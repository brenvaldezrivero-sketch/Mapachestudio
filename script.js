// ========== GLOBAL STATE ==========
let products = []
let cart = []

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", () => {
  loadProducts()
  loadCartFromStorage()
  setupEventListeners()
  checkUserLogin()
})

// ========== LOAD PRODUCTS FROM JSON ==========
async function loadProducts() {
  try {
    const response = await fetch("products.json")
    products = await response.json()
    renderProducts()
  } catch (error) {
    console.error("Error loading products:", error)
    // Fallback to sample products if JSON fails
    products = [
      {
        id: 1,
        name: "Landing Page",
        description: "Diseño de landing page moderna y responsive.",
        price: 30000,
        image: "/images/tienda-landing.png",
      },
    ]
    renderProducts()
  }
}

// ========== RENDER PRODUCTS ==========
function renderProducts() {
  const storeGrid = document.querySelector(".store-grid")
  if (!storeGrid) return

  storeGrid.innerHTML = products
    .map(
      (product) => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-footer">
                <span class="price">$${product.price.toLocaleString("es-AR")}</span>
                <button class="add-btn" onclick="addToCart(${product.id})">Adquirir</button>
            </div>
        </div>
    `,
    )
    .join("")
}

// ========== CART FUNCTIONALITY ==========
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  // Check if product already in cart
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      ...product,
      quantity: 1,
    })
  }

  saveCartToStorage()
  renderCart()
  updateCartCount()

  // Visual feedback
  showNotification(`${product.name} agregado al carrito`)
}

function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId)
  if (index === -1) return

  const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`)
  if (cartItem) {
    cartItem.style.transition = "opacity 0.3s, transform 0.3s"
    cartItem.style.opacity = "0"
    cartItem.style.transform = "translateX(20px)"

    setTimeout(() => {
      cart.splice(index, 1)
      saveCartToStorage()
      renderCart()
      updateCartCount()
    }, 300)
  }
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (!item) return

  item.quantity += change

  if (item.quantity <= 0) {
    removeFromCart(productId)
  } else {
    saveCartToStorage()
    renderCart()
    updateCartCount()
  }
}

function renderCart() {
  const cartItemsContainer = document.querySelector(".cart-items")
  const totalPriceElement = document.querySelector(".total-price")

  if (!cartItemsContainer) return

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
                <p>Tu carrito está vacío</p>
                <p style="font-size: 14px; margin-top: 8px;">Agrega productos desde la tienda</p>
            </div>
        `
    if (totalPriceElement) {
      totalPriceElement.textContent = "$0"
    }
    return
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toLocaleString("es-AR")}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)" class="quantity-btn">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="quantity-btn">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
    `,
    )
    .join("")

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  if (totalPriceElement) {
    totalPriceElement.textContent = `$${total.toLocaleString("es-AR")}`
  }
}

function updateCartCount() {
  const cartCount = document.querySelector(".cart-count")
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (cartCount) {
    cartCount.textContent = totalItems
    cartCount.style.display = totalItems > 0 ? "block" : "none"
  }
}

// ========== LOCAL STORAGE ==========
function saveCartToStorage() {
  localStorage.setItem("mapache_cart", JSON.stringify(cart))
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem("mapache_cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    renderCart()
    updateCartCount()
  }
}

function clearCart() {
  if (confirm("¿Estás seguro de vaciar el carrito?")) {
    cart = []
    saveCartToStorage()
    renderCart()
    updateCartCount()
  }
}

// ========== UI INTERACTIONS ==========
function toggleCart() {
  const sidebar = document.getElementById("cartSidebar")
  const overlay = document.getElementById("cartOverlay")

  if (!sidebar || !overlay) return

  const isActive = sidebar.classList.toggle("active")
  overlay.classList.toggle("active")

  // Prevent body scroll when cart is open
  document.body.style.overflow = isActive ? "hidden" : ""
}

function toggleMobileMenu() {
  const nav = document.querySelector("nav")
  const btn = document.querySelector(".mobile-menu-btn")

  if (!nav || !btn) return

  nav.classList.toggle("mobile-active")
  btn.textContent = nav.classList.contains("mobile-active") ? "✕" : "☰"
}

