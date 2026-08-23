const fs = require("fs");
const prisma = require("../../prisma/prismaClient");
const {
  invalidateProductsCache,
} = require("../../utils/cache/productRateLimiter");
const {
  getSafeProductImagePath,
} = require("../../utils/fileUpload/productImagePath");
const AppError = require("../../utils/errors/AppError");

const validateProductData = async (productData) => {
  const payload = productData || {};

  if (payload.price !== undefined) {
    const priceValue = Number(payload.price);
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      throw new AppError("Price must be greater than 0", 400);
    }
  }

  if (payload.stock !== undefined) {
    const stockValue = Number(payload.stock);
    if (!Number.isInteger(stockValue) || stockValue < 0) {
      throw new AppError("Stock must be a non-negative integer", 400);
    }
  }

  if (payload.categoryId !== undefined && payload.categoryId !== null) {
    const categoryIdValue = Number(payload.categoryId);
    if (!Number.isInteger(categoryIdValue) || categoryIdValue <= 0) {
      throw new AppError("Invalid category ID", 400);
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryIdValue },
    });
    if (!category) {
      throw new AppError("Category not found", 404);
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

  await invalidateProductsCache();

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

  await invalidateProductsCache();

  return updatedProduct;
};

exports.deleteProduct = async (productId, userId) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: Number(productId) },
    include: { images: true },
  });

  if (!existingProduct) {
    throw new AppError("Product not found", 404);
  }

  if (userId && existingProduct.userId !== Number(userId)) {
    throw new AppError("Unauthorized", 403);
  }

  for (const image of existingProduct.images || []) {
    try {
      const imagePath = getSafeProductImagePath(image.url);

      await fs.promises.unlink(imagePath);
    } catch (error) {
      console.error(`Failed to delete image file: ${image.url}`, error.message);
    }
  }

  await prisma.product.delete({
    where: { id: Number(productId) },
  });

  await invalidateProductsCache();
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
    throw new AppError("Product not found", 404);
  }

  const uniqueImagePaths = [...new Set(imagePaths)];

  if (uniqueImagePaths.length !== imagePaths.length) {
    throw new AppError("Duplicate image URLs are not allowed", 409);
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
    throw new AppError("This image already exists for this product", 409);
  }

  const currentImageCount = await prisma.image.count({
    where: {
      productId: Number(productId),
    },
  });

  if (currentImageCount + uniqueImagePaths.length > 5) {
    throw new AppError("A product can have at most 5 images", 409);
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
    throw new AppError("Image not found", 404);
  }

  if (existingImage.url) {
    const imagePath = getSafeProductImagePath(existingImage.url);

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
