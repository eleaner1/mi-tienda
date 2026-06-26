# Glosario Simple de Tecnología
## Explicaciones para todos, incluso sin saber nada de computación

---

> **Cómo usar este glosario:**
> Está ordenado de la A a la Z. Cada término tiene:
> - Una explicación corta y directa
> - Una analogía del mundo real (comparación con algo cotidiano)
> - Un ejemplo de cómo se usa en este proyecto

---

## A

---

### API
**Qué es:** Una forma en que dos programas se hablan entre sí.

**Analogía:** Imaginate que estás en un restaurante. Vos no entras a la cocina a buscar tu comida. Le decís al *mesero* lo que querés, el mesero va a la cocina y te trae la respuesta. **El mesero es la API.** Vos sos el programa que pide, la cocina es el otro programa.

**En este proyecto:** Cuando la página web quiere saber la lista de productos, le pregunta a la API del servidor, que va a la base de datos y devuelve los datos.

---

### AWS (Amazon Web Services)
**Qué es:** Un conjunto de servicios de internet que ofrece Amazon. No es la tienda de compras, sino Amazon la empresa de tecnología.

**Analogía:** Como un edificio gigante con miles de habitaciones de alquiler. Cada habitación sirve para algo: guardar archivos, correr programas, mandar correos, etc. Vos alquilás solo la habitación que necesitás.

**En este proyecto:** Se usa una habitación de AWS llamada **S3** para guardar las fotos de los productos.

---

### AWS S3
**Qué es:** Un servicio de Amazon para guardar archivos en internet (fotos, videos, documentos).

**Analogía:** Como un pen drive gigante que está en internet. Podés guardar archivos desde cualquier lugar del mundo y acceder a ellos desde cualquier lugar del mundo.

**En este proyecto:** Cuando el administrador sube una foto de un producto, esa foto se guarda en S3. Cualquier usuario que visite la tienda puede verla.

---

## B

---

### Backend
**Qué es:** La parte del sistema que el usuario NO ve. Es el "cerebro" que trabaja detrás de la pantalla.

**Analogía:** En un cajero automático, lo que ves (la pantalla, los botones, el teclado) es el frontend. Pero adentro de la máquina hay cables, chips, y conexiones al banco que verifican tu contraseña y mueven el dinero. Eso es el backend.

**En este proyecto:** El backend está en la carpeta `/api`. Ahí está el código que verifica si un usuario existe, calcula el total de un carrito, procesa pagos con PayPal, etc.

---

### Base de Datos
**Qué es:** Un lugar donde se guarda información de forma organizada para poder encontrarla fácilmente después.

**Analogía:** Como un archivero de oficina con cajones y carpetas. Cada cajón tiene una categoría (usuarios, productos, pedidos). Dentro de cada carpeta hay una ficha con todos los datos de ese elemento. Podés buscar, agregar o borrar fichas cuando quieras.

**En este proyecto:** Se usa MySQL como base de datos. Guarda todo: usuarios registrados, productos del catálogo, pedidos realizados, etc.

---

### Branch (Rama)
**Qué es:** Una copia del código donde podés experimentar sin afectar el código principal.

**Analogía:** Como hacer una fotocopia de un documento importante antes de escribir encima. Si te equivocás, el original sigue intacto.

**En este proyecto:** El código principal está en la rama `main`. Si quisieras probar algo nuevo, crearías una rama separada.

---

### Build
**Qué es:** El proceso de transformar el código que escribió el programador en algo que el navegador entiende mejor y más rápido.

**Analogía:** Como cuando un chef prepara todos los ingredientes (corta, mezcla, condimenta) antes de cocinar. El "build" prepara todo el código antes de que los usuarios lo usen.

**En este proyecto:** `npm run build` transforma el código React en archivos HTML, CSS y JavaScript compactos listos para publicar.

---

### Bundle
**Qué es:** Todos los archivos de código juntos en uno solo, para que el navegador los cargue más rápido.

**Analogía:** Imaginate que tenés 100 hojas de papel sueltas. Si las metés todas en un solo folder, es más fácil llevarlas. El bundle es ese folder.

**En este proyecto:** Vite crea el bundle cuando hacemos `npm run build`.

---

## C

---

### Cache (Caché)
**Qué es:** Guardar una copia de algo que ya se calculó, para no tener que calcularlo de nuevo.

**Analogía:** Cuando memorizás el camino a la casa de un amigo, ya no necesitás ver el mapa cada vez que vas. Tu memoria es el caché.

**En este proyecto:** TanStack Query guarda en caché los productos que ya se cargaron. Si navegás a otra página y volvés, los datos aparecen al instante sin esperar.

---

### CDN (Content Delivery Network)
**Qué es:** Una red de servidores repartidos por todo el mundo que guardan copias de los archivos para servirlos más rápido.

**Analogía:** Imaginate que solo hay un único almacén de ropa en todo el mundo, en Japón. Si vivís en Argentina, esperar que te llegue algo de ahí tarda semanas. Pero si hay sucursales en cada país, tu pedido llega en horas. El CDN son esas sucursales.

**En este proyecto:** Las imágenes guardadas en AWS S3 se sirven a través de la infraestructura global de Amazon.

