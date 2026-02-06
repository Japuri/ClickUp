import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { logout } from "../redux/slices/authSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header>
      <Navbar expand="lg" bg="primary" variant="dark">
        <Container fluid>
          <Navbar.Brand onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
            Project Management
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/dashboard")}>Dashboard</Nav.Link>
              {user?.role === "admin" && (
                <>
                  <Nav.Link onClick={() => navigate("/projects/create")}>
                    Create Project
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/users")}>Users</Nav.Link>
                  <Nav.Link onClick={() => navigate("/users/create")}>
                    Create User
                  </Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              <NavDropdown
                title={`${user?.first_name || "User"} (${user?.role || ""})`}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item disabled>
                  {user?.email}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
  );
}

export default Header;
