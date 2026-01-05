import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import SearchBox from '../../components/SearchBox';
import ListView from '../../components/ListView';
import Button from '../../components/Button';

function StudentsTab({ 
  students,
  loading,
  searchTerm,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
  onCreateClick,
  onStudentClick,
  onScheduleLesson,
  onAddCredits
}) {
  return (
    <ListView
      icon={<FontAwesomeIcon icon={faUsers} style={{ marginRight: '10px' }} />}
      title="Students"
      searchBar={
        <SearchBox 
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search students by name..."
        />
      }
      createButton={
        <Button variant="blue" onClick={onCreateClick}>
          + Create
        </Button>
      }
      loading={loading}
      isEmpty={students.length === 0}
      emptyMessage="No students found"
      pagination={totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    >
      {students.map(student => (
        <div key={student.id} className="student-card" onClick={() => onStudentClick(student.id)}>
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
              <div className="lessons-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span className={`lessons-badge ${(student.unscheduledLessons ?? student.lessonsRemaining) <= 3 ? 'low' : ''}`}>
                  {student.unscheduledLessons ?? student.lessonsRemaining} unscheduled {(student.unscheduledLessons ?? student.lessonsRemaining) === 1 ? 'lesson' : 'lessons'}
                </span>
                <span style={{ color: '#6b7280', fontSize: '0.85rem', paddingLeft: '12px' }}>
                  {student.lessonsRemaining} total lesson {student.lessonsRemaining === 1 ? 'credit' : 'credits'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button
              variant="blue"
              onClick={(e) => {
                e.stopPropagation();
                onScheduleLesson(student.id);
              }}
              disabled={student.lessonsRemaining === 0}
            >
              {student.lessonsRemaining === 0 ? 'No Lessons' : 'Schedule Lesson'}
            </Button>
            <Button
              variant="success"
              onClick={(e) => {
                e.stopPropagation();
                onAddCredits(student);
              }}
            >
              Credits +
            </Button>
          </div>
        </div>
      ))}
    </ListView>
  );
}

export default StudentsTab;
