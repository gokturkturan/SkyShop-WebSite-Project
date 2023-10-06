import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Paginate from "../components/Paginate";

const Home = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({
    pageNumber,
    keyword,
  });

  return (
    <>
      {keyword && (
        <Link to={"/"} className="btn btn-light mb-2">
          Geri
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          <h1>En Yeni Ürünler</h1>
          <Row>
            {data.products.map(
              (product) =>
                product.name !== "Ürün" && (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                )
            )}
          </Row>
          <Paginate
            numberOfPage={data.numberOfPage}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default Home;
