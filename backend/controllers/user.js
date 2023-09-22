import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register User
// @route   POST /api/users/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const isUserRegistered = await User.findOne({ email });
  if (isUserRegistered) {
    res.status(400);
    throw new Error("Bu e-posta adresi kullanılmaktadır.");
  }

  const user = await User.create({ name, email, password });
  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Kayıt gerçekleştirilemedi.");
  }
});

// @desc    Login User
// @route   POST /api/users/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.checkPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("E-posta ya da Şifre hatalı.");
  }
});

// @desc    Logout User
// @route   POST /api/users/logout
const logout = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Çıkış yapıldı." });
};

// @desc    Get User Profile
// @route   GET /api/users/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı");
  }
});

// @desc    Update User Profile
// @route   PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı.");
  }
});

// @desc    Get All Users for Admin
// @route   GET /api/users
const getAllUsers = asyncHandler(async (req, res) => {
  res.send("getAllUsers");
});

// @desc    Delete User for Admin
// @route   DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  res.send("deleteUser");
});

// @desc    Get User for Admin
// @route   GET /api/users/:id
const getUser = asyncHandler(async (req, res) => {
  res.send("getUser");
});

// @desc    Update User for Admin
// @route   PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
  res.send("updateUser");
});

const userController = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  getUser,
  updateUser,
};

export default userController;
