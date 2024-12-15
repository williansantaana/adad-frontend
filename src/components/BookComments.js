import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import Select from "react-select";
import {FaRegTrashAlt} from "react-icons/fa";

const BookComments = ({ comments, onAddComment, onDeleteComment }) => {
  const [newComment, setNewComment] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);

  const getUsers = async (query = "") => {
    try {
      const response = await fetch(`http://localhost:3000/users/search?q=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();
      setUsers(data.map(user => ({ value: user._id, label: user.first_name + ' ' + user.last_name })));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (inputValue) => {
    getUsers(inputValue);
  };

  const handleSubmit = () => {
    if (newComment && selectedUser) {
      onAddComment({
        user_id: selectedUser.value,
        comment: newComment
      });
      setNewComment('');
      setSelectedUser(null);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Card className="mt-4">
      <Card.Header>Comments</Card.Header>
      <ListGroup variant="flush">
        {comments.length === 0 ? (
          <ListGroup.Item>No comments available.</ListGroup.Item>
        ) : (
          comments.map((comment) => (
            <ListGroup.Item key={comment._id}>
              <section>
                <section className='d-flex justify-content-between align-items-center mb-2'>
                  <strong>User {comment.user_id}</strong>
                  <section className='d-flex justify-content-between align-items-center'>
                    <span className="text-muted">
                      {new Date(Number(comment.date)).toLocaleDateString()}
                    </span>
                    <Button variant="outline-danger"
                            title='Delete'
                            className="d-flex justify-content-center align-items-center ms-3"
                            onClick={() => onDeleteComment(comment)}>
                      <FaRegTrashAlt title={'Delete'}/>
                    </Button>
                  </section>
                </section>

                <p>{comment.comment}</p>
              </section>
            </ListGroup.Item>
          ))
        )}
        <ListGroup.Item>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select User</Form.Label>
              <Select
                options={users}
                value={selectedUser}
                onChange={setSelectedUser}
                onInputChange={handleInputChange}
                placeholder="Choose a user..."
                isSearchable
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment here..."
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit} disabled={!newComment || !selectedUser}>
              Add Comment
            </Button>
          </Form>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

BookComments.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      book_id: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      user_id: PropTypes.number.isRequired,
      _id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
    })
  ).isRequired,
  onAddComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
};

export default BookComments;
