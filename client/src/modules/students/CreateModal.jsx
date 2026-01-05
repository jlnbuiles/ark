function CreateStudentModal({ 
  isOpen,
  onClose,
  formData,
  validationErrors,
  onFormChange,
  onSpecialConditionsChange,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Student</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={onSubmit} className="student-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Student Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={onFormChange}
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
                value={formData.dateOfBirth}
                onChange={onFormChange}
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
                  checked={formData.specialConditions.includes('autism')}
                  onChange={onSpecialConditionsChange}
                />
                <span>Autism</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="specialConditions"
                  value="adhd"
                  checked={formData.specialConditions.includes('adhd')}
                  onChange={onSpecialConditionsChange}
                />
                <span>ADHD</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="specialConditions"
                  value="anxiety"
                  checked={formData.specialConditions.includes('anxiety')}
                  onChange={onSpecialConditionsChange}
                />
                <span>Anxiety</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="specialConditions"
                  value="dyslexia"
                  checked={formData.specialConditions.includes('dyslexia')}
                  onChange={onSpecialConditionsChange}
                />
                <span>Dyslexia</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="specialConditions"
                  value="hearing_impaired"
                  checked={formData.specialConditions.includes('hearing_impaired')}
                  onChange={onSpecialConditionsChange}
                />
                <span>Hearing Impaired</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="specialConditions"
                  value="vision_impaired"
                  checked={formData.specialConditions.includes('vision_impaired')}
                  onChange={onSpecialConditionsChange}
                />
                <span>Vision Impaired</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="specialConditions"
                  value="mobility_issues"
                  checked={formData.specialConditions.includes('mobility_issues')}
                  onChange={onSpecialConditionsChange}
                />
                <span>Mobility Issues</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="specialConditions"
                  value="allergies"
                  checked={formData.specialConditions.includes('allergies')}
                  onChange={onSpecialConditionsChange}
                />
                <span>Allergies</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="specialConditions"
                  value="other"
                  checked={formData.specialConditions.includes('other')}
                  onChange={onSpecialConditionsChange}
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
              value={formData.notes}
              onChange={onFormChange}
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
                value={formData.guardianName}
                onChange={onFormChange}
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
                value={formData.guardianEmail}
                onChange={onFormChange}
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
                value={formData.guardianPhone}
                onChange={onFormChange}
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
                value={formData.lessonsRemaining}
                onChange={onFormChange}
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
              value={formData.guardianAddress}
              onChange={onFormChange}
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
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateStudentModal;
