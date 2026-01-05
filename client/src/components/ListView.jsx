import PropTypes from 'prop-types';

/**
 * Reusable list view component with consistent layout and styling
 * 
 * @param {node} icon - FontAwesome icon element for the title
 * @param {string} title - Section title
 * @param {node} searchBar - Optional search component
 * @param {node} createButton - Optional create button
 * @param {boolean} loading - Loading state
 * @param {boolean} isEmpty - Whether the list is empty
 * @param {string} emptyMessage - Message to display when list is empty
 * @param {node} children - List items to render
 * @param {node} pagination - Optional pagination component
 */
function ListView({
  icon,
  title,
  searchBar,
  createButton,
  loading,
  isEmpty,
  emptyMessage = 'No items found',
  children,
  pagination,
  extraHeader
}) {
  return (
    <div className="list-view">
      <h2 className="form-title">
        {icon}
        {title}
      </h2>
      
      {(searchBar || createButton) && (
        <div className="search-create-container">
          {searchBar}
          {createButton}
        </div>
      )}

      {extraHeader}

      {loading ? (
        <div className="loading-inline">Loading...</div>
      ) : isEmpty ? (
        <div className="no-results">{emptyMessage}</div>
      ) : (
        <>
          <div className="list-items">
            {children}
          </div>
          {pagination}
        </>
      )}
    </div>
  );
}

ListView.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  searchBar: PropTypes.node,
  createButton: PropTypes.node,
  loading: PropTypes.bool,
  isEmpty: PropTypes.bool,
  emptyMessage: PropTypes.string,
  children: PropTypes.node,
  pagination: PropTypes.node,
  extraHeader: PropTypes.node
};

export default ListView;
