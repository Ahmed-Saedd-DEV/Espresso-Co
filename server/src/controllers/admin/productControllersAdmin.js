const fs = require("fs");
const path = require("path");
const productService = require("../../services/admin/productServicesAdmin");

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await productService.createProduct(
      req.body,
      req.user?.id,
    );
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body,
      req.user?.id,
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id, req.user?.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createImageProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!req.files || req.files.length === 0) {
      throw new Error("Please upload at least one image");
    }

    const imagePaths = req.files.map((file) =>
      path.posix.join("uploads", "products", file.filename)
    );

    try {
      const newImageProduct = await productService.createImageProduct(
        productId,
        imagePaths
      );

      return res.status(201).json(newImageProduct);
    } catch (error) {
      // DB failed → delete uploaded files
      await Promise.all(
        req.files.map(async (file) => {
          try {
            await fs.promises.unlink(file.path);
          } catch (unlinkError) {
            console.error(
              `Failed to cleanup uploaded file: ${file.path}`,
              unlinkError.message
            );
          }
        })
      );

      throw error;
    }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

exports.deleteImageProduct = async (req, res) => {
  try {
    await productService.deleteImageProduct(req.params.imageId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

