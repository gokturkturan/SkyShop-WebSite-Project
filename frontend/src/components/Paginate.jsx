import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ numberOfPage, page, isAdminPage = false }) => {
  return (
    numberOfPage > 1 && (
      <Pagination className="justify-content-center">
        {[...Array(numberOfPage).keys()].map((p) => (
          <LinkContainer
            key={p + 1}
            to={
              !isAdminPage
                ? `/page/${p + 1}`
                : `/admin/productList/page/${p + 1}`
            }
          >
            <Pagination.Item active={p + 1 === page}>{p + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
