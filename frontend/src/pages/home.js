// src/pages/home.js
import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Home() {
  return (
    <>
      <Header />

      <div className="container mt-5">
        <h2 className="text-center">Main content goes here...</h2>
      </div>

      <Footer />
    </>
  );
}
