require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const app = express();
const helmet = require("helmet");
const cors = require("cors");

const redisClient = require("./config/redis");
const isProduction = process.env.NODE_ENV === "production";

const {
  authRoutes,
  productRoutes,
  cartRoutes,
  orderRoutes,
  reviewRoutes,
  categoryRoutes,
  categoryRoutesAdmin,
  productRoutesAdmin,
  userRoutesAdmin,
  orderRoutesAdmin,
  reviewRoutesAdmin,
} = require("./routes/index");

const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://169.254.116.228:5173",
  "http://169.254.158.177:5173",
  "http://192.168.1.6:5173",
  "http://172.20.128.1:5173",
  "http://172.29.16.1:5173",
  "http://localhost:5000",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  // Refresh tokens are httpOnly cookies: credentialed CORS requires an explicit origin, never '*'.
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

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Espresso API",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "Authentication", description: "User authentication endpoints" },
    ],
  },
  apis: ["./docs/**/*.js", "./docs/**/*.yaml", "./docs/**/*.yml"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/categories", categoryRoutes);
app.use("/admin/categories", categoryRoutesAdmin);
app.use("/admin/products", productRoutesAdmin);
app.use("/admin/users", userRoutesAdmin);
app.use("/admin/orders", orderRoutesAdmin);
app.use("/admin/reviews", reviewRoutesAdmin);

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
