const API_URL = 'http://localhost:3001/api';

export const fetchSchedule = async (date) => {
  const dateStr = date.toISOString().split('T')[0];
  const response = await fetch(`${API_URL}/schedule?date=${dateStr}`);
  if (!response.ok) throw new Error('Failed to fetch schedule');
  return await response.json();
};

export const checkInLesson = async (date, time, studentId) => {
  const dateStr = date.toISOString().split('T')[0];
  const response = await fetch(`${API_URL}/lessons/checkin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date: dateStr,
      time,
      studentId
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to check in');
  }

  return await response.json();
};

export const undoLessonCheckIn = async (date, time, studentId) => {
  const response = await fetch(`${API_URL}/lessons/undo-checkin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date,
      time,
      studentId
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to undo check-in');
  }

  return await response.json();
};

export const checkLessonAvailability = async (date, time, horseId, instructorId) => {
  const response = await fetch(`${API_URL}/lessons/check-availability`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date,
      time,
      horseId: parseInt(horseId),
      instructorId: parseInt(instructorId)
    }),
  });

  return response.ok;
};

export const scheduleLesson = async (lessonData) => {
  const response = await fetch(`${API_URL}/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lessonData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to schedule lesson');
  }

  return await response.json();
};
