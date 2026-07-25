const orderServices = require('../../services/user/orderServices');

exports.createOrder = async (req, res) => {
    try {
        const newOrder = await orderServices.createOrder(
            req.body,
            req.user.id
        );

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};


