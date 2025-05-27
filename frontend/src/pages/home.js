import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../components/header';
import Footer from '../components/footer';
import ScholarshipCard from '../components/ScholarshipCard';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Home() {
  return (
    <>
      <Header />

      <main className="container mt-5">
        <h2 className="text-center">Available Scholarships</h2>
        <div className="row">
          <ScholarshipCard />
          <ScholarshipCard />
          <ScholarshipCard />
          <ScholarshipCard />
          <ScholarshipCard />
          <ScholarshipCard />
          <ScholarshipCard />
          <ScholarshipCard />
          <ScholarshipCard />
        </div>
      </main>

      <Footer />
    </>
  );
}
