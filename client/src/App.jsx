import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faUsers, faUserPlus, faMagnifyingGlass, faStickyNote, faHorseHead, faHorse, faChartLine, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import SearchBox from './components/SearchBox';
import ConfirmModal from './components/ConfirmModal';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [horseSearchTerm, setHorseSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeTab, setActiveTab] = useState('schedule');
  const [formData, setFormData] = useState({ name: '', lessonsRemaining: '' });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduledLessons, setScheduledLessons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCheckInConfirm, setShowCheckInConfirm] = useState(false);
  const [lessonToCheckIn, setLessonToCheckIn] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [lastCheckedInLesson, setLastCheckedInLesson] = useState(null);
  const [horses, setHorses] = useState([]);
  const [horseLessonCounts, setHorseLessonCounts] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
  const [showInstructorDetails, setShowInstructorDetails] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [instructorFormData, setInstructorFormData] = useState({
    firstName: '',
    lastName: '',
    specialty: '',
    experience: '',
    certification: '',
    address: '',
    phone: ''
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [studentToSchedule, setStudentToSchedule] = useState(null);
  const [scheduleLessonForm, setScheduleLessonForm] = useState({
    date: '',
    time: '',
    horseId: '',
    instructorId: ''
  });
  const [showHorseModal, setShowHorseModal] = useState(false);
  const [editingHorse, setEditingHorse] = useState(null);
  const [horseFormData, setHorseFormData] = useState({
    name: '',
    condition: 'great'
  });
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    dateOfBirth: '',
    notes: '',
    specialConditions: [],
    guardianName: '',
    guardianEmail: '',
    guardianPhone: '',
    guardianAddress: '',
    lessonsRemaining: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const studentsPerPage = 10;

  // Fetch students when search term or page changes
  useEffect(() => {
    fetchStudents();
  }, [searchTerm, currentPage]);

  // Fetch horses when component mounts
  useEffect(() => {
    fetchHorses();
    fetchHorseLessonCounts();
    fetchTeachers();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/students?search=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${studentsPerPage}`
      );
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data.students);
      setTotalPages(data.totalPages);
      setTotalStudents(data.total);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHorses = async () => {
    try {
      const response = await fetch(`${API_URL}/horses`);
      if (!response.ok) throw new Error('Failed to fetch horses');
      const data = await response.json();
      setHorses(data);
    } catch (err) {
      console.error('Error fetching horses:', err);
    }
  };

  const fetchHorseLessonCounts = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`${API_URL}/horses/lesson-counts?date=${dateStr}`);
      if (!response.ok) throw new Error('Failed to fetch horse lesson counts');
      const data = await response.json();
      setHorseLessonCounts(data);
    } catch (err) {
      console.error('Error fetching horse lesson counts:', err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_URL}/teachers`);
      if (!response.ok) throw new Error('Failed to fetch teachers');
      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const handleCheckIn = async (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setStudentToSchedule(student);
      setScheduleLessonForm({
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        horseId: horses[0]?.id || '',
        instructorId: teachers[0]?.id || ''
      });
      setShowScheduleModal(true);
    }
  };

  const handleScheduleLessonFormChange = (e) => {
    const { name, value } = e.target;
    setScheduleLessonForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleLessonSubmit = async (e) => {
    e.preventDefault();
    
    if (!scheduleLessonForm.date || !scheduleLessonForm.time || !scheduleLessonForm.horseId || !scheduleLessonForm.instructorId) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      const horse = horses.find(h => h.id === parseInt(scheduleLessonForm.horseId));
      const instructor = teachers.find(t => t.id === parseInt(scheduleLessonForm.instructorId));
      
      const response = await fetch(`${API_URL}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: scheduleLessonForm.date,
          time: scheduleLessonForm.time,
          studentId: studentToSchedule.id,
          studentName: studentToSchedule.name,
          horseId: parseInt(scheduleLessonForm.horseId),
          horseName: horse?.name,
          instructorId: parseInt(scheduleLessonForm.instructorId),
          instructorName: `${instructor?.firstName} ${instructor?.lastName}`,
          lessonsRemaining: studentToSchedule.lessonsRemaining,
          specialConditions: studentToSchedule.specialConditions || []
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to schedule lesson');
      }

      // Close modal and refresh if on schedule tab
      setShowScheduleModal(false);
      setStudentToSchedule(null);
      if (activeTab === 'schedule') {
        fetchSchedule(selectedDate);
      }
      alert('Lesson scheduled successfully!');
    } catch (err) {
      alert(err.message);
      console.error('Error scheduling lesson:', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleHorseSearchChange = (e) => {
    setHorseSearchTerm(e.target.value);
  };

  const handleTeacherSearchChange = (e) => {
    setTeacherSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStudentFormChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData({
      ...studentFormData,
      [name]: value
    });
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleSpecialConditionsChange = (e) => {
    const { value, checked } = e.target;
    setStudentFormData(prev => {
      if (checked) {
        return {
          ...prev,
          specialConditions: [...prev.specialConditions, value]
        };
      } else {
        return {
          ...prev,
          specialConditions: prev.specialConditions.filter(item => item !== value)
        };
      }
    });
  };

  const validateStudentForm = () => {
    const errors = {};
    
    if (!studentFormData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!studentFormData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!studentFormData.guardianName.trim()) {
      errors.guardianName = 'Guardian name is required';
    }
    
    if (!studentFormData.guardianEmail.trim()) {
      errors.guardianEmail = 'Guardian email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentFormData.guardianEmail)) {
      errors.guardianEmail = 'Please enter a valid email address';
    }
    
    if (!studentFormData.guardianPhone.trim()) {
      errors.guardianPhone = 'Guardian phone is required';
    } else if (!/^[\d\s\-\(\)\+]+$/.test(studentFormData.guardianPhone)) {
      errors.guardianPhone = 'Please enter a valid phone number';
    }
    
    if (!studentFormData.guardianAddress.trim()) {
      errors.guardianAddress = 'Guardian address is required';
    }
    
    if (!studentFormData.lessonsRemaining || parseInt(studentFormData.lessonsRemaining) < 1) {
      errors.lessonsRemaining = 'Please enter a valid number of lessons (minimum 1)';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    
    if (!validateStudentForm()) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...studentFormData,
          lessonsRemaining: parseInt(studentFormData.lessonsRemaining)
        }),
      });

      if (!response.ok) throw new Error('Failed to add student');

      // Reset form and close modal
      setStudentFormData({
        name: '',
        dateOfBirth: '',
        notes: '',
        specialConditions: [],
        guardianName: '',
        guardianEmail: '',
        guardianPhone: '',
        guardianAddress: '',
        lessonsRemaining: ''
      });
      setValidationErrors({});
      setShowModal(false);
      fetchStudents();
      alert('Student added successfully!');
    } catch (err) {
      alert(err.message);
      console.error('Error adding student:', err);
    }
  };

  const handleStudentClick = async (studentId) => {
    try {
      const response = await fetch(`${API_URL}/students/${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch student details');
      const studentData = await response.json();
      setSelectedStudent(studentData);
      setShowStudentDetails(true);
    } catch (err) {
      alert(err.message);
      console.error('Error fetching student details:', err);
    }
  };

  const handleInstructorClick = async (instructorId) => {
    try {
      const response = await fetch(`${API_URL}/teachers/${instructorId}`);
      if (!response.ok) throw new Error('Failed to fetch instructor details');
      const instructorData = await response.json();
      setSelectedInstructor(instructorData);
      setShowInstructorDetails(true);
    } catch (err) {
      alert(err.message);
      console.error('Error fetching instructor details:', err);
    }
  };

  const handleInstructorFormChange = (e) => {
    const { name, value } = e.target;
    setInstructorFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateInstructor = async (e) => {
    e.preventDefault();
    
    if (!instructorFormData.firstName || !instructorFormData.lastName || !instructorFormData.specialty || !instructorFormData.experience) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...instructorFormData,
          experience: parseInt(instructorFormData.experience)
        }),
      });

      if (!response.ok) throw new Error('Failed to create instructor');

      // Reset form and close modal
      setInstructorFormData({
        firstName: '',
        lastName: '',
        specialty: '',
        experience: '',
        certification: '',
        address: '',
        phone: ''
      });
      setShowInstructorModal(false);
      fetchTeachers();
      alert('Instructor created successfully!');
    } catch (err) {
      alert(err.message);
      console.error('Error creating instructor:', err);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.lessonsRemaining) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          lessonsRemaining: parseInt(formData.lessonsRemaining)
        }),
      });

      if (!response.ok) throw new Error('Failed to add student');

      // Reset form and switch to home tab
      setFormData({ name: '', lessonsRemaining: '' });
      setActiveTab('home');
      fetchStudents(); // Refresh the list
      alert('Student added successfully!');
    } catch (err) {
      alert(err.message);
      console.error('Error adding student:', err);
    }
  };

  const fetchSchedule = async (date) => {
    try {
      setLoading(true);
      const dateStr = date.toISOString().split('T')[0];
      const response = await fetch(`${API_URL}/schedule?date=${dateStr}`);
      if (!response.ok) throw new Error('Failed to fetch schedule');
      const data = await response.json();
      setScheduledLessons(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchSchedule(date);
  };

  const handleLessonCheckIn = async (lesson) => {
    setLessonToCheckIn(lesson);
    setShowCheckInConfirm(true);
  };

  const undoCheckIn = async () => {
    if (!lastCheckedInLesson) return;
    
    try {
      const response = await fetch(`${API_URL}/lessons/undo-checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: lastCheckedInLesson.date,
          time: lastCheckedInLesson.time,
          studentId: lastCheckedInLesson.studentId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to undo check-in');
      }

      // Refresh the schedule and hide toast
      fetchSchedule(selectedDate);
      setShowToast(false);
      setLastCheckedInLesson(null);
    } catch (err) {
      alert(err.message);
      console.error('Error undoing check-in:', err);
    }
  };

  const confirmCheckIn = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`${API_URL}/lessons/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateStr,
          time: lessonToCheckIn.time,
          studentId: lessonToCheckIn.studentId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check in');
      }

      const result = await response.json();
      
      // Refresh the schedule
      fetchSchedule(selectedDate);
      setShowCheckInConfirm(false);
      
      // Store the checked-in lesson for undo and show toast
      setLastCheckedInLesson({
        ...lessonToCheckIn,
        date: dateStr
      });
      setLessonToCheckIn(null);
      setShowToast(true);
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } catch (err) {
      alert(err.message);
      console.error('Error checking in:', err);
    }
  };

  const handleRescheduleLesson = async (lesson) => {
    // In a real app, this would open a modal to select a new date/time
    const newTime = prompt(`Reschedule ${lesson.studentName}'s lesson to what time?`, lesson.time);
    if (newTime) {
      alert(`Lesson rescheduled to ${newTime}`);
      // Refresh the schedule
      fetchSchedule(selectedDate);
    }
  };

  useEffect(() => {
    if (activeTab === 'schedule') {
      fetchSchedule(selectedDate);
    }
  }, [activeTab]);

  if (loading && students.length === 0) {
    return (
      <div className="app">
        <div className="loading">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          Error: {error}
          <button onClick={fetchStudents}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Ark Farms 🌾</h1>
      </header>
      
      <div className="container">
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <FontAwesomeIcon icon={faCalendarDays} className="tab-icon" />
            Schedule
          </button>
          <button 
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <FontAwesomeIcon icon={faUsers} className="tab-icon" />
            Students
          </button>
          <button 
            className={`nav-tab ${activeTab === 'registration' ? 'active' : ''}`}
            onClick={() => setActiveTab('registration')}
          >
            <FontAwesomeIcon icon={faHorseHead} className="tab-icon" />
            Horses
          </button>
          <button 
            className={`nav-tab ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => setActiveTab('teachers')}
          >
            <FontAwesomeIcon icon={faChalkboardTeacher} className="tab-icon" />
            Instructors
          </button>
          <button 
            className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FontAwesomeIcon icon={faChartLine} className="tab-icon" />
            Reports
          </button>
        </nav>

        {activeTab === 'home' ? (
          <>
            <h2 className="form-title">
              <FontAwesomeIcon icon={faUsers} style={{ marginRight: '10px' }} />
              Students
            </h2>
            
            <div className="search-create-container students-search-container">
              <SearchBox 
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search students by name..."
              />
              <button className="create-btn" onClick={() => setShowModal(true)}>
                + Create
              </button>
            </div>

            {loading ? (
              <div className="loading-inline">Loading...</div>
            ) : students.length === 0 ? (
              <div className="no-results">No students found</div>
            ) : (
              <>
                <div className="student-list">
                  {students.map(student => (
                    <div key={student.id} className="student-card" onClick={() => handleStudentClick(student.id)}>
                      <div className="student-info">
                        <div className="student-avatar">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="student-details">
                          <h3 className="student-name">
                            {student.name}
                            {student.notes && (
                              <FontAwesomeIcon icon={faStickyNote} className="notes-icon" title="Has notes" />
                            )}
                          </h3>
                          <div className="lessons-info">
                            <span className={`lessons-badge ${student.lessonsRemaining <= 3 ? 'low' : ''}`}>
                              {student.lessonsRemaining} {student.lessonsRemaining === 1 ? 'lesson' : 'lessons'} remaining
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="check-in-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckIn(student.id);
                        }}
                        disabled={student.lessonsRemaining === 0}
                      >
                        {student.lessonsRemaining === 0 ? 'No Lessons' : 'Schedule Lesson'}
                      </button>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      Previous
                    </button>
                    
                    <div className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : activeTab === 'registration' ? (
          <div className="horses-view">
            <h2 className="form-title">
              <FontAwesomeIcon icon={faHorseHead} style={{ marginRight: '10px' }} />
              Horses
            </h2>
            
            <div className="search-create-container">
              <SearchBox 
                value={horseSearchTerm}
                onChange={handleHorseSearchChange}
                placeholder="Search horses by name..."
              />
              <button className="create-btn" onClick={() => setShowHorseModal(true)}>
                + Create
              </button>
            </div>
            
            {loading ? (
              <div className="loading-inline">Loading horses...</div>
            ) : horses.filter(horse => 
                horse.name.toLowerCase().includes(horseSearchTerm.toLowerCase())
              ).length === 0 ? (
              <div className="no-results">No horses found</div>
            ) : (
              <>
                <div className="horses-header">
                  <span className="horses-header-label">Condition</span>
                </div>
                <div className="student-list">
                  {horses.filter(horse => 
                    horse.name.toLowerCase().includes(horseSearchTerm.toLowerCase())
                  ).map(horse => {
                  const lessonCount = horseLessonCounts.find(h => h.horseId === horse.id)?.count || 0;
                  return (
                    <div key={horse.id} className="student-card">
                      <div className="student-info">
                        <div className="student-avatar">
                          {horse.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="student-details">
                          <h3 className="student-name">{horse.name}</h3>
                          <div className="lessons-info">
                            <span className="lessons-badge">
                              {horse.ridingStyle} · {horse.difficultyLevel}
                            </span>
                            <span className={`lessons-badge ${lessonCount >= 3 ? 'low' : ''}`} style={{ marginLeft: '8px' }}>
                              {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'} today
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`lessons-badge ${horse.condition.toLowerCase()}`}>
                        {horse.condition}
                      </span>
                    </div>
                  );
                })}
              </div>
              </>
            )}
          </div>
        ) : activeTab === 'reports' ? (
          <div className="reports-view">
            <h2 className="form-title">
              <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '10px' }} />
              Reports
            </h2>
            
            <div className="stats">
              <div className="stat-card">
                <span className="stat-number">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="stat-label">Today's Date</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{totalStudents}</span>
                <span className="stat-label">Total Students</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">
                  {students.reduce((sum, student) => sum + student.lessonsRemaining, 0)}
                </span>
                <span className="stat-label">Current Page Lessons</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">24</span>
                <span className="stat-label">Lessons This Week</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">97</span>
                <span className="stat-label">Lessons This Month</span>
              </div>
            </div>
          </div>
        ) : activeTab === 'teachers' ? (
          <div className="teachers-view">
            <h2 className="form-title">
              <FontAwesomeIcon icon={faChalkboardTeacher} style={{ marginRight: '10px' }} />
              Instructors
            </h2>
            
            <div className="search-create-container">
              <SearchBox 
                value={teacherSearchTerm}
                onChange={handleTeacherSearchChange}
                placeholder="Search instructors by name..."
              />
              <button className="create-btn" onClick={() => setShowInstructorModal(true)}>
                + Create
              </button>
            </div>
            
            {loading ? (
              <div className="loading-inline">Loading instructors...</div>
            ) : teachers.filter(teacher => {
                const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
                return fullName.includes(teacherSearchTerm.toLowerCase());
              }).length === 0 ? (
              <div className="no-results">No instructors found</div>
            ) : (
              <div className="student-list">
                {teachers.filter(teacher => {
                  const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
                  return fullName.includes(teacherSearchTerm.toLowerCase());
                }).map(teacher => (
                  <div key={teacher.id} className="student-card" onClick={() => handleInstructorClick(teacher.id)}>
                    <div className="student-info">
                      <div className="student-avatar">
                        {teacher.firstName[0]}{teacher.lastName[0]}
                      </div>
                      <div className="student-details">
                        <h3 className="student-name">{teacher.firstName} {teacher.lastName}</h3>
                        <div className="lessons-info">
                          <span className="lessons-badge">
                            {teacher.specialty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="lessons-badge">
                      {teacher.experience} years
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'schedule' ? (
          <div className="schedule-view">
            <h2 className="form-title">
              <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '10px' }} />
              Schedule
            </h2>
            
            <div className="date-selector">
              <div className="date-nav-group">
                <button 
                    onClick={() => handleDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
                    className="date-nav-btn"
                  >
                    ← Previous
                  </button>
                  <div className="current-date">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <button 
                    onClick={() => handleDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
                    className="date-nav-btn"
                  >
                    Next →
                  </button>
                </div>
                <button 
                  onClick={() => handleDateChange(new Date())}
                  className="today-btn"
                >
                  Go to Today
                </button>
              </div>

            {loading ? (
              <div className="loading-inline">Loading schedule...</div>
            ) : scheduledLessons.length === 0 ? (
              <div className="no-results">No lessons scheduled for this day</div>
            ) : (
              <div className="schedule-list">
                {scheduledLessons.map((lesson, index) => (
                  <div key={index} className="schedule-card">
                    <div className="schedule-time">{lesson.time}</div>
                    <div className="schedule-details">
                      <div className="schedule-student">
                        <div className="student-avatar">
                          {lesson.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="student-name">{lesson.studentName}</h3>
                          <p className={`lesson-type ${lesson.lessonsRemaining < 3 ? 'low-credit' : ''}`}>
                            {lesson.lessonsRemaining < 3 && (
                              <span className="warning-icon">⚠️</span>
                            )}
                            {lesson.lessonsRemaining} {lesson.lessonsRemaining === 1 ? 'credit' : 'credits'}
                          </p>
                          {lesson.horseName && (
                            <p className="lesson-horse">
                              <FontAwesomeIcon icon={faHorse} className="horse-icon-small" /> {lesson.horseName}
                            </p>
                          )}
                          {lesson.instructorName && (
                            <p className="lesson-instructor">
                              <FontAwesomeIcon icon={faChalkboardTeacher} className="instructor-icon-small" /> {lesson.instructorName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="schedule-actions">
                        {(lesson.status === 'completed' || lesson.status === 'cancelled') && (
                          <div className="status-badge-wrapper">
                            <span className={`status-badge ${lesson.status}`}>
                              {lesson.status === 'completed' ? 'Completed' : 'Cancelled'}
                            </span>
                          </div>
                        )}
                        {lesson.status === 'scheduled' && (
                          <>
                            <button 
                              className="checkin-btn-small"
                              onClick={() => handleLessonCheckIn(lesson)}
                            >
                              Check In
                            </button>
                            <button 
                              className="reschedule-btn-small"
                              onClick={() => handleRescheduleLesson(lesson)}
                            >
                              Reschedule
                            </button>
                          </>
                        )}
                        {lesson.lessonsRemaining < 3 && (
                          <button className="renew-btn-small">
                            Renew
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Student</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateStudent} className="student-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Student Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={studentFormData.name}
                    onChange={handleStudentFormChange}
                    className={`form-input ${validationErrors.name ? 'error' : ''}`}
                    placeholder="Enter student name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth *</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={studentFormData.dateOfBirth}
                    onChange={handleStudentFormChange}
                    className={`form-input ${validationErrors.dateOfBirth ? 'error' : ''}`}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Special Conditions</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="specialConditions"
                      value="autism"
                      checked={studentFormData.specialConditions.includes('autism')}
                      onChange={handleSpecialConditionsChange}
                    />
                    <span>Autism</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="specialConditions"
                      value="adhd"
                      checked={studentFormData.specialConditions.includes('adhd')}
                      onChange={handleSpecialConditionsChange}
                    />
                    <span>ADHD</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="specialConditions"
                      value="anxiety"
                      checked={studentFormData.specialConditions.includes('anxiety')}
                      onChange={handleSpecialConditionsChange}
                    />
                    <span>Anxiety</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="specialConditions"
                      value="dyslexia"
                      checked={studentFormData.specialConditions.includes('dyslexia')}
                      onChange={handleSpecialConditionsChange}
                    />
                    <span>Dyslexia</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="specialConditions"
                      value="hearing_impaired"
                      checked={studentFormData.specialConditions.includes('hearing_impaired')}
                      onChange={handleSpecialConditionsChange}
                    />
                    <span>Hearing Impaired</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="specialConditions"
                      value="vision_impaired"
                      checked={studentFormData.specialConditions.includes('vision_impaired')}
                      onChange={handleSpecialConditionsChange}
                    />
                    <span>Vision Impaired</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="specialConditions"
                      value="mobility_issues"
                      checked={studentFormData.specialConditions.includes('mobility_issues')}
                      onChange={handleSpecialConditionsChange}
                    />
                    <span>Mobility Issues</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="specialConditions"
                      value="allergies"
                      checked={studentFormData.specialConditions.includes('allergies')}
                      onChange={handleSpecialConditionsChange}
                    />
                    <span>Allergies</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="specialConditions"
                      value="other"
                      checked={studentFormData.specialConditions.includes('other')}
                      onChange={handleSpecialConditionsChange}
                    />
                    <span>Other</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={studentFormData.notes}
                  onChange={handleStudentFormChange}
                  className="form-textarea"
                  placeholder="Any additional notes about the student"
                  rows="3"
                />
              </div>

              <div className="form-divider">Guardian Information</div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="guardianName">Guardian Name *</label>
                  <input
                    type="text"
                    id="guardianName"
                    name="guardianName"
                    value={studentFormData.guardianName}
                    onChange={handleStudentFormChange}
                    className={`form-input ${validationErrors.guardianName ? 'error' : ''}`}
                    placeholder="Enter guardian name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guardianEmail">Guardian Email *</label>
                  <input
                    type="email"
                    id="guardianEmail"
                    name="guardianEmail"
                    value={studentFormData.guardianEmail}
                    onChange={handleStudentFormChange}
                    className={`form-input ${validationErrors.guardianEmail ? 'error' : ''}`}
                    placeholder="guardian@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="guardianPhone">Guardian Phone *</label>
                  <input
                    type="tel"
                    id="guardianPhone"
                    name="guardianPhone"
                    value={studentFormData.guardianPhone}
                    onChange={handleStudentFormChange}
                    className={`form-input ${validationErrors.guardianPhone ? 'error' : ''}`}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lessonsRemaining">Number of Lessons *</label>
                  <input
                    type="number"
                    id="lessonsRemaining"
                    name="lessonsRemaining"
                    value={studentFormData.lessonsRemaining}
                    onChange={handleStudentFormChange}
                    className={`form-input ${validationErrors.lessonsRemaining ? 'error' : ''}`}
                    placeholder="8"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="guardianAddress">Guardian Address *</label>
                <textarea
                  id="guardianAddress"
                  name="guardianAddress"
                  value={studentFormData.guardianAddress}
                  onChange={handleStudentFormChange}
                  className={`form-textarea ${validationErrors.guardianAddress ? 'error' : ''}`}
                  placeholder="Enter full address"
                  rows="2"
                />
              </div>

              {Object.keys(validationErrors).length > 0 && (
                <div className="validation-error">
                  <strong>Please fix the following errors:</strong>
                  <ul>
                    {Object.entries(validationErrors).map(([field, error]) => (
                      error && <li key={field}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStudentDetails && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowStudentDetails(false)}>
          <div className="modal-content student-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Details</h2>
              <button className="modal-close" onClick={() => setShowStudentDetails(false)}>&times;</button>
            </div>
            
            <div className="student-details-content">
              <div className="detail-section">
                <h3 className="detail-section-title">Student Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedStudent.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date of Birth:</span>
                  <span className="detail-value">{selectedStudent.dateOfBirth || 'Not specified'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Enrollment Date:</span>
                  <span className="detail-value">{selectedStudent.enrollmentDate || 'Not specified'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="detail-section-title">Lesson Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Lessons Remaining:</span>
                  <span className="detail-value">{selectedStudent.lessonsRemaining}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Lessons Completed:</span>
                  <span className="detail-value">{selectedStudent.lessonsCompleted || 0}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Lessons:</span>
                  <span className="detail-value">{(selectedStudent.lessonsRemaining || 0) + (selectedStudent.lessonsCompleted || 0)}</span>
                </div>
              </div>

              {selectedStudent.specialConditions && selectedStudent.specialConditions.length > 0 && (
                <div className="detail-section">
                  <h3 className="detail-section-title">Special Conditions</h3>
                  <div className="special-conditions-list">
                    {selectedStudent.specialConditions.map((condition, index) => (
                      <span key={index} className="condition-badge">
                        {condition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedStudent.notes && (
                <div className="detail-section">
                  <h3 className="detail-section-title">Notes</h3>
                  <p className="notes-content">{selectedStudent.notes}</p>
                </div>
              )}

              <div className="detail-section">
                <h3 className="detail-section-title">Guardian Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedStudent.guardianName || 'Not specified'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedStudent.guardianEmail || 'Not specified'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedStudent.guardianPhone || 'Not specified'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{selectedStudent.guardianAddress || 'Not specified'}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowStudentDetails(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showCheckInConfirm && (
        <ConfirmModal
          isOpen={showCheckInConfirm}
          onClose={() => setShowCheckInConfirm(false)}
          title="Check Into Lesson"
          message={
            <>
              <p>Checking into this lesson will mark it as completed and deduct <b>1 lesson credit</b>.</p>
              <br />
              <p>Are you sure?</p>
            </>
          }
          cancelLabel="Cancel"
          confirmLabel="Yes"
          onConfirm={confirmCheckIn}
        />
      )}

      {showScheduleModal && studentToSchedule && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content schedule-lesson-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule Lesson for {studentToSchedule.name}</h2>
              <button className="modal-close" onClick={() => setShowScheduleModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleScheduleLessonSubmit} className="student-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={scheduleLessonForm.date}
                    onChange={handleScheduleLessonFormChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time *</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={scheduleLessonForm.time}
                    onChange={handleScheduleLessonFormChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="horseId">Horse *</label>
                  <select
                    id="horseId"
                    name="horseId"
                    value={scheduleLessonForm.horseId}
                    onChange={handleScheduleLessonFormChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select a horse</option>
                    {horses.map(horse => (
                      <option key={horse.id} value={horse.id}>
                        {horse.name} - {horse.ridingStyle} ({horse.difficultyLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="instructorId">Instructor *</label>
                  <select
                    id="instructorId"
                    name="instructorId"
                    value={scheduleLessonForm.instructorId}
                    onChange={handleScheduleLessonFormChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select an instructor</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName} - {teacher.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInstructorModal && (
        <div className="modal-overlay" onClick={() => setShowInstructorModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Instructor</h2>
              <button className="modal-close" onClick={() => setShowInstructorModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateInstructor} className="student-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={instructorFormData.firstName}
                    onChange={handleInstructorFormChange}
                    className="form-input"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={instructorFormData.lastName}
                    onChange={handleInstructorFormChange}
                    className="form-input"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="specialty">Specialty *</label>
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={instructorFormData.specialty}
                    onChange={handleInstructorFormChange}
                    className="form-input"
                    placeholder="e.g., English Riding, Dressage"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="experience">Years of Experience *</label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={instructorFormData.experience}
                    onChange={handleInstructorFormChange}
                    className="form-input"
                    placeholder="Enter years"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="certification">Certification</label>
                <input
                  type="text"
                  id="certification"
                  name="certification"
                  value={instructorFormData.certification}
                  onChange={handleInstructorFormChange}
                  className="form-input"
                  placeholder="e.g., Level 3 Instructor, PATH Certified"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={instructorFormData.phone}
                  onChange={handleInstructorFormChange}
                  className="form-input"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={instructorFormData.address}
                  onChange={handleInstructorFormChange}
                  className="form-textarea"
                  placeholder="Enter full address"
                  rows="2"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowInstructorModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInstructorDetails && selectedInstructor && (
        <div className="modal-overlay" onClick={() => setShowInstructorDetails(false)}>
          <div className="modal-content student-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Instructor Details</h2>
              <button className="modal-close" onClick={() => setShowInstructorDetails(false)}>&times;</button>
            </div>
            
            <div className="student-details-content">
              <div className="detail-section">
                <h3 className="detail-section-title">Personal Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedInstructor.firstName} {selectedInstructor.lastName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedInstructor.phone || 'Not specified'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{selectedInstructor.address || 'Not specified'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="detail-section-title">Professional Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Specialty:</span>
                  <span className="detail-value">{selectedInstructor.specialty}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Experience:</span>
                  <span className="detail-value">{selectedInstructor.experience} years</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Certification:</span>
                  <span className="detail-value">{selectedInstructor.certification || 'Not specified'}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowInstructorDetails(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="toast">
          <span className="toast-message">Check-in completed</span>
          <button className="toast-undo-btn" onClick={undoCheckIn}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
