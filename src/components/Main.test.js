import { describe, test, expect } from '@jest/globals';
import { updateTimes, initializeTimes } from './Main';

describe('initializeTimes', () => {
  test('should return the available times from fetchAPI', () => {
    // Mock de window.fetchAPI
    const mockTimes = ["17:00", "18:00", "19:00"];
    window.fetchAPI = jest.fn().mockReturnValue(mockTimes);

    const result = initializeTimes();
    expect(result).toEqual(mockTimes);

    // Nettoyage du mock
    delete window.fetchAPI;
  });
});

describe('updateTimes', () => {
  test('should return the available times from fetchAPI for the given date', () => {
    const mockTimes = ["17:00", "18:00", "19:00"];
    window.fetchAPI = jest.fn().mockReturnValue(mockTimes);

    const state = [];
    const action = { type: 'UPDATE_TIMES', date: '2023-05-16' };
    const result = updateTimes(state, action);
    expect(result).toEqual(mockTimes);

    delete window.fetchAPI;
  });
}); 