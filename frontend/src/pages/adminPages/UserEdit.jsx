import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";

const UserEdit = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: updateUserLoading }] =
    useUpdateUserMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      toast.success("Kullanıcı bilgileri başarıyla güncellendi.");
      refetch();
      navigate("/admin/userlist");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Geri
      </Link>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <h1>Kullanıcıyı Güncelle</h1>
            {updateUserLoading && <Loader />}
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="name">
                  <Form.Label>İsim</Form.Label>
                  <Form.Control
                    type="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="email">
                  <Form.Label>E-Posta</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="isadmin">
                  <Form.Check
                    type="checkbox"
                    label="Admin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  ></Form.Check>
                </Form.Group>

                <Button type="submit" variant="primary">
                  Güncelle
                </Button>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserEdit;
