const fs = require("fs");
const path = require("path");
const productService = require("../../services/admin/productServicesAdmin");
const {
  getSafeProductImagePath,
} = require("../../utils/fileUpload/productImagePath");

exports.getAllProductsAdmin = async (req, res, next) => {
  try {
    const result = await productService.getAllProductsAdmin(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await productService.createProduct(
      req.body,
      req.user?.id,
    );
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body,
      req.user?.id,
    );
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id, req.user?.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.createImageProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    if (!req.files || req.files.length === 0) {
      throw new Error("Please upload at least one image");
    }

    const imagePaths = req.files.map((file) =>
      path.posix.join("uploads", "products", file.filename),
    );

    try {
      const newImageProduct = await productService.createImageProduct(
        productId,
        imagePaths,
      );

      return res.status(201).json(newImageProduct);
    } catch (error) {
      await Promise.all(
        req.files.map(async (file) => {
          try {
            const safePath = getSafeProductImagePath(file.path);
            await fs.promises.unlink(safePath);
          } catch (unlinkError) {
            if (unlinkError.code !== "ENOENT") {
              console.error(
                `Failed to cleanup uploaded file: ${file.path}`,
                unlinkError.message,
              );
            }
          }
        }),
      );

      throw error;
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteImageProduct = async (req, res, next) => {
  try {
    await productService.deleteImageProduct(req.params.imageId, req.user?.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
