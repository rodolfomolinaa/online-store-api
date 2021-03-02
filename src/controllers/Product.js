const { rdb } = require('../services/firebase/firebase');
const serverConfig = require('../configs/server-config');

exports.index = async (req, res, next) => {
    rdb.ref('products').once('value', (snapshot) => {
        let products = snapshot.val();
        products = Object.keys(products).map((key) => ({
            id: key,
            ...products[key],
            imageUrl: `${serverConfig.scheme}://${serverConfig.server}:${serverConfig.port}/${products[key].imageUrl}`,
        }));
        res.status(200).json({
            products,
        });
    });
};

exports.show = (req, res, next) => {
    const productId = req.params.id;
    rdb.ref('products')
        .child(productId)
        .once('value', (snapshot) => {
            let product = snapshot.val();

            if (product != null) {
                product.imageUrl = `${serverConfig.scheme}://${serverConfig.server}:${serverConfig.port}/${product.imageUrl}`;
                product = { id: productId, ...product };
                res.status(200).json({
                    product: product,
                });
            }
        });
};

exports.store = (req, res, next) => {
    const title = req.body.title;
    const price = parseFloat(req.body.price);
    const image = req.file;
    if (!image || title == '' || (price || -1) <= 0) {
        return res.status(402).json({
            message: 'Error to add product!',
        });
    }

    const imageUrl = image.path.replace('public/', '');
    const newProduct = {
        title,
        price,
        imageUrl,
    };
    rdb.ref('products')
        .push(newProduct)
        .then((ref) => {
            newProduct.imageUrl = `${serverConfig.scheme}://${serverConfig.server}:${serverConfig.port}/${newProduct.imageUrl}`;
            res.status(201).json({
                message: 'Product created successfully',
                product: { id: ref.key, ...newProduct },
            });
        });
};

exports.update = (req, res, next) => {
    const image = req.file;
    const productId = req.params.id;

    if (image) {
        const imageUrl = image.path.replace('public/', '');
        req.body.imageUrl = imageUrl;
    }

    if (req.body.price) {
        req.body.price = parseFloat(req.body.price);
    }

    rdb.ref('products')
        .child(productId)
        .update({ ...req.body })
        .then(() => {
            if (req.body.image) {
                req.body.imageUrl = `${serverConfig.scheme}://${serverConfig.server}:${serverConfig.port}/${imageUrl}`;
            }
            res.status(200).json({
                id: productId,
                ...req.body,
            });
        })
        .catch(() => {
            res.status(401).json({ message: 'Error to update product' });
        });
};

exports.delete = (req, res, next) => {
    const productId = req.params.id;
    rdb.ref('products')
        .child(productId)
        .remove()
        .then(() =>
            res.status(200).json({ message: 'Product deleted correctly!' }),
        )
        .catch(() =>
            res.status(401).json({ message: 'Error to delete product!' }),
        );
};
