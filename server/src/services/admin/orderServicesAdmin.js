const prisma = require("../../prisma/prismaClient");
const orderUtils = require("../../utils/orderUtils");
const pagination = require("../../utils/queryFeatures/pagination");
const sort = require("../../utils/queryFeatures/sort");
const filter = require("../../utils/queryFeatures/filter");

const getAllOrders = async (page, limit, sortBy, order, status) => {
  const where = filter.getFiltered( {status}, { },);
  const totalRecords = await prisma.order.count({ where });
  const { skip, take, totalPages } = pagination.getPagination(
    page,
    limit,
    totalRecords,
  );
  const whiteList = ["name", "price", "stock", "createdAt", "updatedAt"];
  const sorting = sort.getSorting(sortBy, order, whiteList);

  const orders = await prisma.order.findMany({
    where,
    include: {
      orderItems: true,
    },
    skip,
    take,
    orderBy: sorting,
  });
  return { orders, totalPages, totalRecords };
};

const getOrderById = async (orderId) => {
  const id = Number(orderId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid order ID");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

const updateOrderStatus = async (orderId, status) => {
  const id = Number(orderId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid order ID");
  }

  const normalizedStatus = (status || "").toUpperCase();
  const allowedStatuses = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  const validTransitions = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!allowedStatuses.includes(normalizedStatus)) {
    throw new Error("Invalid status");
  }

  return prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    const currentStatus = existingOrder.status.toUpperCase();
    const allowedNextStatuses = validTransitions[currentStatus] || [];

    if (!allowedNextStatuses.includes(normalizedStatus)) {
      throw new Error("Invalid status transition");
    }

    if (normalizedStatus === "CANCELLED" && currentStatus !== "CANCELLED") {
      const orderItems = existingOrder.orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await orderUtils.updateIncreaseStock(orderItems, tx);
    }

    return tx.order.update({
      where: { id },
      data: { status: normalizedStatus },
      include: {
        orderItems: true,
      },
    });
  });
};

const deleteOrder = async (orderId) => {
  const id = Number(orderId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid order ID");
  }

  try {
    return await prisma.order.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("Order not found");
    }
    throw error;
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
