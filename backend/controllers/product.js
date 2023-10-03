import path from "path";
import fs from "fs";
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

// @desc Edit a product for Admin
// @route PUT /api/products/:id
const editProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const prodId = req.params.id;

  const product = await Product.findById(prodId);

  if (product) {
    if (image !== product.image) {
      clearImage(product.image);
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Ürün bulunamadı.");
  }
});

// @desc Delete a product for Admin
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const prodId = req.params.id;
  const product = await Product.findById(prodId);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Ürün başarıyla silindi." });
  } else {
    res.status(404);
    throw new Error("Ürün bulunamadı.");
  }
});

const clearImage = (filePath) => {
  const __dirname = path.resolve();
  filePath = path.join(__dirname, filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

const productController = {
  getAllProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
};
export default productController;
