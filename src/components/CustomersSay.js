import React from 'react';
import './CustomersSay.css';

function CustomersSay() {
  const testimonials = [
    {
      id: 1,
      name: "Marie Dupont",
      rating: 5,
      image: "/customer1.jpg",
      review: "La meilleure expérience culinaire que j'ai eue à Chicago. Le service était impeccable et la nourriture délicieuse !"
    },
    {
      id: 2,
      name: "Jean Martin",
      rating: 4,
      image: "/customer2.jpg",
      review: "Une ambiance chaleureuse et des plats authentiques. Je recommande vivement la salade grecque !"
    },
    {
      id: 3,
      name: "Sophie Bernard",
      rating: 5,
      image: "/customer3.jpg",
      review: "Un restaurant familial parfait pour les occasions spéciales. Le personnel est très attentionné."
    },
    {
      id: 4,
      name: "Pierre Dubois",
      rating: 5,
      image: "/customer4.jpg",
      review: "Les saveurs méditerranéennes sont parfaitement exécutées. Je reviendrai certainement !"
    }
  ];

  const renderStars = (rating) => {
    return Array(5).fill().map((_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="testimonials">
      <h2>Ce que nos clients disent</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-header">
              <div className="rating">{renderStars(testimonial.rating)}</div>
              <div className="customer-info">
                <img src={testimonial.image} alt={testimonial.name} />
                <h3>{testimonial.name}</h3>
              </div>
            </div>
            <p>{testimonial.review}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CustomersSay; 