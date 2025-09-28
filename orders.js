document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase Initialization ---
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
    const db = firebase.firestore();

    
    const userArea = document.getElementById('user-area');
    const ordersContainer = document.getElementById('orders-container');

   
    auth.onAuthStateChanged(user => {
        if (user) {
          
            const userName = user.displayName || 'User';
            if (userArea) {
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
                userProfile.addEventListener('click', () => dropdownMenu.classList.toggle('show'));
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    auth.signOut().then(() => window.location.reload());
                });
            }

            
            fetchUserOrders(user.uid);

        } else {
           
            if (userArea) {
                userArea.innerHTML = `<a href="login.html" class="btn">Login</a>`;
            }
            if (ordersContainer) {
                ordersContainer.innerHTML = '<h2>Please log in to see your order history.</h2>';
                ordersContainer.style.color = 'whitesmoke';
            }
        }
    });

    
    function fetchUserOrders(userId) {
        if (!ordersContainer) return; 
        ordersContainer.innerHTML = '<p>Loading your orders...</p>';

        db.collection('orders')
          .where('userId', '==', userId)   
          .orderBy('timestamp', 'desc')   
          .get()
          .then(querySnapshot => {
              if (querySnapshot.empty) {
                  ordersContainer.innerHTML = '<p>You have not placed any orders yet.</p>';
                  return;
              }
              
              ordersContainer.innerHTML = ''; 
              querySnapshot.forEach(doc => {
                  const order = doc.data();
                  
                  const orderCard = document.createElement('div');
                  orderCard.className = 'cart-summary'; 
                  
                  
                  let itemsHtml = order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <p>${item.name} (x${item.quantity})</p>
                        </div>
                    </div>
                  `).join('');

                  orderCard.innerHTML = `
                      <h3>Order from: ${new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</h3>
                      <p>Status: ${order.status}</p>
                      <hr>
                      ${itemsHtml}
                      <hr>
                      <h4>Total: ₹${order.total}</h4>
                  `;
                  ordersContainer.appendChild(orderCard);
              });
          })
          .catch(error => {
              console.error("Error fetching orders: ", error);
              ordersContainer.innerHTML = '<p>Sorry, we could not retrieve your orders.</p>';
          });
    }
});