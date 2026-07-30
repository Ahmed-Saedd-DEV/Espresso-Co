const prisma = require("../../prisma/prismaClient");

const getCart = async (userId) => {
  return await prisma.cart.findUnique({
    where: { userId: Number(userId) },
    include: { items: true },
  });
};

const validateQuantity = (quantity) => {
  const parsedQuantity = Number(quantity);

  if (!Number.isInteger(parsedQuantity)) {
    throw new Error("Invalid quantity");
  }

  if (parsedQuantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  return parsedQuantity;
};

const validateProductId = (productId) => {
  const parsedProductId = Number(productId);

  if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
    throw new Error("Invalid product ID");
  }

  return parsedProductId;
};

const addToCart = async (userId, productId, quantity) => {
  const cart = await prisma.cart.upsert({
    where: { userId: Number(userId) },
    update: {},
    create: { userId: Number(userId) },
  });

  const parsedProductId = validateProductId(productId);
  const parsedQuantity = validateQuantity(quantity);

  const product = await prisma.product.findUnique({
    where: { id: parsedProductId },
    select: { id: true, stock: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const existingCartItem = await prisma.cartProduct.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: parsedProductId,
      },
    },
  });

  const nextQuantity = (existingCartItem?.quantity || 0) + parsedQuantity;

  if (nextQuantity > product.stock) {
    throw new Error("Insufficient stock");
  }

  return await prisma.cartProduct.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: parsedProductId,
      },
    },
    update: {
      quantity: nextQuantity,
    },
    create: {
      cartId: cart.id,
      productId: parsedProductId,
      quantity: parsedQuantity,
    },
  });
};

const updateCartItem = async (userId, productId, quantity) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: Number(userId) },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const parsedProductId = validateProductId(productId);
  const parsedQuantity = validateQuantity(quantity);

  const existingCartItem = await prisma.cartProduct.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: parsedProductId,
      },
    },
  });

  if (!existingCartItem) {
    throw new Error("Cart item not found");
  }

  const product = await prisma.product.findUnique({
    where: { id: parsedProductId },
    select: { id: true, stock: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (parsedQuantity > product.stock) {
    throw new Error("Insufficient stock");
  }

  return await prisma.cartProduct.update({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: parsedProductId,
      },
    },
    data: { quantity: parsedQuantity },
  });
};

const removeFromCart = async (userId, productId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: Number(userId) },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const parsedProductId = validateProductId(productId);

  const existingCartItem = await prisma.cartProduct.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: parsedProductId,
      },
    },
  });

  if (!existingCartItem) {
    throw new Error("Cart item not found");
  }

  return await prisma.cartProduct.delete({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: parsedProductId,
      },
    },
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
