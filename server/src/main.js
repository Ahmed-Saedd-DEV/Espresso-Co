require("dotenv").config();
const express = require("express");
const app = express();

const {
  authRoutes,
  productsRouters,
  cartRoutes,
  orderRoutes,
  reviewRoutes,
  categoryRoutes,
  categoryRoutesAdmin,
  productRoutesAdmin,
  uesrRoutesAdmin,
} = require("./routes/index");

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRoutes);
app.use("/products", productsRouters);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/categories", categoryRoutes);
app.use("/admin/categories", categoryRoutesAdmin);
app.use("/admin/products", productRoutesAdmin);
app.use("/admin/users", uesrRoutesAdmin);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(5000, () => {
  console.log(`Server running on port: http://localhost:5000`);
});
