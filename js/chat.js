// js/chat.js
firebase.initializeApp({
  apiKey: "AIzaSyC2TvTe6Y-WLrKKeikJ111EeHe2ZdGvK2I",
  authDomain: "reflections-92fbc.firebaseapp.com",
  projectId: "reflections-92fbc",
  storageBucket: "reflections-92fbc.firebasestorage.app",
  messagingSenderId: "485903066751",
  appId: "1:485903066751:web:73e26cbacdb2154a4b014a"
});
const db = firebase.firestore();
let userId = localStorage.getItem('userId') || 'guest_' + Math.random().toString(36).slice(2);
localStorage.setItem('userId', userId);

const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const type = window.location.pathname.includes('eden') ? 'eden' : 'agapeus';

// Load history
db.collection('question_logs')
  .where('userId', '==', userId)
  .where('type', '==', type)
  .orderBy('timestamp')
  .onSnapshot(snapshot => {
    chatMessages.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const userMessageDiv = document.createElement('div');
      userMessageDiv.className = 'chat-message user-message';
      userMessageDiv.innerHTML = `
        <p>${data.question}</p>
        <button class="heart-btn">${data.favorited ? '♥' : '<3'}</button>
      `;
      chatMessages.appendChild(userMessageDiv);
      userMessageDiv.querySelector('.heart-btn').onclick = () => favoriteMessage(data.question, data.timestamp);

      const aiMessageDiv = document.createElement('div');
      aiMessageDiv.className = 'chat-message ai-message';
      aiMessageDiv.innerHTML = `<p>${data.response}</p>`;
      chatMessages.appendChild(aiMessageDiv);

      setTimeout(() => {
        userMessageDiv.classList.add('fade-in');
        aiMessageDiv.classList.add('fade-in');
      }, 10);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  const timestamp = new Date().toISOString();
  const userMessageDiv = document.createElement('div');
  userMessageDiv.className = 'chat-message user-message';
  userMessageDiv.innerHTML = `
    <p>${message}</p>
    <button class="heart-btn"><3</button>
  `;
  chatMessages.appendChild(userMessageDiv);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  userMessageDiv.querySelector('.heart-btn').onclick = () => favoriteMessage(message, timestamp);
  setTimeout(() => userMessageDiv.classList.add('fade-in'), 10);

  try {
    const response = await fetch('/.netlify/functions/openai', {
      method: 'POST',
      body: JSON.stringify({ message, type })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    const aiMessageDiv = document.createElement('div');
    aiMessageDiv.className = 'chat-message ai-message';
    aiMessageDiv.innerHTML = `<p>${aiMessage}</p>`;
    chatMessages.appendChild(aiMessageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => aiMessageDiv.classList.add('fade-in'), 10);

    await db.collection('question_logs').add({
      userId,
      type,
      question: message,
      response: aiMessage,
      timestamp,
      favorited: false
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'chat-message error';
    errorDiv.innerHTML = `<p>Error: Could not get response. Please try again.</p>`;
    chatMessages.appendChild(errorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => errorDiv.classList.add('fade-in'), 10);
  }
}

async function favoriteMessage(message, timestamp) {
  const favorites = JSON.parse(localStorage.getItem(`${type}-favorites`) || '[]');
  favorites.push({ message, date: timestamp });
  localStorage.setItem(`${type}-favorites`, JSON.stringify(favorites));

  const snapshot = await db.collection('question_logs')
    .where('userId', '==', userId)
    .where('type', '==', type)
    .where('timestamp', '==', timestamp)
    .get();
  snapshot.forEach(doc => doc.ref.update({ favorited: true }));

  const btn = Array.from(chatMessages.querySelectorAll('.chat-message p')).find(p => p.textContent === message)?.nextElementSibling;
  if (btn) btn.innerHTML = '♥';
}

chatInput.addEventListener('keypress', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const chatContainer = document.querySelector('.chat-container');
  if (chatContainer) {
    chatContainer.style.opacity = '1';
    chatContainer.style.display = 'block';
  }
});
