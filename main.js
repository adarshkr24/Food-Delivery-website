document.addEventListener('DOMContentLoaded', () => {
    // This block must be at the top of each JS file using Firebase

    const firebaseConfig = {
  apiKey: "AIzaSyBhFOb88bfU3aLJO_DdAn6Uawbndk1WUQg",
  authDomain: "insta-food-app.firebaseapp.com",
  projectId: "insta-food-app",
  storageBucket: "insta-food-app.firebasestorage.app",
  messagingSenderId: "1051596915438",
  appId: "1:1051596915438:web:c3f51a38d7952cab3769ff",
  measurementId: "G-NM57SQGYXM"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// You can now initialize the services you need in that file
const auth = firebase.auth();

    
    const userArea = document.getElementById('user-area');

    // Use Firebase's recommended observer to check auth state
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            const userName = user.displayName || 'User';
            userArea.innerHTML = `
                <div class="user-profile">
                    <span>Hi, ${userName}</span>
                    <ul class="dropdown-menu">
                        <li><a id="logout-button" href="#">Logout</a></li>
                    </ul>
                </div>
            `;

            const userProfile = userArea.querySelector('.user-profile');
            const dropdownMenu = userArea.querySelector('.dropdown-menu');
            const logoutButton = document.getElementById('logout-button');

            userProfile.addEventListener('click', () => {
                dropdownMenu.classList.toggle('show');
            });

            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                firebase.auth().signOut();
            });

        } else {
            // User is signed out
            userArea.innerHTML = `<a href="login.html" class="btn">Login</a>`;
        }
    });
});