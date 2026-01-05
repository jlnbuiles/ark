const API_URL = 'http://localhost:3001/api';

export const fetchStudents = async (searchTerm = '', page = 1, limit = 10) => {
  const response = await fetch(
    `${API_URL}/students?search=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`
  );
  if (!response.ok) throw new Error('Failed to fetch students');
  return await response.json();
};

export const fetchStudentDetails = async (studentId) => {
  const response = await fetch(`${API_URL}/students/${studentId}`);
  if (!response.ok) throw new Error('Failed to fetch student details');
  return await response.json();
};

export const createStudent = async (studentData) => {
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) throw new Error('Failed to add student');
  return await response.json();
};

export const updateStudentCredits = async (studentId, creditsToAdd) => {
  const response = await fetch(`${API_URL}/students/${studentId}/credits`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ creditsToAdd }),
  });

  if (!response.ok) throw new Error('Failed to update credits');
  return await response.json();
};

export const getStudentScheduledCount = async (studentId) => {
  try {
    const response = await fetch(`${API_URL}/students/${studentId}/scheduled-count`);
    if (!response.ok) return 0;
    const data = await response.json();
    return data.count || 0;
  } catch (err) {
    console.error('Error fetching scheduled lessons count:', err);
    return 0;
  }
};

export const validateStudentForm = (formData) => {
  const errors = {};
  
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  }
  
  if (!formData.guardianName.trim()) {
    errors.guardianName = 'Guardian name is required';
  }
  
  if (!formData.guardianEmail.trim()) {
    errors.guardianEmail = 'Guardian email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guardianEmail)) {
    errors.guardianEmail = 'Please enter a valid email address';
  }
  
  if (!formData.guardianPhone.trim()) {
    errors.guardianPhone = 'Guardian phone is required';
  } else if (!/^[\d\s\-()+ ]+$/.test(formData.guardianPhone)) {
    errors.guardianPhone = 'Please enter a valid phone number';
  }
  
  if (!formData.guardianAddress.trim()) {
    errors.guardianAddress = 'Guardian address is required';
  }
  
  if (!formData.lessonsRemaining || parseInt(formData.lessonsRemaining) < 1) {
    errors.lessonsRemaining = 'Please enter a valid number of lessons (minimum 1)';
  }
  
  return errors;
};
