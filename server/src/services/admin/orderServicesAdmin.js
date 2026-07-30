const prisma = require("../../prisma/prismaClient");
const orderUtils = require("../../utils/orderUtils");
const pagination = require("../../utils/queryFeatures/pagination");
const sort = require("../../utils/queryFeatures/sort");
const filter = require("../../utils/queryFeatures/filter");

const getAllOrders = async ({
  page,
  limit,
  sort: sortField,
  order,
  status,
}) => {
  const where = filter.getFiltered({ status }, {});
  const totalRecords = await prisma.order.count({ where });
  const paginationData = pagination.getPagination(page, limit, totalRecords);
  const whiteList = ["id", "total", "status", "createdAt", "updatedAt"];
  const normalizedSort = sort.resolveSortQuery({ sort: sortField, order });
  const sorting = sort.getSorting(
    normalizedSort.sort,
    normalizedSort.order,
    whiteList,
  );

  const orders = await prisma.order.findMany({
    where,
    include: {
      orderItems: true,
    },
    skip: paginationData.skip,
    take: paginationData.take,
    orderBy: sorting,
  });

  return {
    orders,
    totalPages: paginationData.totalPages,
    totalRecords,
    page: paginationData.page,
    limit: paginationData.limit,
  };
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

  return prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    if (existingOrder.status === "CANCELLED") {
      throw new Error("Order is already cancelled");
    }

    const orderItems = existingOrder.orderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    await orderUtils.updateIncreaseStock(orderItems, tx);

    return tx.order.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: { orderItems: true },
    });
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
