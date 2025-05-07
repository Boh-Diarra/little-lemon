import './App.css';
import './styles.css';
import Nav from './components/Nav';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Nav />
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/menu" element={<div>Menu Page</div>} />
          <Route path="/reservations" element={<div>Reservations Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
