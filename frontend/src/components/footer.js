// src/components/Footer.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 py-3">
      <div className="container text-center">
        <p>&copy; 2025 Bookstore. All rights reserved.</p>
      </div>
    </footer>
  );
}
