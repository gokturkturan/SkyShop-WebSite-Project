import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword("");
    } else {
      navigate(`/`);
      setKeyword("");
    }
  };

  return (
    <Form onSubmit={searchHandler} className="d-flex my-1">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Ürün ismi giriniz"
        style={{ height: "30px" }}
      ></Form.Control>
      <Button
        type="submit"
        variant="outline-light"
        style={{ height: "30px", padding: "2px 10px" }}
        className=" mx-1"
      >
        Ara
      </Button>
    </Form>
  );
};

export default SearchBox;
