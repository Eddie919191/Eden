async function sendMessage(type) {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const messages = document.getElementById('chat-messages');
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user-message';
    userMessageDiv.innerHTML = `
        <p>${message}</p>
        <button class="heart-btn"><3</button>
    `;
    messages.appendChild(userMessageDiv);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    userMessageDiv.querySelector('.heart-btn').onclick = () => {
        const favorites = JSON.parse(localStorage.getItem(`${type}-favorites`) || '[]');
        favorites.push({ message, date: new Date().toISOString() });
        localStorage.setItem(`${type}-favorites`, JSON.stringify(favorites));
        userMessageDiv.querySelector('.heart-btn').innerHTML = '♥';
    };

    // Send to OpenAI via Netlify function
    try {
        const response = await fetch('/.netlify/functions/openai', {
            method: 'POST',
            body: JSON.stringify({ message })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'chat-message ai-message';
        aiMessageDiv.innerHTML = `<p>${aiMessage}</p>`;
        messages.appendChild(aiMessageDiv);
        messages.scrollTop = messages.scrollHeight;
    } catch (error) {
        console.error('OpenAI API error:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chat-message error';
        errorDiv.innerHTML = `<p>Error: Could not get response. Please try again.</p>`;
        messages.appendChild(errorDiv);
        messages.scrollTop = messages.scrollHeight;
    }
}

// Fade in chat container on load
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
        chatContainer.style.opacity = '1';
    }
});
