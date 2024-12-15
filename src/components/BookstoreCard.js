import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import React from "react";

function BookstoreCard(props) {
  return (
    <Card style={{width: '18rem'}} className="mb-3">
      <Card.Body>
        <Card.Title>{props.name ?? props.properties.INF_NOME}</Card.Title>
        <Card.Text>{props.properties.INF_MORADA}</Card.Text>
        <Button href={"/bookstore/" + props._id} variant="primary">Open Bookstore</Button>
      </Card.Body>
    </Card>
  );
}

export default BookstoreCard;