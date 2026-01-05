const API_URL = 'http://localhost:3001/api';

export const fetchInstructors = async () => {
  const response = await fetch(`${API_URL}/teachers`);
  if (!response.ok) throw new Error('Failed to fetch teachers');
  return await response.json();
};

export const fetchInstructorDetails = async (instructorId) => {
  const response = await fetch(`${API_URL}/teachers/${instructorId}`);
  if (!response.ok) throw new Error('Failed to fetch instructor details');
  return await response.json();
};

export const createInstructor = async (instructorData) => {
  const response = await fetch(`${API_URL}/teachers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...instructorData,
      experience: parseInt(instructorData.experience)
    }),
  });

  if (!response.ok) throw new Error('Failed to create instructor');
  return await response.json();
};
