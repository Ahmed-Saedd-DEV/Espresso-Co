const cartService = require("../../services/user/cartServices");

exports.getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cartItem = await cartService.addToCart(
      req.user.id,
      productId,
      quantity,
    );
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
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
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await cartService.removeFromCart(req.user.id, productId);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    next(error);
  }
};
