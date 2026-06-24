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
const checkoutBtn =
document.getElementById("checkoutBtn");

const checkoutModal =
document.getElementById("checkoutModal");

const placeOrderBtn =
document.getElementById("placeOrderBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart.forEach(item=>{
if(!item.quantity){
item.quantity = 1;
}
});

function displayProducts(items){

productsContainer.innerHTML = "";

items.forEach(product=>{

productsContainer.innerHTML += `

<div class="col-lg-4 col-md-6">

<div class="product-card position-relative"
onclick="openProductModal(products.find(p=>p.id===${product.id}))">

<div class="discount-badge">
-20%
</div>
<div class="wishlist-btn">
🤍
</div>

<img src="${product.image}" alt="${product.name}">

<div class="card-body">

<span class="category-tag">
${product.category}
</span>

<h5>${product.name}</h5>

<div class="rating">
⭐⭐⭐⭐⭐ (4.8)
</div>

<p class="price">
Rs. ${product.price}
</p>
<button
class="btn btn-primary w-100"
onclick="event.stopPropagation(); addToCart(${product.id})">
🛒 Add To Cart
</button>
</div>

</div>

</div>

`;

});

}
function openProductModal(product){

modalImage.src = product.image;
modalName.textContent = product.name;
modalPrice.textContent = "Rs. " + product.price;

modalAddCart.onclick = () => {
addToCart(product.id);
};

productModal.style.display = "flex";

}

function addToCart(id){

const existingItem =
cart.find(item=>item.id===id);

if(existingItem){
existingItem.quantity++;
}
else{

const product =
products.find(p=>p.id===id);

cart.push({
...product,
quantity:1
});

}

saveCart();
renderCart();
showToast("Product Added");
}
document.addEventListener("click",(e)=>{

if(e.target.classList.contains("wishlist-btn")){

e.stopPropagation();

e.target.classList.toggle("active");

e.target.innerHTML =
e.target.classList.contains("active")
? "❤️"
: "🤍";

}

});
function increaseQty(id){

const item =
cart.find(item=>item.id===id);

item.quantity++;

saveCart();
renderCart();

}

function decreaseQty(id){

const item =
cart.find(item=>item.id===id);

if(item.quantity>1){
item.quantity--;
}
else{
cart = cart.filter(p=>p.id!==id);
}

saveCart();
renderCart();

}
function removeItem(id){

cart = cart.filter(item => item.id !== id);

saveCart();

renderCart();

showToast("Product Removed");

}

function saveCart(){

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

}
function renderCart(){

cartItemsDiv.innerHTML = "";

if(cart.length === 0){
    cartItemsDiv.innerHTML = "<p>Cart is empty 🛒</p>";
    totalPriceEl.textContent = 0;
    cartCountEl.textContent = 0;
    return;
}

let total = 0;

cart.forEach(item=>{

total += item.price * item.quantity;

cartItemsDiv.innerHTML += `
<div class="cart-item">

<div>

<h4>${item.name}</h4>

<p>Rs. ${item.price}</p>

<div class="qty-box">

<button onclick="decreaseQty(${item.id})">−</button>

<span>${item.quantity}</span>

<button onclick="increaseQty(${item.id})">+</button>

<button class="remove-btn"
onclick="removeItem(${item.id})">
🗑 Remove
</button>

</div>
</div>

</div>

</div>
`;

});

totalPriceEl.textContent = total;

cartCountEl.textContent =
cart.reduce((sum,item)=>
sum + item.quantity
,0);

}

function showToast(message){

const toast =
document.getElementById("toast");

toast.innerText = message;

toast.style.display="block";

setTimeout(()=>{
toast.style.display="none";
},2000);

}

searchInput.addEventListener("input",()=>{

const value =
searchInput.value.toLowerCase();

const filtered =
products.filter(product=>
product.name.toLowerCase().includes(value)
);

displayProducts(filtered);

});

document
.querySelectorAll(".filter-btn")
.forEach(btn=>{

btn.addEventListener("click",()=>{

const category =
btn.dataset.category;

if(category==="all"){
displayProducts(products);
return;
}

const filtered =
products.filter(product=>
product.category===category
);

displayProducts(filtered);

});

});

cartBtn.addEventListener("click",()=>{

cartModal.style.display="block";

});

closeCart.addEventListener("click",()=>{

cartModal.style.display="none";

});
closeProductModal.addEventListener("click",()=>{

productModal.style.display = "none";

});
checkoutBtn.addEventListener("click",()=>{

if(cart.length === 0){

showToast("Cart is Empty");

return;

}

checkoutModal.style.display = "flex";

});
productModal.addEventListener("click",(e)=>{

if(e.target === productModal){
productModal.style.display = "none";
}

});
cartModal.addEventListener("click",(e)=>{

if(e.target === cartModal){
cartModal.style.display="none";
}

});

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

});

displayProducts(products);
renderCart();
placeOrderBtn.addEventListener("click",()=>{

const name =
document.getElementById("customerName").value;

const card =
document.getElementById("cardNumber").value;

const expiry =
document.getElementById("expiry").value;

const cvv =
document.getElementById("cvv").value;

if(!name || !card || !expiry || !cvv){

showToast("Fill All Fields");

return;

}
checkoutModal.addEventListener("click",(e)=>{

if(e.target === checkoutModal){
checkoutModal.style.display = "none";
}

});

showToast("Payment Successful 🎉");

cart = [];

saveCart();

renderCart();

checkoutModal.style.display = "none";

});