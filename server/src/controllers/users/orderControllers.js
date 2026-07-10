const orderServices = require('../../services/user/orderServices');

exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = await orderServices.createOrder(orderData, req.user?.id);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    createOrder: exports.createOrder
};