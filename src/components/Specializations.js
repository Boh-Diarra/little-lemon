import React from 'react';
import './Specializations.css';

function Specializations() {
  const specials = [
    {
      id: 1,
      title: "Salade Grecque",
      price: "$12.99",
      description: "Notre célèbre salade grecque avec des tomates fraîches, des concombres, des olives et de la feta.",
      image: "images/greek-salad.jpg"
    },
    {
      id: 2,
      title: "Bruschetta",
      price: "$8.99",
      description: "Pain grillé garni de tomates fraîches, d'ail, de basilic et d'huile d'olive extra vierge.",
      image: "images/bruschetta.jpg"
    },
    {
      id: 3,
      title: "Lemon Dessert",
      price: "$6.99",
      description: "Notre dessert signature au citron, une tarte légère et rafraîchissante.",
      image: "images/lemon-dessert.jpg"
    }
  ];

  return (
    <section className="specials">
      <div className="specials-header">
        <h2>Cette semaine spéciale</h2>
        <button className="menu-button">Menu en ligne</button>
      </div>
      <ul className="specials-grid" style={{listStyle: 'none', padding: 0, margin: 0}}>
        {specials.map((special) => (
          <li key={special.id} className="special-card" style={{marginBottom: '1rem'}}>
            <article>
              <div className="special-image">
                <img src={special.image} alt={special.title} />
              </div>
              <div className="special-content">
                <div className="special-header">
                  <h3>{special.title}</h3>
                  <span className="price">{special.price}</span>
                </div>
                <p>{special.description}</p>
                <button className="order-button" aria-label={`Commander ${special.title} pour livraison`}>
                  Commander pour livraison
                </button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Specializations; 