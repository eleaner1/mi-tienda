# Documentación Técnica Completa
## Aplicación Web de Comercio Electrónico — Guía para Nivel Básico

---

**Versión:** 1.0  
**Fecha:** Junio 2026  
**Autor:** Generado con Claude Code  

---

## Tabla de Contenidos

1. [Introducción al Proyecto](#1-introducción-al-proyecto)
2. [¿Qué es una Aplicación Web Full-Stack?](#2-qué-es-una-aplicación-web-full-stack)
3. [Arquitectura General](#3-arquitectura-general)
4. [Lenguajes de Programación](#4-lenguajes-de-programación)
5. [Node.js — El Motor de JavaScript en el Servidor](#5-nodejs--el-motor-de-javascript-en-el-servidor)
6. [TypeScript — JavaScript con Superpoderes](#6-typescript--javascript-con-superpoderes)
7. [React — La Librería del Frontend](#7-react--la-librería-del-frontend)
8. [React Router — Navegación entre Páginas](#8-react-router--navegación-entre-páginas)
9. [Hono — El Servidor Web](#9-hono--el-servidor-web)
10. [tRPC — Comunicación Frontend-Backend](#10-trpc--comunicación-frontend-backend)
11. [TanStack Query — Manejo del Estado del Servidor](#11-tanstack-query--manejo-del-estado-del-servidor)
12. [La Base de Datos MySQL](#12-la-base-de-datos-mysql)
13. [Drizzle ORM — Hablar con la Base de Datos](#13-drizzle-orm--hablar-con-la-base-de-datos)
14. [Vite — La Herramienta de Construcción](#14-vite--la-herramienta-de-construcción)
15. [Tailwind CSS — Los Estilos Visuales](#15-tailwind-css--los-estilos-visuales)
16. [shadcn/ui y Radix UI — Componentes de Interfaz](#16-shadcnui-y-radix-ui--componentes-de-interfaz)
17. [Zod — Validación de Datos](#17-zod--validación-de-datos)
18. [Autenticación y Seguridad](#18-autenticación-y-seguridad)
19. [Sistema de Pagos — PayPal y Stripe](#19-sistema-de-pagos--paypal-y-stripe)
20. [AWS S3 — Almacenamiento de Archivos](#20-aws-s3--almacenamiento-de-archivos)
21. [Librerías de Apoyo](#21-librerías-de-apoyo)
22. [Herramientas de Calidad de Código](#22-herramientas-de-calidad-de-código)
23. [Testing con Vitest](#23-testing-con-vitest)
24. [Estructura de Carpetas](#24-estructura-de-carpetas)
25. [Páginas de la Aplicación](#25-páginas-de-la-aplicación)
26. [Flujos Principales de la Aplicación](#26-flujos-principales-de-la-aplicación)
27. [Variables de Entorno](#27-variables-de-entorno)
28. [Despliegue en Railway](#28-despliegue-en-railway)
29. [Pruebas con ngrok](#29-pruebas-con-ngrok)
30. [Glosario de Términos](#30-glosario-de-términos)

---

## 1. Introducción al Proyecto

### ¿Qué es esta aplicación?

Este proyecto es una **tienda en línea completa** (e-commerce), similar en concepto a Amazon o Mercado Libre, pero construida desde cero y personalizada. Permite a los usuarios:

- Explorar productos organizados por categorías
- Buscar productos por nombre o marca
- Agregar productos al carrito de compras
- Pagar con PayPal
- Ver el historial de sus pedidos

Y permite a los administradores:

- Crear, editar y eliminar productos y categorías
- Gestionar el inventario (stock de productos)
- Crear ofertas y descuentos con fecha de inicio y fin
- Ver y gestionar todos los pedidos de clientes
- Configurar la información de la tienda (datos bancarios, contacto)
- Ver reportes y estadísticas de ventas

### ¿Quién puede usarla?

La aplicación tiene **dos tipos de usuarios**:

| Tipo | Descripción |
|------|-------------|
| **Usuario común** | Se registra, navega productos, compra, ve sus pedidos |
| **Administrador** | Tiene acceso total al panel de administración |

El administrador se define automáticamente: el usuario cuyo `unionId` coincida con la variable de entorno `OWNER_UNION_ID` recibe el rol de admin al registrarse.

---

## 2. ¿Qué es una Aplicación Web Full-Stack?

### La analogía del restaurante

Para entender una aplicación web full-stack, imaginemos un restaurante:

- **El Frontend** es lo que el cliente ve: el menú, las mesas, la decoración. Es todo lo que aparece en pantalla.
- **El Backend** es la cocina: procesa las órdenes, guarda información, aplica las reglas del negocio.
- **La Base de Datos** es la despensa: guarda todos los ingredientes (datos) de forma organizada.

En esta aplicación:

```
USUARIO (navegador)
       ↕
  FRONTEND (React)     ← Lo que el usuario ve en pantalla
       ↕ tRPC
   BACKEND (Hono)      ← La lógica del negocio
       ↕
  BASE DE DATOS        ← Donde se guardan todos los datos
     (MySQL)
```

### ¿Qué hace cada parte?

**El Frontend** (código en la carpeta `/src`):
- Muestra la interfaz visual al usuario
- Envía peticiones al backend cuando el usuario hace algo (clic, formulario, etc.)
- Recibe la respuesta y actualiza lo que se ve en pantalla
- Se ejecuta **en el navegador del usuario** (Chrome, Firefox, etc.)

**El Backend** (código en la carpeta `/api`):
- Recibe las peticiones del frontend
- Aplica reglas de negocio (¿tiene permiso? ¿hay stock? ¿el precio es correcto?)
- Lee y escribe en la base de datos
- Devuelve respuestas al frontend
- Se ejecuta **en un servidor** (en la computadora que tiene el código corriendo)

**La Base de Datos** (MySQL):
- Guarda todos los datos de forma permanente: usuarios, productos, pedidos, etc.
- El backend la consulta y modifica según sea necesario

---

## 3. Arquitectura General

### Diagrama de componentes

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR DEL USUARIO                │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │              REACT (Frontend)                   │   │
│   │                                                 │   │
│   │  Páginas:        Componentes UI:                │   │
│   │  - Home          - Botones                      │   │
│   │  - Login         - Formularios                  │   │
│   │  - Cart          - Tablas                       │   │
│   │  - Admin panel   - Modales                      │   │
│   │  - etc.          - etc.                         │   │
│   └──────────────────┬──────────────────────────────┘   │
└──────────────────────┼──────────────────────────────────┘
                       │ tRPC (peticiones HTTP)
                       ↕
┌──────────────────────┴──────────────────────────────────┐
│                    SERVIDOR (Node.js)                   │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │              HONO (Backend)                     │   │
│   │                                                 │   │
│   │  Routers:        Middleware:                    │   │
│   │  - auth          - Autenticación                │   │
│   │  - products      - Validación de roles          │   │
│   │  - cart          - Límite de tamaño             │   │
│   │  - orders        - Servir archivos estáticos    │   │
│   │  - payment                                      │   │
│   │  - etc.                                         │   │
│   └──────────────────┬──────────────────────────────┘   │
└──────────────────────┼──────────────────────────────────┘
                       │ Drizzle ORM (consultas SQL)
                       ↕
┌──────────────────────┴──────────────────────────────────┐
│                  BASE DE DATOS (MySQL)                  │
│                                                         │
│   Tablas:                                               │
│   - users           - orders                           │
│   - categories      - orderItems                       │
│   - products        - storeSettings                    │
│   - offers          - cartItems                        │
└─────────────────────────────────────────────────────────┘
                       ↕
        Servicios externos (PayPal, Stripe, AWS S3)
```

### El puerto 3000

La aplicación corre en el **puerto 3000**. Piensa en el puerto como la "puerta de entrada" de la aplicación. Cuando escribes `http://localhost:3000` en el navegador, estás "tocando la puerta 3000" de tu propia computadora.

- En desarrollo: Vite sirve el frontend y Hono sirve el backend, ambos en el puerto 3000.
- En producción: Node.js sirve todo desde el mismo puerto.

---

## 4. Lenguajes de Programación

### 4.1 HTML (HyperText Markup Language)

**¿Qué es?**  
HTML es el lenguaje que define la **estructura** de una página web. Es como el esqueleto de una casa: define dónde van las paredes, puertas y ventanas.

**¿Dónde aparece en el proyecto?**  
El archivo `index.html` en la raíz del proyecto es el punto de entrada. Aunque en React casi no escribes HTML directamente, todo termina convirtiéndose en HTML que el navegador entiende.

```html
<!-- index.html (simplificado) -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Mi Tienda</title>
  </head>
  <body>
    <div id="root"></div>  <!-- Aquí React "monta" toda la aplicación -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Concepto clave:** El `<div id="root">` es el punto donde React toma control y dibuja toda la interfaz.

---

### 4.2 CSS (Cascading Style Sheets)

**¿Qué es?**  
CSS es el lenguaje que da **apariencia visual** a las páginas. Define colores, tamaños, fuentes, espaciado y animaciones. Es como la pintura y decoración de la casa.

**¿Cómo se usa en el proyecto?**  
En vez de escribir CSS directamente, este proyecto usa **Tailwind CSS** (explicado en la sección 15), que es una forma de aplicar estilos usando clases predefinidas.

También existen archivos CSS globales:
- `src/App.css` — Estilos específicos de la aplicación
- `src/index.css` — Estilos globales (fuentes, colores base, variables CSS)

**Variables CSS personalizadas:**  
El proyecto usa variables CSS para el sistema de colores con soporte de modo oscuro:

```css
/* src/index.css (fragmento) */
:root {
  --background: 0 0% 100%;      /* Fondo blanco */
  --foreground: 222.2 84% 4.9%;  /* Texto oscuro */
  --primary: 222.2 47.4% 11.2%; /* Color principal */
}

.dark {
  --background: 222.2 84% 4.9%; /* Fondo oscuro en modo dark */
  --foreground: 210 40% 98%;    /* Texto claro en modo dark */
}
```

---

### 4.3 JavaScript (JS)

**¿Qué es?**  
JavaScript es el **lenguaje de programación principal** de la web. Permite que las páginas sean interactivas: responder a clics, enviar datos, mostrar/ocultar elementos, etc.

**¿Dónde se usa?**  
En este proyecto casi no verás archivos `.js` porque se usa TypeScript (una versión mejorada de JavaScript). Sin embargo, todo el código TypeScript se compila (convierte) a JavaScript antes de ejecutarse.

---

### 4.4 TypeScript (TS)

TypeScript se explica en detalle en la sección 6, pero en resumen: es JavaScript con un sistema de tipos que previene errores comunes antes de ejecutar el código.

---

### 4.5 SQL (Structured Query Language)

**¿Qué es?**  
SQL es el lenguaje para **comunicarse con bases de datos**. Sirve para crear tablas, insertar datos, buscar información y modificarla.

**¿Cómo se usa en el proyecto?**  
No se escribe SQL directamente. En cambio, se usa **Drizzle ORM** (sección 13), que traduce código TypeScript a consultas SQL automáticamente.

Ejemplo de lo que Drizzle traduce automáticamente:

```typescript
// Código TypeScript que escribes:
const products = await db.select().from(productsTable).limit(10);

// Drizzle convierte eso a SQL:
// SELECT * FROM products LIMIT 10;
```

---

## 5. Node.js — El Motor de JavaScript en el Servidor

### ¿Qué es Node.js?

Normalmente, JavaScript solo corre en el navegador. **Node.js** es un entorno que permite ejecutar JavaScript **fuera del navegador**, directamente en el servidor o en tu computadora.

Imagina que JavaScript es un idioma. El navegador es como hablar ese idioma en casa. Node.js te permite hablar ese mismo idioma en la oficina, en la tienda, en cualquier lugar.

### ¿Por qué usarlo?

- Permite usar el **mismo lenguaje** (JavaScript/TypeScript) tanto en el frontend como en el backend.
- Es muy eficiente para aplicaciones que manejan muchas conexiones simultáneas.
- Tiene un ecosistema enorme de paquetes (npm).

### Versión utilizada

El archivo `.nvmrc` especifica la versión exacta:

```
v20.20.2
```

Node.js versión 20 es una versión LTS (Long Term Support), es decir, con soporte a largo plazo y considerada estable para producción.

### npm (Node Package Manager)

Junto con Node.js viene **npm**, el gestor de paquetes. Es como una tienda de herramientas: puedes "instalar" librerías que otros desarrolladores crearon para no tener que construir todo desde cero.

```bash
npm install          # Instala todas las dependencias del proyecto
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Compila el proyecto para producción
```

---

## 6. TypeScript — JavaScript con Superpoderes

### ¿Qué es TypeScript?

TypeScript es un **superconjunto de JavaScript** creado por Microsoft. Agrega un sistema de **tipos estáticos**, lo que significa que debes especificar qué tipo de dato espera cada variable, función y parámetro.

### Analogía simple

Imagina que JavaScript es como darle una instrucción a alguien diciendo "tráeme algo". Podrían traerte cualquier cosa. TypeScript es como decir "tráeme una manzana roja". Si intentan traerte una naranja, TypeScript te avisa antes de que lo hagan.

### Ejemplo práctico

```typescript
// JavaScript (sin tipos) — puede causar errores en tiempo de ejecución
function calcularTotal(precio, cantidad) {
  return precio * cantidad;
}

calcularTotal("hola", 5); // Resultado: "holaholahola..." (error silencioso)

// TypeScript (con tipos) — el error se detecta antes de ejecutar
function calcularTotal(precio: number, cantidad: number): number {
  return precio * cantidad;
}

calcularTotal("hola", 5); // Error: Argument of type 'string' is not assignable to type 'number'
```

### Configuración en el proyecto

El proyecto tiene **cuatro archivos de configuración** de TypeScript para diferentes partes:

| Archivo | ¿Para qué sirve? |
|---------|------------------|
| `tsconfig.json` | Configuración raíz, referencia a los demás |
| `tsconfig.node.json` | Para herramientas de construcción (Vite, etc.) |
| `tsconfig.server.json` | Para el código del backend (API) |
| (tsconfig.app.json) | Para el código del frontend (React) |

### Aliases de rutas

Para no escribir rutas relativas largas como `../../components/Button`, se definen aliases:

```typescript
// Sin alias (confuso y difícil de mantener):
import { Button } from '../../../src/components/ui/button';

// Con alias (limpio y fácil):
import { Button } from '@/components/ui/button';
```

| Alias | Apunta a |
|-------|----------|
| `@/*` | `./src/*` |
| `@db/*` | `./db/*` |
| `@api/*` | `./api/*` |
| `@contracts/*` | `./contracts/*` |

---

## 7. React — La Librería del Frontend

### ¿Qué es React?

React es una **librería de JavaScript** creada por Facebook (Meta) para construir interfaces de usuario. Es la tecnología más popular para crear el lado visual de aplicaciones web modernas.

### El concepto de Componentes

React se basa en **componentes**: piezas reutilizables de interfaz. Piensa en ellos como bloques de LEGO: construyes piezas pequeñas y las combinas para hacer algo grande.

```tsx
// Un componente simple de React
function TarjetaProducto({ nombre, precio }: { nombre: string; precio: number }) {
  return (
    <div className="card">
      <h2>{nombre}</h2>
      <p>Precio: ${precio}</p>
      <button>Agregar al carrito</button>
    </div>
  );
}

// Se usa así:
<TarjetaProducto nombre="Laptop" precio={999} />
```

### JSX y TSX

Los archivos con extensión `.tsx` o `.jsx` mezclan JavaScript/TypeScript con algo que parece HTML. Esto se llama **JSX** (JavaScript XML). No es HTML real: es una sintaxis especial que React transforma en llamadas JavaScript.

```tsx
// Esto parece HTML pero es JSX/TSX:
const elemento = <h1 className="titulo">Hola mundo</h1>;

// React lo convierte a esto internamente:
const elemento = React.createElement('h1', { className: 'titulo' }, 'Hola mundo');
```

### Estado (State)

El **estado** es la "memoria" de un componente: datos que pueden cambiar y que cuando cambian, hacen que el componente se redibuje.

```tsx
import { useState } from 'react';

function Contador() {
  const [contador, setContador] = useState(0); // Estado inicial: 0

  return (
    <div>
      <p>Clicks: {contador}</p>
      <button onClick={() => setContador(contador + 1)}>
        Hacer clic
      </button>
    </div>
  );
}
```

### Efectos (useEffect)

Los efectos permiten realizar acciones cuando el componente se monta, actualiza o desmonta. Se usan para cargar datos, suscribirse a eventos, etc.

```tsx
import { useEffect, useState } from 'react';

function ListaProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Esto se ejecuta cuando el componente aparece en pantalla
    fetch('/api/productos').then(r => r.json()).then(setProductos);
  }, []); // [] significa "solo ejecutar una vez al montar"

  return <ul>{productos.map(p => <li key={p.id}>{p.nombre}</li>)}</ul>;
}
```

### Context (Contexto)

El contexto permite compartir datos entre muchos componentes sin pasarlos uno por uno. En este proyecto se usa para:

- **AuthContext** — La información del usuario autenticado (quién está logueado)
- **CartContext** — El estado del carrito de compras

```tsx
// Proveedor (Provider) — envuelve a toda la app
<AuthProvider>
  <CartProvider>
    <App />
  </CartProvider>
</AuthProvider>

// Cualquier componente dentro puede acceder a los datos:
function MiComponente() {
  const { user, isAuthenticated } = useAuth(); // ¡Sin pasar props!
  const { totalItems } = useCart();
}
```

### Versión utilizada

Este proyecto usa **React 19**, la versión más reciente, con mejoras en rendimiento y nuevas funciones de concurrencia.

---

## 8. React Router — Navegación entre Páginas

### ¿Qué es?

React Router es una librería que permite tener **múltiples "páginas"** en una aplicación React sin recargar el navegador. A esto se le llama **SPA (Single Page Application)** — aplicación de una sola página.

### ¿Cómo funciona?

En una web tradicional, cada URL carga una página diferente del servidor. Con React Router, el servidor siempre devuelve el mismo archivo `index.html`, y React Router decide qué componente mostrar según la URL.

```tsx
// src/App.tsx (simplificado)
<Routes>
  <Route path="/"           element={<Home />} />
  <Route path="/login"      element={<Login />} />
  <Route path="/product/:id" element={<ProductDetail />} />
  <Route path="/cart"       element={<CartPage />} />
  <Route path="/admin"      element={<AdminDashboard />} />
</Routes>
```

### Rutas dinámicas

El `:id` en `/product/:id` es un **parámetro dinámico**. Cuando el usuario visita `/product/42`, el componente `ProductDetail` recibe `id = "42"` y puede cargar ese producto específico.

### Versión utilizada

Este proyecto usa **React Router v7**, con el componente `BrowserRouter` que usa el historial del navegador (el botón "Atrás" funciona correctamente).

---

## 9. Hono — El Servidor Web

### ¿Qué es Hono?

**Hono** (significa "llama" en japonés) es un framework web ultraligero y rápido para crear servidores HTTP en JavaScript/TypeScript. Es similar a Express.js pero más moderno y eficiente.

### ¿Qué hace un servidor web?

Un servidor web "escucha" peticiones HTTP que llegan desde el navegador y devuelve respuestas. Cuando accedes a una URL, tu navegador envía una petición HTTP; el servidor la procesa y devuelve HTML, JSON, imágenes, etc.

### Cómo se usa en el proyecto

```typescript
// api/boot.ts (simplificado)
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

// Ruta de ejemplo
app.get('/api/ping', (c) => c.json({ ok: true }));

// Iniciar el servidor en el puerto 3000
serve({ fetch: app.fetch, port: 3000 });
console.log('Servidor corriendo en http://localhost:3000');
```

### Middleware

El middleware son funciones que se ejecutan **antes** de llegar al handler final. Es como un filtro o revisor que procesa la petición antes de que llegue a su destino.

En este proyecto:
- El middleware de **tamaño de cuerpo** rechaza peticiones mayores a 50MB
- El middleware de **autenticación** verifica si el usuario tiene una sesión válida
- El middleware de **archivos estáticos** sirve el frontend React en producción

### La integración con Vite en desarrollo

Durante el desarrollo, Hono y Vite trabajan juntos:
- Las peticiones a `/api/*` van a Hono (el backend)
- Todo lo demás va a Vite (el frontend React)

Esto lo configura `@hono/vite-dev-server` en `vite.config.ts`.

---

## 10. tRPC — Comunicación Frontend-Backend

### ¿Qué es tRPC?

**tRPC** (TypeScript Remote Procedure Call) es una librería que permite al frontend **llamar funciones del backend** como si fueran funciones locales, con total seguridad de tipos.

### El problema que resuelve

Sin tRPC, la comunicación frontend-backend suele ser así:

```typescript
// Frontend: haces una petición HTTP "a ciegas"
const response = await fetch('/api/products');
const data = await response.json(); // TypeScript no sabe qué tipo tiene "data"

// Si el backend cambia el nombre de un campo, el frontend se rompe en silencio.
```

Con tRPC:

```typescript
// Frontend: llamas funciones tipadas
const products = await trpc.product.list.query({ page: 1 });
// TypeScript SABE exactamente qué campos tiene products.
// Si el backend cambia, TypeScript te avisa inmediatamente.
```

### Estructura de tRPC en el proyecto

**En el backend** (`api/`), se definen los **routers** (grupos de funciones):

```typescript
// Ejemplo simplificado de api/router.ts
export const appRouter = createRouter({
  auth: authRouter,      // trpc.auth.login, trpc.auth.register, etc.
  product: productRouter, // trpc.product.list, trpc.product.getById, etc.
  cart: cartRouter,       // trpc.cart.add, trpc.cart.remove, etc.
  order: orderRouter,     // trpc.order.create, trpc.order.myOrders, etc.
  payment: paymentRouter, // trpc.payment.createPayPalOrder, etc.
});
```

**En el frontend** (`src/providers/trpc.tsx`), se configura el cliente:

```typescript
// Se crea el cliente tRPC apuntando al servidor
const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: '/api/trpc' })],
});
```

### Tipos de procedimientos

| Tipo | Uso | Analogía |
|------|-----|---------|
| `query` | Leer datos (GET) | Consultar el catálogo |
| `mutation` | Crear/modificar/eliminar datos | Hacer un pedido |

### SuperJSON

tRPC usa **SuperJSON** para serializar datos complejos. JSON normal no puede manejar tipos como `Date`, `Map` o `Set`. SuperJSON sí puede, y convierte estos tipos automáticamente entre frontend y backend.

---

## 11. TanStack Query — Manejo del Estado del Servidor

### ¿Qué es?

**TanStack Query** (antes llamado React Query) es una librería para gestionar el **estado asíncrono** del servidor. Se encarga de:

- Hacer las peticiones al backend
- **Cachear** los resultados (para no hacer la misma petición múltiples veces)
- **Refrescar** los datos cuando sea necesario
- Manejar estados de carga y error automáticamente

### Integración con tRPC

tRPC y TanStack Query trabajan juntos. Cuando usas `trpc.product.list.useQuery()`, en realidad estás usando ambas librerías al mismo tiempo:

```tsx
function ListaProductos() {
  // Esta línea hace la petición, cachea el resultado y maneja la carga
  const { data, isLoading, error } = trpc.product.list.useQuery({ page: 1 });

  if (isLoading) return <Spinner />;
  if (error)    return <p>Error al cargar productos</p>;

  return (
    <ul>
      {data.products.map(producto => (
        <TarjetaProducto key={producto.id} {...producto} />
      ))}
    </ul>
  );
}
```

### Caché inteligente

TanStack Query guarda los resultados en un caché con un tiempo de vida. En este proyecto está configurado con:

- **staleTime: 30 segundos** — Los datos se consideran "frescos" por 30 segundos
- **Sin reintentos en errores 401/403** — Si hay un error de autenticación, no reintenta

---

## 12. La Base de Datos MySQL

### ¿Qué es una base de datos?

Una base de datos es un sistema organizado para **guardar información de forma permanente**. A diferencia de variables en código (que se borran al cerrar el programa), los datos en la base de datos persisten.

### ¿Qué es MySQL?

**MySQL** es uno de los sistemas de bases de datos más populares del mundo. Organiza los datos en **tablas** (similares a hojas de cálculo de Excel), con filas y columnas.

### Tablas del proyecto

La base de datos de este proyecto tiene **8 tablas**:

#### Tabla: `users` (Usuarios)
Guarda la información de los usuarios registrados.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | número | Identificador único |
| `unionId` | texto único | ID del sistema OAuth |
| `name` | texto | Nombre del usuario |
| `email` | texto único | Correo electrónico |
| `password` | texto | Contraseña (encriptada) |
| `avatar` | texto | URL de la foto de perfil |
| `role` | enum | "user" o "admin" |
| `phone` | texto | Teléfono |
| `createdAt` | fecha | Fecha de registro |
| `updatedAt` | fecha | Última modificación |

#### Tabla: `categories` (Categorías)
Organiza los productos en grupos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | número | Identificador único |
| `name` | texto | Nombre de la categoría |
| `description` | texto | Descripción |
| `image` | texto | URL de la imagen |
| `active` | booleano | Si está activa (true/false) |

#### Tabla: `products` (Productos)
El catálogo completo de productos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | número | Identificador único |
| `name` | texto | Nombre del producto |
| `description` | texto | Descripción |
| `brand` | texto | Marca |
| `price` | decimal | Precio (ej: 99.99) |
| `stock` | número | Unidades disponibles |
| `image` | texto | URL de la imagen |
| `categoryId` | número | Referencia a categoría |
| `mostBought` | número | Veces que fue comprado |
| `active` | booleano | Si está disponible |

#### Tabla: `offers` (Ofertas)
Descuentos temporales sobre productos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | número | Identificador único |
| `productId` | número | Referencia al producto |
| `discountPercent` | número | % de descuento (1-99) |
| `startDate` | fecha | Inicio de la oferta |
| `endDate` | fecha | Fin de la oferta |
| `active` | booleano | Si está activa |

#### Tabla: `cartItems` (Artículos en el carrito)
Guarda lo que los usuarios tienen en su carrito.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | número | Identificador único |
| `userId` | número | Referencia al usuario |
| `productId` | número | Referencia al producto |
| `quantity` | número | Cantidad (default: 1) |

#### Tabla: `orders` (Pedidos)
Los pedidos realizados por los clientes.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | número | Identificador único |
| `userId` | número | Referencia al usuario |
| `status` | enum | pending/processing/completed/cancelled |
| `total` | decimal | Monto total |
| `whatsappSent` | booleano | Si se envió confirmación |

#### Tabla: `orderItems` (Artículos del pedido)
El detalle de qué productos incluye cada pedido.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | número | Identificador único |
| `orderId` | número | Referencia al pedido |
| `productId` | número | Referencia al producto |
| `quantity` | número | Cantidad comprada |
| `unitPrice` | decimal | Precio al momento de compra |

#### Tabla: `storeSettings` (Configuración de la tienda)
Información de la tienda (un solo registro).

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `bankName` | texto | Nombre del banco |
| `accountNumber` | texto | Número de cuenta |
| `accountHolder` | texto | Titular de la cuenta |
| `accountType` | texto | Tipo de cuenta |
| `bankPhone` | texto | Teléfono bancario |

### Relaciones entre tablas

Las tablas están relacionadas entre sí mediante **llaves foráneas (foreign keys)**. Por ejemplo:
- Un `product` pertenece a una `category` (via `categoryId`)
- Un `order` pertenece a un `user` (via `userId`)
- Un `orderItem` pertenece a un `order` y a un `product`

```
users ──────< orders ──────< orderItems >────── products
               │                                    │
               │                                    │
           cartItems                            categories
                                                    │
                                                 offers
```

### Conexión a la base de datos

El proyecto soporta dos modos de conexión:

1. **Local (XAMPP):** Se conecta a `localhost` con usuario `root` sin contraseña, base de datos `catalogo_db`
2. **Cloud (Railway/producción):** Usa la URL completa en la variable `DATABASE_URL`

---

## 13. Drizzle ORM — Hablar con la Base de Datos

### ¿Qué es un ORM?

ORM significa **Object-Relational Mapping** (Mapeo Objeto-Relacional). Es una capa de abstracción que permite trabajar con la base de datos usando código TypeScript/JavaScript en lugar de escribir SQL directamente.

Sin ORM:
```sql
-- SQL puro — más difícil de mantener y propenso a errores
SELECT p.*, c.name as categoryName 
FROM products p 
LEFT JOIN categories c ON p.categoryId = c.id
WHERE p.active = 1 AND p.stock > 0
ORDER BY p.mostBought DESC LIMIT 8;
```

Con Drizzle ORM:
```typescript
// TypeScript — más legible y con verificación de tipos
const products = await db
  .select()
  .from(productsTable)
  .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
  .where(and(eq(productsTable.active, true), gt(productsTable.stock, 0)))
  .orderBy(desc(productsTable.mostBought))
  .limit(8);
```

### ¿Por qué Drizzle?

Drizzle ORM se eligió porque:
- Es **muy rápido** (genera SQL eficiente)
- Es **100% TypeScript** — el editor te avisa de errores al instante
- Tiene un sistema de **migraciones** para evolucionar la estructura de la base de datos
- Funciona con MySQL, PostgreSQL y SQLite

### El esquema (schema.ts)

El archivo `db/schema.ts` define cómo se ven las tablas. Drizzle Kit puede leer este archivo y crear las tablas en la base de datos automáticamente.

```typescript
// db/schema.ts (fragmento)
export const products = mysqlTable('products', {
  id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: int('stock').default(0),
  // ...
});
```

### Drizzle Kit

**Drizzle Kit** es una herramienta de línea de comandos para gestionar la base de datos:

```bash
npm run db:push      # Aplica el schema actual a la base de datos
npm run db:generate  # Genera archivos de migración SQL
npm run db:migrate   # Ejecuta las migraciones pendientes
```

---

## 14. Vite — La Herramienta de Construcción

### ¿Qué es Vite?

**Vite** (pronunciado "vit", francés para "rápido") es una herramienta de construcción (build tool) para aplicaciones JavaScript modernas. Reemplaza herramientas más antiguas como Webpack y es significativamente más rápido.

### ¿Qué hace?

En **desarrollo**:
- Sirve el código del frontend directamente al navegador sin necesidad de compilar todo
- Detecta cambios en los archivos y actualiza el navegador al instante (**Hot Module Replacement**)
- Integra el servidor de Hono para servir el backend simultáneamente

En **producción** (`npm run build`):
- **Empaqueta** (bundle) todo el código JavaScript/TypeScript en pocos archivos optimizados
- **Minifica** el código (elimina espacios, acorta nombres de variables)
- **Divide** el código en chunks para cargar solo lo necesario

### Configuración (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [
    devServer({
      entry: 'api/boot.ts',        // El backend inicia desde aquí
      exclude: [/^\/(?!api\/).*/], // Hono solo maneja /api/*
    }),
    react(),                        // Plugin para React/JSX
  ],

  resolve: {
    alias: {                        // Aliases de rutas
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    outDir: 'dist/public',         // Dónde guardar el build
  },

  server: {
    host: '0.0.0.0',               // Accesible desde la red local
    port: 3000,
    allowedHosts: true,            // Permite hosts externos (para ngrok)
  },
});
```

### esbuild (para el backend)

El backend se compila con **esbuild**, un empaquetador extremadamente rápido escrito en Go. El comando de build es:

```bash
esbuild api/boot.ts --platform=node --bundle --format=esm --outdir=dist
```

Esto convierte el archivo TypeScript del servidor en un archivo JavaScript que Node.js puede ejecutar directamente.

---

## 15. Tailwind CSS — Los Estilos Visuales

### ¿Qué es Tailwind CSS?

**Tailwind CSS** es un framework de CSS que provee cientos de clases pequeñas y específicas que aplican estilos directamente en el HTML/JSX. En lugar de escribir CSS personalizado, combinas estas clases.

### CSS tradicional vs Tailwind

```css
/* CSS tradicional — escribes un archivo .css separado */
.boton-primario {
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
}
```

```tsx
// Con Tailwind — los estilos van directo en el JSX
<button className="bg-blue-500 text-white px-4 py-2 rounded font-bold">
  Comprar
</button>
```

### Ventajas de Tailwind

- **No tienes que salir del archivo** para dar estilos
- **No hay conflictos de nombres** de clases
- **Purga automática**: en producción, solo incluye las clases que realmente usas
- **Consistencia**: todos usan el mismo sistema de espaciado, colores, etc.

### Sistema de diseño

Tailwind tiene un sistema de valores numéricos:
- `p-1` = 4px de padding, `p-2` = 8px, `p-4` = 16px...
- `text-sm` = texto pequeño, `text-lg` = texto grande...
- `bg-blue-500` = azul medio, `bg-blue-700` = azul oscuro...

### Modo responsive

Tailwind incluye prefijos para diferentes tamaños de pantalla:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* 
    - En móvil: 1 columna
    - En tablet (md): 2 columnas
    - En desktop (lg): 4 columnas
  */}
</div>
```

### Modo oscuro

Con el prefijo `dark:`:
```tsx
<p className="text-black dark:text-white">
  Este texto es negro en modo claro y blanco en modo oscuro
</p>
```

### PostCSS y Autoprefixer

Tailwind funciona como un **plugin de PostCSS**, una herramienta que procesa el CSS. **Autoprefixer** agrega prefijos de navegador automáticamente (`-webkit-`, `-moz-`, etc.) para compatibilidad.

---

## 16. shadcn/ui y Radix UI — Componentes de Interfaz

### ¿Qué es shadcn/ui?

**shadcn/ui** es una colección de componentes de interfaz de usuario listos para usar, construidos sobre Radix UI y estilizados con Tailwind CSS. No es una librería tradicional que instalas como dependencia; en cambio, **copias el código** de los componentes directamente a tu proyecto y los modificas a tu gusto.

El archivo `components.json` configura cómo se instalan estos componentes.

### Componentes disponibles (40+ componentes)

Los componentes están en `src/components/ui/`:

**Formularios:**
- `button.tsx` — Botones con variantes (primary, secondary, outline, ghost, destructive)
- `input.tsx` — Campos de texto
- `textarea.tsx` — Áreas de texto
- `select.tsx` — Listas desplegables
- `checkbox.tsx` — Casillas de verificación
- `switch.tsx` — Interruptores on/off
- `form.tsx` — Contenedor de formularios con validación
- `label.tsx` — Etiquetas de campo

**Visualización:**
- `card.tsx` — Tarjetas con sombra
- `badge.tsx` — Etiquetas pequeñas (ej: "Nuevo", "Oferta")
- `alert.tsx` — Mensajes de alerta (éxito, error, advertencia)
- `table.tsx` — Tablas responsivas
- `skeleton.tsx` — Esqueletos de carga (placeholder mientras carga)
- `progress.tsx` — Barras de progreso
- `chart.tsx` — Gráficas (integra Recharts)

**Navegación:**
- `tabs.tsx` — Pestañas
- `pagination.tsx` — Paginación de resultados
- `breadcrumb.tsx` — Migas de pan (ej: Inicio > Categoría > Producto)
- `navigation-menu.tsx` — Menú de navegación
- `sidebar.tsx` — Barra lateral

**Overlays:**
- `dialog.tsx` — Modales/diálogos
- `sheet.tsx` — Panel lateral deslizante
- `drawer.tsx` — Cajón desde la parte inferior (mobile-friendly)
- `popover.tsx` — Popup flotante
- `tooltip.tsx` — Mensajes al pasar el cursor
- `alert-dialog.tsx` — Diálogos de confirmación
- `dropdown-menu.tsx` — Menús desplegables
- `context-menu.tsx` — Menús contextuales (clic derecho)

**Especiales:**
- `sonner.tsx` — Notificaciones toast (mensajes temporales en esquina)
- `carousel.tsx` — Carrusel de imágenes
- `calendar.tsx` — Selector de fecha
- `command.tsx` — Paleta de comandos (búsqueda rápida)
- `accordion.tsx` — Secciones expandibles
- `scroll-area.tsx` — Áreas con scroll personalizado
- `resizable.tsx` — Paneles redimensionables

### Radix UI

**Radix UI** es la base sobre la que está construido shadcn/ui. Provee componentes **sin estilos pero completamente accesibles** (cumplen los estándares ARIA para personas con discapacidades).

Por ejemplo, el componente `Dialog` de Radix maneja automáticamente:
- Trampa de foco (el foco del teclado no sale del diálogo)
- Cerrar con la tecla Escape
- Atributos ARIA para lectores de pantalla
- Animaciones de entrada/salida

### Lucide React

**Lucide React** es una librería de más de 500 íconos SVG listos para usar en React:

```tsx
import { ShoppingCart, Search, User, Package } from 'lucide-react';

<ShoppingCart className="w-6 h-6 text-gray-500" />
```

---

## 17. Zod — Validación de Datos

### ¿Qué es Zod?

**Zod** es una librería de validación de esquemas. Permite definir la "forma" que deben tener los datos y verificar que los datos recibidos la cumplen.

### ¿Por qué es importante?

Nunca debes confiar en los datos que llegan del exterior (el usuario puede enviar cualquier cosa). Zod verifica que los datos son correctos antes de procesarlos.

### Ejemplos del proyecto

```typescript
// Validación de login
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(4, "Mínimo 4 caracteres"),
});

// Validación de producto
const createProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  price: z.number().positive("El precio debe ser positivo"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  categoryId: z.number().int().positive(),
  discountPercent: z.number().min(1).max(99).optional(),
});
```

### Integración con react-hook-form

Zod trabaja con **react-hook-form** (la librería de formularios) a través del adaptador `@hookform/resolvers/zod`:

```tsx
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema), // Zod valida automáticamente
});
```

### Integración con tRPC

Todos los inputs de los procedimientos tRPC usan esquemas Zod:

```typescript
// api/router.ts
createProduct: adminMutation
  .input(createProductSchema) // Zod valida el input
  .mutation(async ({ input }) => {
    // input ya está validado y tipado
    await db.insert(products).values(input);
  }),
```

---

## 18. Autenticación y Seguridad

### ¿Qué es la autenticación?

**Autenticación** es el proceso de verificar que un usuario es quien dice ser. Es el mecanismo detrás del "login".

### Cómo funciona el login en este proyecto

```
1. Usuario ingresa email y contraseña en el formulario
2. Frontend llama a trpc.auth.login con esas credenciales
3. Backend busca al usuario en la base de datos por email
4. Backend compara la contraseña (con hash) 
5. Si es correcta, crea un token JWT y lo guarda en una cookie
6. El navegador guarda la cookie automáticamente
7. En futuras peticiones, el navegador envía la cookie
8. El backend verifica la cookie y sabe quién es el usuario
```

### JWT (JSON Web Tokens)

Un **JWT** es un token compacto y seguro que contiene información del usuario. Tiene tres partes separadas por puntos:

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.abc123def456
    (Header)              (Payload)        (Firma)
```

- **Header:** Algoritmo usado (HS256)
- **Payload:** Datos del usuario (id, rol, etc.)
- **Firma:** Garantiza que el token no fue modificado

La librería **jose** maneja la creación y verificación de JWTs:

```typescript
// Crear token
const token = await new SignJWT({ userId: 1, role: 'admin' })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('1y') // Expira en 1 año
  .sign(secretKey);

// Verificar token
const { payload } = await jwtVerify(token, secretKey);
```

### Cookies seguras

El token JWT se almacena en una **cookie httpOnly** — una cookie que el código JavaScript no puede leer directamente, solo el navegador la envía automáticamente en cada petición. Esto previene ataques XSS (Cross-Site Scripting).

En producción, la cookie también es:
- **Secure:** Solo se envía por HTTPS
- **SameSite: None:** Permite enviarse en peticiones cross-site (necesario para algunos flujos)

### Sistema de roles

Hay dos roles:
- `user` — Usuario normal
- `admin` — Administrador con acceso total

El rol se verifica en el backend con middleware:

```typescript
// Procedimiento solo para admins
const adminMutation = t.procedure
  .use(authMiddleware)  // Primero verifica autenticación
  .use(adminMiddleware) // Luego verifica rol admin
  .mutation(...)
```

Y en el frontend con componentes protegidos:

```tsx
// AdminRoute verifica que el usuario sea admin
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" />;

  return <>{children}</>;
}
```

### nanoid — Generación de IDs únicos

**nanoid** genera identificadores únicos seguros (como `V1StGXR8_Z5jdHi6B-myT`). Se usa para crear `unionId` únicos para cada usuario.

---

## 19. Sistema de Pagos — PayPal y Stripe

### PayPal

**PayPal** es el procesador de pagos principal de esta aplicación. Permite a los usuarios pagar con su cuenta PayPal o con tarjeta de crédito/débito.

#### Flujo de pago con PayPal:

```
1. Usuario en el carrito hace clic en "Pagar con PayPal"
2. Frontend llama a trpc.payment.paypalClientId
3. Backend devuelve el Client ID de PayPal
4. Frontend carga el botón oficial de PayPal
5. Usuario hace clic → PayPal abre su ventana de pago
6. Usuario confirma el pago en PayPal
7. Frontend llama a trpc.payment.captureAndCreateOrder
8. Backend verifica el pago con la API de PayPal
9. Si es exitoso:
   - Crea el pedido en la base de datos
   - Actualiza el stock de los productos
   - Vacía el carrito del usuario
   - Actualiza el contador "mostBought" de cada producto
```

#### Librerías usadas:
- `@paypal/react-paypal-js` — Componentes React oficiales de PayPal
- El backend hace llamadas directas a la API de PayPal para verificar pagos

#### Modos:
- **Sandbox:** Para pruebas (no se cobra dinero real)
- **Producción:** Pagos reales

### Stripe

**Stripe** es una alternativa de pago también integrada. Es muy popular por su API limpia y su soporte a tarjetas de crédito globalmente.

#### Librerías usadas:
- `stripe` — SDK oficial de Stripe para Node.js (backend)
- `@stripe/stripe-js` — Cliente de Stripe para el navegador
- `@stripe/react-stripe-js` — Componentes React de Stripe

#### Diferencias con PayPal:
- Stripe es preferido por negocios que quieren una experiencia de pago más personalizada
- PayPal es más familiar para usuarios individuales

---

## 20. AWS S3 — Almacenamiento de Archivos

### ¿Qué es AWS S3?

**Amazon Web Services S3** (Simple Storage Service) es un servicio de almacenamiento en la nube para guardar archivos (imágenes, documentos, videos, etc.) de forma escalable y duradera.

### ¿Por qué no guardar imágenes en el servidor?

Guardar imágenes directamente en el servidor tiene problemas:
- Si el servidor se reinicia o migra, se pierden las imágenes
- El servidor tiene espacio limitado
- Servir imágenes consume recursos del servidor

Con S3:
- Las imágenes viven en la nube de Amazon, siempre disponibles
- Prácticamente almacenamiento ilimitado
- Se sirven directamente desde los CDN de Amazon (muy rápido)

### URLs pre-firmadas

El proyecto usa `@aws-sdk/s3-request-presigner` para generar **URLs pre-firmadas**. Son URLs temporales que permiten subir archivos directamente a S3 desde el navegador sin exponer las credenciales.

```typescript
// Backend genera una URL temporal para subir
const url = await getSignedUrl(s3Client, new PutObjectCommand({
  Bucket: 'mi-bucket',
  Key: 'productos/imagen-123.jpg',
}), { expiresIn: 300 }); // Válida por 5 minutos

// Frontend usa esa URL para subir directamente a S3
await fetch(url, { method: 'PUT', body: imageFile });
```

---

## 21. Librerías de Apoyo

### react-hook-form — Formularios

**react-hook-form** simplifica la gestión de formularios en React. Maneja:
- El estado de cada campo
- La validación
- Los mensajes de error
- El envío del formulario

```tsx
const { register, handleSubmit, formState: { errors } } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email', { required: 'Email requerido' })} />
  {errors.email && <span>{errors.email.message}</span>}
</form>
```

### recharts — Gráficas

**Recharts** es una librería para crear gráficas en React. Se usa en el panel de administración para mostrar estadísticas de ventas, inventario, etc.

Tipos de gráficas disponibles: barras, líneas, áreas, torta, radial, etc.

### react-day-picker — Selector de fechas

**react-day-picker** es un componente de calendario interactivo para seleccionar fechas. Se usa al crear ofertas (seleccionar fecha de inicio y fin del descuento).

### embla-carousel-react — Carrusel

**Embla Carousel** es un carrusel (slider) de imágenes ligero y táctil. Se usa en la página principal para mostrar productos destacados.

### vaul — Drawer

**Vaul** es un componente de "cajón" que se desliza desde la parte inferior de la pantalla, especialmente útil en dispositivos móviles.

### sonner — Notificaciones Toast

**Sonner** muestra notificaciones temporales en la esquina de la pantalla (llamadas "toasts"). Por ejemplo, "Producto agregado al carrito" o "Error al procesar el pago".

```tsx
import { toast } from 'sonner';

toast.success('Producto agregado al carrito');
toast.error('Error al procesar el pago');
toast.info('Cargando...');
```

### date-fns — Manipulación de fechas

**date-fns** es una librería para trabajar con fechas. Permite formatear, comparar y manipular fechas fácilmente.

```typescript
import { format, isAfter, parseISO } from 'date-fns';

format(new Date(), 'dd/MM/yyyy'); // "17/06/2026"
isAfter(endDate, new Date());    // ¿La oferta sigue vigente?
```

### next-themes — Modo oscuro

**next-themes** maneja el tema (claro/oscuro) de la aplicación. Detecta la preferencia del sistema operativo del usuario y permite cambiarlo manualmente.

### react-resizable-panels — Paneles redimensionables

**react-resizable-panels** permite crear interfaces con paneles que el usuario puede redimensionar arrastrando. Se usa en el panel de administración.

### dotenv — Variables de entorno

**dotenv** carga automáticamente las variables del archivo `.env` en el proceso de Node.js. Estas variables contienen datos sensibles (contraseñas de base de datos, claves API) que no deben estar en el código fuente.

### cookie — Manejo de cookies

La librería **cookie** parsea y serializa cookies HTTP. Se usa para leer la cookie de sesión en el backend.

---

## 22. Herramientas de Calidad de Código

### ESLint — Linter

**ESLint** analiza el código en busca de errores y problemas de estilo **antes de ejecutarlo**. Es como un corrector ortográfico pero para código.

Configuración en `eslint.config.js`:

```javascript
// Reglas activas:
// - JavaScript recomendado
// - TypeScript estricto
// - React Hooks (evita bugs comunes con useEffect, etc.)
// - React Refresh (para el hot reload de Vite)
```

### Prettier — Formateador

**Prettier** formatea automáticamente el código según reglas consistentes. Elimina los debates sobre "dónde poner el punto y coma" o "comillas simples vs dobles".

Configuración en `.prettierrc`:

```json
{
  "semi": true,           // Punto y coma requerido
  "quotes": "double",     // Comillas dobles
  "tabWidth": 2,          // 2 espacios de indentación
  "printWidth": 80,       // Máximo 80 caracteres por línea
  "trailingComma": "es5"  // Coma al final de listas
}
```

### TypeScript Compiler (tsc)

El compilador de TypeScript (`tsc`) verifica que no haya errores de tipos en todo el proyecto. Se ejecuta con `npm run check`.

---

## 23. Testing con Vitest

### ¿Qué es el testing?

**Testing** es el proceso de verificar automáticamente que el código funciona correctamente. En lugar de probar manualmente cada función, escribes "pruebas" que se ejecutan automáticamente.

### ¿Qué es Vitest?

**Vitest** es un framework de testing ultra-rápido diseñado específicamente para proyectos Vite. Es compatible con la API de Jest (el framework de testing más popular).

### Configuración

El archivo `vitest.config.ts` define:
- Los archivos de prueba están en `/api/**/*.test.ts` y `/api/**/*.spec.ts`
- El entorno es Node.js (no el navegador)
- Usa los mismos aliases de rutas que el resto del proyecto

### Cómo se escriben pruebas

```typescript
// api/auth.test.ts (ejemplo)
import { describe, it, expect } from 'vitest';

describe('Autenticación', () => {
  it('rechaza contraseñas incorrectas', async () => {
    const resultado = await login({ 
      email: 'test@test.com', 
      password: 'contraseña-incorrecta' 
    });
    expect(resultado.success).toBe(false);
  });

  it('acepta credenciales válidas', async () => {
    const resultado = await login({ 
      email: 'admin@test.com', 
      password: '1234' 
    });
    expect(resultado.user).toBeDefined();
    expect(resultado.user.role).toBe('admin');
  });
});
```

---

## 24. Estructura de Carpetas

```
app/
│
├── api/                          # Backend (servidor)
│   ├── boot.ts                   # Punto de entrada del servidor
│   ├── middleware.ts             # tRPC middlewares y procedimientos base
│   ├── router.ts                 # Router principal (une todos los sub-routers)
│   ├── auth-router.ts           # Rutas de autenticación
│   ├── store-router.ts          # Rutas de la tienda (productos, pedidos, etc.)
│   ├── payment-router.ts        # Rutas de pagos (PayPal, Stripe)
│   ├── local-auth.ts            # Autenticación con cookies
│   ├── kimi/                    # Integración con plataforma Kimi OAuth
│   │   ├── auth.ts
│   │   ├── session.ts
│   │   ├── platform.ts
│   │   └── types.ts
│   ├── lib/                     # Utilidades del backend
│   │   ├── env.ts               # Variables de entorno
│   │   ├── cookies.ts           # Configuración de cookies
│   │   ├── http.ts              # Cliente HTTP genérico
│   │   └── vite.ts              # Servir archivos estáticos en producción
│   └── queries/                 # Queries a la base de datos
│       ├── connection.ts        # Conexión a MySQL
│       └── users.ts             # Queries de usuarios
│
├── contracts/                    # Tipos compartidos (frontend ↔ backend)
│   ├── types.ts                 # Re-exporta tipos del schema
│   ├── constants.ts             # Constantes compartidas (cookies, rutas)
│   └── errors.ts                # Funciones de error HTTP
│
├── db/                           # Base de datos
│   ├── schema.ts                # Definición de tablas (Drizzle)
│   └── db.ts                    # Conexión SQLite (alternativa local)
│
├── src/                          # Frontend (React)
│   ├── main.tsx                 # Punto de entrada de React
│   ├── App.tsx                  # Rutas y estructura principal
│   ├── const.ts                 # Constantes del frontend
│   ├── App.css                  # Estilos de la app
│   │
│   ├── providers/               # Proveedores de contexto global
│   │   └── trpc.tsx             # Configuración del cliente tRPC
│   │
│   ├── hooks/                   # Custom hooks de React
│   │   ├── useAuth.ts           # Hook de autenticación
│   │   ├── useCart.tsx          # Hook del carrito
│   │   └── use-mobile.ts        # Detectar si es dispositivo móvil
│   │
│   ├── lib/                     # Utilidades del frontend
│   │   └── utils.ts             # cn() para clases de Tailwind
│   │
│   ├── pages/                   # Páginas de la aplicación
│   │   ├── Home.tsx             # Página principal
│   │   ├── Login.tsx            # Login y registro
│   │   ├── SearchPage.tsx       # Búsqueda de productos
│   │   ├── ProductDetail.tsx    # Detalle de producto
│   │   ├── CartPage.tsx         # Carrito de compras
│   │   ├── OrdersPage.tsx       # Historial de pedidos
│   │   ├── CategoriesPage.tsx   # Lista de categorías
│   │   ├── CategoryPage.tsx     # Productos por categoría
│   │   ├── AdminCategories.tsx  # Admin: gestión de categorías
│   │   ├── AdminProducts.tsx    # Admin: gestión de productos
│   │   ├── AdminOffers.tsx      # Admin: gestión de ofertas
│   │   ├── AdminInventory.tsx   # Admin: inventario
│   │   ├── AdminOrders.tsx      # Admin: pedidos
│   │   ├── AdminSettings.tsx    # Admin: configuración
│   │   ├── AdminDashboard.tsx   # Admin: dashboard
│   │   ├── AdminReports.tsx     # Admin: reportes
│   │   └── NotFound.tsx         # Página 404
│   │
│   └── components/              # Componentes reutilizables
│       ├── AuthLayout.tsx       # Layout para páginas de auth
│       ├── AuthLayoutSkeleton.tsx
│       └── ui/                  # Componentes shadcn/ui (40+ archivos)
│
├── index.html                   # Punto de entrada HTML
├── package.json                 # Dependencias y scripts
├── vite.config.ts               # Configuración de Vite
├── tsconfig.json                # Configuración TypeScript
├── tailwind.config.js           # Configuración de Tailwind
├── postcss.config.js            # Configuración de PostCSS
├── eslint.config.js             # Configuración de ESLint
├── .prettierrc                  # Configuración de Prettier
├── .env.example                 # Plantilla de variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── .nvmrc                       # Versión de Node.js
├── .dockerignore                # Archivos ignorados por Docker
├── components.json              # Configuración de shadcn/ui
└── vitest.config.ts             # Configuración de Vitest
```

---

## 25. Páginas de la Aplicación

### Páginas públicas (cualquier usuario puede ver)

#### Home (`/`)
La página principal de la tienda. Muestra:
- **Banner hero**: presentación visual de la tienda con botón de "Explorar productos"
- **Categorías**: grid de todas las categorías activas
- **Productos más comprados**: los 8 productos con mayor `mostBought`
- **Productos en oferta**: los 8 productos con descuentos activos (filtrados por fecha actual)

#### Login (`/login`)
Página unificada de login y registro con dos modos:
- **Iniciar sesión**: ingresa email y contraseña
- **Registrarse**: ingresa nombre, email y contraseña

Al autenticarse:
- Si es **admin** → redirige a `/admin`
- Si es **usuario común** → redirige a la página anterior o al inicio

#### Búsqueda (`/search`)
Muestra resultados de búsqueda con:
- Campo de búsqueda por texto (nombre o marca)
- Filtro por categoría
- Paginación de resultados
- Grid de productos encontrados

#### Categorías (`/categories`)
Grid de todas las categorías activas con imagen y nombre.

#### Categoría (`/category/:id`)
Lista de todos los productos activos de una categoría específica.

#### Detalle de Producto (`/product/:id`)
Página detallada de un producto:
- Imagen del producto
- Nombre, marca, precio
- Descripción completa
- Indicador de stock
- Botón "Agregar al carrito" (deshabilitado si no hay stock)
- Precio con descuento si tiene oferta activa

#### Carrito (`/cart`)
El carrito de compras:
- Lista de productos con cantidad editable
- Botón para eliminar productos
- Resumen del total
- Botones de pago (PayPal)
- Opción de descargar factura PDF

#### Pedidos (`/orders`)
Historial de compras del usuario autenticado:
- Lista de todos sus pedidos
- Estado de cada pedido (pendiente, procesando, completado, cancelado)
- Opción de ver detalles y descargar factura

### Páginas de administración (solo admins)

Todas estas rutas requieren estar autenticado como administrador. Si intentas acceder sin serlo, te redirige al login.

#### Dashboard (`/admin`)
Resumen general con estadísticas:
- Total de productos, categorías, pedidos
- Ventas totales y del mes
- Resumen de inventario (productos con stock normal, bajo stock, sin stock)
- Accesos rápidos a las secciones

#### Categorías (`/admin/categories`)
Gestión completa de categorías:
- Ver todas las categorías
- Crear nueva categoría (nombre, descripción, imagen, activa/inactiva)
- Editar categoría existente
- Eliminar categoría (elimina en cascada todos sus productos)

#### Productos (`/admin/products`)
Gestión del catálogo de productos:
- Ver todos los productos con paginación
- Filtrar por categoría
- Crear producto (nombre, descripción, marca, precio, stock, imagen, categoría)
- Editar producto
- Eliminar producto

#### Ofertas (`/admin/offers`)
Gestión de descuentos:
- Ver todas las ofertas con su vigencia
- Crear oferta (seleccionar producto, % de descuento, fecha inicio y fin)
- Editar oferta
- Eliminar oferta

#### Inventario (`/admin/inventory`)
Vista rápida del stock:
- Lista de todos los productos con su stock actual
- Estadísticas (total productos, total unidades, con poco stock, sin stock)
- Actualización rápida de stock

#### Pedidos (`/admin/orders`)
Gestión de pedidos de clientes:
- Ver todos los pedidos con información del cliente
- Ver detalle completo de cada pedido
- Cambiar el estado del pedido (pendiente → procesando → completado/cancelado)

#### Configuración (`/admin/settings`)
Configuración de la tienda:
- Datos bancarios (para transferencias)
- Información de contacto
- Configuración de WhatsApp

#### Reportes (`/admin/reports`)
Análisis de ventas y estadísticas:
- Ventas por período
- Productos más vendidos
- Actividad de clientes

### Página 404 (`*`)
Cuando el usuario accede a una URL que no existe, ve una página de error amigable con un botón para regresar al inicio.

---

## 26. Flujos Principales de la Aplicación

### Flujo 1: Registro de nuevo usuario

```
Usuario abre /login
    ↓
Hace clic en "Crear cuenta"
    ↓
Llena el formulario (nombre, email, contraseña)
    ↓
Zod valida el formulario en el cliente
    ↓
Frontend llama a trpc.auth.register
    ↓
Backend verifica que el email no exista
    ↓
Backend crea el usuario en la base de datos
    ↓
Backend genera JWT y lo guarda en cookie
    ↓
Frontend recibe confirmación
    ↓
Si OWNER_UNION_ID coincide → rol admin, redirige a /admin
Si no → rol user, redirige a /
```

### Flujo 2: Explorar y buscar productos

```
Usuario en la página principal (/)
    ↓
Ve las categorías y hace clic en una → /category/:id
    ↓
O escribe en el buscador → /search?q=laptop
    ↓
Frontend llama a trpc.product.byCategory o trpc.product.search
    ↓
Backend busca en la base de datos con filtros
    ↓
Backend aplica descuentos activos si existen
    ↓
Frontend muestra los productos en tarjetas
    ↓
Usuario hace clic en un producto → /product/:id
    ↓
Ve detalles completos del producto
```

### Flujo 3: Agregar al carrito y pagar

```
Usuario en la página de producto hace clic "Agregar al carrito"
    ↓
¿Está autenticado?
  ├─ SÍ: llama a trpc.cart.add → guarda en base de datos
  └─ NO: guarda en localStorage del navegador

Usuario navega a /cart
    ↓
Frontend muestra los artículos del carrito
    ↓
Usuario ajusta cantidades o elimina artículos
    ↓
Usuario hace clic en "Pagar con PayPal"
    ↓
Frontend obtiene Client ID de PayPal (trpc.payment.paypalClientId)
    ↓
Aparecen los botones oficiales de PayPal
    ↓
Usuario confirma en la ventana de PayPal
    ↓
Frontend llama a trpc.payment.captureAndCreateOrder
    ↓
Backend verifica el pago con la API de PayPal
    ↓
Backend verifica que hay stock suficiente
    ↓
Backend crea el pedido en la base de datos
    ↓
Backend descuenta el stock de cada producto
    ↓
Backend vacía el carrito del usuario
    ↓
Frontend redirige a /orders con confirmación
```

### Flujo 4: Gestión de pedidos (Admin)

```
Admin en /admin/orders
    ↓
Ve lista de todos los pedidos con info del cliente
    ↓
Hace clic en un pedido para ver el detalle
    ↓
Ve los productos comprados, cantidades y precios
    ↓
Cambia el estado del pedido:
  pending → processing (pedido confirmado, preparando)
  processing → completed (pedido enviado/entregado)
  processing → cancelled (pedido cancelado)
    ↓
El cliente puede ver el nuevo estado en /orders
```

---

## 27. Variables de Entorno

### ¿Qué son las variables de entorno?

Las variables de entorno son valores de configuración que **no van en el código fuente**. Contienen datos sensibles como contraseñas, claves API y configuraciones que cambian entre entornos (desarrollo, producción).

Se guardan en un archivo `.env` (nunca subido a Git) y se cargan con **dotenv**.

### Variables del proyecto (`.env.example`)

```bash
# ── Aplicación ────────────────────────────────────────────────
APP_ID=mi-tienda              # Identificador de la aplicación
APP_SECRET=clave-super-secreta # Clave para firmar los JWTs

# ── Base de Datos ──────────────────────────────────────────────
DATABASE_URL=mysql://usuario:contraseña@host:3306/mi_db
# Ejemplo local: mysql://root:@localhost:3306/catalogo_db
# Ejemplo Railway: mysql://root:xxxx@containers-us-west-x.railway.app:xxxx/railway

# ── OAuth (Autenticación con Kimi) ─────────────────────────────
VITE_KIMI_AUTH_URL=https://auth.kimi.com  # URL del servidor OAuth (frontend)
VITE_APP_ID=mi-app-id                      # App ID para OAuth (frontend)
KIMI_AUTH_URL=https://auth.kimi.com        # URL del servidor OAuth (backend)
KIMI_OPEN_URL=https://open.kimi.com        # URL de la plataforma Kimi

# ── Administrador ──────────────────────────────────────────────
OWNER_UNION_ID=union-id-del-admin  # El usuario con este ID será admin automáticamente
```

### Variables `VITE_`

Las variables que empiezan con `VITE_` son **expuestas al navegador**. El código del frontend puede leerlas. Las variables sin ese prefijo solo están disponibles en el servidor.

⚠️ **Nunca pongas contraseñas o claves secretas en variables `VITE_`** — son visibles para cualquiera que inspeccione el navegador.

---

## 28. Despliegue en Railway

### ¿Qué es Railway?

**Railway** es una plataforma de hosting en la nube que facilita el despliegue de aplicaciones Node.js. Es como alquilar una computadora en internet que corre tu aplicación 24/7.

### ¿Por qué Railway?

- Detecta automáticamente que es un proyecto Node.js
- Provee una base de datos MySQL con un clic
- Genera una URL pública (`tu-app.railway.app`)
- Soporte para variables de entorno de forma segura

### Proceso de despliegue

Los commits recientes muestran el proceso de configuración para Railway:

1. **`npm run build`** — Compila el frontend (Vite) y el backend (esbuild)
2. **`npm run db:push`** — Aplica el schema de la base de datos
3. **`npm start`** — Inicia el servidor con `NODE_ENV=production`

### Diferencias entre desarrollo y producción

| Aspecto | Desarrollo | Producción |
|---------|-----------|------------|
| Servidor | Vite Dev Server + Hono | Solo Node.js + Hono |
| Frontend | Servido por Vite (con hot reload) | Archivos estáticos en `dist/public` |
| Base de datos | MySQL local (XAMPP) | MySQL de Railway |
| Cookies | No seguras (http) | Seguras (https, httpOnly) |
| NODE_ENV | `development` | `production` |

### `.dockerignore`

El archivo `.dockerignore` le dice a Docker qué archivos NO copiar en el contenedor:
- `node_modules/` — Se instalan en el servidor
- `dist/` — Se compilan en el servidor
- `.git/` — El historial de Git no es necesario en producción

---

## 29. Pruebas con ngrok

### ¿Qué es ngrok?

**ngrok** es una herramienta que crea un **túnel seguro** desde internet hacia tu computadora local. Permite que dispositivos externos (celulares, otras computadoras) accedan a tu aplicación como si estuviera publicada en internet.

### ¿Por qué usarlo?

Durante el desarrollo, la aplicación solo está disponible en tu red local. Con ngrok, obtienes una URL pública temporal para:

- Probar en tu celular (sin estar en la misma WiFi)
- Compartir la app con alguien más para obtener feedback
- Probar integraciones que requieren URLs públicas (como los webhooks de PayPal)

### Cómo funciona

```
Tu celular (internet) 
      ↓
https://abc123.ngrok.io  (URL pública de ngrok)
      ↓
ngrok (programa en tu PC)
      ↓
http://localhost:3000  (tu aplicación)
```

### Configuración necesaria en Vite

El `vite.config.ts` ya está configurado para funcionar con ngrok:

```typescript
server: {
  host: '0.0.0.0',       // Acepta conexiones desde cualquier IP
  port: 3000,
  allowedHosts: true,    // Permite el host de ngrok (*.ngrok.io)
},
```

### Cómo usar ngrok

```bash
# 1. Instalar ngrok (solo la primera vez)
npm install -g ngrok

# 2. Iniciar tu aplicación
npm run dev

# 3. En otra terminal, crear el túnel
ngrok http 3000

# ngrok mostrará algo así:
# Forwarding  https://abc123xyz.ngrok.io -> http://localhost:3000
```

Copia la URL `https://...ngrok.io` y ábrela en cualquier dispositivo.

### Limitaciones de ngrok gratuito

- La URL cambia cada vez que reinicias ngrok
- Hay un límite de tráfico por mes
- Solo 1 túnel activo a la vez

Para URLs fijas necesitas la versión de pago o alternativas como **Cloudflare Tunnel** (gratuito).

---

## 30. Glosario de Términos

| Término | Definición sencilla |
|---------|---------------------|
| **API** | Conjunto de funciones que un programa expone para que otros programas lo usen |
| **Backend** | El servidor: la lógica que no ve el usuario, procesa datos |
| **Build** | El proceso de compilar y empaquetar el código para producción |
| **Bundle** | Un archivo JavaScript que contiene todo el código empaquetado |
| **Cache** | Almacenamiento temporal para no repetir operaciones costosas |
| **CDN** | Red de servidores globales que sirven archivos desde el servidor más cercano |
| **CLI** | Command Line Interface — interfaz de línea de comandos (terminal) |
| **Componente** | Pieza reutilizable de interfaz en React |
| **Cookie** | Pequeño dato que el navegador guarda y envía automáticamente al servidor |
| **CORS** | Política que controla qué dominios pueden hacer peticiones a una API |
| **CSS** | Lenguaje para dar estilos visuales a páginas web |
| **Dependencia** | Librería externa que el proyecto usa |
| **Deploy** | Publicar la aplicación en un servidor para que sea accesible |
| **Dev Tools** | Herramientas de desarrollo del navegador (F12) |
| **DOM** | Document Object Model — representación del HTML en memoria |
| **Endpoint** | Una URL específica que acepta peticiones |
| **Enum** | Conjunto fijo de valores posibles (ej: role puede ser "user" o "admin") |
| **ESM** | ECMAScript Modules — el sistema de módulos moderno de JavaScript |
| **Framework** | Estructura base que dicta cómo organizar el código |
| **Frontend** | El cliente: lo que el usuario ve e interactúa en el navegador |
| **Full-stack** | Aplicación con frontend y backend completos |
| **Git** | Sistema de control de versiones para rastrear cambios en el código |
| **Hash** | Función que convierte datos en una cadena de longitud fija (irreversible) |
| **Hook** | Función de React que agrega funcionalidad a componentes funcionales |
| **HTML** | HyperText Markup Language — el lenguaje de estructura de páginas web |
| **HTTP** | Protocolo de comunicación web |
| **HTTPS** | HTTP con cifrado SSL/TLS |
| **Hydration** | Proceso de React de "activar" el HTML estático con JavaScript |
| **ID** | Identificador único de un registro en la base de datos |
| **JSX** | Sintaxis de React que mezcla JavaScript y XML (parecido a HTML) |
| **JSON** | JavaScript Object Notation — formato de datos legible |
| **JWT** | JSON Web Token — token de autenticación seguro y compacto |
| **Linter** | Herramienta que analiza código en busca de errores o malas prácticas |
| **LocalStorage** | Almacenamiento en el navegador que persiste aunque se cierre la pestaña |
| **Middleware** | Función que se ejecuta entre la petición y la respuesta |
| **Migration** | Script que modifica la estructura de la base de datos de forma controlada |
| **Módulo** | Archivo JavaScript/TypeScript que exporta funciones y variables |
| **npm** | Node Package Manager — gestor de paquetes de Node.js |
| **ORM** | Object-Relational Mapping — abstracción sobre la base de datos |
| **Payload** | Los datos que contiene una petición o token |
| **Plugin** | Extensión que agrega funcionalidad a una herramienta |
| **Port** | Puerto de red — "puerta" por donde entra y sale el tráfico |
| **Props** | Propiedades que se pasan de un componente padre a uno hijo en React |
| **Provider** | Componente React que provee datos a sus hijos vía contexto |
| **Query** | Consulta a la base de datos o petición de datos al servidor |
| **Redirect** | Redirigir al usuario a otra URL |
| **Refetch** | Volver a pedir los datos al servidor |
| **Render** | El proceso de dibujar la interfaz en pantalla |
| **Repository (Repo)** | El proyecto completo versionado con Git |
| **REST** | Estilo de API basado en URLs y métodos HTTP |
| **Router** | Componente/función que decide qué código ejecutar según la URL o petición |
| **Schema** | Definición de la estructura de datos (en la base de datos o en Zod) |
| **SDK** | Software Development Kit — kit de herramientas para usar un servicio |
| **Session** | Información temporal que identifica a un usuario entre peticiones |
| **SQL** | Structured Query Language — lenguaje para bases de datos relacionales |
| **SPA** | Single Page Application — aplicación de una sola página |
| **State** | El estado o "memoria" de un componente React |
| **Token** | Cadena de texto que representa una sesión o permiso |
| **tRPC** | TypeScript Remote Procedure Call — API type-safe entre frontend y backend |
| **TSX** | TypeScript + JSX — archivos React con tipos TypeScript |
| **Type** | En TypeScript, la definición de la forma que tiene un dato |
| **URL** | Dirección web (ej: https://mitienda.com/products) |
| **Validation** | Verificar que los datos cumplen con las reglas esperadas |
| **Variable de entorno** | Configuración sensible guardada fuera del código |
| **Webhook** | URL que recibe notificaciones automáticas de servicios externos |

---

## Resumen Final

Esta aplicación es un proyecto de comercio electrónico **full-stack completo**, construido con tecnologías modernas del ecosistema JavaScript/TypeScript. A continuación, un resumen visual de todo el stack:

```
┌────────────────────────────────────────────────────────────────┐
│                     STACK TECNOLÓGICO                         │
├─────────────────────────┬──────────────────────────────────────┤
│      FRONTEND           │           BACKEND                   │
│                         │                                      │
│  React 19               │  Node.js 20                         │
│  TypeScript             │  TypeScript                         │
│  React Router v7        │  Hono (servidor web)                │
│  TanStack Query         │  tRPC (API type-safe)               │
│  tRPC Client            │  Drizzle ORM                        │
│  React Hook Form        │  MySQL                              │
│  Zod (validación)       │  JWT (jose)                         │
│  Tailwind CSS           │  Cookies de sesión                  │
│  shadcn/ui              │  PayPal API                         │
│  Radix UI               │  Stripe API                         │
│  Lucide Icons           │  AWS S3                             │
│  Recharts               │                                      │
│  Sonner (toasts)        │                                      │
│  PayPal React           │                                      │
├─────────────────────────┴──────────────────────────────────────┤
│                    HERRAMIENTAS DEV                            │
│                                                                │
│  Vite (build tool)      ESLint (linter)                       │
│  esbuild (backend)      Prettier (formateador)                 │
│  TypeScript (tsc)       Vitest (testing)                      │
│  Git (versiones)        ngrok (pruebas externas)              │
│  Railway (hosting)      npm (paquetes)                        │
└────────────────────────────────────────────────────────────────┘
```

### ¿Por qué estas tecnologías?

Todas las decisiones tecnológicas apuntan a un objetivo común: **un solo lenguaje (TypeScript) para todo el proyecto**, con la máxima seguridad de tipos posible de punta a punta. Esto significa:

1. El error que cometes en el backend, TypeScript te avisa inmediatamente en el frontend
2. Un solo equipo puede manejar tanto el frontend como el backend
3. Los tipos se comparten entre frontend, backend y base de datos
4. Menos bugs que llegan a producción

Esta arquitectura representa el estado del arte del desarrollo web moderno con JavaScript/TypeScript en 2026.

---

*Documento generado el 17 de junio de 2026*  
*Este documento tiene ~35 páginas en formato impreso (A4, fuente 12pt)*