---

### CLI (Interfaz de Línea de Comandos)
**Qué es:** Una forma de controlar la computadora escribiendo texto, en lugar de hacer clic en íconos.

**Analogía:** Como darle instrucciones a alguien por escrito en vez de señalar con el dedo. "Abrí la carpeta 'Proyectos', entrá a 'MiTienda', instalá las dependencias." Eso es un CLI.

**En este proyecto:** Para iniciar el proyecto se usa `npm run dev` en la terminal. Eso es usar el CLI.

---

### Código
**Qué es:** Instrucciones escritas en un lenguaje que la computadora entiende.

**Analogía:** Como una receta de cocina. Paso a paso, la computadora sigue las instrucciones: "Si el usuario hace clic aquí, mostrá este mensaje. Si no hay stock, deshabilitá el botón."

**En este proyecto:** Todo el código está en las carpetas `/src` (frontend) y `/api` (backend).

---

### Componente
**Qué es:** Una pieza reutilizable de la interfaz visual. Como un bloque de LEGO.

**Analogía:** Un LEGO tiene piezas que se repiten: cuadradas, rectangulares, especiales. En React, un componente es como una pieza: podés usarlo en 10 lugares distintos sin redibujarlo. Si lo modificás, cambia en todos lados.

**En este proyecto:** La "tarjeta de producto" (ProductCard) es un componente. Se usa en la página principal, en la búsqueda, en ofertas, etc. Siempre el mismo bloque.

---

### Cookie
**Qué es:** Un pequeño archivo que el sitio web guarda en tu navegador para "recordarte".

**Analogía:** Como cuando en una biblioteca te dan un papelito con tu número de socio. Cada vez que volvés, mostrás ese papelito y la biblioteca sabe quién sos sin que tengas que dar tu nombre de nuevo.

**En este proyecto:** Cuando iniciás sesión, el servidor guarda una cookie en tu navegador con tu sesión. Así sabés que seguís logueado aunque cierres la pestaña y la abras de nuevo.

---

### CORS
**Qué es:** Una regla de seguridad que controla desde qué páginas web se puede hacer peticiones a un servidor.

**Analogía:** Como un portero de un edificio que solo deja entrar a personas de ciertos barrios. Si venís de un barrio no autorizado, te niegan la entrada.

**En este proyecto:** El servidor solo acepta peticiones del frontend propio. Si otro sitio intentara usar la API de la tienda, CORS lo bloquearía.

---

### CSS
**Qué es:** El lenguaje que le dice al navegador cómo se ve una página: colores, tamaños, posiciones, tipos de letra.

**Analogía:** HTML es el esqueleto de la página (la estructura). CSS es la ropa y el maquillaje: lo que hace que se vea bonita.

**En este proyecto:** Se usa Tailwind CSS, que es una forma especial de escribir CSS más rápido con clases predefinidas.

---

## D

---

### Deploy (Despliegue)
**Qué es:** Subir el código a un servidor para que cualquier persona en internet pueda usarlo.

**Analogía:** Como cuando terminas de cocinar un plato y lo sacás de la cocina para servirlo en la mesa. El "deploy" es servir el plato.

**En este proyecto:** Se hace deploy en Railway. Cuando el código se sube a GitHub, Railway lo detecta y actualiza la aplicación automáticamente.

---

### Dependencia
**Qué es:** Una librería o herramienta externa que el proyecto necesita para funcionar.

**Analogía:** Como cuando armás un mueble de IKEA y necesitás un destornillador. El destornillador es una "dependencia": no lo fabricaste vos, lo usás de otro lado.

**En este proyecto:** React, Tailwind CSS, PayPal SDK, etc. son dependencias. Están listadas en `package.json` y se instalan con `npm install`.

---

### Dev Server (Servidor de Desarrollo)
**Qué es:** Un servidor que corre solo en tu computadora mientras desarrollás, para ver cambios en tiempo real.

**Analogía:** Como el ensayo de una obra de teatro. Todavía no es la función real (producción), pero probás todo en un escenario pequeño antes.

**En este proyecto:** `npm run dev` inicia el servidor de desarrollo en `localhost:3000`.

---

### DOM
**Qué es:** La representación de una página web que tiene el navegador en memoria, que se puede modificar con JavaScript.

**Analogía:** Imaginate que la página es como una marioneta hecha de piezas. El DOM es el "armazón" de esa marioneta. JavaScript puede mover las piezas: agregar brazos, cambiar el color de la cabeza, quitar una pierna.

**En este proyecto:** React modifica el DOM automáticamente cuando cambia el estado. Vos no tenés que hacerlo a mano.

---

### Drizzle ORM
**Qué es:** Una herramienta que permite hablarle a la base de datos usando JavaScript/TypeScript en lugar de SQL.

**Analogía:** Como tener un traductor personal. Vos le decís en español "dame todos los productos que cuestan menos de $100", y el traductor lo convierte al lenguaje que entiende la base de datos (SQL) y te trae los resultados.

**En este proyecto:** En vez de escribir `SELECT * FROM products WHERE price < 100`, escribís `db.select().from(products).where(lt(products.price, 100))`.

---

## E

---

