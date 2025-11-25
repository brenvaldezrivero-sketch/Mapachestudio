// Estado
let PRODUCTS=[];let CART=JSON.parse(localStorage.getItem('cart')||'{"items":[]}');let FAVS=JSON.parse(localStorage.getItem('favorites')||'[]');
const toast=document.getElementById('toast');

function showToast(){toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2000);} 
function updateCartCount(){document.getElementById('cart-count').textContent=CART.items.reduce((a,i)=>a+i.qty,0);} 

function renderProducts(){const grid=document.getElementById('product-grid');grid.innerHTML='';PRODUCTS.forEach(p=>{const card=document.createElement('div');card.className='card';card.innerHTML=`<img src="${p.image}" alt="${p.title}"><div class="title">${p.title}</div><div>$${p.price}</div><div class="actions"><button class="btn add">Agregar</button></div>`;grid.appendChild(card);card.querySelector('.add').onclick=()=>{addToCart(p);showToast();openCart();};});}

function addToCart(p){const idx=CART.items.findIndex(i=>i.id===p.id);if(idx>=0){CART.items[idx].qty+=1;}else{CART.items.push({id:p.id,title:p.title,price:p.price,qty:1});}localStorage.setItem('cart',JSON.stringify(CART));updateCartCount();renderCart();}

function renderCart(){const list=document.getElementById('cart-items');const totalEl=document.getElementById('cart-total');list.innerHTML='';let total=0;CART.items.forEach(i=>{total+=i.price*i.qty;const div=document.createElement('div');div.textContent=`${i.title} x${i.qty} - $${i.price*i.qty}`;list.appendChild(div);});totalEl.textContent=`Total: $${total}`;}

function openCart(){document.getElementById('cart-sidebar').classList.add('open');document.getElementById('cart-backdrop').classList.add('show');renderCart();}
function closeCart(){document.getElementById('cart-sidebar').classList.remove('open');document.getElementById('cart-backdrop').classList.remove('show');}

document.getElementById('cart-toggle').onclick=openCart;document.getElementById('cart-close').onclick=closeCart;document.getElementById('cart-backdrop').onclick=closeCart;
document.getElementById('finalize-btn').onclick=()=>{if(CART.items.length===0){alert('Tu carrito está vacío');return;}alert('¡Tu compra se realizó con éxito!');CART.items=[];localStorage.setItem('cart',JSON.stringify(CART));updateCartCount();renderCart();closeCart();};

// Fetch con ruta relativa segura
fetch('./data/products.json').then(r=>{if(!r.ok) throw new Error('HTTP '+r.status); return r.json();}).then(d=>{PRODUCTS=d;renderProducts();updateCartCount();}).catch(err=>{console.error('Error cargando productos:',err);const grid=document.getElementById('product-grid');grid.innerHTML='<p>No se pudo cargar el catálogo. Verifica la carpeta <code>data/products.json</code>.</p>';});
