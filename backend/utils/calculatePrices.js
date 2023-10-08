function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function calculatePrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + (item.price * 100 * item.qty) / 100,
    0
  );

  const shippingPrice = itemsPrice > 1000 ? 0 : 150;

  const totalPrice = itemsPrice + shippingPrice;

  return {
    itemsPrice: addDecimals(itemsPrice),
    shippingPrice: addDecimals(shippingPrice),
    totalPrice: addDecimals(totalPrice),
  };
}
