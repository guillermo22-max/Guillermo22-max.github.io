// Variables globales
const carrito = document.querySelector('#carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaProductos = document.querySelector('#lista-1');
const contadorProductos = document.querySelector('#contador-productos'); // Nuevo contador de productos
let articulosCarrito = [];

// Función para cargar todos los event listeners
cargarEventListeners();
function cargarEventListeners() {
    // Agregar un producto al carrito al hacer click en "Agregar al Carrito"
    listaProductos.addEventListener('click', agregarProducto);

    // Eliminar productos del carrito
    carrito.addEventListener('click', eliminarProducto);

    // Incrementar productos dentro del carrito
    carrito.addEventListener('click', incrementarProducto);

    // Decrementar productos dentro del carrito
    carrito.addEventListener('click', decrementarProducto);

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // Resetea el carrito
        limpiarHTML(); // Elimina todo el HTML
        actualizarTotal(); // Actualiza el total a 0
        actualizarContador(); // Resetea el contador
    });
}

// Función para agregar el producto al carrito
function agregarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const productoSeleccionado = e.target.parentElement.parentElement;
        leerDatosProducto(productoSeleccionado);
    }
}

// Lee los datos del producto seleccionado
function leerDatosProducto(producto) {
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h3').textContent,
        precio: producto.querySelector('.Precio').textContent,
        id: producto.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    // Revisa si un producto ya existe en el carrito
    const existe = articulosCarrito.some(producto => producto.id === infoProducto.id);
    if (existe) {
        // Actualizamos la cantidad
        const productos = articulosCarrito.map(producto => {
            if (producto.id === infoProducto.id) {
                producto.cantidad++;
                return producto; // Retorna el producto actualizado
            } else {
                return producto; // Retorna los productos que no son los duplicados
            }
        });
        articulosCarrito = [...productos];
    } else {
        // Agrega elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoProducto];
    }

    // Actualiza el HTML del carrito
    carritoHTML();
    // Actualiza el contador del carrito
    actualizarContador();
}

// Elimina un producto del carrito
function eliminarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar')) {
        const productoId = e.target.getAttribute('data-id');

        // Elimina del arreglo de artículos del carrito por el data-id
        articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);

        carritoHTML(); // Itera sobre el carrito y muestra su HTML
        actualizarTotal(); // Actualiza el total
        actualizarContador(); // Actualiza el contador
    }
}

// Incrementa la cantidad de un producto en el carrito
function incrementarProducto(e) {
    if (e.target.classList.contains('incrementar')) {
        const productoId = e.target.getAttribute('data-id');

        // Busca el producto en el arreglo de artículos del carrito y aumenta la cantidad
        articulosCarrito = articulosCarrito.map(producto => {
            if (producto.id === productoId) {
                producto.cantidad++;
            }
            return producto;
        });

        carritoHTML(); // Actualiza el HTML del carrito
        actualizarContador(); // Actualiza el contador
        actualizarTotal(); // Actualiza el total
    }
}

// Decrementa la cantidad de un producto en el carrito
function decrementarProducto(e) {
    if (e.target.classList.contains('decrementar')) {
        const productoId = e.target.getAttribute('data-id');

        // Busca el producto en el arreglo de artículos del carrito y disminuye la cantidad
        articulosCarrito = articulosCarrito.map(producto => {
            if (producto.id === productoId && producto.cantidad > 0) {
                producto.cantidad--;
                if (producto.cantidad === 0) {
                    return null; // Marca para eliminación
                }
            }
            return producto;
        }).filter(producto => producto !== null); // Elimina los productos con cantidad 0

        carritoHTML(); // Actualiza el HTML del carrito
        actualizarContador(); // Actualiza el contador
        actualizarTotal(); // Actualiza el total
    }
}

// Muestra los productos en el carrito de compras en el HTML
function carritoHTML() {
    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width="100">
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>${producto.cantidad}</td>
            <td>
                <div class="acciones"> <!-- Contenedor para los botones -->
                    <button class="decrementar" data-id="${producto.id}">-</button> <!-- Botón para decrementar -->
                    <a href="#" class="borrar" data-id="${producto.id}">X</a> <!-- Botón para eliminar -->
                    <button class="incrementar" data-id="${producto.id}">+</button> <!-- Botón para incrementar -->
                </div>
            </td>
        `;

        // Agrega el HTML del carrito en el tbody
        carrito.appendChild(row);
    });

    // Actualizar el total
    actualizarTotal();
}

// Elimina los productos del tbody
function limpiarHTML() {
    while (carrito.firstChild) {
        carrito.removeChild(carrito.firstChild);
    }
}

// Calcula y muestra el total de la compra
function actualizarTotal() {
    const total = articulosCarrito.reduce((total, producto) => {
        const precio = parseFloat(producto.precio.replace('€', '').replace(',', '.'));
        return total + (precio * producto.cantidad);
    }, 0);

    const totalElement = document.querySelector('#total');
    if (!totalElement) {
        const nuevoTotal = document.createElement('div');
        nuevoTotal.id = 'total';
        nuevoTotal.textContent = `Total: ${total.toFixed(2)} €`;
        carrito.parentElement.appendChild(nuevoTotal);
    } else {
        totalElement.textContent = `Total: ${total.toFixed(2)} €`;
    }
}

// Actualiza el contador de productos en el ícono del carrito
function actualizarContador() {
    const totalProductos = articulosCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    contadorProductos.textContent = totalProductos;
}





