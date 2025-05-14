import React, { useState, useEffect, useCallback } from 'react';

function BookingForm({ availableTimes, onDateChange, selectedDate, onBookingSubmit }) {
  // États pour chaque champ du formulaire
  const [date, setDate] = useState(selectedDate || "");
  const [time, setTime] = useState(availableTimes && availableTimes.length > 0 ? availableTimes[0] : "");
  const [guests, setGuests] = useState(1);
  const [occasion, setOccasion] = useState("Anniversaire");

  // États pour les erreurs et la validation
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Validation des champs
  const validateField = useCallback((name, value) => {
    let error = "";
    switch (name) {
      case "date":
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (!value) {
          error = "La date est requise";
        } else if (selectedDate < today) {
          error = "La date ne peut pas être dans le passé";
        }
        break;
      case "time":
        if (!value) {
          error = "L'heure est requise";
        } else if (!availableTimes?.includes(value)) {
          error = "Cette heure n'est pas disponible";
        }
        break;
      case "guests":
        if (!value) {
          error = "Le nombre d'invités est requis";
        } else if (value < 1) {
          error = "Le nombre minimum d'invités est 1";
        } else if (value > 10) {
          error = "Le nombre maximum d'invités est 10";
        }
        break;
      case "occasion":
        if (!value) {
          error = "L'occasion est requise";
        }
        break;
      default:
        break;
    }
    return error;
  }, [availableTimes]);

  // Vérifier si le formulaire est valide
  const isFormValid = useCallback(() => {
    const newErrors = {
      date: validateField("date", date),
      time: validateField("time", time),
      guests: validateField("guests", guests),
      occasion: validateField("occasion", occasion)
    };
    return !Object.values(newErrors).some(error => error !== "");
  }, [date, time, guests, occasion, validateField]);

  // Gestionnaire de changement de date
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setTouched(prev => ({ ...prev, date: true }));
    setErrors(prev => ({ ...prev, date: validateField("date", newDate) }));
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  // Gestionnaire de changement de champ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));

    switch (name) {
      case "time":
        setTime(value);
        break;
      case "guests":
        setGuests(value);
        break;
      case "occasion":
        setOccasion(value);
        break;
      default:
        break;
    }
  };

  // Gestionnaire de perte de focus
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Valider tous les champs
    const newErrors = {
      date: validateField("date", date),
      time: validateField("time", time),
      guests: validateField("guests", guests),
      occasion: validateField("occasion", occasion)
    };
    
    setErrors(newErrors);
    setTouched({
      date: true,
      time: true,
      guests: true,
      occasion: true
    });

    // Vérifier s'il y a des erreurs
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
      const booking = {
        date,
        time,
        guests,
        occasion
      };
      if (onBookingSubmit) {
        await onBookingSubmit(booking);
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: "Une erreur est survenue lors de la soumission du formulaire"
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-form-container">
      <h2 className="booking-form-title">Réserver une table</h2>
      <form 
        className="booking-form-styled"
        onSubmit={handleSubmit}
        noValidate
        role="form"
      >
        <div className="form-group">
          <label htmlFor="res-date">Choisir une date</label>
          <input 
            type="date" 
            id="res-date"
            name="date"
            value={date}
            onChange={handleDateChange}
            onBlur={handleBlur}
            className={touched.date && errors.date ? "error" : ""}
            required
            min={new Date().toISOString().split('T')[0]}
            aria-required="true"
            aria-invalid={touched.date && errors.date ? "true" : "false"}
            aria-describedby={touched.date && errors.date ? "date-error" : undefined}
          />
          {touched.date && errors.date && (
            <span className="error-message" id="date-error" role="alert">{errors.date}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="res-time">Choisir une heure</label>
          <select 
            id="res-time"
            name="time"
            value={time}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.time && errors.time ? "error" : ""}
            required
            aria-required="true"
            aria-invalid={touched.time && errors.time ? "true" : "false"}
            aria-describedby={touched.time && errors.time ? "time-error" : undefined}
          >
            <option value="" disabled>Sélectionnez une heure</option>
            {availableTimes && availableTimes.length > 0 ? (
              availableTimes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))
            ) : (
              <option value="" disabled>Aucune heure disponible</option>
            )}
          </select>
          {touched.time && errors.time && (
            <span className="error-message" id="time-error" role="alert">{errors.time}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="guests">Nombre d'invités</label>
          <input 
            type="number" 
            placeholder="1" 
            min="1" 
            max="10" 
            id="guests"
            name="guests"
            value={guests}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.guests && errors.guests ? "error" : ""}
            required
            step="1"
            inputMode="numeric"
            pattern="[1-9]|10"
            aria-required="true"
            aria-invalid={touched.guests && errors.guests ? "true" : "false"}
            aria-describedby={touched.guests && errors.guests ? "guests-error" : undefined}
          />
          {touched.guests && errors.guests && (
            <span className="error-message" id="guests-error" role="alert">{errors.guests}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="occasion">Occasion</label>
          <select 
            id="occasion"
            name="occasion"
            value={occasion}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.occasion && errors.occasion ? "error" : ""}
            required
            aria-required="true"
            aria-invalid={touched.occasion && errors.occasion ? "true" : "false"}
            aria-describedby={touched.occasion && errors.occasion ? "occasion-error" : undefined}
          >
            <option value="">Sélectionnez une occasion</option>
            <option value="Anniversaire">Anniversaire</option>
            <option value="Anniversaire de mariage">Anniversaire de mariage</option>
            <option value="Autre">Autre</option>
          </select>
          {touched.occasion && errors.occasion && (
            <span className="error-message" id="occasion-error" role="alert">{errors.occasion}</span>
          )}
        </div>
        {errors.submit && (
          <div className="form-error" role="alert">
            {errors.submit}
          </div>
        )}
        <button 
          type="submit" 
          className="booking-form-submit"
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? "Envoi en cours..." : "Faire votre réservation"}
        </button>
      </form>
    </div>
  );
}

export default BookingForm; 