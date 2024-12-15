import React, { useState, useEffect } from "react";
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import { useNavigate, useLocation } from 'react-router-dom';

import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import {Button} from "react-bootstrap";

export default function App() {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Get current page from query params, default to 1
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page')) || 1;

  const getBooks = async (page) => {
    try {
      const response = await fetch(`http://localhost:3000/books?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();
      setBooks(data.books);
      setPagination(data.pagination);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getBooks(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    // Update the URL with the new page
    searchParams.set('page', page);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const handleAddBook = () => {
    navigate('/book/new');
  }

  return (
    <section className="container pt-5 pb-5">
      <section className="d-flex justify-content-between align-items-center mb-4">
        <h2>Books</h2>
        <Button variant="primary"
                title='Add New Book'
                className="d-flex justify-content-center align-items-center"
                onClick={handleAddBook}>
          Add New Book
        </Button>
      </section>
      <CardGroup>
        <Row xs={1} md={2} className="d-flex justify-content-around gap-5">
          {books && books.map((book) => {
            return (
              <BookCard
                key={book._id}
                {...book}
              />
            );
          })}
        </Row>
      </CardGroup>
      {(pagination && pagination.totalPages > 1) && (
        <Pagination pagination={pagination} onPageChange={handlePageChange}/>
      )}
    </section>
  );
}
