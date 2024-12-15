import React, { useState, useEffect } from "react";
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import {Button} from "react-bootstrap";
import {FaPlus} from "react-icons/fa";

export default function App() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const columns = [
    {
      label: "Name",
      accessor: "presentableName",
    },
    {
      label: "Year of birth",
      accessor: "year_of_birth",
    },
    {
      label: "Job",
      accessor: "job",
    },
    {
      label: "Reviews",
      accessor: "totalReviews",
    },
  ];

  const getUsers = async (page) => {
    try {
      const response = await fetch(`http://localhost:3000/users?page=${page}&limit=15`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      setPagination(data.pagination);
      setUsers(data.users.map(user => {
        return {
          ...user,
          presentableName: `${user.first_name} ${user.last_name}`,
          totalReviews: user.reviews ? user.reviews.length : 0
        };
      }));

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePageChange = (page) => {
    searchParams.set('page', page);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const handleViewUser = (user) => {
    navigate(`/user/${user._id}`);
  };

  const handleEditUser = (user) => {
    navigate(`/user/${user._id}/edit`);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowConfirmDialog(true);
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== selectedUser._id));
        setShowConfirmDialog(false);
        setSelectedUser(null);
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddUser = () => {
    navigate('/user/new');
  }

  useEffect(() => {
    getUsers(currentPage);
  }, [currentPage]);

  return (
    <section className="container pt-5 pb-5">
      <section className="d-flex justify-content-between align-items-center">
        <h2>Users Page</h2>
        <Button variant="primary"
                title='Add New User'
                className="d-flex justify-content-center align-items-center"
                onClick={handleAddUser}>
          Add New User
        </Button>
      </section>
      <DataTable
        columns={columns}
        data={users}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        useIcons={true}
      />
      {pagination && (
        <Pagination pagination={pagination} onPageChange={handlePageChange}/>
      )}
      <ConfirmDialog
        show={showConfirmDialog}
        title="Confirm Deletion"
        message={`Are you sure you want to delete user ${selectedUser?.presentableName}?`}
        onConfirm={confirmDeleteUser}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </section>
  );
}
