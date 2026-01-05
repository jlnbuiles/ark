import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faUsers, faHorseHead, faChartLine, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import SearchBox from './components/SearchBox';
import ConfirmModal from './components/ConfirmModal';
import ListView from './components/ListView';
import Button from './components/Button';
import StudentsTab from './modules/students/List';
import HorsesTab from './modules/horses/List';
import InstructorsTab from './modules/instructors/List';
import ReportsTab from './modules/reports/List';
import ScheduleTab from './modules/schedule/List';
import CreateStudentModal from './modules/students/CreateModal';
import StudentDetailModal from './modules/students/DetailModal';
import ScheduleLessonModal from './modules/schedule/ScheduleModal';
import CreateInstructorModal from './modules/instructors/CreateModal';
import * as scheduleActions from './modules/schedule/actions';
import * as studentActions from './modules/students/actions';
import * as horseActions from './modules/horses/actions';
import * as instructorActions from './modules/instructors/actions';
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
    instructorId: '',
    repeat: 'none'
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
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [conflictingDates, setConflictingDates] = useState([]);
  const [studentScheduledCount, setStudentScheduledCount] = useState(0);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [studentForCredits, setStudentForCredits] = useState(null);
  const [creditsToAdd, setCreditsToAdd] = useState(0);
  const studentsPerPage = 10;

  // Fetch students when search term or page changes
  useEffect(() => {
    loadStudents();
  }, [searchTerm, currentPage]);

  // Fetch horses when component mounts
  useEffect(() => {
    loadHorses();
    loadHorseLessonCounts();
    loadTeachers();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentActions.fetchStudents(searchTerm, currentPage, studentsPerPage);
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

  const loadHorses = async () => {
    try {
      const data = await horseActions.fetchHorses();
      setHorses(data);
    } catch (err) {
      console.error('Error fetching horses:', err);
    }
  };

  const loadHorseLessonCounts = async () => {
    try {
      const data = await horseActions.fetchHorseLessonCounts(selectedDate);
      setHorseLessonCounts(data);
    } catch (err) {
      console.error('Error fetching horse lesson counts:', err);
    }
  };

  const loadTeachers = async () => {
    try {
      const data = await instructorActions.fetchInstructors();
      setTeachers(data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const getStudentScheduledLessonsCount = async (studentId) => {
    return await studentActions.getStudentScheduledCount(studentId);
  };

  const handleCheckIn = async (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setStudentToSchedule(student);
      setScheduleLessonForm({
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        horseId: horses[0]?.id || '',
        instructorId: teachers[0]?.id || '',
        repeat: 'none'
      });
      setShowScheduleModal(true);
      
      // Fetch and set the count of already scheduled lessons
      const scheduledCount = await getStudentScheduledLessonsCount(studentId);
      setStudentScheduledCount(scheduledCount);
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
      
      // Get count of already scheduled lessons for this student
      const scheduledCount = await getStudentScheduledLessonsCount(studentToSchedule.id);
      const availableCredits = studentToSchedule.lessonsRemaining - scheduledCount;
      
      if (availableCredits <= 0) {
        alert('This student has no available credits. All credits are already scheduled.');
        return;
      }
      
      // Calculate how many lessons to create based on repeat option
      const datesToSchedule = [];
      const startDate = new Date(scheduleLessonForm.date);
      
      if (scheduleLessonForm.repeat === 'none') {
        datesToSchedule.push(startDate);
      } else {
        // Determine interval in weeks
        let intervalWeeks;
        let maxLessons;
        
        switch (scheduleLessonForm.repeat) {
          case 'weekly':
            intervalWeeks = 1;
            maxLessons = 12;
            break;
          case 'biweekly':
            intervalWeeks = 2;
            maxLessons = 12;
            break;
          case 'monthly':
            intervalWeeks = 4;
            maxLessons = 12;
            break;
          default:
            intervalWeeks = 1;
            maxLessons = 1;
        }
        
        // Limit by student's available credits (remaining minus already scheduled)
        const numberOfLessons = Math.min(maxLessons, availableCredits);
        
        // Create array of dates
        for (let i = 0; i < numberOfLessons; i++) {
          const lessonDate = new Date(startDate);
          lessonDate.setDate(startDate.getDate() + (i * intervalWeeks * 7));
          datesToSchedule.push(lessonDate);
        }
      }
      
      // Check availability for all dates first
      const available = [];
      const conflicts = [];
      
      for (const lessonDate of datesToSchedule) {
        const dateStr = lessonDate.toISOString().split('T')[0];
        
        // Check availability
        const isAvailable = await scheduleActions.checkLessonAvailability(
          dateStr,
          scheduleLessonForm.time,
          parseInt(scheduleLessonForm.horseId),
          parseInt(scheduleLessonForm.instructorId)
        );
        
        if (isAvailable) {
          available.push({ date: dateStr, formatted: lessonDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) });
        } else {
          conflicts.push({ 
            date: dateStr, 
            formatted: lessonDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
            reason: 'Time slot not available'
          });
        }
      }
      
      // If there are conflicts, show them to the user
      if (conflicts.length > 0) {
        setAvailableDates(available);
        setConflictingDates(conflicts);
        setShowConflictWarning(true);
        return;
      }
      
      // Schedule all lessons if no conflicts
      await scheduleAvailableLessons(available);
      
    } catch (err) {
      alert(err.message);
      console.error('Error scheduling lesson:', err);
    }
  };
  
  const scheduleAvailableLessons = async (datesToSchedule) => {
    try {
      const horse = horses.find(h => h.id === parseInt(scheduleLessonForm.horseId));
      const instructor = teachers.find(t => t.id === parseInt(scheduleLessonForm.instructorId));
      
      const scheduledCount = [];
      for (const dateInfo of datesToSchedule) {
        try {
          await scheduleActions.scheduleLesson({
            date: dateInfo.date,
            time: scheduleLessonForm.time,
            studentId: studentToSchedule.id,
            studentName: studentToSchedule.name,
            horseId: parseInt(scheduleLessonForm.horseId),
            horseName: horse?.name,
            instructorId: parseInt(scheduleLessonForm.instructorId),
            instructorName: `${instructor?.firstName} ${instructor?.lastName}`,
            lessonsRemaining: studentToSchedule.lessonsRemaining,
            specialConditions: studentToSchedule.specialConditions || []
          });
          scheduledCount.push(dateInfo.date);
        } catch (err) {
          console.warn(`Failed to schedule lesson on ${dateInfo.date}:`, err.message);
        }
      }

      // Close modal and refresh
      setShowScheduleModal(false);
      setStudentToSchedule(null);
      setScheduleLessonForm({
        date: '',
        time: '',
        horseId: '',
        instructorId: '',
        repeat: 'none'
      });
      setShowConflictWarning(false);
      setAvailableDates([]);
      setConflictingDates([]);
      
      // Refresh students list to show updated available lessons
      await loadStudents();
      
      if (activeTab === 'schedule') {
        loadSchedule(selectedDate);
      }
      
      if (scheduledCount.length > 0) {
        alert(`Successfully scheduled ${scheduledCount.length} lesson(s)!`);
      } else {
        alert('Failed to schedule lessons.');
      }
    } catch (err) {
      alert(err.message);
      console.error('Error scheduling lessons:', err);
    }
  };
  
  const handleConfirmScheduleWithConflicts = async () => {
    await scheduleAvailableLessons(availableDates);
  };
  
  const handleCancelSchedule = () => {
    setShowConflictWarning(false);
    setAvailableDates([]);
    setConflictingDates([]);
  };

  const handleOpenCreditsModal = (student) => {
    setStudentForCredits(student);
    setCreditsToAdd(0);
    setShowCreditsModal(true);
  };

  const handleSaveCredits = async () => {
    if (!studentForCredits) return;

    try {
      const newTotal = studentForCredits.lessonsRemaining + creditsToAdd;
      
      await studentActions.updateStudentCredits(studentForCredits.id, creditsToAdd);

      // Refresh students list
      await loadStudents();
      
      // Close modal
      setShowCreditsModal(false);
      setStudentForCredits(null);
      setCreditsToAdd(0);
      
      alert(`Successfully updated credits to ${newTotal}!`);
    } catch (err) {
      alert(err.message);
      console.error('Error updating credits:', err);
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
    const errors = studentActions.validateStudentForm(studentFormData);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    
    if (!validateStudentForm()) {
      return;
    }
    
    try {
      await studentActions.createStudent({
        ...studentFormData,
        lessonsRemaining: parseInt(studentFormData.lessonsRemaining)
      });

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
      loadStudents();
      alert('Student added successfully!');
    } catch (err) {
      alert(err.message);
      console.error('Error adding student:', err);
    }
  };

  const handleStudentClick = async (studentId) => {
    try {
      const studentData = await studentActions.fetchStudentDetails(studentId);
      setSelectedStudent(studentData);
      setShowStudentDetails(true);
    } catch (err) {
      alert(err.message);
      console.error('Error fetching student details:', err);
    }
  };

  const handleInstructorClick = async (instructorId) => {
    try {
      const instructorData = await instructorActions.fetchInstructorDetails(instructorId);
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
      await instructorActions.createInstructor(instructorFormData);

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
      loadTeachers();
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
      loadStudents(); // Refresh the list
      alert('Student added successfully!');
    } catch (err) {
      alert(err.message);
      console.error('Error adding student:', err);
    }
  };

  const loadSchedule = async (date) => {
    try {
      setLoading(true);
      const data = await scheduleActions.fetchSchedule(date);
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
    loadSchedule(date);
  };

  const handleLessonCheckIn = async (lesson) => {
    setLessonToCheckIn(lesson);
    setShowCheckInConfirm(true);
  };

  const undoCheckIn = async () => {
    if (!lastCheckedInLesson) return;
    
    try {
      await scheduleActions.undoLessonCheckIn(
        lastCheckedInLesson.date,
        lastCheckedInLesson.time,
        lastCheckedInLesson.studentId
      );

      // Refresh the schedule and hide toast
      loadSchedule(selectedDate);
      setShowToast(false);
      setLastCheckedInLesson(null);
    } catch (err) {
      alert(err.message);
      console.error('Error undoing check-in:', err);
    }
  };

  const confirmCheckIn = async () => {
    try {
      await scheduleActions.checkInLesson(
        selectedDate,
        lessonToCheckIn.time,
        lessonToCheckIn.studentId
      );
      
      // Refresh the schedule
      loadSchedule(selectedDate);
      setShowCheckInConfirm(false);
      
      // Store the checked-in lesson for undo and show toast
      setLastCheckedInLesson({
        ...lessonToCheckIn,
        date: selectedDate.toISOString().split('T')[0]
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
      loadSchedule(selectedDate);
    }
  };

  useEffect(() => {
    if (activeTab === 'schedule') {
      loadSchedule(selectedDate);
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
          <button onClick={loadStudents}>Retry</button>
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
          <StudentsTab
            students={students}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onCreateClick={() => setShowModal(true)}
            onStudentClick={handleStudentClick}
            onScheduleLesson={handleCheckIn}
            onAddCredits={handleOpenCreditsModal}
          />
        ) : activeTab === 'registration' ? (
          <HorsesTab
            horses={horses}
            loading={loading}
            searchTerm={horseSearchTerm}
            onSearchChange={handleHorseSearchChange}
            onCreateClick={() => setShowHorseModal(true)}
            horseLessonCounts={horseLessonCounts}
          />
        ) : activeTab === 'reports' ? (
          <ReportsTab
            students={students}
            totalStudents={totalStudents}
          />
        ) : activeTab === 'teachers' ? (
          <InstructorsTab
            teachers={teachers}
            loading={loading}
            searchTerm={teacherSearchTerm}
            onSearchChange={handleTeacherSearchChange}
            onCreateClick={() => setShowInstructorModal(true)}
            onInstructorClick={handleInstructorClick}
          />
        ) : activeTab === 'schedule' ? (
          <ScheduleTab
            scheduledLessons={scheduledLessons}
            loading={loading}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onLessonCheckIn={handleLessonCheckIn}
            onRescheduleLesson={handleRescheduleLesson}
          />
        ) : null}
      </div>

      <CreateStudentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={studentFormData}
        validationErrors={validationErrors}
        onFormChange={handleStudentFormChange}
        onSpecialConditionsChange={handleSpecialConditionsChange}
        onSubmit={handleCreateStudent}
      />

      <ScheduleLessonModal
        isOpen={showScheduleModal}
        student={studentToSchedule}
        formData={scheduleLessonForm}
        horses={horses}
        teachers={teachers}
        studentScheduledCount={studentScheduledCount}
        showConflictWarning={showConflictWarning}
        conflictingDates={conflictingDates}
        availableDates={availableDates}
        onClose={() => setShowScheduleModal(false)}
        onFormChange={handleScheduleLessonFormChange}
        onSubmit={handleScheduleLessonSubmit}
        onCancelSchedule={handleCancelSchedule}
        onConfirmWithConflicts={handleConfirmScheduleWithConflicts}
      />

      <CreateInstructorModal
        isOpen={showInstructorModal}
        formData={instructorFormData}
        onClose={() => setShowInstructorModal(false)}
        onFormChange={handleInstructorFormChange}
        onSubmit={handleCreateInstructor}
      />

      <StudentDetailModal
        isOpen={showStudentDetails}
        student={selectedStudent}
        onClose={() => setShowStudentDetails(false)}
      />

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

      <ConfirmModal
        isOpen={showCreditsModal && studentForCredits}
        onClose={() => setShowCreditsModal(false)}
        title="Add Credits"
        confirmLabel="Save"
        cancelLabel="Cancel"
        onConfirm={handleSaveCredits}
        message={
          <div style={{ padding: '10px 0' }}>
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px' }}>
                Current Credits
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                {studentForCredits?.lessonsRemaining}
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>
                Credits to Add/Remove
              </label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <button
                  type="button"
                  onClick={() => setCreditsToAdd(prev => prev - 1)}
                  disabled={creditsToAdd <= 0}
                  className="counter-btn"
                  style={{
                    width: '48px',
                    height: '48px',
                    fontSize: '1.5rem',
                    background: 'white',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: creditsToAdd <= 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    color: '#374151',
                    opacity: creditsToAdd <= 0 ? 0.5 : 1
                  }}
                >
                  −
                </button>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  minWidth: '80px',
                  textAlign: 'center',
                  color: creditsToAdd >= 0 ? '#059669' : '#dc2626'
                }}>
                  {creditsToAdd >= 0 ? '+' : ''}{creditsToAdd}
                </div>
                <button
                  type="button"
                  onClick={() => setCreditsToAdd(prev => prev + 1)}
                  className="counter-btn"
                  style={{
                    width: '48px',
                    height: '48px',
                    fontSize: '1.5rem',
                    background: 'white',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#374151'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ 
              marginBottom: '10px', 
              padding: '20px', 
              background: '#f9fafb', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px' }}>
                New Total
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>
                {(studentForCredits?.lessonsRemaining || 0) + creditsToAdd}
              </div>
            </div>
          </div>
        }
      />

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
