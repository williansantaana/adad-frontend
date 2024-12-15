import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import React from "react";

function BookCard(props) {
  return (
    <Card style={{width: '18rem'}} className="mb-3">
      <Card.Body>
        <Card.Img src={props.thumbnailUrl}/>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          <small>{props.authors.join(', ')}</small>
        </Card.Text>
        <section className='mb-3'>
          {props.categories.map((category, index) => (
            <Badge key={index} bg='secondary' className='me-2'>
              {category}
            </Badge>
          ))}
        </section>
        { props.score && (
          <Card.Text>
            <strong>Score: </strong>
            <span>{props.score}</span>
          </Card.Text>
        )}
        <Button href={"/book/" + props._id} variant="primary">Open Book</Button>
      </Card.Body>
    </Card>
  );
}

export default BookCard;