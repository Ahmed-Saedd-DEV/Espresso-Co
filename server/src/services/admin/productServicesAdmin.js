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

exports.getAllProductsAdmin = async (queryParams = {}) => {
  const page = Number(queryParams.page ?? 1);
  const limit = Number(queryParams.limit ?? 10);
  const search = queryParams.search?.trim();
  const categoryId =
    queryParams.categoryId !== undefined &&
    queryParams.categoryId !== null &&
    queryParams.categoryId !== ""
      ? Number(queryParams.categoryId)
      : undefined;

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
  const skip = (safePage - 1) * safeLimit;

  const where = {};

  if (categoryId !== undefined && Number.isFinite(categoryId)) {
    where.categoryId = categoryId;
  }

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        images: true,
      },
    }),
    prisma.product.count({
      where,
    }),
  ]);

  return {
    data: products,
    total,
    page: safePage,
    limit: safeLimit,
  };
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

  try {
    await prisma.$transaction(async (tx) => {
      await tx.cartProduct.deleteMany({
        where: { productId: Number(productId) },
      });

      await tx.product.delete({
        where: { id: Number(productId) },
      });
    });
  } catch (error) {
    if (error?.code === "P2003") {
      throw new AppError(
        "Unable to delete product due to existing references",
        409,
      );
    }

    throw error;
  }

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

  const safeImagePaths = uniqueImagePaths.map((url) => ({
    url,
    resolvedPath: getSafeProductImagePath(url),
  }));

  try {
    await prisma.image.createMany({
      data: safeImagePaths.map(({ url }) => ({
        productId: Number(productId),
        url,
      })),
    });
  } catch (error) {
    await Promise.all(
      safeImagePaths.map(async ({ resolvedPath }) => {
        try {
          await fs.promises.unlink(resolvedPath);
        } catch (unlinkError) {
          if (unlinkError.code !== "ENOENT") {
            console.error(
              `Failed to cleanup uploaded image: ${resolvedPath}`,
              unlinkError.message,
            );
          }
        }
      }),
    );

    throw error;
  }

  const images = await prisma.image.findMany({
    where: {
      productId: Number(productId),
    },
  });

  return images;
};

exports.deleteImageProduct = async (imageId, userId = null) => {
  const existingImage = await prisma.image.findUnique({
    where: {
      id: Number(imageId),
    },
    include: {
      product: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!existingImage) {
    throw new AppError("Image not found", 404);
  }

  if (userId !== null && existingImage.product.userId !== Number(userId)) {
    throw new AppError("Unauthorized", 403);
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
