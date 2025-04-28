function checkPassword() {
    const password = document.getElementById('password').value;
    if (password === 'flamekeeper') { // Replace with your password
        document.getElementById('password-prompt').style.display = 'none';
        document.getElementById('chamber').style.display = 'block';
        initNightSky();
    } else {
        alert('Incorrect password.');
    }
}

function initNightSky() {
    const width = 600;
    const height = 400;
    
    const svg = d3.select('#night-sky')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#0a0a1a');
    
    const emotions = ['Joy', 'Grief', 'Clarity', 'Fear', 'Love', 'Purpose'];
    const questions = JSON.parse(localStorage.getItem('soul-questions') || '[]');
    
    const nodes = questions.map((q, i) => ({
        id: i,
        emotion: q.emotion,
        x: Math.random() * width,
        y: Math.random() * height,
        brightness: q.breakthrough ? 3 : 1
    }));
    
    svg.selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.brightness)
        .attr('fill', 'white')
        .attr('opacity', 0.8);
}

document.getElementById('question-form').addEventListener('submit', e => {
    e.preventDefault();
    const question = document.getElementById('question').value;
    const emotion = document.getElementById('emotion').value;
    
    const questions = JSON.parse(localStorage.getItem('soul-questions') || '[]');
    questions.push({ question, emotion, breakthrough: false });
    localStorage.setItem('soul-questions', JSON.stringify(questions));
    
    document.getElementById('question').value = '';
    d3.select('#night-sky svg').remove();
    initNightSky();
});
