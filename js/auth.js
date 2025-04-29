// js/auth.js
firebase.initializeApp({
  apiKey: "AIzaSyC2TvTe6Y-WLrKKeikJ111EeHe2ZdGvK2I",
  authDomain: "reflections-92fbc.firebaseapp.com",
  projectId: "reflections-92fbc",
  storageBucket: "reflections-92fbc.firebasestorage.app",
  messagingSenderId: "485903066751",
  appId: "1:485903066751:web:73e26cbacdb2154a4b014a"
});
const auth = firebase.auth();

document.getElementById('auth-form').addEventListener('submit', async e => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const email = `${username}@reflections.local`; // Fake email for Firebase
  try {
    await auth.signInWithEmailAndPassword(email, password);
    localStorage.setItem('userId', auth.currentUser.uid);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed: ' + error.message);
  }
});

document.getElementById('register-btn').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const email = `${username}@reflections.local`;
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: username });
    localStorage.setItem('userId', userCredential.user.uid);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Register error:', error);
    alert('Registration failed: ' + error.message);
  }
});
