import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { taskService, userService, projectService } from '../services/apiService';
import {
  createTaskStart,
  createTaskSuccess,
  createTaskFailure,
} from '../redux/slices/taskSlice';
import { fetchRegularUsersSuccess } from '../redux/slices/userSlice';
import './FormScreen.css';

const TaskCreate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    project_id: id || '',
    task_name: '',
    task_description: '',
    user_assigned: '',
    start_date: '',
    end_date: '',
  });

  const [validationError, setValidationError] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'manager') {
          const data = await userService.getRegularUsers();
          dispatch(fetchRegularUsersSuccess(data));
          setAvailableUsers(data);
        } else if (user?.role === 'admin') {
          const allUsers = await userService.getUsers();
          const filteredUsers = allUsers.filter(
            (u) => u.role === 'manager' || u.role === 'user'
          );
          setAvailableUsers(filteredUsers);
        }

        if (!id) {
          const projects = await projectService.getProjects();
          setAvailableProjects(projects);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, [dispatch, user, id]);

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

    if (!formData.task_name.trim()) {
      setValidationError('Task name is required');
      return;
    }

    if (!id && !formData.project_id) {
      setValidationError('Please select a project');
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

    dispatch(createTaskStart());
    try {
      const projectId = id || formData.project_id;
      const data = await taskService.createTask(projectId, formData);
      dispatch(createTaskSuccess(data));
      navigate(id ? `/projects/${id}` : '/dashboard');
    } catch (err) {
      dispatch(createTaskFailure(err.response?.data?.message || 'Failed to create task'));
    }
  };

  return (
    <Container fluid className="form-screen">
      <div className="form-container">
        <div className="form-header">
          <button className="back-link" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className="form-title">Create Task</h1>
          <p className="form-subtitle">Add a new task and assign it to a team member</p>
        </div>

        {(error || validationError) && (
          <Alert variant="danger" className="error-alert">
            {error || validationError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="modern-form">
          {!id && (
            <Form.Group className="form-field">
              <Form.Label className="field-label">
                Project <span className="required">*</span>
              </Form.Label>
              <Form.Select
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                className="field-input"
                required
              >
                <option value="">Select a project</option>
                {availableProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group className="form-field">
            <Form.Label className="field-label">
              Task Name <span className="required">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="task_name"
              value={formData.task_name}
              onChange={handleChange}
              className="field-input"
              placeholder="Enter task name"
              required
            />
          </Form.Group>

          <Form.Group className="form-field">
            <Form.Label className="field-label">Task Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="task_description"
              value={formData.task_description}
              onChange={handleChange}
              className="field-input"
              placeholder="Enter task description (optional)"
            />
          </Form.Group>

          <Form.Group className="form-field">
            <Form.Label className="field-label">Assign User</Form.Label>
            <Form.Select
              name="user_assigned"
              value={formData.user_assigned}
              onChange={handleChange}
              className="field-input"
            >
              <option value="">Select a user (optional)</option>
              {availableUsers.map((availableUser) => (
                <option key={availableUser.id} value={availableUser.id}>
                  {availableUser.first_name} {availableUser.last_name} ({availableUser.email}) - {availableUser.role}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted" style={{ fontSize: '13px', marginTop: '6px', display: 'block' }}>
              {user?.role === 'manager' && 'As a manager, you can only assign tasks to regular users.'}
              {user?.role === 'admin' && 'As an admin, you can assign tasks to managers and users.'}
            </Form.Text>
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
            <Button className="cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default TaskCreate;
