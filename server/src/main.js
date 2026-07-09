const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const productsRouters = require('./routes/productsRouters');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/products', productsRouters);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(5000, () => {
    console.log(`Server running on port: http://localhost:5000`);
});