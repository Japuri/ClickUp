import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Collapse, Button, Container, Card } from 'react-bootstrap';
import { projectService } from '../services/apiService';
import {
  fetchProjectsStart,
  fetchProjectsSuccess,
  fetchProjectsFailure,
} from '../redux/slices/projectSlice';
import './Dashboard.css';

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

  const getStatusStyle = (status) => {
    const styles = {
      CREATED: { bg: '#e3f2fd', color: '#1976d2', border: '#90caf9' },
      'IN PROGRESS': { bg: '#fff3e0', color: '#f57c00', border: '#ffb74d' },
      OVERDUE: { bg: '#ffebee', color: '#d32f2f', border: '#ef5350' },
      COMPLETED: { bg: '#e8f5e9', color: '#388e3c', border: '#66bb6a' },
    };
    return styles[status] || styles.CREATED;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <Container fluid className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="dashboard-container">
        <div className="alert alert-danger m-4">{error}</div>
      </Container>
    );
  }

  return (
    <Container fluid className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">Projects</h1>
            <p className="dashboard-subtitle">{projects.length} {projects.length === 1 ? 'project' : 'projects'}</p>
          </div>
          {user?.role === 'admin' && (
            <Button className="create-btn" onClick={() => navigate('/projects/create')}>
              <span className="btn-icon">+</span> New Project
            </Button>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No projects yet</h3>
          <p>Create your first project to get started</p>
          {user?.role === 'admin' && (
            <Button className="create-btn mt-3" onClick={() => navigate('/projects/create')}>
              <span className="btn-icon">+</span> Create Project
            </Button>
          )}
        </div>
      ) : (
        <div className="projects-list">
          {projects.map((project) => {
            const statusStyle = getStatusStyle(project.status);
            const isOpen = openAccordions[project.id];
            
            return (
              <Card key={project.id} className="project-card">
                <div className="project-header" onClick={() => toggleAccordion(project.id)}>
                  <div className="project-main">
                    <span className="expand-icon">{isOpen ? '▼' : '►'}</span>
                    <div className="project-info">
                      <h3 className="project-name">{project.project_name}</h3>
                      <p className="project-dates">
                        {formatDate(project.start_date)} - {formatDate(project.end_date)}
                      </p>
                    </div>
                  </div>
                  <div className="project-meta">
                    <div className="status-badge" style={{ 
                      backgroundColor: statusStyle.bg, 
                      color: statusStyle.color,
                      border: `1px solid ${statusStyle.border}`
                    }}>
                      {project.status}
                    </div>
                    <div className="hours-badge">
                      <span className="hours-icon">⏱</span>
                      {project.hours_consumed || 0}h
                    </div>
                    <Button 
                      className="view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project.id}`);
                      }}
                    >
                      Open
                    </Button>
                  </div>
                </div>

                <Collapse in={isOpen}>
                  <div className="project-details">
                    <div className="detail-section">
                      <h4 className="detail-label">Description</h4>
                      <p className="detail-text">{project.project_description || 'No description provided'}</p>
                    </div>
                    
                    {project.tasks && project.tasks.length > 0 && (
                      <div className="detail-section">
                        <h4 className="detail-label">Tasks ({project.tasks.length})</h4>
                        <div className="tasks-grid">
                          {project.tasks.map((task) => {
                            const taskStatusStyle = getStatusStyle(task.status);
                            return (
                              <div key={task.id} className="task-item">
                                <div className="task-content">
                                  <div className="task-name">{task.task_name}</div>
                                  <div className="task-assigned">
                                    {task.user_assigned || 'Unassigned'}
                                  </div>
                                </div>
                                <div className="task-meta">
                                  <span className="task-status" style={{
                                    backgroundColor: taskStatusStyle.bg,
                                    color: taskStatusStyle.color,
                                    border: `1px solid ${taskStatusStyle.border}`
                                  }}>
                                    {task.status}
                                  </span>
                                  <span className="task-hours">{task.hours_consumed || 0}h</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </Collapse>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default Dashboard;
