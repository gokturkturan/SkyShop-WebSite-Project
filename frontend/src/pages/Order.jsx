import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderQuery,
  useGetPaypalClientQuery,
  useUpdateOrderToPaidMutation,
} from "../slices/ordersApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    isError,
  } = useGetOrderQuery(orderId);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: client,
    isLoading: clientLoading,
    isError: clientError,
  } = useGetPaypalClientQuery();

  const [payOrder, { isLoading: loadingPay }] = useUpdateOrderToPaidMutation();

  useEffect(() => {
    if (!clientError && !clientLoading && client.id) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": client.id },
          currency: "TL",
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, client, paypalDispatch, clientError, clientLoading]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Ödeme başarılı.");
      } catch (error) {
        toast.success(error?.data?.message || error.message);
      }
    });
  }

  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();
  //   toast.success("Ödeme başarılı.");
  // }

  function onError(error) {
    toast.error(error.message);
  }
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger" />
  ) : (
    <>
      <h1>Sipariş {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Kargo</h2>
              <p>
                <strong> İsim: </strong> {order.user.name}
              </p>
              <p>
                <strong> E-Posta: </strong> {order.user.email}
              </p>
              <p>
                <strong>Adres: </strong>
                {order.shippingAddress.address},{" "}
                {order.shippingAddress.postalCode}, {order.shippingAddress.city}
                , {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  {order.deliveredAt.slice(0, 19).split("T")[0]}{" "}
                  {order.deliveredAt.slice(0, 19).split("T")[1]} tarihinde
                  teslim edildi.
                </Message>
              ) : (
                <Message variant="danger"> Teslim edilmedi. </Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Ödeme Yöntemi</h2>
              <p>
                <strong>Yöntem: </strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  {order.paidAt.slice(0, 19).split("T")[0]}{" "}
                  {order.paidAt.slice(0, 19).split("T")[1]} tarihinde ödeme
                  yapıldı.
                </Message>
              ) : (
                <Message variant="danger">Ödeme yapılmadı.</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Ürünler</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={4} lg={2} xs={4}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={4} lg={4} xs={10}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4} lg={4} xs={10}>
                      {item.qty} x {item.price} = {item.qty * item.price} TL
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
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
                  <Col>{order.itemsPrice} TL</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Kargo Toplam:</Col>
                  <Col>{order.shippingPrice} TL</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Toplam Sepet:</Col>
                  <Col>{order.totalPrice} TL</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: "10px" }}
                      >
                        Test Pay Order
                      </Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Order;
