import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { taskService, userService } from '../services/apiService';
import {
  createTaskStart,
  createTaskSuccess,
  createTaskFailure,
} from '../redux/slices/taskSlice';
import { fetchRegularUsersSuccess } from '../redux/slices/userSlice';

const TaskCreate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const { regularUsers } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    task_name: '',
    task_description: '',
    user_assigned: '',
    start_date: '',
    end_date: '',
  });

  const [validationError, setValidationError] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
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
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, [dispatch, user]);

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
      const data = await taskService.createTask(id, formData);
      dispatch(createTaskSuccess(data));
      navigate(`/projects/${id}`);
    } catch (err) {
      dispatch(createTaskFailure(err.response?.data?.message || 'Failed to create task'));
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="bg-secondary text-white">
              <h3 className="mb-0">Create New Task</h3>
            </Card.Header>
            <Card.Body>
              {(error || validationError) && (
                <Alert variant="danger">{error || validationError}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Task Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="task_name"
                    value={formData.task_name}
                    onChange={handleChange}
                    placeholder="Enter task name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="task_description"
                    value={formData.task_description}
                    onChange={handleChange}
                    placeholder="Enter task description (optional)"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Assign User</Form.Label>
                  <Form.Select
                    name="user_assigned"
                    value={formData.user_assigned}
                    onChange={handleChange}
                  >
                    <option value="">Select a user (optional)</option>
                    {availableUsers.map((availableUser) => (
                      <option key={availableUser.id} value={availableUser.id}>
                        {availableUser.first_name} {availableUser.last_name} ({availableUser.email}) - {availableUser.role}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    {user?.role === 'manager' && 'As a manager, you can only assign tasks to regular users.'}
                    {user?.role === 'admin' && 'As an admin, you can assign tasks to managers and users.'}
                  </Form.Text>
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
                  <Button variant="secondary" onClick={() => navigate(`/projects/${id}`)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Task'}
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

export default TaskCreate;
