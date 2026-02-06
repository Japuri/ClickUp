import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { logout } from "../redux/slices/authSlice";
import './Header.css';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header>
      <Navbar className="custom-navbar" expand="lg">
        <Container fluid className="navbar-container">
          <Navbar.Brand onClick={() => navigate("/dashboard")} className="brand-logo">
            <span className="logo-text">TaskFlow</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="navbar-content" />
          
          <Navbar.Collapse id="navbar-content">
            <Nav className="nav-links">
              <Nav.Link 
                onClick={() => navigate("/dashboard")} 
                className={isActive('/') || isActive('/dashboard') ? 'nav-item active' : 'nav-item'}
              >
                Projects
              </Nav.Link>
              
              {(user?.role === 'admin' || user?.role === 'manager') && (
                <Nav.Link 
                  onClick={() => navigate("/tasks/create")} 
                  className={isActive('/tasks/create') ? 'nav-item active' : 'nav-item'}
                >
                  New Task
                </Nav.Link>
              )}
              
              {user?.role === 'admin' && (
                <Nav.Link 
                  onClick={() => navigate("/users")} 
                  className={isActive('/users') ? 'nav-item active' : 'nav-item'}
                >
                  Team
                </Nav.Link>
              )}
            </Nav>
            
            <Nav className="user-section">
              {user?.role === 'admin' && (
                <button className="new-project-btn" onClick={() => navigate('/projects/create')}>
                  <span className="btn-plus">+</span>
                </button>
              )}
              
              <Dropdown align="end">
                <Dropdown.Toggle className="user-dropdown" id="user-dropdown">
                  <div className="user-avatar">
                    {(user?.first_name || user?.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user?.first_name || user?.username}</span>
                    <span className="user-role">{user?.role}</span>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="user-menu">
                  {user?.role === 'admin' && (
                    <>
                      <Dropdown.Item onClick={() => navigate('/projects/create')}>
                        New Project
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => navigate('/users/create')}>
                        Add User
                      </Dropdown.Item>
                      <Dropdown.Divider />
                    </>
                  )}
                  <Dropdown.Item onClick={handleLogout} className="logout-item">
                    Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
