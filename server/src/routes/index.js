const authRoutes = require("./authRoutes");
const productRoutes = require("./user/productRoutes");
const cartRoutes = require("./user/cartRoutes");
const orderRoutes = require("./user/orderRoutes");
const reviewRoutes = require("./user/reviewRoutes");
const categoryRoutes = require("./user/categoryRoutes");
const categoryRoutesAdmin = require("./admin/categoryRoutesAdmin");
const productRoutesAdmin = require("./admin/productRoutesAdmin");
const userRoutesAdmin = require("./admin/userRoutesAdmin");
const orderRoutesAdmin = require("./admin/orderRoutesAdmin");
const reviewRoutesAdmin = require("./admin/reviewRoutesAdmin");

module.exports = {
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
};
