import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

// @desc Create New Order
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("Sepetinizde ürün bulunmamaktadır.");
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map((i) => ({
        ...i,
        product: i._id,
        _id: undefined,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });
    orderItems.map(async (i) => {
      const product = await Product.findById(i._id);
      product.countInStock = product.countInStock - i.qty;
      await product.save();
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc Get Orders of User
// @route GET /api/orders/myOrders
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc Get Order by ID
// @route GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Sipariş bulunamadı.");
  }
});

// @desc Update Order to Paid
// @route PUT /api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Sipariş bulunamadı.");
  }
});

// @desc Update Order to Delivered for Admin
// @route PUT /api/orders/:id/deliver
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Sipariş bulunamadı.");
  }
});

// @desc Get All Orders for Admin
// @route GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "id name");
  res.status(200).json(orders);
});

const orderController = {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
};
export default orderController;
