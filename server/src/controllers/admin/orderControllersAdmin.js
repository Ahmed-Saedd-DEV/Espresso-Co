const orderServicesAdmin = require("../../services/admin/orderServicesAdmin");

exports.getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, sort, order, status } = req.query;
    const {
      orders,
      totalPages,
      totalRecords,
      page: activePage,
      limit: activeLimit,
    } = await orderServicesAdmin.getAllOrders({
      page,
      limit,
      sort,
      order,
      status,
    });
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
  const { orderId } = req.params;
  try {
    const order = await orderServicesAdmin.getOrderById(orderId);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await orderServicesAdmin.updateOrderStatus(
      orderId,
      status,
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const updatedOrder = await orderServicesAdmin.deleteOrder(orderId);
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
