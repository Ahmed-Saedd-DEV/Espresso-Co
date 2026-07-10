const authRoutes = require('./authRoutes');
const productsRouters = require('./user/productsRouters');
const cartRoutes = require('./user/cartRoutes');
const orderRoutes = require('./user/orderRoutes');
const reviewRoutes = require('./user/reviewRoutes');
const categoryRoutes = require('./user/categoryRoutes');
const categoryRoutesAdmin = require('./admin/categoryRoutesAdmin');
const productRoutesAdmin = require('./admin/productsRoutersAdmin');

module.exports = {
    authRoutes,
    productsRouters,
    cartRoutes,
    orderRoutes,
    reviewRoutes,
    categoryRoutes,
    categoryRoutesAdmin,
    productRoutesAdmin
};
