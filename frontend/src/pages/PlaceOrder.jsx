import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCart } from "../slices/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const cart = useSelector((state) => state.cart);
  const {
    cartItems,
    paymentMethod,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = cart;

  useEffect(() => {
    if (!paymentMethod) {
      navigate("/payment");
    } else if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, paymentMethod, shippingAddress]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice,
      }).unwrap();
      dispatch(clearCart());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Teslimat Adresi</h2>
              <p>
                <strong>Adres:</strong>
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Ödeme Yönetmi</h2>
              <strong>Yöntem: </strong>
              {paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Ürünler</h2>
              {cartItems.length === 0 ? (
                <Message>Sepetinizde ürün bulunmamaktadır.</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={4} lg={3} xs={5}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.price} x {item.qty} = {item.qty * item.price} TL
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Sipariş Özeti</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Ürünün Toplamı:</Col>
                  <Col>{itemsPrice} TL</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Kargo Toplam:</Col>
                  <Col>{shippingPrice} TL</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Toplam Sepet:</Col>
                  <Col>{totalPrice} TL</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <Card>
            <Button
              type="button"
              className="btn-block"
              disabled={cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              Sipariş Ver
            </Button>
            {isLoading && <Loader />}
          </Card>
          <ListGroup.Item>
            {error && <Message variant="danger">{error}</Message>}
          </ListGroup.Item>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrder;
