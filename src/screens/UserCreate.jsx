import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { userService } from '../services/apiService';
import {
  createUserStart,
  createUserSuccess,
  createUserFailure,
} from '../redux/slices/userSlice';
import './FormScreen.css';

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
    <Container fluid className="form-screen">
      <div className="form-container">
        <div className="form-header">
          <button className="back-link" onClick={() => navigate('/users')}>
            ← Back to Team
          </button>
          <h1 className="form-title">Add Team Member</h1>
          <p className="form-subtitle">Create a new user account</p>
        </div>

        {(error || validationError) && (
          <Alert variant="danger" className="error-alert">
            {error || validationError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="modern-form">
          <div className="form-row">
            <Form.Group className="form-field">
              <Form.Label className="field-label">
                First Name <span className="required">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="field-input"
                placeholder="Enter first name"
                required
              />
            </Form.Group>
            
            <Form.Group className="form-field">
              <Form.Label className="field-label">
                Last Name <span className="required">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="field-input"
                placeholder="Enter last name"
                required
              />
            </Form.Group>
          </div>

          <Form.Group className="form-field">
            <Form.Label className="field-label">
              Username <span className="required">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="field-input"
              placeholder="Enter username"
              required
            />
          </Form.Group>

          <Form.Group className="form-field">
            <Form.Label className="field-label">
              Email <span className="required">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="field-input"
              placeholder="Enter email address"
              required
            />
          </Form.Group>

          <Form.Group className="form-field">
            <Form.Label className="field-label">
              Role <span className="required">*</span>
            </Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="field-input"
              required
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="form-field">
            <Form.Label className="field-label">
              Password <span className="required">*</span>
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="field-input"
              placeholder="Enter password"
              required
            />
            <Form.Text className="text-muted" style={{ fontSize: '13px', marginTop: '6px', display: 'block' }}>
              Password must be at least 6 characters long.
            </Form.Text>
          </Form.Group>

          <div className="form-actions">
            <Button className="cancel-btn" onClick={() => navigate('/users')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default UserCreate;
