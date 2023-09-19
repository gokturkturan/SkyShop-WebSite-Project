import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={15} md={12} sm={10} lg={7}>
          <CheckoutSteps step1 />
          <h1>Teslimat Adresi</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group id="address" className="my-2" controlId="address">
              <Form.Label>Adres:</Form.Label>
              <Form.Control
                type="text"
                value={address}
                required
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group id="city" className="my-2" controlId="city">
              <Form.Label>Şehir:</Form.Label>
              <Form.Control
                type="text"
                value={city}
                required
                onChange={(e) => {
                  setCity(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group id="postalCode" className="my-2" controlId="postalCode">
              <Form.Label>Posta Kodu:</Form.Label>
              <Form.Control
                type="number"
                value={postalCode}
                required
                onChange={(e) => {
                  setPostalCode(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group id="country" className="my-2" controlId="country">
              <Form.Label>Ülke:</Form.Label>
              <Form.Control
                type="text"
                value={country}
                required
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
              />
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

export default Shipping;
