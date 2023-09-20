import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { savePaymentMethod } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={15} md={12} sm={10} lg={7}>
          <CheckoutSteps step1 step2 step3 />
          <h1>Ödeme Türü</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group
              id="paymentMethod"
              className="my-2"
              controlId="paymentMethod"
            >
              <Col>
                <Form.Check
                  type="radio"
                  label="PayPal ya da Kredi Kartı"
                  id="PayPal"
                  name="paymentMethod"
                  value="PayPal"
                  checked
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-2">
              Devam Et
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
