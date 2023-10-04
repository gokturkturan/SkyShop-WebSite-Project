import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  useGetProductQuery,
  useSendProductReviewMutation,
} from "../slices/productsApiSlice";
import { addToCart } from "../slices/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const { userInfo } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    refetch,
    isLoading,
    isError,
  } = useGetProductQuery(productId);
  const [sendProductReview, { isLoading: sendReviewLoading }] =
    useSendProductReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await sendProductReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Ürün başarıyla değerlendirildi.");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const reviewLoginHandler = () => {
    navigate(`/login?redirect=/product/${product._id}`);
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Geri
      </Link>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} Değerlendirme`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Fiyat: {product.price} TL</ListGroup.Item>
                <ListGroup.Item>{product.description}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Fiyat: </Col>
                      <Col>
                        <strong>{product.price} TL</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Durum: </Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0 ? "Stokta Var" : "Tükendi"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Adet:</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => {
                              setQty(Number(e.target.value));
                            }}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Sepete Ekle
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review my-4">
            <Col md={6}>
              <h2>Değerlendirmeler</h2>
              {product.reviews.length === 0 && (
                <Message>
                  Bu ürün değerlendirilmemiş. İlk değerlendiren sen ol.
                </Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup>
                ))}
              </ListGroup>
            </Col>
            <Col>
              <ListGroup>
                <h2>Değerlendir</h2>
                {sendReviewLoading && <Loader />}
                {userInfo ? (
                  <Form onSubmit={submitReview}>
                    <Form.Group controlId="rating">
                      <Form.Label>Puan</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                      >
                        <option value="">Seçiniz...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="comment" className="my-2">
                      <Form.Label>Yorum</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                    <Button
                      disabled={sendReviewLoading}
                      type="submit"
                      variant="primary"
                    >
                      Değerlendir
                    </Button>
                  </Form>
                ) : (
                  <Button onClick={reviewLoginHandler}>
                    Yorum Yapmak İçin Giriş Yap
                  </Button>
                )}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductDetails;
