import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductQuery,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";

const ProductEdit = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [newImage, setNewImage] = useState("");

  const {
    data: product,
    isLoading: getProductLoading,
    refetch,
    isError: getProductError,
  } = useGetProductQuery(productId);

  const [updateProduct, { isLoading: updateLoading }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: uploadLoading }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const updateProductHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      };
      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);
        const res = await uploadProductImage(formData).unwrap();
        updatedProduct.image = res.image;
      }
      await updateProduct(updatedProduct).unwrap();
      toast.success("Ürün Güncellendi.");
      refetch();
      navigate("/admin/productList");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  return (
    <>
      <Link to="/admin/productList" className="btn btn-light my-3">
        Geri
      </Link>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <h1>Ürünü Güncelle</h1>
            {updateLoading && <Loader />}
            {getProductLoading ? (
              <Loader />
            ) : getProductError ? (
              <Message variant="danger">{getProductError}</Message>
            ) : (
              <Form onSubmit={updateProductHandler}>
                <Form.Group controlId="name" className="my-2">
                  <Form.Label>İsim</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="price" className="my-2">
                  <Form.Label>Fiyat</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="image" className="my-2">
                  <Form.Label>Resim</Form.Label>
                  <Form.Control
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <Form.Control
                    type="file"
                    label="Resmi seçiniz"
                    onChange={(e) => setNewImage(e.target.files[0])}
                  ></Form.Control>
                  {uploadLoading && <Loader />}
                </Form.Group>

                <Form.Group controlId="brand" className="my-2">
                  <Form.Label>Marka</Form.Label>
                  <Form.Control
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="category" className="my-2">
                  <Form.Label>Kategori</Form.Label>
                  <Form.Control
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="countInStock" className="my-2">
                  <Form.Label>Stok</Form.Label>
                  <Form.Control
                    type="number"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="description" className="my-2">
                  <Form.Label>Açıklama</Form.Label>
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="my-2">
                  Ürünü Güncelle
                </Button>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductEdit;
