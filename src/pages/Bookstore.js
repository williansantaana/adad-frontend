import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button, Form } from "react-bootstrap";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";

// Configurar ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function BookstorePage() {
  const params = useParams();
  const [bookstore, setBookstore] = useState(null);
  const [books, setBooks] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  // Get current page from query params, default to 1
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page')) || 1;

  const getBookstore = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/bookstores/${id}`);
      const data = await response.json();
      setBookstore(data);
    } catch (error) {
      console.error("Error fetching bookstore data:", error);
    }
  };

  const getBookstoreBooks = async (id, page) => {
    try {
      const response = await fetch(`http://localhost:3000/bookstores/${id}/books?page=${page}`);
      const data = await response.json();
      console.log(data)
      setBooks(data.books);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching bookstore books:", error);
    }
  };

  const getAvailableBooks = async () => {
    try {
      const response = await fetch(`http://localhost:3000/books/simple-list`);
      const data = await response.json();
      setAvailableBooks(data.map(book => ({ value: book._id, label: book.title })));
    } catch (error) {
      console.error("Error fetching available books:", error);
    }
  };

  const handleAddBook = async () => {
    if (!selectedBook || quantity < 1) return;

    try {
      const response = await fetch(`http://localhost:3000/bookstores/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookstore_id: parseInt(params.id),
          book_id: selectedBook.value,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        getBookstoreBooks(params.id, currentPage);
        setSelectedBook(null);
        setQuantity(1);
      } else {
        console.error('Failed to add book');
      }
    } catch (error) {
      console.error("Error adding book to bookstore:", error);
    }
  };

  useEffect(() => {
    getBookstore(params.id);
    getBookstoreBooks(params.id, currentPage);
    getAvailableBooks();
  }, [params, currentPage]);

  const handlePageChange = (page) => {
    // Update the URL with the new page
    searchParams.set('page', page);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  if (!bookstore) {
    return <section className="text-center mt-5">Loading...</section>;
  }

  const { INF_NOME, INF_MORADA, INF_DESCRICAO, INF_FONTE, INF_TELEFONE } = bookstore.properties;
  const [longitude, latitude] = bookstore.geometry.coordinates;

  // Filter books not already added
  const filteredAvailableBooks = availableBooks.filter(
    book => !books?.some(reviewedBook => reviewedBook.book_id === book.value)
  );

  return (
    <section className="container pt-5 pb-5">
      <section className='row'>
        <Card className="mb-4 border-0 col-md-6">
          <Card.Body className='p-0'>
            <Card.Title as="h2">{INF_NOME}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{INF_MORADA}</Card.Subtitle>
            <Card.Subtitle className="mb-4 text-muted">{INF_TELEFONE}</Card.Subtitle>
            <Card.Text>{INF_DESCRICAO}</Card.Text>
            {(INF_FONTE && !['', '-'].includes(INF_FONTE)) && (
              <Card.Link href={INF_FONTE} target="_blank" rel="noopener noreferrer">
                More Information
              </Card.Link>
            )}
          </Card.Body>
        </Card>
        <section className="mb-4 col-md-6">
          <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            style={{height: "300px", width: "100%"}}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[latitude, longitude]}>
              <Popup>{INF_NOME}</Popup>
            </Marker>
          </MapContainer>
        </section>
      </section>

      <section className="my-5">
        <h4>Add a Book to Bookstore</h4>
        <Form>
          <section className='row'>
            <Form.Group className="mb-3 col-md-8">
              <Form.Label>Select Book</Form.Label>
              <Select
                options={filteredAvailableBooks}
                value={filteredAvailableBooks.find(option => option.value === selectedBook?.value) || null}
                onChange={setSelectedBook}
                isSearchable
                placeholder="Search for a book..."
              />
            </Form.Group>
            <Form.Group className="mb-3 col-md-4">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
              />
            </Form.Group>
          </section>
          <Button variant="primary"
                  onClick={handleAddBook}
                  disabled={!selectedBook || quantity < 1}>
            Add Book
          </Button>
        </Form>
      </section>

      {books && books.length > 0 && (
        <section>
          <h4>Books</h4>
          <CardGroup>
            <Row xs={1} md={2} className="d-flex justify-content-around gap-5">
              {books.map((book) => {
                return (
                  <BookCard
                    key={book.book_id}
                    _id={book.book_id}
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
      )}
    </section>
  );
}