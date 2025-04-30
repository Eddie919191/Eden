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

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const remember = document.getElementById('remember');

    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Set persistence based on "remember me"
        const persistence = remember.checked
            ? firebase.auth.Auth.Persistence.LOCAL
            : firebase.auth.Auth.Persistence.SESSION;

        firebase.auth().setPersistence(persistence)
            .then(() => {
                return firebase.auth().signInWithEmailAndPassword(email, password);
            })
            .then(() => {
                window.location.href = '/public/index.html';
            })
            .catch(error => {
                alert('Login failed: ' + error.message);
            });
    });

    registerBtn.addEventListener('click', () => {
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const persistence = remember.checked
            ? firebase.auth.Auth.Persistence.LOCAL
            : firebase.auth.Auth.Persistence.SESSION;

        firebase.auth().setPersistence(persistence)
            .then(() => {
                return firebase.auth().createUserWithEmailAndPassword(email, password);
            })
            .then(() => {
                window.location.href = '/public/index.html';
            })
            .catch(error => {
                alert('Registration failed: ' + error.message);
            });
    });
});