### Endpoint
**Qué es:** Una dirección específica en el servidor que acepta un tipo de petición.

**Analogía:** Como las ventanillas de un banco. Una ventanilla es para sacar dinero, otra para depositar, otra para consultas. Cada ventanilla (endpoint) hace solo una cosa.

**En este proyecto:** `/api/trpc/product.list` es un endpoint que devuelve la lista de productos.

---

### ESM (ECMAScript Modules)
**Qué es:** La forma moderna de organizar el código en archivos separados que se pueden importar entre sí.

**Analogía:** Como dividir un libro muy largo en capítulos. Cada capítulo (archivo) trata un tema. Cuando lo necesitás, "importás" ese capítulo.

**En este proyecto:** En todos los archivos se ve `import { algo } from "./otro-archivo"`. Eso es ESM.

---

## F

---

### Framework
**Qué es:** Una estructura base que ya tiene muchas cosas hechas y te dice cómo organizar tu código.

**Analogía:** Como una casa prefabricada. Ya tiene paredes, techo y plomería. Vos solo decorás el interior. Sin el framework, tendrías que construir todo desde cero.

**En este proyecto:** React es el framework del frontend. Hono es el framework del backend.

---

### Frontend
**Qué es:** Todo lo que el usuario ve e interactúa en pantalla.

**Analogía:** La fachada y el interior visible de una tienda: las vitrinas, los carteles, los estantes. Es todo lo que el cliente experimenta directamente.

**En este proyecto:** El frontend está en la carpeta `/src`. Son todas las páginas: inicio, búsqueda, carrito, etc.

---

### Full-Stack
**Qué es:** Una aplicación que tiene tanto frontend como backend completos.

**Analogía:** Un negocio que tiene tanto el salón de atención al público (frontend) como la cocina o depósito donde se preparan las cosas (backend).

**En este proyecto:** MiTienda es una aplicación full-stack. Tiene frontend (React) y backend (Hono + tRPC) en el mismo proyecto.

---

## G

---

### Git
**Qué es:** Un sistema que guarda el historial de todos los cambios hechos en el código.

**Analogía:** Como el historial de un documento de Google Docs, pero para código. Podés ver qué cambió, quién lo cambió, cuándo, y volver a cualquier versión anterior.

**En este proyecto:** Todo el código está guardado en Git. Cada cambio guardado se llama "commit".

---

### GitHub
**Qué es:** Un sitio web donde se guarda el código usando Git, y se puede trabajar en equipo.

**Analogía:** Como Google Drive pero para código. Guardás tu proyecto ahí y otras personas pueden verlo, descargarlo o colaborar.

**En este proyecto:** El código está en un repositorio de GitHub. Railway lo lee de ahí para hacer el deploy.

---

## H

---

### Hash
**Qué es:** Una función matemática que convierte un texto en otro texto de longitud fija, de forma irreversible.

**Analogía:** Como una picadora de carne. Metés un pollo entero y sale picado. No podés recuperar el pollo original a partir del picado.

**En este proyecto:** Las contraseñas de los usuarios se guardan como hash en la base de datos. Si alguien roba la base de datos, no puede saber cuál era la contraseña original.

---

### Hono
**Qué es:** El servidor web de este proyecto. Es el programa que recibe las peticiones de los usuarios y las procesa.

**Analogía:** Como el director de una empresa de mensajería. Cuando llega un paquete (petición), el director sabe a qué departamento mandarlo y quién lo tiene que procesar.

**En este proyecto:** Hono recibe todas las peticiones que llegan al servidor y las dirige a la función correcta de tRPC.

---

### Hook
**Qué es:** Funciones especiales de React que agregan comportamiento a los componentes.

**Analogía:** Como enchufes eléctricos. El componente es la pared, los hooks son los enchufes que le agregan funcionalidades: uno da luz (useState = memoria), otro conecta internet (useEffect = acciones al cargar), etc.

**En este proyecto:** Se usan hooks como `useState` (para guardar el texto del buscador), `useEffect` (para ejecutar algo al cargar la página) y hooks propios de tRPC.

---

### HTML
**Qué es:** El lenguaje que define la estructura de una página web: qué textos hay, qué imágenes, qué botones.

**Analogía:** HTML es como el esqueleto de una persona. Define que hay una cabeza, dos brazos, dos piernas. No dice si es gordo o flaco (eso es CSS), solo la estructura.

**En este proyecto:** React genera HTML automáticamente a partir del código JSX/TSX. El navegador lo lee y muestra la página.

---

### HTTP / HTTPS
**Qué es:** El protocolo (idioma) con el que el navegador y el servidor se comunican.

**Analogía:** Como el idioma en que dos personas hablan. Para comunicarse, ambas tienen que hablar el mismo idioma. HTTP es ese idioma. HTTPS es lo mismo pero con "sobre cerrado" (encriptado) para que nadie pueda leer lo que se dice en el camino.

**En este proyecto:** Toda la comunicación entre el navegador del usuario y el servidor usa HTTPS.

---

## I

---

### ID (Identificador)
**Qué es:** Un número o texto único que identifica a cada elemento en la base de datos.

**Analogía:** Como el número de DNI de una persona. No importa cuántas personas se llamen "Juan García", cada una tiene un DNI diferente. En la base de datos pasa lo mismo.

