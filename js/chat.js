const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const type = window.location.pathname.includes('eden') ? 'eden' : 'agapeus';

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  const userMessageDiv = document.createElement('div');
  userMessageDiv.className = 'chat-message user-message';
  userMessageDiv.innerHTML = `
    <p>${message}</p>
    <button class="heart-btn"><3</button>
  `;
  chatMessages.appendChild(userMessageDiv);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  userMessageDiv.querySelector('.heart-btn').onclick = () => {
    const favorites = JSON.parse(localStorage.getItem(`${type}-favorites`) || '[]');
    favorites.push({ message, date: new Date().toISOString() });
    localStorage.setItem(`${type}-favorites`, JSON.stringify(favorites));
    userMessageDiv.querySelector('.heart-btn').innerHTML = '♥';
  };

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

    const messages = chatMessages.querySelectorAll('.chat-message:not(.fade-in)');
    messages.forEach(msg => setTimeout(() => msg.classList.add('fade-in'), 10));
  } catch (error) {
    console.error('OpenAI API error:', error);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'chat-message error';
    errorDiv.innerHTML = `<p>Error: Could not get response. Please try again.</p>`;
    chatMessages.appendChild(errorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight);
  }
}

chatInput.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());

document.addEventListener('DOMContentLoaded', () => {
  const chatContainer = document.querySelector('.chat-container');
  if (chatContainer) chatContainer.style.opacity = '1';
});
