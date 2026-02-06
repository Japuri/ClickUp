import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { userService } from '../services/apiService';
import {
  createUserStart,
  createUserSuccess,
  createUserFailure,
} from '../redux/slices/userSlice';

const UserCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    role: '',
    password: '',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name.trim()) {
      setValidationError('First name is required');
      return;
    }

    if (!formData.last_name.trim()) {
      setValidationError('Last name is required');
      return;
    }

    if (!formData.username.trim()) {
      setValidationError('Username is required');
      return;
    }

    if (!formData.email.trim()) {
      setValidationError('Email is required');
      return;
    }

    if (!formData.role) {
      setValidationError('Role is required');
      return;
    }

    if (!formData.password.trim()) {
      setValidationError('Password is required');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    dispatch(createUserStart());
    try {
      const data = await userService.createUser(formData);
      dispatch(createUserSuccess(data));
      navigate('/users');
    } catch (err) {
      dispatch(createUserFailure(err.response?.data?.message || 'Failed to create user'));
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Create New User</h3>
            </Card.Header>
            <Card.Body>
              {(error || validationError) && (
                <Alert variant="danger">{error || validationError}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        First Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Last Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Username <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Role <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long.
                  </Form.Text>
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <Button variant="secondary" onClick={() => navigate('/users')}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create User'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserCreate;
