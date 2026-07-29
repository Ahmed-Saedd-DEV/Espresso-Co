const orderServicesAdmin = require("../../services/admin/orderServicesAdmin");

exports.getAllOrders = async (req, res) => {
  try {
    const { page, limit, sort, order, status } = req.query;
    const { orders, totalPages, totalRecords } = await orderServicesAdmin.getAllOrders(page, limit, sort, order, status);
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
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await orderServicesAdmin.getOrderById(orderId);
    res.status(200).json(order);
  } catch (error) {
    const statusCode =
      error.message === "Order not found" ||
      error.message === "Invalid order ID"
        ? 404
        : 500;

    res.status(statusCode).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await orderServicesAdmin.updateOrderStatus(
      orderId,
      status,
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    const statusCode =
      error.message === "Order not found" ||
      error.message === "Invalid order ID"
        ? 404
        : error.message === "Invalid status" ||
            error.message === "Invalid status transition"
          ? 400
          : 500;

    res.status(statusCode).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const updatedOrder = await orderServicesAdmin.deleteOrder(orderId);
    res.status(200).json(updatedOrder);
  } catch (error) {
    const statusCode =
      error.message === "Order not found" ||
      error.message === "Invalid order ID"
        ? 404
        : 500;

    res.status(statusCode).json({ message: error.message });
  }
};
