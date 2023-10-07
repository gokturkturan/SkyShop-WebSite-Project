import React from "react";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

const ProductCarousel = () => {
  const { data: products, isLoading, isError } = useGetTopProductsQuery();
  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">{isError}</Message>
  ) : (
    <Carousel pause="hover" className="bg-primary mb-4">
      {products.map((p) => (
        <Carousel.Item key={p._id}>
          <Link to={`/product/${p._id}`}>
            <Image src={p.image} alt={p.name}></Image>
            <Carousel.Caption className="carousel-caption">
              <h2>
                {p.name} ({p.price} TL)
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
