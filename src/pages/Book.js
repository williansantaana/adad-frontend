import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { openContractCall } from '@stacks/connect';
import {
  bufferCV,
} from '@stacks/transactions';
import { utf8ToBytes } from '@stacks/common';
import { userSession } from '../auth';
import Badge from "react-bootstrap/Badge";
import Figure from 'react-bootstrap/Figure';
import StarRatings from 'react-star-ratings';
import BookComments from "../components/BookComments";
import Button from "react-bootstrap/Button";
import ConfirmDialog from "../components/ConfirmDialog";

const bytes = utf8ToBytes('foo');
const bufCV = bufferCV(bytes);

export default function App() {
  const params = useParams();
  const [book, setBook] = useState(null); // Alterado para null para representar o estado inicial
  const [averageScore, setAverageScore] = useState(0);
  const [comments, setComments] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCommentConfirmDialog, setShowCommentConfirmDialog] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const navigate = useNavigate();

  const getBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      setBook(data.book);
      setAverageScore(data.averageScore ?? 0);
      setComments(data.comments);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const confirmDeleteBook = async () => {
    try {
      const response = await fetch(`http://localhost:3000/books/${book._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        setShowConfirmDialog(false);
        navigate('/books');
      } else {
        console.error('Failed to delete book');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddComment = async (comment) => {
    comment.book_id = book._id;

    try {
      const response = await fetch(`/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });

      if (response.ok) {
        await getBook(book._id);
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  const handleDeleteComment = async (comment) => {
    setSelectedComment(comment);
    setShowCommentConfirmDialog(true);
  }

  const confirmDeleteComment = async () => {
    try {
      const response = await fetch(`/comments/${selectedComment._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await getBook(book._id);
        setShowCommentConfirmDialog(false);
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }

  useEffect(() => {
    getBook(params.id);
  }, [params.id]);

  if (!book) {
    return <section>Loading...</section>;
  }

  return (
    <section className="container pt-5 pb-5">
      <section className="d-flex gap-4">
        <Figure>
          <Figure.Image
            width={250}
            src={book.thumbnailUrl}
          />
        </Figure>
        <section>
          <h2>{book.title}</h2>
          <section>
            <small>{book.authors ? book.authors.join(', ') : 'Unknown Authors'}</small>
          </section>
          <section className='mb-3'>
            {book.categories && book.categories.map((category, index) => (
              <Badge key={index} bg='secondary' className='me-2'>
                {category}
              </Badge>
            ))}
          </section>
          <section>
            <strong>ISBN: </strong>
            <span>{book.isbn}</span>
          </section>
          <section>
            <strong>Page numbers: </strong>
            <span>{book.pageCount}</span>
          </section>
          <section>
            <strong>Publish Date: </strong>
            <span>{book.publishedDate ? new Date(book.publishedDate).toLocaleDateString(
              'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            ) : 'N/A'}</span>
          </section>
          <section>
            <strong>Status: </strong>
            <span>{book.status}</span>
          </section>
          <section className='d-flex align-items-center gap-1'>
            <strong>Average Score: </strong>
            <span>{averageScore.toFixed(1) ?? 0}</span>
            <StarRatings
              rating={averageScore}
              starRatedColor="#ffd700"
              numberOfStars={5}
              starDimension="25px"
              starSpacing="2px"
              name="rating"
            />
          </section>
        </section>
      </section>
      <p>{book.longDescription}</p>
      <section className='mb-4'>
        <BookComments
          comments={comments}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      </section>
      <Button href={`/book/${book._id}/edit`} variant="primary" className="me-2">Edit Book</Button>
      <Button onClick={_ => setShowConfirmDialog(true)} variant="danger">Delete Book</Button>
      <ConfirmDialog
        show={showConfirmDialog}
        title="Confirm Book Deletion"
        message={`Are you sure you want to delete book ${book.title}?`}
        onConfirm={confirmDeleteBook}
        onCancel={() => setShowConfirmDialog(false)}
      />
      { selectedComment && (
        <ConfirmDialog
          show={showCommentConfirmDialog}
          title="Confirm Comment Deletion"
          message={`Are you sure you want to delete comment from User ${selectedComment.user_id}?`}
          onConfirm={confirmDeleteComment}
          onCancel={() => setShowCommentConfirmDialog(false)}
        />
      )}
    </section>
  )
}
