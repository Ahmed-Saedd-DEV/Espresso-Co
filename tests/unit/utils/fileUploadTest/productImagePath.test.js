const path = require("path");
const {
  uploadsDir,
  getSafeProductImagePath,
} = require("../../../../server/src/utils/fileUpload/productImagePath");

describe("getSafeProductImagePath", () => {
  it("returns resolved path for a file inside uploads/products", () => {
    const rel = path.join("uploads", "products", "img.jpg");
    const resolved = path.resolve(rel);

    expect(getSafeProductImagePath(resolved)).toBe(resolved);
  });

  it("accepts nested files inside uploads/products", () => {
    const rel = path.join("uploads", "products", "nested", "img.png");
    const resolved = path.resolve(rel);

    expect(getSafeProductImagePath(resolved)).toBe(resolved);
  });

  it("allows the uploads directory itself", () => {
    const dir = uploadsDir;
    expect(getSafeProductImagePath(dir)).toBe(path.resolve(dir));
  });

  it("throws for paths outside uploads/products", () => {
    const outside = path.resolve("uploads", "other", "img.jpg");
    expect(() => getSafeProductImagePath(outside)).toThrow(
      "Invalid image path",
    );
  });
});
