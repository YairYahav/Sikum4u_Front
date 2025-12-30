import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css'; 

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="white" expand="lg" shadow="sm" className="border-bottom py-3">
      <Container fluid>
        {/* צד שמאל: שם האתר */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          Sikum4u
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          {/* אמצע: קישורים (שימוש ב-mx-auto ממקם אותם באמצע) */}
          <Nav className="mx-auto text-center">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/files">Files</Nav.Link>
            <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
            
            {/* הצגת Admin רק אם למשתמש יש הרשאה */}
            {user && (user.role === 'admin' || user.isAdmin) && (
              <Nav.Link as={Link} to="/admin" className="text-danger fw-bold">
                Admin Panel
              </Nav.Link>
            )}
          </Nav>

          {/* צד ימין: התחברות או משתמש */}
          <Nav className="ms-auto align-items-center justify-content-center">
            {user ? (
              <>
                {/* כפתור יציאה */}
                <span 
                  onClick={handleLogout} 
                  style={{ cursor: 'pointer' }} 
                  className="me-3 text-secondary"
                >
                  Logout
                </span>

                {/* עיגול משתמש */}
                <Link to="/user" className="user-circle">
                  {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </Link>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary px-4 rounded-pill">
                Login
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;