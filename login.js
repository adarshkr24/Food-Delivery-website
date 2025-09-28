document.addEventListener('DOMContentLoaded', () => {
    // --- 1. INITIALIZE FIREBASE ---
    const firebaseConfig = {
  apiKey: "AIzaSyBhFOb88bfU3aLJO_DdAn6Uawbndk1WUQg",
  authDomain: "insta-food-app.firebaseapp.com",
  projectId: "insta-food-app",
  storageBucket: "insta-food-app.firebasestorage.app",
  messagingSenderId: "1051596915438",
  appId: "1:1051596915438:web:c3f51a38d7952cab3769ff",
  measurementId: "G-NM57SQGYXM"
};
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // --- 2. GET DOM ELEMENTS ---
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const googleBtn = document.getElementById('google-signin-btn');
    const errorMsg = document.getElementById('error-message');

    // --- 3. EVENT LISTENERS ---

   // Sign Up
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value; // Get the name
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // After user is created, update their profile with the name
            return userCredential.user.updateProfile({
                displayName: name
            });
        })
        .then(() => {
            // Redirect after the profile has been updated
            window.location.href = 'index.html';
        })
        .catch(error => {
            errorMsg.textContent = error.message;
        });
});
    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                window.location.href = 'index.html'; // Redirect on success
            })
            .catch(error => {
                errorMsg.textContent = error.message;
            });
    });

    // Google Sign-In
    googleBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(result => {
                window.location.href = 'index.html'; // Redirect on success
            })
            .catch(error => {
                errorMsg.textContent = error.message;
            });
    });
});