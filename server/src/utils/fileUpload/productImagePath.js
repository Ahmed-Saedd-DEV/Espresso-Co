const path = require("path");

const uploadsDir = path.resolve("uploads/products");

const getSafeProductImagePath = (imageUrl) => {
  const imagePath = path.resolve(imageUrl);

  const isInsideUploads =
    imagePath === uploadsDir ||
    imagePath.startsWith(uploadsDir + path.sep);

  if (!isInsideUploads) {
    throw new Error("Invalid image path");
  }

  return imagePath;
};

module.exports = {
  uploadsDir,
  getSafeProductImagePath,
};