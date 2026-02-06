import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { projectService, userService } from '../services/apiService';
import {
  createProjectStart,
  createProjectSuccess,
  createProjectFailure,
} from '../redux/slices/projectSlice';
import { fetchManagersSuccess } from '../redux/slices/userSlice';

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
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Create New Project</h3>
            </Card.Header>
            <Card.Body>
              {(error || validationError) && (
                <Alert variant="danger">{error || validationError}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Project Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Project Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="project_description"
                    value={formData.project_description}
                    onChange={handleChange}
                    placeholder="Enter project description (optional)"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Assign Manager <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="user_assigned"
                    value={formData.user_assigned}
                    onChange={handleChange}
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

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Start Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        End Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between mt-4">
                  <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Project'}
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

export default ProjectCreate;
