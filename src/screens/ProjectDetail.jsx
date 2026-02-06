import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';
import { projectService } from '../services/apiService';
import {
  fetchProjectDetailStart,
  fetchProjectDetailSuccess,
  fetchProjectDetailFailure,
} from '../redux/slices/projectSlice';

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProject, loading, error } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      dispatch(fetchProjectDetailStart());
      try {
        const data = await projectService.getProjectDetail(id);
        dispatch(fetchProjectDetailSuccess(data));
      } catch (err) {
        dispatch(fetchProjectDetailFailure(err.response?.data?.message || 'Failed to fetch project details'));
      }
    };

    fetchProjectDetail();
  }, [dispatch, id]);

  const getStatusBadge = (status) => {
    const statusMap = {
      CREATED: 'secondary',
      'IN PROGRESS': 'primary',
      OVERDUE: 'danger',
      COMPLETED: 'success',
    };
    return <Badge bg={statusMap[status] || 'secondary'}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">Loading project details...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger">{error}</div>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!currentProject) {
    return null;
  }

  const canCreateTask = user?.role === 'admin' || user?.role === 'manager';

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </Col>
      </Row>

      <Card className="mb-4 shadow">
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">Project Details</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h4>{currentProject.project_name}</h4>
              <p className="text-muted">{currentProject.project_description || 'No description provided.'}</p>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>Status:</strong> {getStatusBadge(currentProject.status)}
              </div>
              <div className="mb-2">
                <strong>Hours Consumed:</strong> {currentProject.hours_consumed || 0} hrs
              </div>
              <div className="mb-2">
                <strong>Start Date:</strong> {formatDate(currentProject.start_date)}
              </div>
              <div className="mb-2">
                <strong>End Date:</strong> {formatDate(currentProject.end_date)}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow">
        <Card.Header className="bg-secondary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Tasks</h4>
          {canCreateTask && (
            <Button variant="light" size="sm" onClick={() => navigate(`/projects/${id}/task/create`)}>
              + Create Task
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {currentProject.tasks && currentProject.tasks.length > 0 ? (
            <Table responsive hover>
              <thead className="table-light">
                <tr>
                  <th>Task Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Hours Consumed</th>
                  <th>Assigned To</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {currentProject.tasks.map((task) => (
                  <tr key={task.id}>
                    <td><strong>{task.task_name}</strong></td>
                    <td>{task.task_description || 'No description'}</td>
                    <td>{getStatusBadge(task.status)}</td>
                    <td>{task.hours_consumed || 0} hrs</td>
                    <td>{task.user_assigned || 'Unassigned'}</td>
                    <td>{formatDate(task.start_date)}</td>
                    <td>{formatDate(task.end_date)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center text-muted py-4">
              <p>No tasks found for this project.</p>
              {canCreateTask && (
                <Button variant="primary" onClick={() => navigate(`/projects/${id}/task/create`)}>
                  Create First Task
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProjectDetail;
