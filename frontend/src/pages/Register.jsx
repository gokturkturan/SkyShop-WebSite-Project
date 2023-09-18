import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.user);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Şifreler uyuşmuyor.");
      return;
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={15} md={8} sm={10} lg={4}>
          <h1>Kayıt Ol</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group id="name" className="my-2" controlId="name">
              <Form.Label>İsim</Form.Label>
              <Form.Control
                type="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group id="email" className="my-2" controlId="email">
              <Form.Label>E-Posta</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group id="password" className="my-2" controlId="password">
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group
              id="confirmPassword"
              className="my-2"
              controlId="confirmPassword"
            >
              <Form.Label>Şifre Tekrar</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="mt-2"
              disabled={isLoading}
            >
              Kayıt Ol
            </Button>
            {isLoading && <Loader />}
          </Form>
          <Row className="py-3">
            <Col>
              Zaten bir hesabın var mı ?{" "}
              <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                Giriş Yap!
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
