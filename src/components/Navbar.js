import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Bharat Law Associates</div>
      <ul className="navbar-menu">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About Us</a></li>
        <li><a href="#lawyers">Our Lawyers</a></li>
        <li><a href="#contact">Contact Us</a></li>
        <li><a href="#join-us">Join Us</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
