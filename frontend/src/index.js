import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Provider } from "react-redux";
import store from "./store";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/index.css";
import "./assets/styles/bootstrap.custom.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shipping from "./pages/Shipping";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Payment from "./pages/Payment";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";
import Profile from "./pages/Profile";
import OrderList from "./pages/adminPages/OrderList";
import ProductList from "./pages/adminPages/ProductList";
import ProductEdit from "./pages/adminPages/ProductEdit";
import UserList from "./pages/adminPages/UserList";
import UserEdit from "./pages/adminPages/UserEdit";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index={true} path="/" element={<Home />}></Route>
      <Route path="/search/:keyword" element={<Home />}></Route>
      <Route path="/page/:pageNumber" element={<Home />}></Route>
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<Home />}
      ></Route>
      <Route path="/product/:id" element={<ProductDetails />}></Route>
      <Route path="/cart" element={<Cart />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>

      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<Shipping />}></Route>
        <Route path="/payment" element={<Payment />}></Route>
        <Route path="/placeorder" element={<PlaceOrder />}></Route>
        <Route path="/order/:id" element={<Order />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Route>

      {/* Admin Routes */}
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderList" element={<OrderList />}></Route>
        <Route path="/admin/productList" element={<ProductList />}></Route>
        <Route
          path="/admin/productList/page/:pageNumber"
          element={<ProductList />}
        ></Route>
        <Route path="/admin/editProduct/:id" element={<ProductEdit />}></Route>
        <Route path="/admin/userList" element={<UserList />}></Route>
        <Route path="/admin/userEdit/:id" element={<UserEdit />}></Route>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
