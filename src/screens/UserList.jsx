import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Badge, Row, Col } from 'react-bootstrap';
import { userService } from '../services/apiService';
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
} from '../redux/slices/userSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(fetchUsersStart());
      try {
        const data = await userService.getUsers();
        dispatch(fetchUsersSuccess(data));
      } catch (err) {
        dispatch(fetchUsersFailure(err.response?.data?.message || 'Failed to fetch users'));
      }
    };

    fetchUsers();
  }, [dispatch]);

  const getRoleBadge = (role) => {
    const roleMap = {
      admin: 'danger',
      manager: 'primary',
      user: 'success',
    };
    return <Badge bg={roleMap[role?.toLowerCase()] || 'secondary'}>{role}</Badge>;
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">Loading users...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>User Management</h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => navigate('/users/create')}>
            Create User
          </Button>
        </Col>
      </Row>

      {users.length === 0 ? (
        <div className="alert alert-info">No users found.</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{getRoleBadge(user.role)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UserList;
