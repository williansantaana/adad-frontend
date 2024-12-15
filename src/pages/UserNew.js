import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Table, Toast, ToastContainer } from "react-bootstrap";
import Select from "react-select";
import {FaPlus, FaRegTrashAlt} from "react-icons/fa";

export default function CreateUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    year_of_birth: "",
    job: "",
    reviews: [],
  });
  const [books, setBooks] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const getBooks = async () => {
    try {
      const response = await fetch(`http://localhost:3000/books/simple-list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();
      setBooks(data.map(book => ({ value: book._id, label: book.title })));
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleReviewChange = (index, field, value) => {
    const updatedReviews = [...user.reviews];
    updatedReviews[index][field] = field === "recommendation" ? value === "true" : value;
    setUser({ ...user, reviews: updatedReviews });
  };

  const handleDeleteReview = (index) => {
    const updatedReviews = user.reviews.filter((_, i) => i !== index);
    setUser({ ...user, reviews: updatedReviews });
  };

  const handleAddReview = () => {
    const newReview = { book_id: "", score: "", recommendation: true, review_date: new Date().getTime().toString() };
    setUser({ ...user, reviews: [...user.reviews, newReview] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate new reviews
    const hasIncompleteReview = user.reviews.some(review =>
      !review.book_id || review.score === "" || review.recommendation === ""
    );

    if (hasIncompleteReview) {
      setToastMessage("Please complete all fields in the reviews before submitting.");
      setShowToast(true);
      return;
    }

    console.log(user)

    try {
      const response = await fetch(`/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        navigate("/users");
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const availableBooks = books.filter(book => !user.reviews.some(review => review.book_id === book.value));

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
      <h2>Create User</h2>
      <Form onSubmit={handleSubmit}>
        <section className='row'>
          <Form.Group className="mb-3 col-md-6">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 col-md-6">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              value={user.last_name}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 col-md-6">
            <Form.Label>Year of Birth</Form.Label>
            <Form.Control
              type="number"
              name="year_of_birth"
              value={user.year_of_birth}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 col-md-6">
            <Form.Label>Job</Form.Label>
            <Form.Control
              type="text"
              name="job"
              value={user.job}
              onChange={handleInputChange}
            />
          </Form.Group>
        </section>

        <section className="d-flex justify-content-between align-items-center">
          <h3>Reviews</h3>
          <Button variant="primary"
                  title='Add Review'
                  className="d-flex justify-content-center align-items-center"
                  onClick={handleAddReview}>
            <FaPlus title={'Add Review'} />
          </Button>
        </section>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>#</th>
            <th>Book</th>
            <th>Score</th>
            <th>Recommendation</th>
            <th>Review Date</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {user.reviews.map((review, index) => (
            <tr key={index}>
              <td className='p-1 align-content-center'>{index + 1}</td>
              <td className='p-1 align-content-center'>
                {review.book_id === "" ? (
                  <Select
                    options={availableBooks}
                    value={availableBooks.find(option => option.value === review.book_id)}
                    onChange={(selected) => handleReviewChange(index, "book_id", selected?.value)}
                    isSearchable
                  />
                ) : (
                  <Form.Control
                    type="text"
                    value={books.find((book) => book.value === review.book_id)?.label || "Unknown Book"}
                    disabled
                  />
                )}
              </td>
              <td className='p-1 align-content-center'>
                <Form.Control
                  type="number"
                  value={review.score}
                  onChange={(e) => handleReviewChange(index, "score", parseInt(e.target.value))}
                />
              </td>
              <td className='p-1 align-content-center'>
                <Form.Select
                  value={review.recommendation}
                  onChange={(e) => handleReviewChange(index, "recommendation", e.target.value === "true")}
                >
                  <option value={true}>True</option>
                  <option value={false}>False</option>
                </Form.Select>
              </td>
              <td className='p-1 align-content-center'>
                <Form.Control
                  type="text"
                  value={new Date(parseInt(review.review_date)).toLocaleDateString() || ""}
                  readOnly={true}
                />
              </td>
              <td className='p-1 align-content-center'>
                <Button variant="outline-danger"
                        title='Delete'
                        className="d-flex justify-content-center align-items-center"
                        onClick={() => handleDeleteReview(index)}>
                  <FaRegTrashAlt title={'Delete'} />
                </Button>
              </td>
            </tr>
          ))}
          </tbody>
        </Table>

        <Button type="submit" variant="primary">Create User</Button>
      </Form>
    </Container>
  );
}
