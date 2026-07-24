const fs = require("fs");
const path = require("path");
const prisma = require("../../prisma/prismaClient");

exports.createProduct = async (productData, userId) => {
  const { userId: _, ...safeProductData } = productData || {};

  const newProduct = await prisma.product.create({
    data: {
      ...safeProductData,
      userId: Number(userId),
    },
  });

  return newProduct;
};

exports.updateProduct = async (productId, productData, userId) => {
  const { userId: _, ...safeProductData } = productData || {};

  const updatedProduct = await prisma.product.update({
    where: { id: Number(productId) },
    data: {
      ...safeProductData,
      ...(userId ? { userId: Number(userId) } : {}),
    },
  });

  return updatedProduct;
};

exports.deleteProduct = async (productId, userId) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: Number(productId) },
    include: { images: true },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  if (userId && existingProduct.userId !== Number(userId)) {
    throw new Error("Unauthorized");
  }

  for (const image of existingProduct.images || []) {
    const imagePath = path.resolve(image.url);

    try {
      await fs.promises.unlink(imagePath);
    } catch (error) {
      console.error(`Failed to delete image file: ${imagePath}`, error.message);
    }
  }

  await prisma.product.delete({
    where: { id: Number(productId) },
  });
};

exports.createImageProduct = async (productId, imagePaths) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
    select: {
      id: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const uniqueImagePaths = [...new Set(imagePaths)];

  if (uniqueImagePaths.length !== imagePaths.length) {
    throw new Error("Duplicate image URLs are not allowed");
  }

  const existingImages = await prisma.image.findMany({
    where: {
      productId: Number(productId),
    },
    select: {
      url: true,
    },
  });

  const existingUrls = new Set(existingImages.map((image) => image.url));

  const duplicateExisting = uniqueImagePaths.find((url) =>
    existingUrls.has(url),
  );

  if (duplicateExisting) {
    throw new Error("This image already exists for this product");
  }

  const currentImageCount = await prisma.image.count({
    where: {
      productId: Number(productId),
    },
  });

  if (currentImageCount + uniqueImagePaths.length > 5) {
    throw new Error("A product can have at most 5 images");
  }

  await prisma.image.createMany({
    data: uniqueImagePaths.map((url) => ({
      productId: Number(productId),
      url,
    })),
  });

  const images = await prisma.image.findMany({
    where: {
      productId: Number(productId),
    },
  });

  return images;
};

exports.deleteImageProduct = async (imageId) => {
  const existingImage = await prisma.image.findUnique({
    where: { id: Number(imageId) },
  });

  if (!existingImage) {
    throw new Error("Image not found");
  }

  if (existingImage.url) {
    const imagePath = path.resolve(existingImage.url);

    try {
      await fs.promises.unlink(imagePath);
    } catch (error) {
      console.error(`Failed to delete image file: ${imagePath}`, error.message);
    }
  }

  await prisma.image.delete({
    where: { id: Number(imageId) },
  });

  return true;
};
