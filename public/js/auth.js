// Firebase configuration (placeholder, to be set in next session)
const firebaseConfig = {
    // Will be provided during Firebase setup
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const remember = document.getElementById('remember');

    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                if (remember.checked) {
                    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                }
                window.location.href = '/index.html';
            })
            .catch(error => {
                alert('Login failed: ' + error.message);
            });
    });

    registerBtn.addEventListener('click', () => {
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                if (remember.checked) {
                    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                }
                window.location.href = '/index.html';
            })
            .catch(error => {
                alert('Registration failed: ' + error.message);
            });
    });
});
