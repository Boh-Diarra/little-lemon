import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from './BookingForm';

export function initializeTimes() {
    if (window.fetchAPI) {
        const today = new Date();
        return window.fetchAPI(today);
    }
    return [];
}

export function updateTimes(state, action) {
    if (window.fetchAPI && action && action.date) {
        return window.fetchAPI(new Date(action.date));
    }
    return state;
}

function Main() {
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        // Format YYYY-MM-DD pour l'input type="date"
        return today.toISOString().split('T')[0];
    });

    // Utilisation de useReducer pour gérer les horaires disponibles
    const [availableTimes, dispatch] = useReducer(updateTimes, [], initializeTimes);

    // État pour stocker les réservations
    const [bookingData, setBookingData] = useState([]);

    // Pour la navigation après soumission
    const navigate = useNavigate();

    // Charger les horaires disponibles à chaque changement de date
    useEffect(() => {
        dispatch({ type: 'UPDATE_TIMES', date: selectedDate });
    }, [selectedDate]);

    // Fonction pour BookingForm pour changer la date
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Fonction pour ajouter une réservation
    const addBooking = (booking) => {
        setBookingData((prev) => [...prev, booking]);
    };

    // Fonction de soumission du formulaire
    const submitForm = (formData) => {
        if (window.submitAPI) {
            const result = window.submitAPI(formData);
            if (result) {
                navigate('/booking-confirmed');
            } else {
                alert('Erreur lors de la réservation. Veuillez réessayer.');
            }
        } else {
            alert('API de soumission non disponible.');
        }
    };

    return (
        <main className="main">
            <section className="hero">
                <h2>Welcome to Little Lemon</h2>
                <p>Discover our delicious Mediterranean cuisine</p>
            </section>
            <BookingForm 
                availableTimes={availableTimes}
                onDateChange={handleDateChange}
                selectedDate={selectedDate}
                onBookingSubmit={submitForm}
            />
            {/* Tableau des réservations */}
            {bookingData.length > 0 && (
                <section style={{marginTop: '2rem'}}>
                    <h3>Réservations enregistrées</h3>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                      <caption>Liste des réservations enregistrées</caption>
                        <thead>
                            <tr>
                                <th style={{border: '1px solid #ccc', padding: '8px'}}>Date</th>
                                <th style={{border: '1px solid #ccc', padding: '8px'}}>Heure</th>
                                <th style={{border: '1px solid #ccc', padding: '8px'}}>Invités</th>
                                <th style={{border: '1px solid #ccc', padding: '8px'}}>Occasion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingData.map((b, idx) => (
                                <tr key={idx}>
                                    <td style={{border: '1px solid #ccc', padding: '8px'}}>{b.date}</td>
                                    <td style={{border: '1px solid #ccc', padding: '8px'}}>{b.time}</td>
                                    <td style={{border: '1px solid #ccc', padding: '8px'}}>{b.guests}</td>
                                    <td style={{border: '1px solid #ccc', padding: '8px'}}>{b.occasion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}
        </main>
    );
}

export default Main;