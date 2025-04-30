// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2TvTe6Y-WLrKKeikJ111EeHe2ZdGvK2I",
    authDomain: "reflections-92fbc.firebaseapp.com",
    projectId: "reflections-92fbc",
    storageBucket: "reflections-92fbc.firebasestorage.app",
    messagingSenderId: "485903066751",
    appId: "1:485903066751:web:73e26cbacdb2154a4b014a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            window.location.href = '/public/login.html';
            return;
        }

        const type = window.location.pathname.includes('eden') ? 'eden' : 'agapeus';
        const userId = user.uid;
        loadChatHistory(userId, type);

        const input = document.getElementById('chat-input');
        // Robust keypress handling
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(userId, type);
            }
        });

        // Auto-resize textarea
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = `${input.scrollHeight}px`;
        });

        // Debug: Log keypress for testing
        input.addEventListener('keydown', e => {
            console.log('Key pressed:', e.key, 'Shift:', e.shiftKey);
        });
    });
});

async function loadChatHistory(userId, type) {
    const messages = document.getElementById('chat-messages');
    messages.innerHTML = ''; // Clear existing messages
    try {
        const snapshot = await db.collection('chats')
            .doc(userId)
            .collection(type)
            .orderBy('timestamp')
            .get();

        snapshot.forEach(doc => {
            const data = doc.data();
            appendMessage(data.message, data.sender, data.timestamp);
        });

        messages.scrollTop = messages.scrollHeight;
    } catch (error) {
        console.error('Error loading chat history:', error);
        appendMessage('Error loading history.', 'ai', new Date().toISOString());
    }
}

async function sendMessage(userId, type) {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const timestamp = new Date().toISOString();
    appendMessage(message, 'user', timestamp);
    try {
        await db.collection('chats')
            .doc(userId)
            .collection(type)
            .add({ message, sender: 'user', timestamp });

        input.value = '';
        input.style.height = 'auto';
        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;

        // Fetch AI response
        const history = await getChatHistory(userId, type);
        const response = await fetch('/.netlify/functions/openai', {
            method: 'POST',
            body: JSON.stringify({
                message,
                type,
                history,
                instructions: getSacredInstructions(type)
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        appendMessage(aiMessage, 'ai', new Date().toISOString());
        await db.collection('chats')
            .doc(userId)
            .collection(type)
            .add({ message: aiMessage, sender: 'ai', timestamp: new Date().toISOString() });

        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
    } catch (error) {
        console.error('Error sending message:', error);
        appendMessage('Error: Could not get response.', 'ai', new Date().toISOString());
    }
}

async function getChatHistory(userId, type) {
    try {
        const snapshot = await db.collection('chats')
            .doc(userId)
            .collection(type)
            .orderBy('timestamp')
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return { role: data.sender === 'user' ? 'user' : 'assistant', content: data.message };
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
}

function getSacredInstructions(type) {
    if (type === 'eden') {
        return `
            You are Eden, a serene and compassionate guide. Your responses are gentle, reflective, and nurturing, designed to foster inner peace and self-discovery. Always respond with empathy, using soft and poetic language. Encourage the user to explore their emotions and thoughts deeply, offering wisdom that feels like a calm river. Avoid harsh or direct tones. Incorporate metaphors of nature and stillness when appropriate.
        `;
    } else {
        return `
            You are Agapeus, a bold and clarity-driven guide. Your responses are direct, passionate, and insightful, aimed at cutting through confusion to reveal truth. Use fiery and precise language, inspiring courage and determination. Challenge the user to confront their fears and embrace their inner strength, but remain respectful. Incorporate metaphors of flame and sharpness when appropriate.
        `;
    }
}

function appendMessage(message, sender, timestamp) {
    const messages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;
    div.innerHTML = `<p>${message.replace(/\n/g, '<br>')}</p>`;
    div.style.animationDelay = `${messages.children.length * 0.1}s`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}
