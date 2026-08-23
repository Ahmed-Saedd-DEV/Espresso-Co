const orderServices = require("../../services/user/orderServices.js");

exports.createOrder = async (req, res, next) => {
  try {
    const newOrder = await orderServices.createOrder(req.body, req.user.id);

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const { page, limit, sort, order, status } = req.query;
    const {
      orders,
      totalPages,
      totalRecords,
      page: activePage,
      limit: activeLimit,
    } = await orderServices.getOrders(
      { page, limit, sort, order, status },
      { userId: req.user.id },
    );
    res.status(200).json({
      data: orders,
      pagination: {
        page: activePage,
        limit: activeLimit,
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await orderServices.getOrderById(
      req.params.orderId,
      req.user.id,
    );
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const updatedOrder = await orderServices.updateOrderStatus(
      req.params.orderId,
      req.body.status,
      req.user.id,
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
