const carrito = document.querySelector('#carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaProductos = document.querySelector('#lista-1');
const contadorProductos = document.querySelector('#contador-productos'); 
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    listaProductos.addEventListener('click', agregarProducto);

    carrito.addEventListener('click', eliminarProducto);

    carrito.addEventListener('click', incrementarProducto);

    carrito.addEventListener('click', decrementarProducto);

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // Resetea el carrito
        limpiarHTML(); // Elimina todo el HTML
        actualizarTotal(); // Actualiza el total a 0
        actualizarContador(); // Resetea el contador
    });
}

function agregarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const productoSeleccionado = e.target.parentElement.parentElement;
        leerDatosProducto(productoSeleccionado);
    }
}

function leerDatosProducto(producto) {
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h3').textContent,
        precio: producto.querySelector('.Precio').textContent,
        id: producto.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    const existe = articulosCarrito.some(producto => producto.id === infoProducto.id);
    if (existe) {
        // Actualizamos la cantidad
        const productos = articulosCarrito.map(producto => {
            if (producto.id === infoProducto.id) {
                producto.cantidad++;
                return producto; 
            } else {
                return producto; 
            }
        });
        articulosCarrito = [...productos];
    } else {
        articulosCarrito = [...articulosCarrito, infoProducto];
    }

    carritoHTML();
    actualizarContador();
}

function eliminarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar')) {
        const productoId = e.target.getAttribute('data-id');

        articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);

        carritoHTML(); // Itera sobre el carrito y muestra su HTML
        actualizarTotal(); // Actualiza el total
        actualizarContador(); // Actualiza el contador
    }
}

function incrementarProducto(e) {
    if (e.target.classList.contains('incrementar')) {
        const productoId = e.target.getAttribute('data-id');

        articulosCarrito = articulosCarrito.map(producto => {
            if (producto.id === productoId) {
                producto.cantidad++;
            }
            return producto;
        });

        carritoHTML(); 
        actualizarContador(); 
        actualizarTotal(); 
    }
}


function decrementarProducto(e) {
    if (e.target.classList.contains('decrementar')) {
        const productoId = e.target.getAttribute('data-id');

        articulosCarrito = articulosCarrito.map(producto => {
            if (producto.id === productoId && producto.cantidad > 0) {
                producto.cantidad--;
                if (producto.cantidad === 0) {
                    return null; // Marca para eliminación
                }
            }
            return producto;
        }).filter(producto => producto !== null); 

        carritoHTML(); // Actualiza el HTML del carrito
        actualizarContador(); // Actualiza el contador
        actualizarTotal(); // Actualiza el total
    }
}

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

        carrito.appendChild(row);
    });

    actualizarTotal();
}

function limpiarHTML() {
    while (carrito.firstChild) {
        carrito.removeChild(carrito.firstChild);
    }
}

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

function actualizarContador() {
    const totalProductos = articulosCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    contadorProductos.textContent = totalProductos;
}



