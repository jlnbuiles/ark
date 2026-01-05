function StudentDetailModal({ isOpen, student, onClose }) {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content student-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Student Details</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="student-details-content">
          <div className="detail-section">
            <h3 className="detail-section-title">Student Information</h3>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{student.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date of Birth:</span>
              <span className="detail-value">{student.dateOfBirth || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Enrollment Date:</span>
              <span className="detail-value">{student.enrollmentDate || 'Not specified'}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="detail-section-title">Lesson Information</h3>
            <div className="detail-row">
              <span className="detail-label">Lessons Remaining:</span>
              <span className="detail-value">{student.lessonsRemaining}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Lessons Completed:</span>
              <span className="detail-value">{student.lessonsCompleted || 0}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Lessons:</span>
              <span className="detail-value">{(student.lessonsRemaining || 0) + (student.lessonsCompleted || 0)}</span>
            </div>
          </div>

          {student.specialConditions && student.specialConditions.length > 0 && (
            <div className="detail-section">
              <h3 className="detail-section-title">Special Conditions</h3>
              <div className="special-conditions-list">
                {student.specialConditions.map((condition, index) => (
                  <span key={index} className="condition-badge">
                    {condition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}

          {student.notes && (
            <div className="detail-section">
              <h3 className="detail-section-title">Notes</h3>
              <p className="notes-content">{student.notes}</p>
            </div>
          )}

          <div className="detail-section">
            <h3 className="detail-section-title">Guardian Information</h3>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{student.guardianName || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{student.guardianEmail || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{student.guardianPhone || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{student.guardianAddress || 'Not specified'}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailModal;