**En este proyecto:** Cada producto tiene un `id` único (1, 2, 3...). Así si querés ver el producto 47, el sistema sabe exactamente cuál es.

---

## J

---

### JavaScript
**Qué es:** El lenguaje de programación que usan los navegadores web. Hace que las páginas sean interactivas.

**Analogía:** Si HTML es el esqueleto y CSS es la ropa, JavaScript son los músculos que hacen que el cuerpo se mueva. Cuando hacés clic en un botón y algo cambia, eso es JavaScript en acción.

**En este proyecto:** Todo el proyecto usa JavaScript (especialmente TypeScript, que es JavaScript mejorado).

---

### JSON
**Qué es:** Un formato de texto para organizar y transportar datos entre programas.

**Analogía:** Como un formulario estándar. Si querés enviar información de una persona a otro sistema, podés usar un formato fijo: `{"nombre": "Juan", "edad": 25, "ciudad": "Buenos Aires"}`. Así cualquier programa lo puede leer sin confusiones.

**En este proyecto:** El frontend y el backend se mandan datos en formato JSON. Por ejemplo, cuando pedís la lista de productos, el servidor responde con un JSON que tiene todos los productos.

---

### JSX / TSX
**Qué es:** Una forma de escribir código que mezcla JavaScript con HTML, para describir la interfaz visual.

**Analogía:** Como una receta que en vez de solo listar ingredientes, ya te muestra cómo va a quedar el plato. Escribís el código y al mismo tiempo describís cómo se verá.

**En este proyecto:** Todos los archivos `.tsx` usan JSX. Por ejemplo: `<Button onClick={handleClick}>Comprar</Button>`.

---

### JWT (JSON Web Token)
**Qué es:** Una forma de verificar la identidad de un usuario de forma segura, sin consultar la base de datos en cada petición.

**Analogía:** Como una pulsera de ingreso en un festival. Te la dan al entrar (cuando iniciás sesión) y en cada puerta interna simplemente mostrás la pulsera. Los guardias no llaman a la taquilla para verificar que compraste el ticket, confían en la pulsera.

**En este proyecto:** Cuando iniciás sesión, el servidor genera un JWT con tu información y te lo manda en una cookie. En cada petición siguiente, el servidor verifica que el JWT sea válido.

---

## L

---

### Librería (Library)
**Qué es:** Código ya escrito por otras personas que podés usar en tu proyecto.

**Analogía:** Como un conjunto de herramientas que comprás en una ferretería. No fabricás los martillos, los destornilladores o las llaves inglesas: los comprás ya hechos y los usás.

**En este proyecto:** React, TanStack Query, Zod, Tailwind, etc. son librerías.

---

### Linter
**Qué es:** Un programa que revisa el código en busca de errores o malas prácticas, como un corrector ortográfico pero para código.

**Analogía:** Como un maestro que lee tu redacción y subraya los errores en rojo. No te dice qué escribir, pero te avisa cuando algo está mal.

**En este proyecto:** ESLint revisa el código automáticamente y avisa si hay errores antes de publicarlo.

---

### LocalStorage
**Qué es:** Un espacio de almacenamiento en el navegador que guarda datos aunque cierres la pestaña.

**Analogía:** Como una libreta que dejás en tu casa. Aunque salgas y vuelvas, la libreta sigue ahí con lo que anotaste.

**En este proyecto:** Se puede usar para guardar preferencias del usuario, como el modo oscuro activado.

---

## M

---

### Middleware
**Qué es:** Código que se ejecuta entre que llega una petición y que el servidor la responde. Como un filtro.

**Analogía:** Como el control de seguridad en un aeropuerto. Antes de llegar a la puerta de embarque, todos los pasajeros pasan por el mismo control (revisión de documentos, equipaje). El control de seguridad es el middleware.

**En este proyecto:** El servidor tiene middleware que verifica si el usuario está logueado antes de permitirle hacer ciertas acciones como comprar o acceder al panel admin.

---

### MySQL
**Qué es:** Un sistema de base de datos que guarda información en tablas (como hojas de Excel).

**Analogía:** Como una hoja de cálculo de Excel muy poderosa. Tenés varias hojas (tablas): una para usuarios, otra para productos, otra para pedidos. Cada fila es un registro y cada columna es un dato.

**En este proyecto:** MySQL guarda todos los datos de la tienda: usuarios, productos, categorías, pedidos, carritos, etc.

---

## N

---

### Node.js
**Qué es:** Un programa que permite ejecutar JavaScript fuera del navegador, en el servidor.

**Analogía:** JavaScript nació para vivir dentro de los navegadores (Chrome, Firefox). Node.js es como una "casa" que construyeron para que JavaScript también pudiera vivir en servidores, como si fuera otro lenguaje de programación normal.

**En este proyecto:** El backend (servidor) corre sobre Node.js.

---

### npm
**Qué es:** El gestor de paquetes de Node.js. Sirve para instalar librerías y herramientas.

**Analogía:** Como una tienda de aplicaciones (App Store o Google Play) pero para programadores. Escribís el nombre de lo que necesitás y te lo instala automáticamente.

