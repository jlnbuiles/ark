import PropTypes from 'prop-types';

/**
 * Reusable confirmation modal component
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Called when modal should close
 * @param {string} title - Modal header title
 * @param {string|node} message - Main content (can be string or JSX)
 * @param {string} cancelLabel - Text for cancel button (default: "Cancel")
 * @param {string} confirmLabel - Text for confirm button (default: "Yes")
 * @param {function} onConfirm - Called when confirm button is clicked
 * @param {function} onCancel - Optional callback for cancel action
 * 
 * @example
 * <ConfirmModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Delete Item"
 *   message="Are you sure you want to delete this item?"
 *   cancelLabel="No, Keep It"
 *   confirmLabel="Yes, Delete"
 *   onConfirm={handleDelete}
 * />
 */
function ConfirmModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  cancelLabel = 'Cancel',
  confirmLabel = 'Yes',
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={handleCancel}>&times;</button>
        </div>
        
        <div className="modal-body">
          {typeof message === 'string' ? (
            <p>{message}</p>
          ) : (
            message
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="submit-btn" onClick={handleConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func
};

export default ConfirmModal;
