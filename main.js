// ================= IMPORTS =================
import { db, auth } from "./firebase.js";

import {
  collection,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// ================= GLOBAL VARIABLES =================
let products = [];
let cart = [];


// ================= LOAD PRODUCTS =================
async function loadProducts() {
  const snapshot = await getDocs(collection(db, "products"));

  products = [];

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    data.id = docSnap.id;
    products.push(data);
  });

  displayProducts(products);
loadRecommendations();
}

loadProducts();


// ================= DISPLAY PRODUCTS =================
function displayProducts(productList) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  productList.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <button class="btn-primary" data-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Attach button listeners
  document.querySelectorAll(".btn-primary").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      addToCart(id);
    });
  });
}
// ================= RECOMMENDATIONS =================
function loadRecommendations() {

  const container = document.getElementById("recommendationGrid");

  if (!container) return; // safety check

  container.innerHTML = "";

  // show first 3 products
  const recommended = products.slice(0, 3);

  recommended.forEach(product => {

    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" />
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
      </div>
    `;

    container.appendChild(card);

  });

}


// ================= ADD TO CART (FIRESTORE) =================
async function addToCart(productId) {

  const user = auth.currentUser;

  if (!user) {
    alert("Please login first!");
    window.location = "login.html";
    return;
  }

  const product = products.find(p => p.id === productId);
  if (!product) return;

  await addDoc(
    collection(db, "carts", user.uid, "items"),
    {
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      createdAt: new Date()
    }
  );

  alert("Added to cart!");
  loadCart(user);
}


// ================= LOAD CART =================
async function loadCart(user) {

  const snapshot = await getDocs(
    collection(db, "carts", user.uid, "items")
  );

  cart = [];

  snapshot.forEach(doc => {
    cart.push(doc.data());
  });

  updateCartUI();
  renderCart();
}


// ================= RENDER CART =================
function renderCart() {

  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <p>${item.name}</p>
      <p>$${item.price}</p>
    `;

    cartItems.appendChild(div);
  });
}


// ================= UPDATE CART COUNT =================
function updateCartUI() {
  document.getElementById("cartCount").innerText = cart.length;
}


// ================= CART PANEL =================
const cartIcon = document.querySelector(".cart-icon");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");

cartIcon.addEventListener("click", () => {
  cartPanel.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cartPanel.classList.remove("active");
});


// ================= SEARCH =================
document.getElementById("searchInput")
.addEventListener("keyup", function () {

  const value = this.value.toLowerCase();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(value)
  );

  displayProducts(filtered);
});


// ================= CATEGORY FILTER =================
document.querySelectorAll(".category-card")
.forEach(card => {

  card.addEventListener("click", function () {

    const category = this.innerText;

    const filtered = products.filter(
      p => p.category === category
    );

    displayProducts(filtered);
  });

});


// ================= EXPLORE BUTTON =================
document.getElementById("exploreBtn")
.addEventListener("click", () => {

  document.getElementById("products")
  .scrollIntoView({ behavior: "smooth" });

});


// ================= AUTH STATE =================
const logoutBtn = document.getElementById("logoutBtn");
const loginLink = document.getElementById("loginLink");
const signupLink = document.getElementById("signupLink");

onAuthStateChanged(auth, (user) => {

  if (user) {
    loginLink.style.display = "none";
    signupLink.style.display = "none";
    logoutBtn.style.display = "inline-block";
    loadCart(user);
  } 
  else {
    loginLink.style.display = "inline-block";
    signupLink.style.display = "inline-block";
    logoutBtn.style.display = "none";
    cart = [];
    updateCartUI();
  }

});


// ================= LOGOUT =================
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  alert("Logged out!");
});