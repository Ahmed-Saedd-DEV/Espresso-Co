const cartService = require("../../services/user/cartServices");

exports.getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cartItem = await cartService.addToCart(
      req.user.id,
      productId,
      quantity,
    );
    res.status(201).json(cartItem);
  } catch (error) {
    const statusCode =
      error.message === "Product not found"
        ? 404
        : error.message === "Insufficient stock" ||
            error.message === "Invalid product ID" ||
            error.message === "Invalid quantity"
          ? 409
          : 400;

    res.status(statusCode).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const updatedCartItem = await cartService.updateCartItem(
      req.user.id,
      productId,
      quantity,
    );
    res.json(updatedCartItem);
  } catch (error) {
    const statusCode =
      error.message === "Cart item not found"
        ? 404
        : error.message === "Insufficient stock" ||
            error.message === "Invalid quantity" ||
            error.message === "Invalid product ID"
          ? 409
          : 400;

    res.status(statusCode).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    await cartService.removeFromCart(req.user.id, productId);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    const statusCode = error.message === "Cart item not found" ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
};
