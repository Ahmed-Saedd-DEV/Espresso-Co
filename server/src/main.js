require("dotenv").config();

const express = require("express");
const app = express();
const helmet = require("helmet");

const redisClient = require("./config/redis");
const isProduction = process.env.NODE_ENV === "production";

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

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  helmet({
    hsts: isProduction,
  }),
);

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

const startServer = async () => {
  try {
    await redisClient.connect();

    console.log("Redis connected");

    app.listen(PORT, () => {
      console.log(`Server running on port: http://localhost:${PORT}`);
      console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("isProduction:", isProduction);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
