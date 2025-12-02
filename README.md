# Mapache Studio - Sitio Web Oficial

Sitio web oficial de Mapache Studio, un estudio de diseño e ilustración inspirado en la curiosidad y astucia del mapache.

## 🎨 Descripción

Mapache Studio es una agencia creativa especializada en diseño UX/UI, diseño digital e ilustración. Este sitio web presenta nuestros servicios, proyectos destacados y una tienda online integrada con carrito de compras funcional.

## ✨ Características

- **Diseño Responsivo**: Adaptado para dispositivos móviles, tablets y escritorio
- **Carrito de Compras**: Sistema completo con LocalStorage para persistencia de datos
- **Sistema de Login**: Autenticación básica con validación JavaScript
- **Formulario de Contacto**: Integrado con Formspree para envío de emails
- **Productos Dinámicos**: Carga de productos desde archivo JSON
- **Efectos Hover**: Interacciones visuales en proyectos destacados
- **Navegación Móvil**: Menú hamburguesa con animaciones suaves

## 🛠️ Tecnologías Utilizadas

- HTML5
- CSS3 (Flexbox, Grid, Animaciones)
- JavaScript Vanilla (ES6+)
- LocalStorage API
- Formspree (para formulario de contacto)
- Google Maps Embed API

## 📁 Estructura del Proyecto

\`\`\`
mapache-studio/
│
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
├── products.json       # Base de datos de productos
│
└── img/                # Carpeta de imágenes
    ├── logo.png
    ├── nosotros-fondo.png
    ├── servicio-uxui.png
    ├── servicio-digital.png
    ├── servicio-ilust.png
    ├── linea-estrellas.png
    ├── proyecto1.png
    ├── proyecto2.png
    ├── proyecto3.png
    ├── proyecto4.png
    ├── tienda-landing.png
    └── footer-fondo.png
\`\`\`

## 🚀 Instalación y Uso

1. **Clonar o descargar el repositorio**
   \`\`\`bash
   git clone [url-del-repositorio]
   \`\`\`

2. **Abrir el proyecto**
   - Simplemente abre el archivo `index.html` en tu navegador web
   - O utiliza un servidor local como Live Server en VS Code

3. **No requiere instalación de dependencias**
   - El proyecto usa HTML, CSS y JavaScript puros
   - No necesita npm, node.js u otras herramientas

## 🔑 Credenciales de Prueba

Para probar el sistema de login, utiliza:

**Admin:**
- Email: `admin@mapache.com`
- Password: `admin123`

**Usuario:**
- Email: `user@test.com`
- Password: `test123`

## 🛒 Funcionalidades del Carrito

- ✅ Agregar productos desde la tienda
- ✅ Ajustar cantidades (+/-)
- ✅ Eliminar productos individuales
- ✅ Cálculo automático de subtotales y total
- ✅ Persistencia con LocalStorage
- ✅ Notificaciones visuales
- ✅ Finalizar compra con confirmación

## 📧 Formulario de Contacto

El formulario de contacto está integrado con **Formspree** y envía los mensajes directamente al email configurado. Los campos incluyen:
- Nombre
- Correo electrónico
- Teléfono
- Mensaje

## 🎯 Secciones del Sitio

1. **Header**: Logo y navegación principal con carrito y login
2. **Nosotros**: Presentación del estudio con diseño visual impactante
3. **Servicios**: UX/UI, Diseño Digital e Ilustración
4. **Proyectos Destacados**: Galería de trabajos realizados con efectos hover
5. **Tienda**: Productos disponibles con sistema de compra
6. **Contacto**: Formulario y datos de contacto con mapa de Google

## 📱 Responsive Design

El sitio está optimizado para:
- 📱 Móviles: < 768px
- 💻 Tablets: 768px - 1024px
- 🖥️ Desktop: > 1024px

## 🎨 Paleta de Colores

- **Verde Lima**: `#7ed321` (Color principal/acento)
- **Negro**: `#1a1a1a` (Texto principal)
- **Gris Oscuro**: `#333` (Backgrounds y elementos secundarios)
- **Blanco**: `#fff` (Fondos y contrastes)

## 📝 Validaciones JavaScript

- ✅ Formulario de login con usuarios predefinidos
- ✅ Formulario de contacto con validación de campos
- ✅ Gestión de sesión con LocalStorage
- ✅ Validación de productos en carrito
- ✅ Prevención de cantidades negativas o cero

## 🌐 Ubicación

**Dirección Física:**
Calle Florida 165, C1005
Ciudad Autónoma de Buenos Aires, Argentina

## 👨‍💻 Desarrollado por

Mapache Studio - 2024

## 📄 Licencia

Todos los derechos reservados © Mapache Studio

---

**Nota:** Este proyecto fue desarrollado como parte de un trabajo práctico que incluye:
- Implementación de carrito con LocalStorage
- Consumo de datos desde JSON
- Sistema de login con validación JavaScript
- Formulario funcional con Formspree
- Diseño responsive completo
