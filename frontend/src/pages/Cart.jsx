import React from "react";
import {
  Col,
  Row,
  Button,
  ListGroup,
  Image,
  Form,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, itemsPrice, shippingPrice } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkOutHandler = async () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Row>
      <h1>
        Sepetim
        {` (${cartItems.reduce((acc, item) => acc + item.qty, 0)} ürün)`}
        {cartItems.length !== 0 && (
          <Link to={"/"}>
            <Button type="button" className="btn-block">
              Alışverişe Devam Et
            </Button>
          </Link>
        )}
      </h1>
      <Col>
        {cartItems.length > 0 ? (
          <>
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>{item.price} TL</Col>
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} adet
                          </option>
                        ))}
                        {item.qty} adet
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item._id)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        ) : (
          cartItems.length === 0 && (
            <Message>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Sepetinizde ürün bulunmamaktadır.</span>
                <Link to={"/"}>
                  <Button>Alışverişe Başla</Button>
                </Link>
              </div>
            </Message>
          )
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Sipariş Özeti</h2>
              <Row>
                <Col>Ürünün Toplamı:</Col>
                <Col>
                  <span style={{ color: "black", fontWeight: "600" }}>
                    {itemsPrice ? itemsPrice : "0.00"} TL
                  </span>
                </Col>
              </Row>
              <Row>
                <Col>Kargo Toplam:</Col>
                <Col>
                  <span
                    style={{
                      color: shippingPrice > 0 ? "red" : "green",
                      fontWeight: "600",
                    }}
                  >
                    {cartItems.length === 0 ? "0.00" : shippingPrice} TL
                  </span>
                  {shippingPrice === Number(0).toFixed(2)
                    ? " (1000 TL ve Üzeri Kargo Bedava)"
                    : ""}
                </Col>
              </Row>
              <Row>
                <Col>Toplam Sepet:</Col>
                <Col>
                  <span style={{ color: "orange", fontWeight: "600" }}>
                    {itemsPrice ? itemsPrice : "0.00"} TL
                  </span>
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card>
        <Card>
          <Button
            type="button"
            className="btn-block"
            disabled={cartItems.length === 0}
            onClick={checkOutHandler}
          >
            Sepeti Onayla
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default Cart;
