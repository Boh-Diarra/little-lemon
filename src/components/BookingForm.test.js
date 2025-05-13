import { render, screen } from "@testing-library/react";
import BookingForm from "./BookingForm";

// Mock des props nécessaires pour BookingForm
const mockAvailableTimes = ["17:00", "18:00"];
const mockDispatch = jest.fn();

test('Renders the BookingForm heading', () => {
    render(<BookingForm availableTimes={mockAvailableTimes} dispatch={mockDispatch} />);
    const headingElement = screen.getByText("Réserver une table");
    expect(headingElement).toBeInTheDocument();
}); 