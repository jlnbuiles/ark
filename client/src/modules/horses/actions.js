const API_URL = 'http://localhost:3001/api';

export const fetchHorses = async () => {
  const response = await fetch(`${API_URL}/horses`);
  if (!response.ok) throw new Error('Failed to fetch horses');
  return await response.json();
};

export const fetchHorseLessonCounts = async (date) => {
  const dateStr = date.toISOString().split('T')[0];
  const response = await fetch(`${API_URL}/horses/lesson-counts?date=${dateStr}`);
  if (!response.ok) throw new Error('Failed to fetch horse lesson counts');
  return await response.json();
};
