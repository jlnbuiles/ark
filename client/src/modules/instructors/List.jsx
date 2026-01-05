import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import SearchBox from '../../components/SearchBox';
import ListView from '../../components/ListView';
import Button from '../../components/Button';

function InstructorsTab({ 
  teachers,
  loading,
  searchTerm,
  onSearchChange,
  onCreateClick,
  onInstructorClick
}) {
  const filteredTeachers = teachers.filter(teacher => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <ListView
      icon={<FontAwesomeIcon icon={faChalkboardTeacher} style={{ marginRight: '10px' }} />}
      title="Instructors"
      searchBar={
        <SearchBox 
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search instructors by name..."
        />
      }
      createButton={
        <Button variant="blue" onClick={onCreateClick}>
          + Create
        </Button>
      }
      loading={loading}
      isEmpty={filteredTeachers.length === 0}
      emptyMessage="No instructors found"
    >
      {filteredTeachers.map(teacher => (
        <div key={teacher.id} className="student-card" onClick={() => onInstructorClick(teacher.id)}>
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
    </ListView>
  );
}

export default InstructorsTab;
