import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { projectService } from '../services/apiService';
import {
  fetchProjectDetailStart,
  fetchProjectDetailSuccess,
  fetchProjectDetailFailure,
} from '../redux/slices/projectSlice';
import './ProjectDetail.css';

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
      <Container fluid className="detail-container">
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
      <Container fluid className="detail-container">
        <div className="error-state">
          <div className="alert alert-danger">{error}</div>
          <Button className="back-btn" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </Container>
    );
  }

  if (!currentProject) {
    return null;
  }

  const canCreateTask = user?.role === 'admin' || user?.role === 'manager';
  const statusStyle = getStatusStyle(currentProject.status);

  return (
    <Container fluid className="detail-container">
      <div className="detail-header">
        <button className="back-link" onClick={() => navigate('/dashboard')}>
          ← Projects
        </button>
      </div>

      <div className="detail-content">
        <div className="project-overview">
          <div className="overview-header">
            <div>
              <h1 className="project-title">{currentProject.project_name}</h1>
              <div className="project-meta-row">
                <span className="status-badge" style={{
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.color,
                  border: `1px solid ${statusStyle.border}`
                }}>
                  {currentProject.status}
                </span>
                <span className="hours-display">
                  <span className="hours-icon">⏱</span>
                  {currentProject.hours_consumed || 0} hours consumed
                </span>
              </div>
            </div>
            {canCreateTask && (
              <Button className="create-task-btn" onClick={() => navigate('/tasks/create')}>
                <span className="btn-icon">+</span> New Task
              </Button>
            )}
          </div>

          <div className="info-grid">
            <div className="info-card">
              <div className="info-label">Start Date</div>
              <div className="info-value">{formatDate(currentProject.start_date)}</div>
            </div>
            <div className="info-card">
              <div className="info-label">End Date</div>
              <div className="info-value">{formatDate(currentProject.end_date)}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Project Manager</div>
              <div className="info-value">{currentProject.user_assigned || 'Unassigned'}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Tasks</div>
              <div className="info-value">{currentProject.tasks?.length || 0} total</div>
            </div>
          </div>

          <div className="description-section">
            <h3 className="section-title">Description</h3>
            <p className="description-text">{currentProject.project_description || 'No description provided.'}</p>
          </div>
        </div>

        <div className="tasks-section">
          <div className="tasks-header">
            <h2 className="tasks-title">Tasks</h2>
          </div>

          {currentProject.tasks && currentProject.tasks.length > 0 ? (
            <div className="tasks-list">
              {currentProject.tasks.map((task) => {
                const taskStatusStyle = getStatusStyle(task.status);
                return (
                  <div key={task.id} className="task-card">
                    <div className="task-header-row">
                      <h4 className="task-name">{task.task_name}</h4>
                      <div className="task-badges">
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
                    
                    {task.task_description && (
                      <p className="task-description">{task.task_description}</p>
                    )}

                    <div className="task-footer">
                      <div className="task-assignee">
                        <span className="assignee-icon">👤</span>
                        {task.user_assigned || 'Unassigned'}
                      </div>
                      <div className="task-dates">
                        {formatDate(task.start_date)} - {formatDate(task.end_date)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-tasks">
              <div className="empty-icon">📝</div>
              <h3>No tasks yet</h3>
              <p>Create your first task to get started</p>
              {canCreateTask && (
                <Button className="create-task-btn mt-3" onClick={() => navigate('/tasks/create')}>
                  <span className="btn-icon">+</span> Create Task
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProjectDetail;
