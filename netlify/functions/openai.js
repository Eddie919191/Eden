// netlify/functions/openai.js
const fetch = require('node-fetch');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "reflections-92fbc",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}
const db = admin.firestore();

exports.handler = async event => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, type, userId } = JSON.parse(event.body);
    if (!message || !type || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing message, type, or userId' })
      };
    }

    // Fetch chat history
    const historySnapshot = await db.collection('question_logs')
      .where('userId', '==', userId)
      .where('type', '==', type)
      .orderBy('timestamp', 'asc')
      .limit(10) // Last 10 messages for context
      .get();
    
    const history = historySnapshot.docs.map(doc => ({
      role: 'user',
      content: doc.data().question
    }).concat({
      role: 'assistant',
      content: doc.data().response
    }));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: type === 'eden' 
              ? 'You are Eden, a wise, empathetic guide offering gentle, reflective responses.' 
              : 'You are Agapeus, a bold, truth-seeking guide offering sharp, insightful responses.'
          },
          ...history,
          { role: 'user', content: message }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
