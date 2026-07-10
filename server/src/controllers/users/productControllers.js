const productService = require('../../services/user/productServices');

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


module.exports = {
    getProducts: exports.getProducts,
    getProductById: exports.getProductById,
};