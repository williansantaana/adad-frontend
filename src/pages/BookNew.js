import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Toast, ToastContainer } from "react-bootstrap";

export default function CreateBook() {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: "",
    isbn: "",
    pageCount: "",
    publishedDate: "",
    thumbnailUrl: "",
    shortDescription: "",
    longDescription: "",
    status: "DRAFT",
    authors: "",
    categories: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!book.title || !book.isbn || !book.pageCount || !book.status) {
      setToastMessage("Please complete all required fields before submitting.");
      setShowToast(true);
      return;
    }

    const formattedBook = {
      ...book,
      pageCount: parseInt(book.pageCount, 10),
      authors: book.authors.split(",").map((author) => author.trim()),
      categories: book.categories.split(",").map((category) => category.trim()),
    };

    console.log(formattedBook)

    try {
      const response = await fetch(`/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedBook),
      });

      if (response.ok) {
        navigate("/books");
      } else {
        console.error("Failed to create book");
      }
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  return (
    <Container className="pt-5 pb-5">
      <ToastContainer position="bottom-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Validation Error</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      <h2>Create Book</h2>
      <Form onSubmit={handleSubmit}>
        <section className='row'>
          <Form.Group className="mb-3 col-md-4">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={book.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 col-md-4">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="number"
              name="isbn"
              value={book.isbn}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 col-md-4">
            <Form.Label>Page Count</Form.Label>
            <Form.Control
              type="number"
              name="pageCount"
              min="0"
              value={book.pageCount}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 col-md-4">
            <Form.Label>Published Date</Form.Label>
            <Form.Control
              type="date"
              name="publishedDate"
              value={book.publishedDate}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 col-md-4">
            <Form.Label>Thumbnail URL</Form.Label>
            <Form.Control
              type="text"
              name="thumbnailUrl"
              value={book.thumbnailUrl}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 col-md-4">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={book.status}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Status</option>
              <option value="PUBLISH">PUBLISH</option>
              <option value="DRAFT">DRAFT</option>
            </Form.Select>
          </Form.Group>
        </section>

        <Form.Group className="mb-3">
          <Form.Label>Short Description</Form.Label>
          <Form.Control
            as="textarea"
            name="shortDescription"
            value={book.shortDescription}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Long Description</Form.Label>
          <Form.Control
            as="textarea"
            name="longDescription"
            value={book.longDescription}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Authors</Form.Label>
          <Form.Control
            type="text"
            name="authors"
            value={book.authors}
            onChange={handleInputChange}
            placeholder="Separate authors with commas"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Categories</Form.Label>
          <Form.Control
            type="text"
            name="categories"
            value={book.categories}
            onChange={handleInputChange}
            placeholder="Separate categories with commas"
          />
        </Form.Group>

        <Button type="submit" variant="primary">Create Book</Button>
      </Form>
    </Container>
  );
}
