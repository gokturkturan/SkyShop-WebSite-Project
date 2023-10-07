import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";

const ProductList = () => {
  const navigate = useNavigate();
  const { pageNumber } = useParams();

  const { data, isLoading, refetch, isError } = useGetProductsQuery({
    pageNumber,
  });
  const [createProduct, { isLoading: createProductLoading }] =
    useCreateProductMutation();
  const [deleteProduct, { isLoading: deleteProductLoading }] =
    useDeleteProductMutation();

  const deleteProductHandler = async (productId) => {
    if (window.confirm("Bir ürünü silmek üzeresiniz!")) {
      try {
        await deleteProduct(productId);
        refetch();
        toast.success("Ürün başarıyla silindi.");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Yeni bir ürün oluşturmak üzeresiniz!")) {
      try {
        const { data } = await createProduct();
        navigate(`/admin/editProduct/${data._id}`);
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

      {createProductLoading && <Loader />}
      {deleteProductLoading && <Loader />}
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
              {data.products.map((product) => (
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
          <Paginate
            numberOfPage={data.numberOfPage}
            page={data.page}
            isAdminPage={true}
          />
        </>
      )}
    </>
  );
};

export default ProductList;
