// Firebase configuration (replace with your config from Firebase Console)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
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
