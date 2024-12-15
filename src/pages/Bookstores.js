import React, {useState, useEffect} from "react";
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {useLocation, useNavigate} from "react-router-dom";
import Pagination from "../components/Pagination";
import BookstoreCard from "../components/BookstoreCard";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet's default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function App() {
  const [bookstores, setBookstores] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [points, setPoints] = useState([]);
  const [maxDistance, setMaxDistance] = useState(5000);

  const navigate = useNavigate();
  const location = useLocation();

  // Get current page from query params, default to 1
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page')) || 1;

  const getBookstores = async (page) => {
    try {
      const response = await fetch(`http://localhost:3000/bookstores?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      setBookstores(data.bookstores);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const endpoint = points.length > 1 ? '/bookstores/near-route' : '/bookstores/near';
      const body = points.length > 1 ? { route: points.map(point => [point.lng, point.lat]), maxDistance } : null;
      const urlParams = points.length === 1
        ? `latitude=${points[0].lat}&longitude=${points[0].lng}&maxDistance=${maxDistance}`
        : '';

      console.log(body)
      const response = await fetch(`http://localhost:3000${endpoint}${urlParams ? `?${urlParams}` : ''}`, {
        method: points.length > 1 ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: points.length > 1 ? JSON.stringify(body) : null
      });
      const data = await response.json();
      setBookstores(data.bookstores);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error searching bookstores:', error);
    }
  };

  useEffect(() => {
    getBookstores(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    searchParams.set('page', page);
    navigate({ pathname: location.pathname, search: searchParams.toString() });
  };

  function MapClickHandler() {
    const map = useMapEvents({
      click(e) {
        setPoints([...points, { lat: e.latlng.lat, lng: e.latlng.lng }]);
      }
    });
    return null;
  }

  return (
    <div className="container pt-5 pb-5">
      <h2>Bookstores Page</h2>

      {/* Search Section */}
      <Accordion defaultActiveKey="0" className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Search Bookstores by Location</Accordion.Header>
          <Accordion.Body>
            <div style={{ height: "400px" }}>
              <MapContainer center={[38.7223, -9.1393]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {points.map((point, index) => (
                  <Marker key={index} position={[point.lat, point.lng]}>
                    <Popup>Point {index + 1}</Popup>
                  </Marker>
                ))}
                {points.length > 1 && <Polyline positions={points} />}
                <MapClickHandler />
              </MapContainer>
            </div>
            <div className="mt-3">
              <label>Max Distance (meters):</label>
              <input
                type="number"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="form-control mb-2"
              />
              <Button variant="primary" onClick={handleSearch} disabled={points.length === 0}>
                Search Bookstores
              </Button>
              {points.length > 0 && (
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() => setPoints([])}
                >
                  Clear Points
                </Button>
              )}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Bookstores List */}
      <CardGroup>
        <Row xs={1} md={2} className="d-flex justify-content-around gap-5">
          {bookstores && bookstores.map((bookstore) => (
            <BookstoreCard key={bookstore._id} {...bookstore} />
          ))}
        </Row>
      </CardGroup>

      {/* Pagination */}
      {(pagination && pagination.totalPages > 1) && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
