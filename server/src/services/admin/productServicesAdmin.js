const fs = require("fs");
const path = require("path");
const prisma = require("../../prisma/prismaClient");

const validateProductData = async (productData) => {
  const payload = productData || {};

  if (payload.price !== undefined) {
    const priceValue = Number(payload.price);
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      throw new Error("Price must be greater than 0");
    }
  }

  if (payload.stock !== undefined) {
    const stockValue = Number(payload.stock);
    if (!Number.isInteger(stockValue) || stockValue < 0) {
      throw new Error("Stock must be a non-negative integer");
    }
  }

  if (payload.categoryId !== undefined && payload.categoryId !== null) {
    const categoryIdValue = Number(payload.categoryId);
    if (!Number.isInteger(categoryIdValue) || categoryIdValue <= 0) {
      throw new Error("Invalid category ID");
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryIdValue },
    });
    if (!category) {
      throw new Error("Category not found");
    }
  }
};

exports.createProduct = async (productData, userId) => {
  const { userId: _, ...safeProductData } = productData || {};
  await validateProductData(safeProductData);

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
  await validateProductData(safeProductData);

  const payload = { ...safeProductData };
  if (payload.categoryId === null) {
    payload.categoryId = null;
  }

  const updatedProduct = await prisma.product.update({
    where: { id: Number(productId) },
    data: payload,
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
    where: {
      id: Number(imageId),
    },
  });

  if (!existingImage) {
    throw new Error("Image not found");
  }

  if (existingImage.url) {
    const uploadsDir = path.resolve("uploads/products");
    const imagePath = path.resolve(existingImage.url);

    const isInsideUploads =
      imagePath === uploadsDir || imagePath.startsWith(uploadsDir + path.sep);

    if (!isInsideUploads) {
      throw new Error("Invalid image path");
    }

    try {
      await fs.promises.unlink(imagePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw new Error("Failed to delete image file");
      }
    }
  }

  await prisma.image.delete({
    where: {
      id: Number(imageId),
    },
  });

  return true;
};
