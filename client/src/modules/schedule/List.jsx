import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faHorse, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import ListView from '../../components/ListView';
import Button from '../../components/Button';

function ScheduleTab({ 
  scheduledLessons,
  loading,
  selectedDate,
  onDateChange,
  onLessonCheckIn,
  onRescheduleLesson
}) {
  return (
    <ListView
      icon={<FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '10px' }} />}
      title="Schedule"
      extraHeader={
        <div className="date-selector">
          <div className="date-nav-group">
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 1);
                onDateChange(newDate);
              }}
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
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 1);
                onDateChange(newDate);
              }}
              className="date-nav-btn"
            >
              Next →
            </button>
          </div>
          <button 
            onClick={() => onDateChange(new Date())}
            className="today-btn"
          >
            Go to Today
          </button>
        </div>
      }
      loading={loading}
      isEmpty={scheduledLessons.length === 0}
      emptyMessage="No lessons scheduled for this day"
    >
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
                  <Button 
                    variant="primary"
                    onClick={() => onLessonCheckIn(lesson)}
                  >
                    Check In
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => onRescheduleLesson(lesson)}
                  >
                    Reschedule
                  </Button>
                </>
              )}
              {lesson.lessonsRemaining < 3 && (
                <Button variant="warning">
                  Renew
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </ListView>
  );
}

export default ScheduleTab;
