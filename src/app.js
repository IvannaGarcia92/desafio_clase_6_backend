import express from 'express'; // importamos el modulo de express para crear y configurar el servidor
import ProductManager from './ProductManager.js'; // importamos la clase ProductManager para el manejo de productos

const app = express(); // creamos una nueva instancia de express (app)
const PORT = 8080; // definimos el puerto donde se escucharán las solicitudes
const jsonFilePath = './src/products.json'; // ruta a nuestro archivo json con los productos
const productManager = new ProductManager(jsonFilePath); // instancia de la clase ProductManager (como argumento lleva la ruta a los productos)

// Middlewares para trabajar con json y datos complejos
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// endpoints
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined; // obtenemos el valor del parámetro de consulta 'limit' de la solicitud si está presente, si no está presente, 'limit' será undefined
        const products = await productManager.getProducts(); // llamamos al método 'getProducts()' de la instancia de 'ProductManager' para obtener todos los productos
        const limitedProducts = limit ? products.slice(0, limit) : products; // si se proporciona un límite, se limita el número de productos a devolver, de lo contrario, se devuelven todos los productos
        res.json(limitedProducts); // respondemos con los productos obtenidos en formato JSON
    } catch (error) {
        console.error('Error fetching products:', error); // capturamos si se produce un error durante la obtención de los productos
        res.status(500).json({ error: 'Internal Server Error' }); // en caso de error, respondemos con un estado de error 500 (Internal Server Error) y un mensaje en formato JSON
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); // obtenemos el ID del producto de los parámetros de la solicitud y lo convertimos a un número entero
        const product = await productManager.getProductById(productId); // llamamos al método 'getProductById()' de la instancia de 'ProductManager' para obtener el producto por su ID
        if (product) { // verificamos si se encontró el producto
            res.json(product); // en caso de éxito, respondemos con el producto en formato JSON
        } else {
            res.status(404).json({ error: 'Product not found' }); // en caso de error, respondemos con un estado de error 404 (Not Found) y un mensaje en formato JSON
        }
    } catch (error) {
        console.error('Error fetching product by id:', error); // capturamos si se produce un error durante la obtención del producto por su ID
        res.status(500).json({ error: 'Internal Server Error' }); // en caso de error, respondemos con un estado de error 500 (Internal Server Error) y un mensaje en formato JSON
    }
});

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
}); // iniciamos el servidor y lo ponemos a correr en el puerto deseado 

export default app; // exportamos app

