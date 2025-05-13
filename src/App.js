import './App.css';
import './styles.css';
import Nav from './components/Nav';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CallToAction from './components/CallToAction';
import Specializations from './components/Specializations';
import CustomersSay from './components/CustomersSay';
import Chicago from './components/Chicago';
import BookingPage from './components/BookingPage';
import ConfirmedBooking from './components/ConfirmedBooking';

function HomePage() {
  return (
    <>
      <CallToAction />
      <Specializations />
      <CustomersSay />
      <Chicago />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Nav />
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<Chicago />} />
            <Route path="/menu" element={<Specializations />} />
            <Route path="/reservations" element={<BookingPage />} />
            <Route path="/booking-confirmed" element={<ConfirmedBooking />} />
            <Route path="/order-online" element={<div>Commande en ligne à venir</div>} />
            <Route path="/login" element={<div>Page de connexion à venir</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
