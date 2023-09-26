import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/product.js";

// @desc Fetch all products
// @route GET /api/products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// @desc Fetch a product
// @route GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Ürün bulunamadı.");
  }
  res.json(product);
});

// @desc Create a product for Admin
// @route POST /api/products/
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Ürün",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Marka",
    category: "Kategori",
    countInStock: 0,
    numReviews: 0,
    description: "Açıklama",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const productController = { getAllProducts, getProduct, createProduct };
export default productController;
