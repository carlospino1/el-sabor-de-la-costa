// Edita solamente los valores de "price" para agregar los precios.
const products = [
  { name: "Carne guisada", description: "Con arroz, patacón o yuca y ensalada.", image: "assets/carne-guisada.jpeg", price: "15.000" },
  { name: "Chuleta doradita", description: "Jugosa, con su huesito, arroz, patacón y ensalada.", image: "assets/chuleta.jpeg", price: "20.000" },
  { name: "Plato BBQ", description: "Proteína con salsa BBQ, arroz, patacones y ensalada.", image: "assets/plato-bbq.jpeg", price: "18.000" },
  { name: "Chicharrón costeño", description: "Crujiente, con arroz de coco, yuca frita y suero costeño.", image: "assets/chicharron.jpeg", price: "12.000" },
  { name: "Lengua en salsa", description: "Lengua en salsa de ciruela con arroz y tajadas.", image: "assets/lengua.jpeg", price: "16.000" },
  { name: "Pescado frito", description: "Acompañado de arroz, ensalada y patacón.", image: "assets/pescado.jpeg", price: "14.000" },
  { name: "Sancocho de costilla", description: "Sabor casero y costeño para disfrutar en familia.", image: "assets/sancocho.jpg", price: "10.000" },
  { name: "Sopa de pollo", description: "Con arroz y aguacate, preparada al momento.", image: "assets/sopa-pollo.jpeg", price: "10.000" }
];

const phone = "573242984375";
const productGrid = document.querySelector("#product-grid");
const preparationModal = document.querySelector("#preparation-modal");
const orderForm = document.querySelector("#order-form");
const preparationStatus = document.querySelector("#preparation-status");
const formProduct = document.querySelector("#form-product");
const preparationProduct = document.querySelector("#preparation-product");
const countdown = document.querySelector("#countdown");
let countdownInterval;

productGrid.innerHTML = products.map((product) => {
  const message = `Hola Sazón Secreta, quiero pedir: ${product.name}`;
  return `
    <article class="product-card">
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
      <div class="product-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <span>${product.price}</span>
          <a class="product-order" href="https://wa.me/${phone}?text=${encodeURIComponent(message)}" data-product="${product.name}">Pedir →</a>
        </div>
      </div>
    </article>
  `;
}).join("");

function showOrderForm(productName) {
  formProduct.textContent = productName;
  orderForm.reset();
  preparationStatus.hidden = true;
  orderForm.hidden = false;
  preparationModal.hidden = false;
  document.body.classList.add("modal-open");
}

function startPreparation(productName, address, payment) {
  preparationProduct.textContent = productName;
  preparationStatus.hidden = false;
  orderForm.hidden = true;
  countdown.textContent = "15:00";
  const message = encodeURIComponent(
    `Hola Sazón Secreta, quiero pedir: ${productName}\nDirección: ${address}\nMétodo de pago: ${payment}`
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
  const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener");
  if (!whatsappWindow) {
    window.location.href = whatsappUrl;
  }

  let secondsLeft = 15 * 60;
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    secondsLeft -= 1;
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    countdown.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    if (secondsLeft <= 0) {
      clearInterval(countdownInterval);
      countdown.textContent = "¡Listo!";
    }
  }, 1000);
}

function closePreparation() {
  preparationModal.hidden = true;
  document.body.classList.remove("modal-open");
  clearInterval(countdownInterval);
}

productGrid.addEventListener("click", (event) => {
  const orderLink = event.target.closest(".product-order");
  if (!orderLink) return;
  event.preventDefault();
  showOrderForm(orderLink.dataset.product);
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(orderForm);
  startPreparation(formProduct.textContent, formData.get("address").trim(), formData.get("payment"));
});

document.querySelector("#modal-close").addEventListener("click", closePreparation);
document.querySelector("#modal-done").addEventListener("click", closePreparation);
preparationModal.addEventListener("click", (event) => {
  if (event.target === preparationModal) closePreparation();
});
