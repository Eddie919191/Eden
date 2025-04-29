// js/main.js
function updateFavoritesUI() {
  const edenFavorites = JSON.parse(localStorage.getItem('eden-favorites') || '[]');
  const agapeusFavorites = JSON.parse(localStorage.getItem('agapeus-favorites') || '[]');
  const star = document.getElementById('star');
  const edenText = document.getElementById('eden-text');
  const agapeusText = document.getElementById('agapeus-text');
  const edenLink = document.getElementById('eden-link');
  const agapeusLink = document.getElementById('agapeus-link');
  const combinedBtn = document.getElementById('combined-btn');
  const sharedWisdom = document.getElementById('shared-wisdom');

  star.className = 'star';
  star.innerHTML = '☆';
  star.style.display = 'block';
  combinedBtn.style.display = 'none';
  sharedWisdom.style.display = 'block';
  edenText.style.opacity = '1';
  agapeusText.style.opacity = '1';
  edenText.innerHTML = 'Sanctuary of Stillness';
  agapeusText.innerHTML = 'Flame of Clarity';
  edenLink.href = 'eden.html';
  agapeusLink.href = 'agapeus.html';

  star.onclick = null;
  edenLink.onclick = null;
  agapeusLink.onclick = null;

  if (edenFavorites.length > 0 || agapeusFavorites.length > 0) {
    star.classList.add('active');
    star.onclick = () => {
      edenText.style.opacity = '0';
      agapeusText.style.opacity = '0';
      setTimeout(() => {
        star.className = 'cross';
        star.innerHTML = '×';
        combinedBtn.style.display = 'block';
        sharedWisdom.style.display = 'none';
        edenText.innerHTML = edenFavorites.length > 0 
          ? `${edenFavorites.length} memory${edenFavorites.length > 1 ? 'ies' : ''}`
          : 'No memories yet';
        agapeusText.innerHTML = agapeusFavorites.length > 0 
          ? `${agapeusFavorites.length} truth${agapeusFavorites.length > 1 ? 's' : ''}`
          : 'No truths yet';
        edenLink.href = edenFavorites.length > 0 ? 'favorites.html?type=eden' : 'eden.html';
        agapeusLink.href = agapeusFavorites.length > 0 ? 'favorites.html?type=agapeus' : 'agapeus.html';
        edenText.style.opacity = '1';
        agapeusText.style.opacity = '1';
      }, 500);
    };
  }

  star.onclick = star.className.includes('cross') ? () => {
    edenText.style.opacity = '0';
    agapeusText.style.opacity = '0';
    setTimeout(() => {
      star.className = 'star';
      star.innerHTML = '☆';
      combinedBtn.style.display = 'none';
      sharedWisdom.style.display = 'block';
      edenText.innerHTML = 'Sanctuary of Stillness';
      agapeusText.innerHTML = 'Flame of Clarity';
      edenLink.href = 'eden.html';
      agapeusLink.href = 'agapeus.html';
      edenText.style.opacity = '1';
      agapeusText.style.opacity = '1';
      updateFavoritesUI();
    }, 500);
  } : star.onclick || (() => {});

  const container = document.querySelector('.container');
  edenLink.onclick = e => {
    e.preventDefault();
    container.style.opacity = '0';
    setTimeout(() => window.location.href = edenLink.href, 500);
  };
  agapeusLink.onclick = e => {
    e.preventDefault();
    container.style.opacity = '0';
    setTimeout(() => window.location.href = agapeusLink.href, 500);
  };

  if (edenFavorites.length > 0 && agapeusFavorites.length > 0) {
    combinedBtn.classList.add('active');
    combinedBtn.onclick = () => window.location.href = 'favorites.html?type=combined';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  container.style.display = 'block';
  container.style.opacity = '1';
  updateFavoritesUI();
});