**En este proyecto:** Con `npm install` se instalan todas las dependencias del proyecto. Con `npm run dev` se inicia el servidor de desarrollo.

---

## O

---

### ORM (Object-Relational Mapping)
**Qué es:** Una herramienta que traduce las operaciones de la base de datos a código del lenguaje de programación.

**Analogía:** Como tener un intérprete. Vos hablás en español (TypeScript) y el intérprete (ORM) le dice a la base de datos lo que querés en el idioma que ella entiende (SQL).

**En este proyecto:** Se usa Drizzle ORM. Permite escribir consultas a MySQL usando TypeScript en lugar de SQL.

---

## P

---

### Package.json
**Qué es:** El archivo que describe el proyecto: su nombre, versión y la lista de todas las librerías que usa.

**Analogía:** Como el menú de un restaurante. Lista todo lo que hay disponible y a qué precio. En este caso, lista todas las dependencias y sus versiones.

**En este proyecto:** `package.json` está en la raíz del proyecto. Define scripts como `npm run dev`, `npm run build`, etc.

---

### PayPal API
**Qué es:** El sistema de PayPal que permite integrar pagos en una aplicación web.

**Analogía:** Como la terminal de tarjeta de crédito en un local. No fabricás la terminal vos mismo, la alquilás del banco (PayPal). Cuando el cliente quiere pagar, usás esa terminal y PayPal se encarga de mover el dinero.

**En este proyecto:** Cuando un usuario confirma su compra, la aplicación le muestra los botones de PayPal. El usuario paga en PayPal y este notifica a la tienda que el pago fue exitoso.

---

### Port (Puerto)
**Qué es:** Un número que identifica "por dónde" entra y sale el tráfico de red en una computadora.

**Analogía:** Como los locales de un mismo edificio. El edificio (la computadora) tiene una dirección, pero dentro hay muchos locales (puertos). El local 3000 puede ser la tienda web, el local 3306 la base de datos, etc.

**En este proyecto:** El frontend corre en el puerto 3000 durante el desarrollo. MySQL usa el puerto 3306.

---

### Producción
**Qué es:** El entorno real donde los usuarios finales usan la aplicación.

**Analogía:** La función real de una obra de teatro, con público. Opuesto al "ensayo" (desarrollo local).

**En este proyecto:** La aplicación en producción corre en los servidores de Railway y es la que usan los clientes reales.

---

### Props
**Qué es:** Datos que se pasan de un componente padre a uno hijo en React.

**Analogía:** Como los parámetros que le das a una receta. La receta de "tarta" es siempre la misma, pero le pasás distintos "props": tarta de manzana, tarta de frutilla, etc. La receta usa lo que le pasás.

**En este proyecto:** El componente `ProductCard` recibe props como `name`, `price`, `image`, `stock`.

---

## Q

---

### Query
**Qué es:** Una consulta o pedido de datos.

**Analogía:** Como hacerle una pregunta a una biblioteca: "Dame todos los libros de terror publicados después del 2000". Eso es una query.

**En este proyecto:** Hay dos tipos: queries a la base de datos (buscar productos) y queries de tRPC (el frontend pide datos al backend).

---

## R

---

### Railway
**Qué es:** Un servicio en la nube que aloja y ejecuta aplicaciones web.

**Analogía:** Como alquilar una habitación en un hotel permanente para tu programa. Railway le da electricidad, internet, y un dominio (dirección web) a tu aplicación para que funcione 24/7.

**En este proyecto:** La aplicación MiTienda vive en los servidores de Railway. También la base de datos MySQL corre ahí.

---

### React
**Qué es:** La librería de JavaScript más popular para construir interfaces visuales web.

**Analogía:** Como un sistema de LEGO para páginas web. React te da "bloques" (componentes) que podés armar y rearmar para construir cualquier interfaz. Cuando un bloque cambia, React actualiza solo ese bloque en la pantalla, sin recargar toda la página.

**En este proyecto:** Todo el frontend (lo que el usuario ve) está construido con React 19.

---

### React Router
**Qué es:** La librería que maneja la navegación entre páginas en una aplicación React.

**Analogía:** Como el directorio de un edificio. Cuando querés ir al piso 3, el directorio te dice qué hay ahí. Cuando escribís `/carrito` en el navegador, React Router sabe qué página mostrarte.

**En este proyecto:** Se usa React Router v7 para manejar las rutas: `/`, `/search`, `/cart`, `/admin`, etc.

---

### Recharts
**Qué es:** Una librería para crear gráficos y visualizaciones de datos en React.

**Analogía:** Como un generador de gráficos de Excel, pero dentro de la página web. Le pasás los datos y genera barras, líneas, tortas, etc.

**En este proyecto:** Se usa en el panel de administración para mostrar estadísticas de ventas en forma de gráficos.

---

### Render
**Qué es:** El proceso de convertir el código en imágenes/texto visibles en pantalla.

**Analogía:** Como imprimir un documento. El texto en el Word no es lo mismo que el papel impreso. El "render" es la impresión: convertir el código en algo que el ojo ve.

**En este proyecto:** React "renderiza" los componentes: los convierte en HTML que el navegador muestra.

---

