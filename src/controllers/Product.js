const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
    await Product.getAll()
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(400).json({ message: error }));
};

const getProduct = async (req, res, next) => {
    const productId = req.params.id;
    await Product.getById(productId)
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(400).json({ message: error }));
};

const saveProduct = async (req, res, next) => {
    const title = req.body.title;
    const price = parseFloat(req.body.price);
    const details = req.body.details;
    const image = req.file;

    if (!image || title == '' || details == '' || (price || -1) <= 0) {
        return res.status(402).json({
            message: 'Error to add product!',
        });
    }

    const imageUrl = image.path.replace('public/', '');
    const product = new Product(title, price, details, imageUrl);

    await product
        .save()
        .then((response) => res.status(201).json(response))
        .catch((error) => res.status(400).json({ message: error }));
};

const updateProduct = async (req, res, next) => {
    const image = req.file;
    const productId = req.params.id;

    if (image) {
        const imageUrl = image.path.replace('public/', '');
        req.body.imageUrl = imageUrl;
    }

    if (req.body.price) {
        req.body.price = parseFloat(req.body.price);
    }

    const product = new Product(
        req.body.title,
        req.body.price,
        req.body.details,
        req.body.imageUrl,
        productId,
    );
    await product
        .update()
        .then((response) => res.status(201).json(response))
        .catch((error) => res.status(400).json({ message: error }));
};

const deleteProduct = async (req, res, next) => {
    const productId = req.params.id;
    await Product.delete(productId)
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(400).json({ message: error }));
    // rdb.ref('products')
    //     .child(productId)
    //     .remove()
    //     .then(() =>
    //         res.status(200).json({ message: 'Product deleted correctly!' }),
    //     )
    //     .catch(() =>
    //         res.status(401).json({ message: 'Error to delete product!' }),
    //     );
};

module.exports = {
    getProducts,
    getProduct,
    saveProduct,
    updateProduct,
    deleteProduct,
};
