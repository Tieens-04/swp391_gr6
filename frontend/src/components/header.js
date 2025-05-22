// src/components/Header.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">TEAM6</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><a className="nav-link active" href="/">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="/manage-books">Manage</a></li>
            <li className="nav-item"><a className="nav-link" href="/add-book">Add Book</a></li>
            <li className="nav-item"><a className="nav-link" href="/track-order">Track Order</a></li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item"><a className="nav-link" href="/cart"><i className="fas fa-shopping-cart"></i> Cart</a></li>
            <li className="nav-item"><a className="nav-link" href="/login">Login</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
