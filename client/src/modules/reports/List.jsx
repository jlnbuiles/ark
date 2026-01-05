import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

function ReportsTab({ students, totalStudents }) {
  return (
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
  );
}

export default ReportsTab;
