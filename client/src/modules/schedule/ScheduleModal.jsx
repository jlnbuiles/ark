function ScheduleLessonModal({
  isOpen,
  student,
  formData,
  horses,
  teachers,
  studentScheduledCount,
  showConflictWarning,
  conflictingDates,
  availableDates,
  onClose,
  onFormChange,
  onSubmit,
  onCancelSchedule,
  onConfirmWithConflicts
}) {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content schedule-lesson-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Schedule Lesson</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={onSubmit} className="student-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={onFormChange}
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
                value={formData.time}
                onChange={onFormChange}
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
                value={formData.horseId}
                onChange={onFormChange}
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
                value={formData.instructorId}
                onChange={onFormChange}
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="repeat">Repeat</label>
              <select
                id="repeat"
                name="repeat"
                value={formData.repeat}
                onChange={onFormChange}
                className="form-input"
              >
                <option value="none">None</option>
                <option value="weekly">
                  Every Week ({Math.min(12, Math.max(0, (student?.lessonsRemaining || 0) - studentScheduledCount))} lesson{Math.min(12, Math.max(0, (student?.lessonsRemaining || 0) - studentScheduledCount)) !== 1 ? 's' : ''})
                </option>
                <option value="biweekly">
                  Every 2 Weeks ({Math.min(12, Math.max(0, (student?.lessonsRemaining || 0) - studentScheduledCount))} lesson{Math.min(12, Math.max(0, (student?.lessonsRemaining || 0) - studentScheduledCount)) !== 1 ? 's' : ''})
                </option>
                <option value="monthly">
                  Every 4 Weeks ({Math.min(12, Math.max(0, (student?.lessonsRemaining || 0) - studentScheduledCount))} lesson{Math.min(12, Math.max(0, (student?.lessonsRemaining || 0) - studentScheduledCount)) !== 1 ? 's' : ''})
                </option>
              </select>
            </div>
          </div>

          {showConflictWarning && (
            <div className="conflict-warning">
              <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>⚠️ Scheduling Conflicts Detected</h3>
              
              {conflictingDates.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Unavailable Dates:</strong>
                  <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                    {conflictingDates.map((conflict, idx) => (
                      <li key={idx} style={{ color: '#dc2626', marginBottom: '5px' }}>
                        {conflict.formatted} - {conflict.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {availableDates.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#059669' }}>Available Dates ({availableDates.length}):</strong>
                  <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                    {availableDates.map((dateInfo, idx) => (
                      <li key={idx} style={{ color: '#059669', marginBottom: '5px' }}>
                        {dateInfo.formatted}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#6b7280' }}>
                Would you like to schedule the {availableDates.length} available lesson(s)?
              </p>
            </div>
          )}

          <div className="modal-actions">
            {showConflictWarning ? (
              <>
                <button type="button" className="cancel-btn" onClick={onCancelSchedule}>
                  Cancel
                </button>
                <button type="button" className="submit-btn" onClick={onConfirmWithConflicts}>
                  Schedule {availableDates.length} Lesson(s)
                </button>
              </>
            ) : (
              <>
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Confirm
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleLessonModal;
