export default function caclTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    // product can be deleted, but they could still be inside cart
    if (!cartItem.product) return tally;

    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
}
