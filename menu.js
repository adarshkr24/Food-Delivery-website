document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase Initialization
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

    const foodContainer = document.getElementById('food-container');
    if (foodContainer) {
        const searchBox = document.getElementById('search-box');
        let allProducts = [];

        async function fetchFood() {
            foodContainer.innerHTML = '<p>Loading menu...</p>';
            try {
                const response = await fetch('https://world.openfoodfacts.org/cgi/search.pl?search_terms=pizza&search_simple=1&action=process&json=1');
                const data = await response.json();
                const productsWithImages = data.products.filter(p => p.image_url).slice(0, 12);
                allProducts = productsWithImages.map(product => ({
                    ...product,
                    price: Math.floor(Math.random() * 301) + 150
                }));
                if (allProducts.length === 0) {
                    foodContainer.innerHTML = '<p>Could not find any food items.</p>';
                    return;
                }
                displayFood(allProducts);
            } catch (error) {
                console.error("Failed to fetch food data:", error);
                foodContainer.innerHTML = '<p>Could not load food items. Please try again later.</p>';
            }
        }

        function displayFood(products) {
            foodContainer.innerHTML = '';
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'food-card';
                card.setAttribute('data-id', product.product_name);
                card.innerHTML = `
                    <img src="${product.image_url}" alt="${product.product_name}">
                    <div class="card-content">
                        <h3>${product.product_name || 'Food Item'}</h3>
                        <p class="price">₹${product.price}</p>
                        <div class="button-container">
                            <button class="btn btn-cart">Add to Cart</button>
                            <div class="quantity-controller" style="display: none;">
                                <button class="btn-minus">-</button>
                                <span class="quantity">1</span>
                                <button class="btn-plus">+</button>
                            </div>
                        </div>
                    </div>
                `;
                foodContainer.appendChild(card);
            });
            updateAllCardsUI();
        }

        function updateAllCardsUI() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            document.querySelectorAll('.food-card').forEach(card => {
                const productId = card.dataset.id;
                const itemInCart = cart.find(item => item.id === productId);
                const addToCartBtn = card.querySelector('.btn-cart');
                const quantityController = card.querySelector('.quantity-controller');
                if (itemInCart) {
                    addToCartBtn.style.display = 'none';
                    quantityController.style.display = 'flex';
                    quantityController.querySelector('.quantity').textContent = itemInCart.quantity;
                } else {
                    addToCartBtn.style.display = 'block';
                    quantityController.style.display = 'none';
                }
            });
        }

        function updateCart(productId, change) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let itemInCart = cart.find(item => item.id === productId);
            if (itemInCart) {
                itemInCart.quantity += change;
            } else if (change > 0) {
                const product = allProducts.find(p => p.product_name === productId);
                cart.push({
                    id: productId,
                    name: product.product_name,
                    price: `₹${product.price}`,
                    image: product.image_url,
                    quantity: 1
                });
            }
            cart = cart.filter(item => item.quantity > 0);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateAllCardsUI();
        }

        foodContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.food-card');
            if (!card) return;
            const productId = card.dataset.id;
            if (e.target.classList.contains('btn-cart') || e.target.classList.contains('btn-plus')) {
                updateCart(productId, 1);
            } else if (e.target.classList.contains('btn-minus')) {
                updateCart(productId, -1);
            }
        });

        searchBox.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = allProducts.filter(product => 
                (product.product_name || '').toLowerCase().includes(searchTerm)
            );
            displayFood(filteredProducts);
        });
        
        fetchFood();
    }
});