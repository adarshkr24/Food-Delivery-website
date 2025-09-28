document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase Initialization (Must be at the top) ---
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

    // --- Get HTML Elements ---
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const checkoutTotalElement = document.getElementById('checkout-total');
    
    // --- Calculate and Display Total ---
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;
    cart.forEach(item => {
        const itemPrice = parseFloat(item.price.replace('₹', ''));
        totalPrice += itemPrice * item.quantity;
    });
    checkoutTotalElement.textContent = `Total: ₹${totalPrice.toFixed(2)}`;

    // --- Confirm Order Logic ---
  confirmOrderBtn.addEventListener('click', () => {
    const user = auth.currentUser;

    if (!user) {
        alert('You must be logged in to confirm an order.');
        window.location.href = 'login.html';
        return;
    }

    const street = document.getElementById('street-address').value;
    const city = document.getElementById('city').value;
    const pincode = document.getElementById('pincode').value;

    if (!street || !city || !pincode) {
        alert('Please fill out all address fields.');
        return;
    }

    const deliveryAddress = { street, city, pincode };
    const newOrder = {
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        address: deliveryAddress,
        items: cart, // The cart data
        total: totalPrice.toFixed(2),
        paymentMethod: 'Cash on Delivery',
        status: 'Pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // This is the new line. It will show us the data in the console.
    console.log("Data being sent to Firestore:", newOrder);

    // The code then attempts to save this data
    db.collection('orders').add(newOrder)
        .then(() => {
            localStorage.removeItem('cart');
            alert("Order confirmed! Thank you for your purchase.");
            window.location.href = 'orders.html';
        })
        .catch(error => {
            console.error("Error placing order: ", error);
            alert("There was an error placing your order. Please try again.");
        });
});
});