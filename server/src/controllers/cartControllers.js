const cartService = require('../services/cartServices');

exports.getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cartItem = await cartService.addToCart(req.user.id, productId, quantity);
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const updatedCartItem = await cartService.updateCartItem(req.user.id, id, quantity);
        res.json(updatedCartItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        await cartService.removeFromCart(req.user.id, id);
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCart: exports.getCart,
    addToCart: exports.addToCart,
    updateCartItem: exports.updateCartItem,
    removeFromCart: exports.removeFromCart
};