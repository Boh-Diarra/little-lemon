import React from 'react';

function ConfirmedBooking() {
  return (
    <div className="confirmation-page" style={{textAlign: 'center', marginTop: '3rem'}}>
      <h2>Réservation confirmée !</h2>
      <p style={{color: 'var(--text-color)'}}>Merci pour votre réservation chez Little Lemon.<br />Nous avons bien enregistré votre demande.</p>
      <span role="img" aria-label="confirmation" style={{fontSize: '3rem'}}>✅</span>
    </div>
  );
}

export default ConfirmedBooking; 