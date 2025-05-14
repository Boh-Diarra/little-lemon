import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingForm from "./BookingForm";

// Mock des props nécessaires pour BookingForm
const mockAvailableTimes = ["17:00", "18:00", "19:00"];
const mockOnDateChange = jest.fn();
const mockOnBookingSubmit = jest.fn();
const mockSelectedDate = "2024-03-20";

// Fonction utilitaire pour rendre le composant avec les props par défaut
const renderBookingForm = (props = {}) => {
  const defaultProps = {
    availableTimes: mockAvailableTimes,
    onDateChange: mockOnDateChange,
    selectedDate: mockSelectedDate,
    onBookingSubmit: mockOnBookingSubmit,
    ...props
  };
  return render(<BookingForm {...defaultProps} />);
};

describe("BookingForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test du rendu initial
  test("Renders the BookingForm heading", () => {
    renderBookingForm();
    const headingElement = screen.getByText("Réserver une table");
    expect(headingElement).toBeInTheDocument();
  });

  // Test des champs requis
  test("Renders all required form fields", () => {
    renderBookingForm();
    expect(screen.getByLabelText(/choisir une date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/choisir une heure/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre d'invités/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
  });

  // Test de la validation de la date
  describe("Date validation", () => {
    test("Shows error for past date", async () => {
      renderBookingForm();
      const dateInput = screen.getByLabelText(/choisir une date/i);
      
      // Sélectionner une date passée
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const pastDateString = pastDate.toISOString().split('T')[0];
      
      await userEvent.type(dateInput, pastDateString);
      fireEvent.blur(dateInput);

      expect(await screen.findByText(/la date ne peut pas être dans le passé/i)).toBeInTheDocument();
    });

    test("Shows error for empty date", async () => {
      renderBookingForm();
      const dateInput = screen.getByLabelText(/choisir une date/i);
      
      fireEvent.change(dateInput, { target: { value: "" } });
      fireEvent.blur(dateInput);

      expect(await screen.findByText(/la date est requise/i)).toBeInTheDocument();
    });
  });

  // Test de la validation du nombre d'invités
  describe("Guests validation", () => {
    test("Shows error for less than 1 guest", async () => {
      renderBookingForm();
      const guestsInput = screen.getByLabelText(/nombre d'invités/i);
      
      await userEvent.clear(guestsInput);
      await userEvent.type(guestsInput, "0");
      fireEvent.blur(guestsInput);

      expect(await screen.findByText(/le nombre minimum d'invités est 1/i)).toBeInTheDocument();
    });

    test("Shows error for more than 10 guests", async () => {
      renderBookingForm();
      const guestsInput = screen.getByLabelText(/nombre d'invités/i);
      
      await userEvent.clear(guestsInput);
      await userEvent.type(guestsInput, "11");
      fireEvent.blur(guestsInput);

      expect(await screen.findByText(/le nombre maximum d'invités est 10/i)).toBeInTheDocument();
    });
  });

  // Test de la validation de l'heure
  describe("Time validation", () => {
    test("Shows error for empty time selection", async () => {
      renderBookingForm();
      const timeSelect = screen.getByLabelText(/choisir une heure/i);
      
      fireEvent.change(timeSelect, { target: { value: "" } });
      fireEvent.blur(timeSelect);

      expect(await screen.findByText(/l'heure est requise/i)).toBeInTheDocument();
    });

    test("Shows error for unavailable time", async () => {
      renderBookingForm();
      const timeSelect = screen.getByLabelText(/choisir une heure/i);
      
      // Simuler une heure non disponible
      fireEvent.change(timeSelect, { target: { value: "20:00" } });
      fireEvent.blur(timeSelect);

      expect(await screen.findByText(/cette heure n'est pas disponible/i)).toBeInTheDocument();
    });
  });

  // Test de la validation de l'occasion
  describe("Occasion validation", () => {
    test("Shows error for empty occasion", async () => {
      renderBookingForm();
      const occasionSelect = screen.getByLabelText(/occasion/i);
      
      fireEvent.change(occasionSelect, { target: { value: "" } });
      fireEvent.blur(occasionSelect);

      expect(await screen.findByText(/l'occasion est requise/i)).toBeInTheDocument();
    });
  });

  // Test de la soumission du formulaire
  describe("Form submission", () => {
    test("Submits form with valid data", async () => {
      renderBookingForm();
      
      // Remplir le formulaire avec des données valides
      const dateInput = screen.getByLabelText(/choisir une date/i);
      const timeSelect = screen.getByLabelText(/choisir une heure/i);
      const guestsInput = screen.getByLabelText(/nombre d'invités/i);
      const occasionSelect = screen.getByLabelText(/occasion/i);
      
      await userEvent.type(dateInput, "2024-03-25");
      fireEvent.change(timeSelect, { target: { value: "17:00" } });
      await userEvent.clear(guestsInput);
      await userEvent.type(guestsInput, "4");
      fireEvent.change(occasionSelect, { target: { value: "Anniversaire" } });

      // Soumettre le formulaire
      const submitButton = screen.getByRole("button", { name: /faire votre réservation/i });
      await userEvent.click(submitButton);

      // Vérifier que onBookingSubmit a été appelé avec les bonnes données
      expect(mockOnBookingSubmit).toHaveBeenCalledWith({
        date: "2024-03-25",
        time: "17:00",
        guests: "4",
        occasion: "Anniversaire"
      });
    });

    test("Disables submit button when form is invalid", async () => {
      renderBookingForm();
      
      const submitButton = screen.getByRole("button", { name: /faire votre réservation/i });
      expect(submitButton).toBeDisabled();
    });

    test("Shows loading state during submission", async () => {
      // Simuler une soumission asynchrone
      mockOnBookingSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      renderBookingForm();
      
      // Remplir le formulaire avec des données valides
      const dateInput = screen.getByLabelText(/choisir une date/i);
      const timeSelect = screen.getByLabelText(/choisir une heure/i);
      const guestsInput = screen.getByLabelText(/nombre d'invités/i);
      const occasionSelect = screen.getByLabelText(/occasion/i);
      
      await userEvent.type(dateInput, "2024-03-25");
      fireEvent.change(timeSelect, { target: { value: "17:00" } });
      await userEvent.clear(guestsInput);
      await userEvent.type(guestsInput, "4");
      fireEvent.change(occasionSelect, { target: { value: "Anniversaire" } });

      // Soumettre le formulaire
      const submitButton = screen.getByRole("button", { name: /faire votre réservation/i });
      await userEvent.click(submitButton);

      // Vérifier que le bouton affiche l'état de chargement
      expect(screen.getByText(/envoi en cours/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      // Attendre que la soumission soit terminée
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    test("Shows error message on submission failure", async () => {
      // Simuler une erreur de soumission
      mockOnBookingSubmit.mockRejectedValue(new Error("Erreur de soumission"));
      
      renderBookingForm();
      
      // Remplir le formulaire avec des données valides
      const dateInput = screen.getByLabelText(/choisir une date/i);
      const timeSelect = screen.getByLabelText(/choisir une heure/i);
      const guestsInput = screen.getByLabelText(/nombre d'invités/i);
      const occasionSelect = screen.getByLabelText(/occasion/i);
      
      await userEvent.type(dateInput, "2024-03-25");
      fireEvent.change(timeSelect, { target: { value: "17:00" } });
      await userEvent.clear(guestsInput);
      await userEvent.type(guestsInput, "4");
      fireEvent.change(occasionSelect, { target: { value: "Anniversaire" } });

      // Soumettre le formulaire
      const submitButton = screen.getByRole("button", { name: /faire votre réservation/i });
      await userEvent.click(submitButton);

      // Vérifier que le message d'erreur s'affiche
      expect(await screen.findByText(/une erreur est survenue lors de la soumission du formulaire/i)).toBeInTheDocument();
    });
  });

  // Tests des attributs HTML5 de validation
  describe("HTML5 validation attributes", () => {
    test("Date input has correct HTML5 validation attributes", () => {
      renderBookingForm();
      const dateInput = screen.getByLabelText(/choisir une date/i);
      
      // Vérifier les attributs de validation
      expect(dateInput).toHaveAttribute("type", "date");
      expect(dateInput).toHaveAttribute("required");
      expect(dateInput).toHaveAttribute("min");
      expect(dateInput.getAttribute("min")).toBe(new Date().toISOString().split('T')[0]);
      expect(dateInput).toHaveAttribute("aria-required", "true");
    });

    test("Time select has correct HTML5 validation attributes", () => {
      renderBookingForm();
      const timeSelect = screen.getByLabelText(/choisir une heure/i);
      
      // Vérifier les attributs de validation
      expect(timeSelect).toHaveAttribute("required");
      expect(timeSelect).toHaveAttribute("aria-required", "true");
      
      // Vérifier que l'option vide est désactivée
      const emptyOption = timeSelect.querySelector('option[value=""]');
      expect(emptyOption).toHaveAttribute("disabled");
    });

    test("Guests input has correct HTML5 validation attributes", () => {
      renderBookingForm();
      const guestsInput = screen.getByLabelText(/nombre d'invités/i);
      
      // Vérifier les attributs de validation
      expect(guestsInput).toHaveAttribute("type", "number");
      expect(guestsInput).toHaveAttribute("required");
      expect(guestsInput).toHaveAttribute("min", "1");
      expect(guestsInput).toHaveAttribute("max", "10");
      expect(guestsInput).toHaveAttribute("step", "1");
      expect(guestsInput).toHaveAttribute("inputMode", "numeric");
      expect(guestsInput).toHaveAttribute("pattern", "[1-9]|10");
      expect(guestsInput).toHaveAttribute("aria-required", "true");
    });

    test("Occasion select has correct HTML5 validation attributes", () => {
      renderBookingForm();
      const occasionSelect = screen.getByLabelText(/occasion/i);
      
      // Vérifier les attributs de validation
      expect(occasionSelect).toHaveAttribute("required");
      expect(occasionSelect).toHaveAttribute("aria-required", "true");
      
      // Vérifier que l'option vide est présente
      const emptyOption = occasionSelect.querySelector('option[value=""]');
      expect(emptyOption).toBeInTheDocument();
      expect(emptyOption).toHaveTextContent("Sélectionnez une occasion");
    });

    test("Form has correct HTML5 validation attributes", () => {
      renderBookingForm();
      const form = screen.getByRole("form");
      
      // Vérifier les attributs de validation du formulaire
      expect(form).toHaveAttribute("noValidate");
    });

    test("Submit button has correct HTML5 validation attributes", () => {
      renderBookingForm();
      const submitButton = screen.getByRole("button", { name: /faire votre réservation/i });
      
      // Vérifier les attributs du bouton
      expect(submitButton).toHaveAttribute("type", "submit");
      expect(submitButton).toHaveAttribute("disabled");
    });

    test("Error messages have correct ARIA attributes", async () => {
      renderBookingForm();
      const dateInput = screen.getByLabelText(/choisir une date/i);
      
      // Déclencher une erreur
      fireEvent.change(dateInput, { target: { value: "" } });
      fireEvent.blur(dateInput);

      // Attendre que le message d'erreur apparaisse
      const errorMessage = await screen.findByText(/la date est requise/i);
      
      // Vérifier les attributs ARIA
      expect(errorMessage).toHaveAttribute("role", "alert");
      expect(errorMessage).toHaveAttribute("id", "date-error");
      expect(dateInput).toHaveAttribute("aria-invalid", "true");
      expect(dateInput).toHaveAttribute("aria-describedby", "date-error");
    });
  });

  // Tests des fonctions de validation JavaScript
  describe("JavaScript validation functions", () => {
    describe("Date validation", () => {
      test("Validates future date correctly", async () => {
        renderBookingForm();
        const dateInput = screen.getByLabelText(/choisir une date/i);
        
        // Sélectionner une date future
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const futureDateString = futureDate.toISOString().split('T')[0];
        
        await userEvent.type(dateInput, futureDateString);
        fireEvent.blur(dateInput);

        // Vérifier qu'il n'y a pas de message d'erreur
        const errorMessage = screen.queryByText(/la date ne peut pas être dans le passé/i);
        expect(errorMessage).not.toBeInTheDocument();
      });

      test("Validates today's date correctly", async () => {
        renderBookingForm();
        const dateInput = screen.getByLabelText(/choisir une date/i);
        
        // Sélectionner la date d'aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        
        await userEvent.type(dateInput, today);
        fireEvent.blur(dateInput);

        // Vérifier qu'il n'y a pas de message d'erreur
        const errorMessage = screen.queryByText(/la date ne peut pas être dans le passé/i);
        expect(errorMessage).not.toBeInTheDocument();
      });
    });

    describe("Time validation", () => {
      test("Validates available time correctly", async () => {
        renderBookingForm();
        const timeSelect = screen.getByLabelText(/choisir une heure/i);
        
        // Sélectionner une heure disponible
        fireEvent.change(timeSelect, { target: { value: "17:00" } });
        fireEvent.blur(timeSelect);

        // Vérifier qu'il n'y a pas de message d'erreur
        const errorMessage = screen.queryByText(/cette heure n'est pas disponible/i);
        expect(errorMessage).not.toBeInTheDocument();
      });

      test("Validates time selection when available times change", async () => {
        const { rerender } = renderBookingForm();
        const timeSelect = screen.getByLabelText(/choisir une heure/i);
        
        // Sélectionner une heure
        fireEvent.change(timeSelect, { target: { value: "17:00" } });
        
        // Changer les heures disponibles
        const newAvailableTimes = ["18:00", "19:00"];
        rerender(
          <BookingForm
            availableTimes={newAvailableTimes}
            onDateChange={mockOnDateChange}
            selectedDate={mockSelectedDate}
            onBookingSubmit={mockOnBookingSubmit}
          />
        );

        // Vérifier que l'heure précédemment sélectionnée n'est plus valide
        fireEvent.blur(timeSelect);
        expect(await screen.findByText(/cette heure n'est pas disponible/i)).toBeInTheDocument();
      });
    });

    describe("Guests validation", () => {
      test("Validates valid guest numbers correctly", async () => {
        renderBookingForm();
        const guestsInput = screen.getByLabelText(/nombre d'invités/i);
        
        // Tester plusieurs nombres valides
        const validNumbers = ["1", "5", "10"];
        
        for (const number of validNumbers) {
          await userEvent.clear(guestsInput);
          await userEvent.type(guestsInput, number);
          fireEvent.blur(guestsInput);

          // Vérifier qu'il n'y a pas de message d'erreur
          const errorMessage = screen.queryByText(/le nombre (minimum|maximum) d'invités est/i);
          expect(errorMessage).not.toBeInTheDocument();
        }
      });

      test("Validates decimal numbers correctly", async () => {
        renderBookingForm();
        const guestsInput = screen.getByLabelText(/nombre d'invités/i);
        
        // Tester des nombres décimaux
        await userEvent.clear(guestsInput);
        await userEvent.type(guestsInput, "2.5");
        fireEvent.blur(guestsInput);

        // Vérifier que le nombre est arrondi à l'entier le plus proche
        expect(guestsInput.value).toBe("3");
      });
    });

    describe("Form state validation", () => {
      test("Updates form validity state correctly", async () => {
        renderBookingForm();
        const submitButton = screen.getByRole("button", { name: /faire votre réservation/i });
        
        // Vérifier que le bouton est désactivé initialement
        expect(submitButton).toBeDisabled();

        // Remplir le formulaire avec des données valides
        const dateInput = screen.getByLabelText(/choisir une date/i);
        const timeSelect = screen.getByLabelText(/choisir une heure/i);
        const guestsInput = screen.getByLabelText(/nombre d'invités/i);
        const occasionSelect = screen.getByLabelText(/occasion/i);
        
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const futureDateString = futureDate.toISOString().split('T')[0];
        
        await userEvent.type(dateInput, futureDateString);
        fireEvent.change(timeSelect, { target: { value: "17:00" } });
        await userEvent.clear(guestsInput);
        await userEvent.type(guestsInput, "4");
        fireEvent.change(occasionSelect, { target: { value: "Anniversaire" } });

        // Vérifier que le bouton est activé
        expect(submitButton).not.toBeDisabled();

        // Rendre le formulaire invalide
        await userEvent.clear(guestsInput);
        await userEvent.type(guestsInput, "0");
        fireEvent.blur(guestsInput);

        // Vérifier que le bouton est désactivé
        expect(submitButton).toBeDisabled();
      });

      test("Handles multiple validation errors correctly", async () => {
        renderBookingForm();
        
        // Rendre plusieurs champs invalides
        const dateInput = screen.getByLabelText(/choisir une date/i);
        const guestsInput = screen.getByLabelText(/nombre d'invités/i);
        
        // Date invalide
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        const pastDateString = pastDate.toISOString().split('T')[0];
        await userEvent.type(dateInput, pastDateString);
        
        // Nombre d'invités invalide
        await userEvent.clear(guestsInput);
        await userEvent.type(guestsInput, "11");
        
        // Déclencher la validation
        fireEvent.blur(dateInput);
        fireEvent.blur(guestsInput);

        // Vérifier que tous les messages d'erreur sont affichés
        expect(await screen.findByText(/la date ne peut pas être dans le passé/i)).toBeInTheDocument();
        expect(await screen.findByText(/le nombre maximum d'invités est 10/i)).toBeInTheDocument();
      });
    });

    describe("Error message handling", () => {
      test("Clears error messages when field becomes valid", async () => {
        renderBookingForm();
        const dateInput = screen.getByLabelText(/choisir une date/i);
        
        // Créer une erreur
        fireEvent.change(dateInput, { target: { value: "" } });
        fireEvent.blur(dateInput);
        expect(await screen.findByText(/la date est requise/i)).toBeInTheDocument();

        // Corriger l'erreur
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const futureDateString = futureDate.toISOString().split('T')[0];
        await userEvent.type(dateInput, futureDateString);
        fireEvent.blur(dateInput);

        // Vérifier que le message d'erreur a disparu
        const errorMessage = screen.queryByText(/la date est requise/i);
        expect(errorMessage).not.toBeInTheDocument();
      });

      test("Maintains error state until field is touched", async () => {
        renderBookingForm();
        const dateInput = screen.getByLabelText(/choisir une date/i);
        
        // Créer une erreur
        fireEvent.change(dateInput, { target: { value: "" } });
        fireEvent.blur(dateInput);
        expect(await screen.findByText(/la date est requise/i)).toBeInTheDocument();

        // Changer la valeur sans toucher le champ
        fireEvent.change(dateInput, { target: { value: "2024-03-25" } });
        
        // Vérifier que le message d'erreur est toujours présent
        expect(screen.getByText(/la date est requise/i)).toBeInTheDocument();

        // Toucher le champ
        fireEvent.blur(dateInput);

        // Vérifier que le message d'erreur a disparu
        const errorMessage = screen.queryByText(/la date est requise/i);
        expect(errorMessage).not.toBeInTheDocument();
      });
    });
  });
}); 