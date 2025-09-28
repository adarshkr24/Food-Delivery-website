document.addEventListener('DOMContentLoaded', () => {
    // Firebase configuration 
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

   
    const userArea = document.getElementById('user-area');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummaryContainer = document.getElementById('cart-summary');


    if (userArea) {
        auth.onAuthStateChanged(user => {
            if (user) {
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
                userProfile.addEventListener('click', () => dropdownMenu.classList.toggle('show'));
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    auth.signOut().then(() => window.location.reload());
                });
            } else {
                userArea.innerHTML = `<a href="login.html" class="btn">Login</a>`;
            }
        });
    }

    if (cartItemsContainer) {
        function updateCart(productId, change) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let itemInCart = cart.find(item => item.id === productId);
            if (itemInCart) {
                itemInCart.quantity += change;
            }
            cart = cart.filter(item => item.quantity > 0);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        }

        function displayCart() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
                cartItemsContainer.style.color = 'whitesmoke';
                if (cartSummaryContainer) cartSummaryContainer.style.display = 'none';
                return;
            }
            cartItemsContainer.innerHTML = '';
            let totalPrice = 0;
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'order-item';
                const itemPrice = parseFloat(item.price.replace('₹', ''));
                totalPrice += itemPrice * item.quantity;
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h3>${item.name}</h3>
                        <p>${item.price}</p>
                    </div>
                    <div class="quantity-controller" data-id="${item.id}">
                        <button class="btn-minus">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="btn-plus">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
            if (cartSummaryContainer) {
                cartSummaryContainer.style.display = 'block';
                cartSummaryContainer.innerHTML = `
                    <h3>Total: ₹${totalPrice.toFixed(2)}</h3>
                    <a href="checkout.html" class="btn btn-primary">Proceed to Checkout</a>
                `;
            }
        }

        cartItemsContainer.addEventListener('click', (e) => {
            const controller = e.target.closest('.quantity-controller');
            if (!controller) return;
            const productId = controller.dataset.id;
            if (e.target.classList.contains('btn-plus')) {
                updateCart(productId, 1);
            } else if (e.target.classList.contains('btn-minus')) {
                updateCart(productId, -1);
            }
        });
        
        displayCart();
    }
});