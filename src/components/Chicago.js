import React from 'react';
import './Chicago.css';

function Chicago() {
  return (
    <section className="chicago">
      <div className="chicago-content">
        <div className="chicago-text">
          <h2>Little Lemon</h2>
          <h3>Chicago</h3>
          <p>
            Little Lemon est un restaurant familial méditerranéen situé au cœur de Chicago.
            Fondé en 1995 par la famille Lemon, notre restaurant est devenu un lieu de rencontre
            privilégié pour les amateurs de cuisine méditerranéenne authentique.
          </p>
          <p>
            Notre chef exécutif, Mario Lemon, combine des recettes traditionnelles transmises
            de génération en génération avec des techniques culinaires modernes pour créer
            une expérience gastronomique unique.
          </p>
        </div>
        <div className="chicago-images">
          <img 
            src="images/mario-and-adrian.jpg" 
            alt="Mario et Adrian, les chefs de Little Lemon" 
            className="chefs-image"
          />
          <img 
            src="images/restaurant.jpg" 
            alt="Notre restaurant à Chicago" 
            className="restaurant-image"
          />
        </div>
      </div>
    </section>
  );
}

export default Chicago; 