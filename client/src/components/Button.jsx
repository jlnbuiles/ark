import PropTypes from 'prop-types';

/**
 * Reusable button component with consistent styling
 * 
 * @param {string} variant - Button style variant: 'primary', 'secondary', 'delete', 'warning', 'success'
 * @param {string} size - Button size: 'small', 'medium', 'large'
 * @param {function} onClick - Click handler
 * @param {boolean} disabled - Whether button is disabled
 * @param {string} className - Additional CSS classes
 * @param {node} children - Button content
 * @param {string} type - Button type attribute
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>Click Me</Button>
 * <Button variant="secondary" size="small">Cancel</Button>
 */
function Button({ 
  variant = 'primary',
  size = 'small',
  onClick,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ...props
}) {
  const baseStyles = {
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    minWidth: '120px',
    opacity: disabled ? 0.6 : 1
  };

  const sizeStyles = {
    small: {
      padding: '8px 16px'
    },
    medium: {
      padding: '12px 24px'
    },
    large: {
      padding: '14px 28px',
      fontSize: '1rem'
    }
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
    },
    secondary: {
      padding: '6px 14px', // Adjusted for border
      background: 'white',
      color: '#2563eb',
      border: '2px solid #2563eb'
    },
    delete: {
      padding: '6px 14px', // Adjusted for border
      background: 'white',
      color: '#dc2626',
      border: '2px solid #dc2626'
    },
    warning: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: 'white',
      boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)'
    },
    success: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
    },
    blue: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      color: 'white',
      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
    }
  };

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  const buttonStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant]
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
      style={buttonStyles}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'delete', 'warning', 'success', 'blue']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  type: PropTypes.string
};

export default Button;