function setupEventListeners() {
  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const nav = document.querySelector("nav")
      const btn = document.querySelector(".mobile-menu-btn")
      if (nav && nav.classList.contains("mobile-active")) {
        nav.classList.remove("mobile-active")
        if (btn) btn.textContent = "☰"
      }
    })
  })

  const checkoutBtn = document.querySelector(".checkout-btn")
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Tu carrito está vacío")
        return
      }

      // Show success modal
      showModal(
        "¡Compra realizada!",
        "Tu pedido ha sido procesado exitosamente. Te enviaremos la información a tu correo. Nos estaremos contactando pronto!",
      )

      // Clear cart after checkout
      cart = []
      saveCartToStorage()
      renderCart()
      updateCartCount()
      toggleCart()
    })
  }

  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const formData = new FormData(contactForm)

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        })

        if (response.ok) {
          showModal("¡Mensaje enviado!", "Gracias por contactarnos! Nos estaremos comunicando contigo pronto.")
          contactForm.reset()
        } else {
          alert("Hubo un error al enviar el mensaje. Por favor intenta de nuevo.")
        }
      } catch (error) {
        alert("Hubo un error al enviar el mensaje. Por favor intenta de nuevo.")
      }
    })
  }

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    })
  })

  // Login modal event listeners
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  const loginBtn = document.querySelector(".login-btn")
  if (loginBtn) {
    loginBtn.onclick = openLoginModal
  }
}

function showModal(title, message) {
  const modal = document.getElementById("modalOverlay")
  const modalTitle = document.getElementById("modalTitle")
  const modalMessage = document.getElementById("modalMessage")

  if (modal && modalTitle && modalMessage) {
    modalTitle.textContent = title
    modalMessage.textContent = message
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
  }
}

function closeModal() {
  const modal = document.getElementById("modalOverlay")
  if (modal) {
    modal.classList.remove("active")
    document.body.style.overflow = ""
    document.body.style.position = ""
  }
}

function openLoginModal() {
  const loginModal = document.getElementById("loginModal")
  if (loginModal) {
    loginModal.classList.add("active")
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
  }
}

function closeLoginModal() {
  const loginModal = document.getElementById("loginModal")
  if (loginModal) {
    loginModal.classList.remove("active")
    document.body.style.overflow = ""
    document.body.style.position = ""
  }
}

function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value

  const validUsers = [
    { email: "admin@mapache.com", password: "admin123", name: "Admin" },
    { email: "user@test.com", password: "test123", name: "Usuario" },
  ]

  const user = validUsers.find((u) => (u.email === email || u.email.split("@")[0] === email) && u.password === password)

  if (user) {
    // Successful login
    closeLoginModal()
    showModal(`¡Bienvenido ${user.name}!`, "Has iniciado sesión exitosamente en Mapache Studio.")

    // Store user session
    localStorage.setItem(
      "mapache_user",
      JSON.stringify({
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString(),
      }),
    )

    // Update login button to show user name
    updateLoginButton(user.name)
  } else {
    // Failed login
    alert("Usuario o contraseña incorrectos. Intenta de nuevo.")
  }
}

function updateLoginButton(userName) {
  const loginBtn = document.querySelector(".login-btn")
  if (loginBtn) {
    loginBtn.textContent = userName
    loginBtn.onclick = handleLogout
  }
}

function handleLogout() {
  if (confirm("¿Deseas cerrar sesión?")) {
    localStorage.removeItem("mapache_user")
    const loginBtn = document.querySelector(".login-btn")
    if (loginBtn) {
      loginBtn.textContent = "Login"
      loginBtn.onclick = openLoginModal
    }
    showModal("Sesión cerrada", "Has cerrado sesión exitosamente.")
  }
}

function checkUserLogin() {
  const savedUser = localStorage.getItem("mapache_user")
  if (savedUser) {
    const user = JSON.parse(savedUser)
    updateLoginButton(user.name)
  }
}

// ========== NOTIFICATIONS ==========
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #7ed321;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `

  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Add CSS animations for notifications
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)
