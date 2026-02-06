import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { authService } from '../services/apiService';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(loginStart());
    try {
      const data = await authService.login(credentials);
      dispatch(loginSuccess({ token: data.access, user: data.user }));
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.detail || 'Login failed. Please check your credentials.'));
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-text">TaskFlow</span>
            </div>
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to your workspace</p>
          </div>

          <Form onSubmit={handleSubmit} className="login-form">
            {error && (
              <Alert variant="danger" className="error-alert">
                {error}
              </Alert>
            )}

            <Form.Group className="form-group">
              <Form.Label className="form-label">Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label className="form-label">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Form.Group>

            <Button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : null}
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Form>
        </div>

        <div className="login-footer">
          <p>Project Management System</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
