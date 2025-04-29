// js/shared-wisdom.js
firebase.initializeApp({
  apiKey: "AIzaSyC2TvTe6Y-WLrKKeikJ111EeHe2ZdGvK2I",
  authDomain: "reflections-92fbc.firebaseapp.com",
  projectId: "reflections-92fbc",
  storageBucket: "reflections-92fbc.firebasestorage.app",
  messagingSenderId: "485903066751",
  appId: "1:485903066751:web:73e26cbacdb2154a4b014a"
});
const db = firebase.firestore();
const userId = localStorage.getItem('userId');

const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const emotionColors = {
  Joy: '#FFD700',
  Grief: '#4682B4',
  Clarity: '#90EE90',
  Fear: '#800080',
  Love: '#FF69B4',
  Purpose: '#FFA500'
};

let stars = [];

function drawStars() {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius * (1 + 0.2 * Math.sin(Date.now() / 1000)), 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.globalAlpha = star.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  });
  requestAnimationFrame(drawStars);
}

db.collection('shared_moments')
  .where('userId', '==', userId)
snapshot.forEach(doc => {
  const data = doc.data();
  momentsDiv.innerHTML += `
    <div class="moment">
      <p><strong>${data.emotion}</strong>: ${data.question} -> ${data.response}</p>
    </div>
  `;
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 3 + data.candleCount * 0.5, // Brighter with more messages
    color: emotionColors[data.emotion],
    opacity: 0.8
  });
});

// Add candle count
db.collection('question_logs')
  .where('userId', '==', userId)
  .get()
  .then(snapshot => {
    const candleCount = snapshot.size;
    snapshot.forEach(doc => {
      const data = doc.data();
      db.collection('shared_moments')
        .where('question', '==', data.question)
        .where('timestamp', '==', data.timestamp)
        .get()
        .then(momentSnapshot => {
          momentSnapshot.forEach(momentDoc => {
            momentDoc.ref.update({ candleCount });
          });
        });
    });
  });
