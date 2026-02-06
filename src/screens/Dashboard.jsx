import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Collapse, Button, Badge, Container, Row, Col } from 'react-bootstrap';
import { projectService } from '../services/apiService';
import {
  fetchProjectsStart,
  fetchProjectsSuccess,
  fetchProjectsFailure,
} from '../redux/slices/projectSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading, error } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const [openAccordions, setOpenAccordions] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      dispatch(fetchProjectsStart());
      try {
        const data = await projectService.getProjects();
        dispatch(fetchProjectsSuccess(data));
      } catch (err) {
        dispatch(fetchProjectsFailure(err.response?.data?.message || 'Failed to fetch projects'));
      }
    };

    fetchProjects();
  }, [dispatch]);

  const toggleAccordion = (projectId) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

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
        <div className="text-center">Loading projects...</div>
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
          <h2>Project Dashboard</h2>
        </Col>
        {user?.role === 'admin' && (
          <Col className="text-end">
            <Button variant="primary" onClick={() => navigate('/projects/create')}>
              Create Project
            </Button>
          </Col>
        )}
      </Row>

      {projects.length === 0 ? (
        <div className="alert alert-info">No projects found.</div>
      ) : (
        <Table hover bordered>
          <thead className="table-dark">
            <tr>
              <th>Project Name</th>
              <th>Status</th>
              <th>Hours Consumed</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <React.Fragment key={project.id}>
                <tr>
                  <td>
                    <Button
                      variant="link"
                      className="text-decoration-none text-start p-0"
                      onClick={() => toggleAccordion(project.id)}
                    >
                      {openAccordions[project.id] ? '▼' : '►'} {project.project_name}
                    </Button>
                  </td>
                  <td>{getStatusBadge(project.status)}</td>
                  <td>{project.hours_consumed || 0} hrs</td>
                  <td>{formatDate(project.start_date)}</td>
                  <td>{formatDate(project.end_date)}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="6" className="p-0 border-0">
                    <Collapse in={openAccordions[project.id]}>
                      <div className="p-3 bg-light">
                        <h6>Project Description</h6>
                        <p>{project.project_description || 'No description provided.'}</p>
                        {project.tasks && project.tasks.length > 0 && (
                          <>
                            <h6 className="mt-3">Tasks ({project.tasks.length})</h6>
                            <Table size="sm" bordered className="mb-0">
                              <thead>
                                <tr>
                                  <th>Task Name</th>
                                  <th>Status</th>
                                  <th>Assigned To</th>
                                  <th>Hours</th>
                                </tr>
                              </thead>
                              <tbody>
                                {project.tasks.map((task) => (
                                  <tr key={task.id}>
                                    <td>{task.task_name}</td>
                                    <td>{getStatusBadge(task.status)}</td>
                                    <td>{task.user_assigned || 'Unassigned'}</td>
                                    <td>{task.hours_consumed || 0} hrs</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </>
                        )}
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Dashboard;
