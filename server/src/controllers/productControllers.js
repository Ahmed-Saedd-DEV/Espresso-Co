const productService = require('../services/productServices');

exports.getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body, req.user?.id);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body, req.user?.id);
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id, req.user?.id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    getProducts: exports.getProducts,
    getProductById: exports.getProductById,
    createProduct: exports.createProduct,
    updateProduct: exports.updateProduct,
    deleteProduct: exports.deleteProduct
};