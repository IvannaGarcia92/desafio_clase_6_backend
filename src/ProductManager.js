import fs from 'fs/promises'; // Importamos fs como una promesa
import fetch from 'node-fetch';

// definimos la clase ProductManager
class ProductManager { 
    constructor( jsonFilePath ) { // el constructor recibe la ruta al archivo json como parámetro
        this.path = jsonFilePath;
    }

    // reset
    async resetProductsFile() {
        try {
            await fs.writeFile(this.path, '[]'); // escribimos un arreglo vacío en el archivo JSON para reiniciar los productos
            console.log("Archivo de productos reiniciado.");
        } catch (error) {
            console.error('Error resetting products file:', error);
            throw error;
        }
    }

    // agregamos un nuevo producto al archivo
    async addProduct( productData ) {
        try {
            let products = await this.getProductsFromFile(); // obtenemos los productos del archivo
            productData.id = products.length > 0 ? products[ products.length - 1 ].id + 1 : 1; // le asignamos un ID autoincrementable a cada producto
            products.push(productData); // agregamos el nuevo producto al array
            await this.saveProductsToFile(products); // guardamos el array actualizado en el archivo
            return productData.id; // retornamos el ID del producto agregado
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

     // obtenemos todos los productos del archivo
    async getProducts() {
        try {
            return await this.getProductsFromFile(); // obtenemos y retornamos los productos del archivo
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }
    
    // obtenemos un producto por su ID
    async getProductById(id) {
        try {
            const products = await this.getProductsFromFile(); // obtenemos los productos del archivo
            const product = products.find(item => item.id === id); // buscamos el producto por su ID
            if (!product) {
                throw new Error('Product not found'); // lanzamos un error si no encuentra el producto
            }
            return product; // retornamos el producto en caso de encontrarlo
        } catch (error) {
            console.error('Error fetching product by id:', error);
        }
    }

    // actualizamos un producto por su ID
    async updateProducts (id, updatedFields) {
        try {
            let products = await this.getProductsFromFile();  // obtenemos los productos actuales del archivo
            const index = products.findIndex(item => item.id === id); // buscamos el índice del producto a actualizar por su ID
            if (index === -1) {
                throw new Error('Product not found'); // lanzamos un error si el producto no existe
            }
            products[index] = {...products[index], ...updatedFields}; // actualizamos los campos mediante la desestructuración de objetos
            await this.saveProductsToFile(products); // guardamos los productos actualizados en el archivo
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }

    // eliminamos un producto
    async deleteProduct (id) {
        try {
            let products = await this.getProductsFromFile(); // obtenemos los productos actuales del archivo 
            products = products.filter(item => item.id !== id); // filtramos los productos para eliminar el que coincida con el ID especificado (lo excluímos en un nuevo array)
            await this.saveProductsToFile(products); // guardamos los productos actualizados en el archivo, ya sin el producto que fue excluído (eliminado)
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    // método para obtener los productos desde el archivo json
    async getProductsFromFile() {
        try {
            const data = await fs.readFile(this.path, 'utf-8'); // leemos el archivo JSON y lo convertimos en un objeto js
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading file:', error);
            return []; //retornamos on objeto vacío en caso de error
        }
    }

    // método para guardar los productos desde el archivo json
    async saveProductsToFile(products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2)); // convertimos el objeto js en formato JSON y lo escribimos en el archivo
        } catch (error) {
            console.error('Error saving file:', error);
            throw error;
        }
    }

    // método para ejecutar las pruebas
    async runTests() {
        console.log("Proceso de testing:");

        try {
            // Paso 1: probamos el endpoint '/products' sin query params
            console.log("\nPaso 1: Probamos el endpoint '/products' sin query params:");
            const response1 = await fetch('http://localhost:8080/products');
            const products1 = await response1.json();
            console.log(products1);

            // Paso 2: probamos el endpoint '/products' con query param limit=5
            console.log("\nPaso 2: Probamos el endpoint '/products' con query param limit=5:");
            const response2 = await fetch('http://localhost:8080/products?limit=5');
            const products2 = await response2.json();
            console.log(products2);

            // Paso 3: probamos el endpoint '/products/:pid' con un ID existente
            console.log("\nPaso 3: Probamos el endpoint '/products/:pid' con un ID existente:");
            const response3 = await fetch('http://localhost:8080/products/2');
            const product2 = await response3.json();
            console.log(product2);

            // Paso 4: probamos el endpoint '/products/:pid' con un ID inexistente
            console.log("\nPaso 4: Probamos el endpoint '/products/:pid' con un ID inexistente:");
            const response4 = await fetch('http://localhost:8080/products/34123123');
            const productNotFound = await response4.json();
            console.log(productNotFound);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

export default ProductManager;