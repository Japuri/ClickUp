import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-text">
          © {new Date().getFullYear()} TaskFlow. Project Management System.
        </p>
      </div>
    </footer>
  );
}

export default Footer;