### REST
**Qué es:** Un estilo de diseño para APIs que usa URLs y métodos HTTP.

**Analogía:** Como un sistema de pedidos estandarizado. GET = pedir información, POST = crear algo nuevo, PUT = actualizar, DELETE = borrar. Es como los verbos de un idioma.

**En este proyecto:** La API de PayPal usa REST. La API interna usa tRPC (que es más moderno que REST para este caso).

---

### Router
**Qué es:** El componente que decide qué hacer según la URL o la petición recibida.

**Analogía:** Como el operador de una central telefónica. Cuando entra una llamada, el operador la desvía al departamento correcto.

**En este proyecto:** El router del backend (tRPC) dirige cada petición a la función correcta. El router del frontend (React Router) muestra la página correcta.

---

## S

---

### Sandbox
**Qué es:** Un entorno de prueba que simula el real pero sin dinero ni efectos reales.

**Analogía:** Como jugar a la "tiendita" de niños con billetes de juguete. Todo parece real pero no hay dinero de verdad involucrado.

**En este proyecto:** PayPal tiene un "sandbox" para probar pagos sin usar dinero real. Durante el desarrollo se usa el sandbox de PayPal.

---

### Schema (Esquema)
**Qué es:** La definición de la estructura que deben tener los datos.

**Analogía:** Como el molde para hacer chocolates. El molde define la forma (campos) que tendrá cada chocolate (registro de datos). Todos los chocolates salen con la misma forma.

**En este proyecto:** El schema de Drizzle define cómo son las tablas de MySQL. El schema de Zod define cómo deben ser los datos que llegan al servidor.

---

### SDK
**Qué es:** Software Development Kit (Kit de Desarrollo). Es un conjunto de herramientas que un servicio te da para que lo puedas usar más fácilmente.

**Analogía:** Como el kit de reparación que viene con algunos autos: ya incluye gato, llave y triángulo. No tenés que fabricarlos, ya vienen incluidos para facilitar el trabajo.

**En este proyecto:** PayPal tiene un SDK de React (`@paypal/react-paypal-js`) que ya incluye los botones de pago listos para usar.

---

### Sesión
**Qué es:** El período de tiempo que dura la conexión identificada de un usuario con el sistema.

**Analogía:** Como quedarse en un hotel. Hacés el check-in (login), te dan la llave (cookie de sesión), y mientras tengas la llave, el hotel sabe quién sos. Cuando hacés check-out (logout), devolvés la llave.

**En este proyecto:** Al iniciar sesión, el servidor crea una sesión y la guarda en una cookie. La sesión expira después de cierto tiempo.

---

### shadcn/ui
**Qué es:** Una colección de componentes de interfaz ya diseñados y listos para usar.

**Analogía:** Como comprar muebles de IKEA en vez de construirlos desde cero. Los botones, las tablas, los formularios y los diálogos ya tienen buen diseño. Solo los ponés en su lugar.

**En este proyecto:** Casi todos los elementos visuales (botones, inputs, tarjetas, tablas, modales) vienen de shadcn/ui.

---

### Sonner
**Qué es:** Una librería que muestra notificaciones emergentes temporales (toasts) en la pantalla.

**Analogía:** Como las notificaciones que aparecen en la esquina del celular cuando llega un mensaje. Aparecen, muestran algo, y desaparecen solas.

**En este proyecto:** Cuando creás un producto, borrás una categoría, o hay un error, aparece un "toast" con el mensaje.

---

### SQL
**Qué es:** El lenguaje para hablarle a las bases de datos relacionales.

**Analogía:** Como el idioma oficial de los archiveros. Todos los archiveros de bases de datos (MySQL, PostgreSQL, etc.) entienden SQL. Es su idioma común.

**En este proyecto:** Drizzle ORM traduce el código TypeScript a SQL automáticamente. Pero la base de datos que corre por abajo es MySQL.

---

### SPA (Single Page Application)
**Qué es:** Una aplicación web que carga una sola vez y luego cambia el contenido sin recargar la página.

**Analogía:** Como un televisor con control remoto. No cambiás de TV cada vez que querés ver otro canal. Cambias el canal en el mismo televisor. La SPA hace lo mismo: cambia el contenido sin recargar.

**En este proyecto:** MiTienda es una SPA. Cuando navegás de la página principal al carrito, no recarga el navegador: React simplemente muestra otro componente.

---

### State (Estado)
**Qué es:** La "memoria" de un componente React. Datos que pueden cambiar y que cuando cambian, actualizan la pantalla.

**Analogía:** Como el marcador de un partido. El estado actual es "3-2". Cuando cae un gol, el marcador se actualiza a "3-3". La pantalla refleja el estado actual en todo momento.

**En este proyecto:** El carrito de compras tiene estado. Cuando agregás un producto, el estado cambia y el número del carrito en el menú se actualiza automáticamente.

---

## T

---

### Tailwind CSS
**Qué es:** Una forma de escribir estilos visuales usando clases predefinidas directamente en el HTML.

**Analogía:** Como tener una caja de pinturas con todos los colores ya listos y etiquetados. En vez de mezclar colores para obtener "azul oscuro", simplemente agarrás el tubo que dice "azul oscuro".

