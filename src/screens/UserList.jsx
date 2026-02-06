import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { userService } from '../services/apiService';
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
} from '../redux/slices/userSlice';
import './UserList.css';

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(fetchUsersStart());
      try {
        const data = await userService.getUsers();
        dispatch(fetchUsersSuccess(data));
      } catch (err) {
        dispatch(fetchUsersFailure(err.response?.data?.message || 'Failed to fetch users'));
      }
    };

    fetchUsers();
  }, [dispatch]);

  const getRoleStyle = (role) => {
    const styles = {
      admin: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
      manager: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
      user: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    };
    return styles[role?.toLowerCase()] || styles.user;
  };

  if (loading) {
    return (
      <Container fluid className="users-container">
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
      <Container fluid className="users-container">
        <div className="alert alert-danger m-4">{error}</div>
      </Container>
    );
  }

  return (
    <Container fluid className="users-container">
      <div className="users-header">
        <div className="header-content">
          <div>
            <h1 className="users-title">Team</h1>
            <p className="users-subtitle">{users.length} {users.length === 1 ? 'member' : 'members'}</p>
          </div>
          <Button className="create-btn" onClick={() => navigate('/users/create')}>
            <span className="btn-icon">+</span> Add Member
          </Button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No team members yet</h3>
          <p>Add your first team member to get started</p>
          <Button className="create-btn mt-3" onClick={() => navigate('/users/create')}>
            <span className="btn-icon">+</span> Add Member
          </Button>
        </div>
      ) : (
        <div className="users-list">
          {users.map((member, index) => {
            const roleStyle = getRoleStyle(member.role);
            return (
              <div key={member.id} className="user-card">
                <div className="user-avatar-large">
                  {member.first_name?.charAt(0).toUpperCase() || member.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-details">
                  <h3 className="user-name">{member.first_name} {member.last_name}</h3>
                  <p className="user-email">{member.email}</p>
                  <p className="user-username">@{member.username}</p>
                </div>
                <div className="user-role-badge" style={{
                  backgroundColor: roleStyle.bg,
                  color: roleStyle.color,
                  border: `1px solid ${roleStyle.border}`
                }}>
                  {member.role}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default UserList;
