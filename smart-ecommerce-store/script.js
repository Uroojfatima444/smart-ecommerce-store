// ---------- Elements ----------
const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");

const cartModal = document.getElementById("cartModal");
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartItemsDiv = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const cartCountEl = document.getElementById("cartCount");

const themeBtn = document.getElementById("themeBtn");

const productModal = document.getElementById("productModal");
const closeProductModal = document.getElementById("closeProductModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalAddCart = document.getElementById("modalAddCart");

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const placeOrderBtn = document.getElementById("placeOrderBtn");

// ---------- State ----------
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "all";

cart.forEach(item => {
  if (!item.quantity) item.quantity = 1;
});

// ---------- Helpers ----------
function formatPrice(n) {
  return "Rs. " + n.toLocaleString();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

// ---------- Products ----------
function displayProducts(items) {
  if (items.length === 0) {
    productsContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  productsContainer.innerHTML = items.map(product => `
    <div class="col-lg-4 col-md-6">
      <div class="product-card position-relative"
           onclick="openProductModal(products.find(p => p.id === ${product.id}))">

        ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ""}
        <div class="wishlist-btn">🤍</div>

        <img src="${product.image}" alt="${product.name}">

        <div class="card-body">
          <span class="category-tag">${product.category}</span>
          <h5>${product.name}</h5>
          <div class="rating">⭐ ${product.rating}</div>
          <p class="price">${formatPrice(product.price)}</p>
          <button class="btn btn-primary w-100"
                  onclick="event.stopPropagation(); addToCart(${product.id})">
            🛒 Add To Cart
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function applyFilters() {
  const value = searchInput.value.toLowerCase().trim();
  const filtered = products.filter(p =>
    (currentCategory === "all" || p.category === currentCategory) &&
    p.name.toLowerCase().includes(value)
  );
  displayProducts(filtered);
}

function openProductModal(product) {
  modalImage.src = product.image;
  modalName.textContent = product.name;
  modalPrice.textContent = formatPrice(product.price);
  modalAddCart.onclick = () => addToCart(product.id);
  productModal.style.display = "flex";
}

// ---------- Cart ----------
function addToCart(id) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
  showToast("Product Added");
}

function increaseQty(id) {
  const item = cart.find(item => item.id === id);
  item.quantity++;
  saveCart();
  renderCart();
}

function decreaseQty(id) {
  const item = cart.find(item => item.id === id);
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cart = cart.filter(p => p.id !== id);
  }
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  showToast("Product Removed");
}

function renderCart() {
  cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Cart is empty 🛒</p>";
    totalPriceEl.textContent = 0;
    return;
  }

  let total = 0;

  cartItemsDiv.innerHTML = cart.map(item => {
    total += item.price * item.quantity;
    return `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <p>${formatPrice(item.price)}</p>
          <div class="qty-box">
            <button onclick="decreaseQty(${item.id})">−</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQty(${item.id})">+</button>
            <button class="remove-btn" onclick="removeItem(${item.id})">🗑 Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  totalPriceEl.textContent = total.toLocaleString();
}

// ---------- Events ----------
searchInput.addEventListener("input", applyFilters);

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    applyFilters();
  });
});

// Wishlist heart
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("wishlist-btn")) {
    e.stopPropagation();
    e.target.classList.toggle("active");
    e.target.innerHTML = e.target.classList.contains("active") ? "❤️" : "🤍";
  }
});

cartBtn.addEventListener("click", () => { cartModal.style.display = "block"; });
closeCart.addEventListener("click", () => { cartModal.style.display = "none"; });
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) cartModal.style.display = "none";
});

closeProductModal.addEventListener("click", () => { productModal.style.display = "none"; });
productModal.addEventListener("click", (e) => {
  if (e.target === productModal) productModal.style.display = "none";
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Checkout
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Cart is Empty");
    return;
  }
  checkoutModal.style.display = "flex";
});

checkoutModal.addEventListener("click", (e) => {
  if (e.target === checkoutModal) checkoutModal.style.display = "none";
});

placeOrderBtn.addEventListener("click", () => {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (!name || !phone || !address) {
    showToast("Fill All Fields");
    return;
  }

  showToast("Order Placed 🎉");
  cart = [];
  saveCart();
  renderCart();
  checkoutModal.style.display = "none";
  cartModal.style.display = "none";
});

// ---------- Start ----------
displayProducts(products);
renderCart();