**En este proyecto:** En vez de escribir CSS complejo, se usan clases como `text-blue-500 font-bold px-4 py-2 rounded-lg` directamente en los componentes.

---

### TanStack Query
**Qué es:** Una librería que maneja automáticamente la carga, caché y actualización de datos del servidor.

**Analogía:** Como tener un asistente personal que: busca los datos que necesitás, los guarda para no buscarlos dos veces, los actualiza cuando cambian, y te avisa si hay un error. Vos solo le decís "necesito los productos" y él se encarga de todo.

**En este proyecto:** Cuando el frontend pide datos al backend (como la lista de productos), TanStack Query maneja el estado de carga, el caché y los errores automáticamente.

---

### Token
**Qué es:** Una cadena de texto que funciona como llave de acceso.

**Analogía:** Como un ticket de entrada a un concierto. Quien tiene el ticket válido puede entrar. Si el ticket está vencido o es falso, no puede.

**En este proyecto:** Al iniciar sesión, el servidor genera un JWT (token). Con ese token, el usuario puede hacer peticiones al servidor que requieren autenticación.

---

### tRPC
**Qué es:** Un sistema para comunicar el frontend con el backend de forma segura y tipada, sin necesidad de escribir una API tradicional.

**Analogía:** Como un teléfono directo entre dos personas. Sabés exactamente quién está del otro lado y en qué idioma hablar, sin pasar por una operadora. Además, si cometés un error al marcar (tipo de dato incorrecto), el sistema te avisa antes de que hagas la llamada.

**En este proyecto:** El frontend llama funciones del backend como si fueran funciones locales: `trpc.product.list.useQuery()`. No hay que definir URLs ni serializar datos manualmente.

---

### TypeScript
**Qué es:** JavaScript con la capacidad de definir el tipo de cada dato (si es número, texto, lista, etc.).

**Analogía:** JavaScript sin tipos es como enviar paquetes sin etiqueta: podés poner cualquier cosa adentro y descubrís qué era cuando lo abrís. TypeScript pone etiquetas: "este paquete es una caja de zapatos tamaño 42". Si intentás meter algo que no sea eso, da error antes de enviar.

**En este proyecto:** Todo el código está en TypeScript: tanto el frontend como el backend. Esto previene muchos errores.

---

## U

---

### URL
**Qué es:** La dirección de una página web o recurso en internet.

**Analogía:** Como la dirección postal de una casa. Así como "Av. Corrientes 1234, Buenos Aires" lleva a una casa específica, "https://mitienda.com/products/5" lleva a la página del producto número 5.

**En este proyecto:** Cada página tiene su URL: `/` es el inicio, `/cart` es el carrito, `/admin` es el panel de administración, etc.

---

## V

---

### Validación
**Qué es:** Verificar que los datos que llegan sean correctos y cumplan las reglas esperadas.

**Analogía:** Como el control de calidad en una fábrica. Antes de que el producto salga a la venta, lo revisan: ¿tiene el tamaño correcto? ¿los colores están bien? ¿no tiene defectos? Si no pasa el control, se rechaza.

**En este proyecto:** Zod valida los datos que llegan al servidor. Por ejemplo, verifica que el precio de un producto sea un número positivo, o que el email tenga formato correcto.

---

### Variable de Entorno
**Qué es:** Configuración sensible (contraseñas, claves) que se guarda fuera del código, en el sistema operativo o en el servidor.

**Analogía:** Como la caja fuerte de una empresa. La combinación de la caja (contraseña de la base de datos, clave de PayPal) no se escribe en el manual de procedimientos (código). Se guarda en un lugar seguro separado.

**En este proyecto:** La contraseña de MySQL, las claves de PayPal, la clave de AWS S3 y el secreto del JWT son variables de entorno. No aparecen en el código.

---

### Vite
**Qué es:** La herramienta que transforma el código de desarrollo en código optimizado para producción, y que también sirve el servidor local durante el desarrollo.

**Analogía:** Como la imprenta de un periódico. Los periodistas escriben sus notas (código), y la imprenta las convierte en el periódico final listo para distribuir. Además, durante el trabajo, la imprenta muestra una "prueba de galera" (servidor de desarrollo) para ver cómo queda.

**En este proyecto:** Vite procesa todos los archivos `.tsx` y genera los archivos finales que el navegador puede leer.

---

## W

---

### Webhook
**Qué es:** Una URL que recibe notificaciones automáticas cuando algo pasa en un servicio externo.

**Analogía:** Como dejar tu número de teléfono para que te avisen. En vez de llamar al banco cada hora para preguntar "¿llegó el pago?", dejás tu número y el banco te llama cuando llega.

**En este proyecto:** PayPal puede notificar a la tienda mediante un webhook cuando un pago es confirmado, aunque el usuario cierre la ventana.

---

### WebSocket
**Qué es:** Una conexión permanente entre el navegador y el servidor para comunicación en tiempo real.

**Analogía:** Diferente a hacer llamadas telefónicas (petición-respuesta), WebSocket es como dejar una línea abierta todo el tiempo. Cualquiera puede hablar cuando quiera, sin esperar el turno.

**En este proyecto:** No se usa actualmente, pero podría usarse para notificaciones en tiempo real.

