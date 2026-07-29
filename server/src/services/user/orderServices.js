const { Prisma } = require("@prisma/client");
const prisma = require("../../prisma/prismaClient");
const orderUtils = require("../../utils/orderUtils");

const createOrder = async (orderData, userId) => {
  if (!userId) {
    throw new Error("Authentication required");
  }

  const items = orderData.items;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No order items provided");
  }

  const normalizedItems = items.map((item) => ({
    productId: Number(item.productId),
    quantity: Number(item.quantity ?? 1),
  }));

  const mergedItems = normalizedItems.reduce((acc, item) => {
    const existingItem = acc.find(
      (entry) => entry.productId === item.productId,
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
      return acc;
    }

    acc.push({ ...item });
    return acc;
  }, []);

  const invalidItem = mergedItems.some(
    (item) =>
      !Number.isInteger(item.productId) ||
      item.productId <= 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0,
  );

  if (invalidItem) {
    throw new Error("Invalid order items");
  }

  const productIds = [...new Set(mergedItems.map((item) => item.productId))];

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (products.length !== productIds.length) {
    throw new Error("One or more products not found");
  }

  const orderItems = mergedItems.map((item) => {
    const product = products.find((product) => product.id === item.productId);

    return {
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const total = orderItems.reduce(
    (sum, item) => sum.plus(item.price.mul(item.quantity)),
    new Prisma.Decimal(0),
  );

  if (total.lte(0)) {
    throw new Error("Invalid total amount");
  }

  return prisma.$transaction(async (tx) => {
    await orderUtils.checkStock(mergedItems, tx);

    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
      },
    });

    await tx.orderItem.createMany({
      data: orderItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    await orderUtils.updateDecreaseStock(mergedItems, tx);

    return tx.order.findUnique({
      where: {
        id: order.id,
      },
      include: {
        orderItems: true,
      },
    });
  });
};

const getOrders = async (userId) => {
  if (!userId) {
    throw new Error("Authentication required");
  }
  return prisma.order.findMany({
    where: { userId },
    include: { orderItems: true },
  });
};

const getOrderById = async (orderId, userId) => {
  if (!userId) {
    throw new Error("Authentication required");
  }

  const id = Number(orderId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid order ID");
  }

  return prisma.order.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      orderItems: true,
    },
  });
};

const updateOrderStatus = async (orderId, status, userId) => {
  if (!userId) {
    throw new Error("Authentication required");
  }

  const id = Number(orderId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid order ID");
  }

  const normalizedStatus = (status || "").toUpperCase();

  if (normalizedStatus !== "CANCELLED") {
    throw new Error("Only cancellation is allowed for users");
  }

  return prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: true,
      },
    });

    if (!existingOrder || existingOrder.userId !== userId) {
      throw new Error("Order not found");
    }

    if (existingOrder.status !== "PENDING") {
      throw new Error("Only pending orders can be cancelled");
    }

    const orderItems = existingOrder.orderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    await orderUtils.updateIncreaseStock(orderItems, tx);

    return tx.order.update({
      where: {
        id,
      },
      data: {
        status: normalizedStatus,
      },
      include: {
        orderItems: true,
      },
    });
  });
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
