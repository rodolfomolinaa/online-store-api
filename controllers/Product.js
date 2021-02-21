const products = require('../models/Products');

exports.index = (req, res, next) => {
    console.log('index request');
    res.status(200).json({
        products,
    });
};

exports.show = (req, res, next) => {
    const productId = req.params.id;
    const found = products.some((product) => product.id == productId);
    if (found) {
        res.status(200).json(
            products.filter((product) => product.id == productId),
        );
    } else {
        res.status(400).json({ msg: `No product with the id of ${productId}` });
    }
};

exports.store = (req, res, next) => {};

exports.update = (req, res, next) => {};

exports.delete = (req, res, next) => {};
