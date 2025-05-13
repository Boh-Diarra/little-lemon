import React, { useState, useEffect } from 'react';

function BookingForm({ availableTimes, onDateChange, selectedDate, onBookingSubmit }) {
  // États pour chaque champ du formulaire
  const [date, setDate] = useState(selectedDate || "");
  const [time, setTime] = useState(availableTimes && availableTimes.length > 0 ? availableTimes[0] : "");
  const [guests, setGuests] = useState(1);
  const [occasion, setOccasion] = useState("Anniversaire");

  // Synchroniser la date locale avec la prop
  useEffect(() => {
    setDate(selectedDate || "");
  }, [selectedDate]);

  // Synchroniser l'heure sélectionnée avec les horaires disponibles
  useEffect(() => {
    if (availableTimes && availableTimes.length > 0) {
      setTime(availableTimes[0]);
    } else {
      setTime("");
    }
  }, [availableTimes]);

  // Gestionnaire de changement de date
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Vérification : ne pas ajouter si un champ est vide
    if (!date || !time || !guests || !occasion) {
      return;
    }
    const booking = {
      date,
      time,
      guests,
      occasion
    };
    if (onBookingSubmit) {
      onBookingSubmit(booking);
    }
  };

  return (
    <div className="booking-form-container">
      <h2 className="booking-form-title">Réserver une table</h2>
      <form 
        className="booking-form-styled"
        onSubmit={handleSubmit}
      >
        <label htmlFor="res-date">Choisir une date</label>
        <input 
          type="date" 
          id="res-date"
          value={date}
          onChange={handleDateChange}
          required
        />
        
        <label htmlFor="res-time">Choisir une heure</label>
        <select 
          id="res-time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          // required
        >
          {availableTimes && availableTimes.length > 0 ? (
            availableTimes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))
          ) : (
            <option value="" disabled>Aucune heure disponible</option>
          )}
        </select>
        
        <label htmlFor="guests">Nombre d'invités</label>
        <input 
          type="number" 
          placeholder="1" 
          min="1" 
          max="10" 
          id="guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          required
        />
        
        <label htmlFor="occasion">Occasion</label>
        <select 
          id="occasion"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          required
        >
          <option>Anniversaire</option>
          <option>Anniversaire de mariage</option>
        </select>
        
        <input 
          type="submit" 
          value="Faire votre réservation" 
          className="booking-form-submit"
        />
      </form>
    </div>
  );
}

export default BookingForm; 