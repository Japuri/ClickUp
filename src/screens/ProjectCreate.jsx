import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { projectService, userService } from '../services/apiService';
import {
  createProjectStart,
  createProjectSuccess,
  createProjectFailure,
} from '../redux/slices/projectSlice';
import { fetchManagersSuccess } from '../redux/slices/userSlice';
import './FormScreen.css';

const ProjectCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.projects);
  const { managers } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    project_name: '',
    project_description: '',
    user_assigned: '',
    start_date: '',
    end_date: '',
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const data = await userService.getManagers();
        dispatch(fetchManagersSuccess(data));
      } catch (err) {
        console.error('Failed to fetch managers:', err);
      }
    };

    fetchManagers();
  }, [dispatch]);

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

    if (!formData.project_name.trim()) {
      setValidationError('Project name is required');
      return;
    }

    if (!formData.user_assigned) {
      setValidationError('Please assign a manager to the project');
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      setValidationError('Start date and end date are required');
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setValidationError('End date must be after start date');
      return;
    }

    dispatch(createProjectStart());
    try {
      const data = await projectService.createProject(formData);
      dispatch(createProjectSuccess(data));
      navigate('/dashboard');
    } catch (err) {
      dispatch(createProjectFailure(err.response?.data?.message || 'Failed to create project'));
    }
  };

  return (
    <Container fluid className="form-screen">
      <div className="form-container">
        <div className="form-header">
          <button className="back-link" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="form-title">Create Project</h1>
          <p className="form-subtitle">Set up a new project and assign a manager</p>
        </div>

        {(error || validationError) && (
          <Alert variant="danger" className="error-alert">
            {error || validationError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="modern-form">
          <Form.Group className="form-field">
            <Form.Label className="field-label">
              Project Name <span className="required">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              className="field-input"
              placeholder="Enter project name"
              required
            />
          </Form.Group>

          <Form.Group className="form-field">
            <Form.Label className="field-label">Project Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="project_description"
              value={formData.project_description}
              onChange={handleChange}
              className="field-input"
              placeholder="Enter project description (optional)"
            />
          </Form.Group>

          <Form.Group className="form-field">
            <Form.Label className="field-label">
              Assign Manager <span className="required">*</span>
            </Form.Label>
            <Form.Select
              name="user_assigned"
              value={formData.user_assigned}
              onChange={handleChange}
              className="field-input"
              required
            >
              <option value="">Select a manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.first_name} {manager.last_name} ({manager.email})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="form-row">
            <Form.Group className="form-field">
              <Form.Label className="field-label">
                Start Date <span className="required">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="field-input"
                required
              />
            </Form.Group>
            
            <Form.Group className="form-field">
              <Form.Label className="field-label">
                End Date <span className="required">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="field-input"
                required
              />
            </Form.Group>
          </div>

          <div className="form-actions">
            <Button className="cancel-btn" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default ProjectCreate;