---

## Z

---

### Zod
**Qué es:** Una librería para definir la forma que deben tener los datos y validarlos automáticamente.

**Analogía:** Como rellenar un formulario con campos obligatorios. Si no llenás el campo "Nombre" o ponés un número donde va un texto, el formulario no te deja enviarlo. Zod hace eso automáticamente en el código.

**En este proyecto:** Cada función del backend tiene un schema de Zod que define qué datos acepta. Si el frontend manda algo incorrecto, Zod lo rechaza antes de que llegue a la base de datos.

---

## Conceptos del Proyecto

---

### Administrador (Admin)
**Qué es:** Un tipo especial de usuario que tiene acceso total al panel de administración.

**Cómo funciona:** El usuario cuyo `unionId` coincide con la variable de entorno `OWNER_UNION_ID` recibe automáticamente el rol de administrador.

**Qué puede hacer:** Crear/editar/borrar productos y categorías, ver todos los pedidos, gestionar el stock, crear ofertas, ver estadísticas de ventas, configurar la tienda.

---

### Carrito de Compras
**Qué es:** La lista de productos que el usuario quiere comprar, antes de confirmar el pedido.

**Analogía:** Como la canasta del supermercado. Vas agregando productos mientras recorrés la tienda. Al llegar a la caja, confirmás lo que comprás.

**Cómo funciona en este proyecto:** Los productos del carrito se guardan en la base de datos (tabla `cartItems`), asociados al usuario. Así el carrito persiste aunque cierres el navegador.

---

### Categoría
**Qué es:** Una agrupación de productos relacionados.

**Ejemplos:** Electrónica, Ropa, Hogar, Mascotas.

**En este proyecto:** Cada categoría tiene un nombre, descripción, imagen y un ícono (elegido de una biblioteca de 38 íconos). Las categorías se muestran en la página principal y en la página de categorías.

---

### Descuento / Oferta
**Qué es:** Una reducción del precio original de un producto por tiempo limitado.

**Cómo funciona:** El administrador crea una "oferta" para un producto, indicando el porcentaje de descuento, la fecha de inicio y la fecha de fin. El sistema calcula automáticamente el precio con descuento.

**Ejemplo:** Producto que cuesta $100 con un 20% de descuento → precio final $80.

---

### Inventario (Stock)
**Qué es:** La cantidad disponible de un producto.

**En este proyecto:** Cada producto tiene un campo `stock` que indica cuántas unidades hay. Si el stock llega a 0, el producto se muestra como "Sin stock" y no se puede agregar al carrito.

---

### Pedido (Order)
**Qué es:** La compra confirmada y pagada por un usuario.

**Ciclo de vida:** Carrito → Pago con PayPal → Pedido creado → Administrador lo gestiona.

**En este proyecto:** Cada pedido guarda: quién compró, qué productos, cuántos, a qué precio, cuándo, y el estado del pago.

---

### Producto
**Qué es:** Un artículo que se vende en la tienda.

**Datos de cada producto:** nombre, descripción, precio, marca, stock, imagen, categoría, y si está activo o no.

---

### Sesión de Usuario
**Qué es:** El estado de "estar logueado" en la aplicación.

**Cómo funciona:** Al iniciar sesión, el servidor genera un JWT con los datos del usuario y lo guarda en una cookie. La cookie se envía automáticamente en cada petición. Cuando el JWT vence, el usuario tiene que volver a iniciar sesión.

---

## Tecnologías por área

| Área | Tecnología | Para qué sirve |
|------|-----------|----------------|
| **Interfaz visual** | React 19 | Construir los componentes visuales |
| **Estilos** | Tailwind CSS | Darle color, tamaño y forma a los elementos |
| **Componentes UI** | shadcn/ui + Radix UI | Botones, tablas, diálogos, ya diseñados |
| **Navegación** | React Router v7 | Cambiar de página sin recargar |
| **Datos del servidor** | TanStack Query | Pedir, guardar y actualizar datos del backend |
| **API interna** | tRPC | Conectar frontend y backend con seguridad de tipos |
| **Servidor web** | Hono | Recibir y procesar peticiones |
| **Base de datos** | MySQL | Guardar todos los datos |
| **Lenguaje BD** | Drizzle ORM | Hablarle a MySQL desde TypeScript |
| **Validación** | Zod | Verificar que los datos sean correctos |
| **Autenticación** | JWT + Cookies | Mantener la sesión del usuario |
| **Pagos** | PayPal API | Procesar pagos |
| **Imágenes** | AWS S3 | Guardar fotos de productos |
| **Gráficos** | Recharts | Mostrar estadísticas visuales |
| **Íconos** | Lucide React | Íconos vectoriales para la interfaz |
| **Notificaciones** | Sonner | Mensajes emergentes temporales |
| **Build** | Vite | Compilar y optimizar el código |
| **Hosting** | Railway | Donde vive la aplicación en internet |
| **Versiones** | Git + GitHub | Control de cambios del código |
| **Lenguaje** | TypeScript | El lenguaje principal de todo el proyecto |

---

*Glosario generado el 17 de junio de 2026*
*Proyecto: MiTienda — E-commerce full-stack*
