require("dotenv").config();

const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");

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

const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "x-refresh-token",
    "Cookie",
  ],
  exposedHeaders: ["Set-Cookie"],
};

app.use(
  helmet({
    hsts: isProduction,
  }),
);
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.use("/uploads/products", express.static("uploads/products"));

app.use("/auth", authRoutes);
app.use("/products", productsRouters);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/categories", categoryRoutes);
app.use("/admin/categories", categoryRoutesAdmin);
app.use("/admin/products", productRoutesAdmin);
app.use("/admin/users", uesrRoutesAdmin);

app.use(errorHandler);

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
