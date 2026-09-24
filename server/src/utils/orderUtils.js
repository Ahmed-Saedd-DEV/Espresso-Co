const prisma = require("../prisma/prismaClient");
const AppError = require("../utils/errors/AppError");

const checkStock = async (orderItems, tx = prisma) => {
  const productIds = [...new Set(orderItems.map((item) => item.productId))];

  const products = await tx.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  orderItems.forEach((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new AppError(`Product not found: ${item.productId}`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for product ${item.productId}`,
        409,
      );
    }
  });

  return products;
};

const updateDecreaseStock = async (orderItems, tx) => {
  await Promise.all(
    orderItems.map(async (item) => {
      const result = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (result.count !== 1) {
        throw new Error(`Failed to update stock for product ${item.productId}`);
      }
    }),
  );

  return true;
};

const updateIncreaseStock = async (orderItems, tx) => {
  await Promise.all(
    orderItems.map(async (item) => {
      const result = await tx.product.updateMany({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });

      if (result.count !== 1) {
        throw new Error(
          `Failed to restore stock for product ${item.productId}`,
        );
      }
    }),
  );

  return true;
};

module.exports = {
  checkStock,
  updateDecreaseStock,
  updateIncreaseStock,
};
