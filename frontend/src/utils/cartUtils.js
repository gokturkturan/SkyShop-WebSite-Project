export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // over 1000TL is free, else 150TL
  state.shippingPrice = addDecimals(state.itemsPrice > 1000 ? 0 : 150);

  // 15% tax
  state.taxPrice = addDecimals(Number(state.itemsPrice * 0.15).toFixed(2));

  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
