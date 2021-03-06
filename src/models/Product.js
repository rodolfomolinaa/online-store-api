const serverConfig = require('../configs/server-config');
const getFirebaseDB = require('../database/firebase/firebase').getDB;

module.exports = class Product {
    constructor(title, price, quantity, detail, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.quantity = quantity;
        this.detail = detail;
        this.imageUrl = imageUrl;
        this.id = id;
    }

    static getAll() {
        const database = getFirebaseDB();
        return new Promise((resolve, reject) => {
            database
                .ref('products')
                .once('value', (snapshot) => {
                    let products = snapshot.val();
                    products = Object.keys(products).map((key) => ({
                        id: key,
                        ...products[key],
                        imageUrl: `${serverConfig.scheme}://${serverConfig.server}${serverConfig.imagePort}/${products[key].imageUrl}`,
                    }));
                    products = products || [];
                    resolve({ message: 'success', products: products });
                })
                .catch((error) => {
                    reject({ message: 'Error to get products', error: error });
                });
        });
    }

    static getById(id) {
        const database = getFirebaseDB();
        return new Promise((resolve, reject) => {
            database
                .ref('products')
                .child(id)
                .once('value', (snapshot) => {
                    let product = snapshot.val();

                    if (product != null) {
                        product.imageUrl = `${serverConfig.scheme}://${serverConfig.server}${serverConfig.imagePort}/${product.imageUrl}`;
                        product = { id: id, ...product };
                        resolve({ message: 'success', product });
                    }
                })
                .catch((error) => {
                    reject({ message: 'Error to get product', error: error });
                });
        });
    }

    static delete(id) {
        const database = getFirebaseDB();
        return new Promise((resolve, reject) => {
            database
                .ref('products')
                .child(id)
                .remove()
                .then(() =>
                    resolve({ message: 'Product deleted succesfully!' }),
                )
                .catch(() =>
                    reject({ message: `Error to delete product! ${id}` }),
                );
        });
    }

    save() {
        const database = getFirebaseDB();
        return new Promise((resolve, reject) => {
            database
                .ref('products')
                .push({
                    title: this.title,
                    price: this.price,
                    stock: this.quantity,
                    detail: this.detail,
                    imageUrl: this.imageUrl,
                })
                .then((result) => {
                    const imageUrl = `${serverConfig.scheme}://${serverConfig.server}${serverConfig.imagePort}/${this.imageUrl}`;
                    resolve({
                        message: 'Product saved succesfully',
                        product: {
                            id: result.key,
                            title: this.title,
                            price: this.price,
                            stock: this.quantity,
                            detail: this.detail,
                            imageUrl: imageUrl,
                        },
                    });
                })
                .catch((error) => {
                    reject({
                        message: 'Error to save product to Firebase',
                        error,
                    });
                });
        });
    }

    update() {
        const database = getFirebaseDB();
        return new Promise((resolve, reject) => {
            const product = {
                title: this.title,
                price: this.price,
                stock: this.quantity,
                details: this.details,
                imageUrl: this.imageUrl,
            };
            database
                .ref('products')
                .child(this.id)
                .update({ ...product })
                .then(() => {
                    if (product.imageUrl) {
                        product.imageUrl = `${serverConfig.scheme}://${serverConfig.server}${serverConfig.imagePort}/${product.imageUrl}`;
                    }
                    resolve({
                        message: 'Product updated succesfully',
                        product: { id: this.id, ...product },
                    });
                })
                .catch((error) => {
                    reject({
                        message: 'Error to update product',
                        error: error,
                    });
                });
        });
    }
};
