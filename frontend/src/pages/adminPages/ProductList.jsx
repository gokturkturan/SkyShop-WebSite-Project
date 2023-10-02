import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetProductsQuery,
  useCreateProductMutation,
} from "../../slices/productsApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const ProductList = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [createProduct, { isLoading: createProductLoading }] =
    useCreateProductMutation();

  const deleteProductHandler = (productId) => {
    console.log("asd");
  };

  const createProductHandler = async () => {
    if (window.confirm("Yeni bir ürün oluşturmak üzeresiniz!")) {
      try {
        const { data } = await createProduct();
        navigate(`/admin/product/${data._id}/edit`);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Ürünler</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={() => createProductHandler()}>
            <FaEdit />
            Ürün Ekle
          </Button>
        </Col>
      </Row>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{isError}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ürün Adı</th>
                <th>Fiyat</th>
                <th>Kategori</th>
                <th>Marka</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/editProduct/${product._id}`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteProductHandler(product._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ProductList;
