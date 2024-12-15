import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { openContractCall } from '@stacks/connect';
import {
  bufferCV,
} from '@stacks/transactions';
import { utf8ToBytes } from '@stacks/common';
import { userSession } from '../auth';
import Avatar from "../components/Avatar";
import Row from "react-bootstrap/Row";
import BookCard from "../components/BookCard";
import CardGroup from "react-bootstrap/CardGroup";
import Button from "react-bootstrap/Button";
import ConfirmDialog from "../components/ConfirmDialog";
const bytes = utf8ToBytes('foo');
const bufCV = bufferCV(bytes);

export default function App() {
  let params = useParams();
  let [user, setUser] = useState(null);
  let [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const navigate = useNavigate();

  const getUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      setUser(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const confirmDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        setShowConfirmDialog(false);
        navigate('/users');
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getUser(params.id);
  }, [params.id]);

  if (!user) {
    return <section>Loading...</section>;
  }

  const presentableName = `${user.first_name} ${user.last_name}`

  return (
    <section className="container pt-5 pb-5">
      <section className="d-flex flex-column align-items-center">
        <Avatar name={presentableName} size={100}/>
        <h2 className="mt-3">{presentableName}</h2>
        <p>
          <strong>Year of Birth: </strong>
          <span>{user.year_of_birth}</span>
        </p>
        <p>
          <strong>Job: </strong>
          <span>{user.job}</span>
        </p>
        <p>
          <strong>Reviews: </strong>
          <span>{user.reviews.length}</span>
        </p>
      </section>
      <h2>Top Books</h2>
      <CardGroup>
        <Row xs={1} md={2} className="d-flex justify-content-start gap-5">
          {user.topBooks && user.topBooks.map((book) => {
            return (
              <BookCard
                key={book._id}
                {...book}
              />
            );
          })}
        </Row>
      </CardGroup>
      <Button href={`/user/${user._id}/edit`} variant="primary" className="me-2">Edit User</Button>
      <Button onClick={_ => setShowConfirmDialog(true)} variant="danger">Delete User</Button>
      <ConfirmDialog
        show={showConfirmDialog}
        title="Confirm Deletion"
        message={`Are you sure you want to delete user ${presentableName}?`}
        onConfirm={confirmDeleteUser}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </section>
  )
}