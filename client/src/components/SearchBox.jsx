import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="search-section">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="search-input"
      />
    </div>
  );
}

export default SearchBox;
