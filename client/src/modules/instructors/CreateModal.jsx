function CreateInstructorModal({
  isOpen,
  formData,
  onClose,
  onFormChange,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Instructor</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={onSubmit} className="student-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={onFormChange}
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
                value={formData.lastName}
                onChange={onFormChange}
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
                value={formData.specialty}
                onChange={onFormChange}
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
                value={formData.experience}
                onChange={onFormChange}
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
              value={formData.certification}
              onChange={onFormChange}
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
              value={formData.phone}
              onChange={onFormChange}
              className="form-input"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={onFormChange}
              className="form-textarea"
              placeholder="Enter full address"
              rows="2"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Instructor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateInstructorModal;
