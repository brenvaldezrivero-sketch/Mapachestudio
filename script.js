// Storage utils
const storage = {
  get(key, def){ try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
};

let PRODUCTS = [];
let CART = storage.get('cart', { items: [] });
let FAVS = storage.get('favorites', []);

function updateCartCount(){
  const count = CART.items.reduce((acc,i)=>acc+i.qty,0);
  const el = document.getElementById('cart-count');
  if(el) el.textContent = count;
}

function renderProducts(){
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image || 'assets/placeholder.png'}" alt="${p.title}">
      <div class="title">${p.title}</div>
      <div class="price">$${p.price}</div>
      <div class="actions">
        <button class="btn ver">Ver</button>
        <button class="btn add">Agregar</button>
        <button class="fav ${FAVS.some(f=>f.id===p.id)?'active':''}">★ Favorito</button>
      </div>`;
    grid.appendChild(card);
    card.querySelector('.ver').onclick = ()=>openModal(p);
    card.querySelector('.add').onclick = ()=>{ addToCart(p); openCart(); };
    card.querySelector('.fav').onclick = (e)=>toggleFavorite(p, e.target);
  });
}

function renderFavorites(){
  const grid = document.getElementById('favorites-grid');
  if(!grid) return;
  grid.innerHTML = '';
  FAVS.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image || 'assets/placeholder.png'}" alt="${p.title}">
      <div class="title">${p.title}</div>
      <div class="price">$${p.price}</div>
      <div class="actions">
        <button class="btn ver">Ver</button>
        <button class="btn add">Agregar</button>
        <button class="fav active">★ Quitar</button>
      </div>`;
    grid.appendChild(card);
    card.querySelector('.ver').onclick = ()=>openModal(p);
    card.querySelector('.add').onclick = ()=>{ addToCart(p); openCart(); };
    card.querySelector('.fav').onclick = ()=>{ toggleFavorite(p); };
  });
}

// Modal
const modal = document.getElementById('product-modal');
const modalClose = document.querySelector('.modal-close');
function openModal(p){
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden','false');
  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <h2>${p.title}</h2>
    <img src="${p.image || 'assets/placeholder.png'}" alt="${p.title}">
    <p>${p.description || ''}</p>
    <p><strong>Precio:</strong> $${p.price}</p>
    <div class="actions">
      <button class="btn" id="modal-add">Agregar al carrito</button>
    </div>`;
  document.getElementById('modal-add').onclick = ()=>{ addToCart(p); openCart(); };
}
function closeModal(){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); }
modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeModal(); });
modal.addEventListener('click',(e)=>{ if(e.target===modal) closeModal(); });

// Cart Sidebar
const cartSidebar = document.getElementById('cart-sidebar');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');
const finalizeBtn = document.getElementById('finalize-btn');

function openCart(){
  cartSidebar.classList.add('open');
  cartBackdrop.classList.add('show');
  renderCartSidebar();
}
function closeCart(){
  cartSidebar.classList.remove('open');
  cartBackdrop.classList.remove('show');
}
cartToggle.addEventListener('click', ()=>{ cartSidebar.classList.contains('open') ? closeCart() : openCart(); });
cartClose.addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

function addToCart(p){
  const idx = CART.items.findIndex(i=>i.id===p.id);
  if(idx>=0) CART.items[idx].qty += 1; else CART.items.push({id:p.id,title:p.title,price:p.price,image:p.image,qty:1});
  storage.set('cart', CART);
  updateCartCount();
}
function setQty(id, qty){ const i = CART.items.find(x=>x.id===id); if(!i) return; i.qty = Math.max(1, qty); storage.set('cart', CART); updateCartCount(); renderCartSidebar(); }
function removeItem(id){ CART.items = CART.items.filter(i=>i.id!==id); storage.set('cart', CART); updateCartCount(); renderCartSidebar(); }

function renderCartSidebar(){
  const list = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  list.innerHTML = '';
  let total = 0;
  if(CART.items.length===0){ list.innerHTML = '<p>Tu carrito está vacío.</p>'; totalEl.textContent = 'Total: $0'; return; }
  CART.items.forEach(i=>{
    const subtotal = i.price * i.qty;
    total += subtotal;
    const line = document.createElement('div');
    line.className = 'cart-line';
    line.innerHTML = `
      <div><strong>${i.title}</strong> — $${i.price}</div>
      <div class="qty">
        <button onclick="setQty(${i.id}, ${i.qty-1})">−</button>
        <span>${i.qty}</span>
        <button onclick="setQty(${i.id}, ${i.qty+1})">+</button>
        <button onclick="removeItem(${i.id})">Eliminar</button>
      </div>
      <div><strong>$${subtotal.toFixed(2)}</strong></div>`;
    list.appendChild(line);
  });
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

// Finalizar compra
finalizeBtn.addEventListener('click', ()=>{
  if(CART.items.length===0){ alert('Tu carrito está vacío.'); return; }
  alert('¡Tu compra se realizó con éxito! Se enviarán los datos al correo registrado.');
  CART.items = [];
  storage.set('cart', CART);
  updateCartCount();
  renderCartSidebar();
  closeCart();
});

// Favoritos
function toggleFavorite(p, btn){
  const exists = FAVS.some(f=>f.id===p.id);
  FAVS = exists ? FAVS.filter(f=>f.id!==p.id) : [...FAVS, p];
  storage.set('favorites', FAVS);
  if(btn) btn.classList.toggle('active', !exists);
  renderFavorites();
}

// Contact form (opcional: ya funcional con Formspree desde HTML)

// Init
window.addEventListener('DOMContentLoaded', async ()=>{
  try{ const res = await fetch('data/products.json'); PRODUCTS = await res.json(); }catch(e){ PRODUCTS = []; }
  updateCartCount();
  renderFavorites();
  renderProducts();
});
