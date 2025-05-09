import React from 'react';
import { Link } from 'react-router-dom';
import './CallToAction.css';

function CallToAction() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Little Lemon</h1>
          <h2>Chicago</h2>
          <p>
            Nous sommes un restaurant familial méditerranéen, 
            nous nous concentrons sur des recettes traditionnelles 
            servies avec une touche moderne.
          </p>
          <Link to="/reservations" className="cta-button">
            Réserver une table
          </Link>
        </div>
        <div className="hero-image">
          <img 
            src="images/hero-image.jpg" 
            alt="Plats signature de Little Lemon" 
          />
        </div>
      </div>
    </section>
  );
}

export default CallToAction; 