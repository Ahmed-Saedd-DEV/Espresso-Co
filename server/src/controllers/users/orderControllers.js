const orderServices = require("../../services/user/orderServices.js");

exports.createOrder = async (req, res) => {
  try {
    const newOrder = await orderServices.createOrder(req.body, req.user.id);

    res.status(201).json(newOrder);
  } catch (error) {
    const statusCode =
      error.message === "Authentication required"
        ? 401
        : error.message === "Insufficient stock" ||
            error.message === "Invalid order items" ||
            error.message === "Invalid total amount"
          ? 409
          : 400;

    res.status(statusCode).json({
      error: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { page, limit, sortBy, order, status } = req.query;
    const { orders, totalPages, totalRecords } = await orderServices.getOrders(
      { page, limit, sortBy, order, status },
      { userId: req.user.id },
    );
    res.status(200).json({
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderServices.getOrderById(
      req.params.orderId,
      req.user.id,
    );
    res.status(200).json(order);
  } catch (error) {
    const statusCode =
      error.message === "Invalid order ID"
        ? 400
        : error.message === "Authentication required"
          ? 401
          : 404;

    res.status(statusCode).json({
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await orderServices.updateOrderStatus(
      req.params.orderId,
      req.body.status,
      req.user.id,
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    const statusCode =
      error.message === "Authentication required"
        ? 401
        : error.message === "Invalid order ID"
          ? 400
          : error.message === "Order not found"
            ? 404
            : 400;

    res.status(statusCode).json({
      error: error.message,
    });
  }
};
