const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', productController.saveProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
