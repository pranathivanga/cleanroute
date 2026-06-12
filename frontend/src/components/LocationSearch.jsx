import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, X, Loader2, Search } from 'lucide-react';
import { searchPlaces } from '../services/geocodingService';
import './LocationSearch.css';

/**
 * India-focused autocomplete location search input.
 *
 * Uses OpenStreetMap Nominatim restricted to India (countrycodes=in).
 * Debounces API calls at 350ms. Shows real Indian place suggestions.
 * Stores lat/lon internally — users only see place names.
 *
 * Props:
 *  - label: field label
 *  - placeholder: input placeholder
 *  - value: currently selected place object { displayName, shortName, lat, lon }
 *  - onChange: callback when a place is selected (receives place object or null)
 *  - dotColor: 'start' | 'end' for the colored indicator
 *  - id: unique HTML id
 *  - error: error message to display
 */
export default function LocationSearch({
  label,
  placeholder = 'Search for a place in India...',
  value,
  onChange,
  dotColor = 'start',
  id = 'location-search',
  error,
}) {
  const [query, setQuery] = useState(value?.shortName || '');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  // Sync external value changes
  useEffect(() => {
    if (value?.shortName) {
      setQuery(value.shortName);
    }
  }, [value]);

  // Click-outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const places = await searchPlaces(searchQuery, 5);
      setResults(places);
      setShowDropdown(places.length > 0);
      setHighlightedIndex(-1);
    } catch {
      setResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    // Clear current selection when user types
    if (value) {
      onChange(null);
    }

    // Debounced search — 350ms delay
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length >= 2) {
      setIsSearching(true); // Show loading immediately
      debounceRef.current = setTimeout(() => {
        handleSearch(val);
      }, 350);
    } else {
      setResults([]);
      setShowDropdown(false);
      setIsSearching(false);
    }
  };

  const handleSelect = (place) => {
    // place has { displayName, shortName, lat, lon } — lat/lon stored internally
    setQuery(place.shortName);
    setShowDropdown(false);
    setResults([]);
    setIsSearching(false);
    onChange(place);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    setIsSearching(false);
    onChange(null);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        handleSelect(results[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className="location-search" ref={wrapperRef} id={id}>
      {label && (
        <label className="location-label">
          <span className={`dot-indicator ${dotColor}`}></span>
          {label}
        </label>
      )}

      <div className={`location-input-wrapper ${error ? 'has-error' : ''} ${value ? 'has-value' : ''}`}>
        <Search size={16} className="location-search-icon" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="location-input"
          autoComplete="off"
        />
        {isSearching && (
          <Loader2 size={16} className="location-loading-icon" />
        )}
        {query && !isSearching && (
          <button className="location-clear-btn" onClick={handleClear} type="button">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Selected confirmation — show human-readable name only */}
      {value && (
        <div className="location-confirmed">
          <MapPin size={12} />
          <span>{value.shortName}</span>
        </div>
      )}

      {/* Error */}
      {error && <p className="location-error">{error}</p>}

      {/* Dropdown — Indian location suggestions */}
      {showDropdown && results.length > 0 && (
        <div className="location-dropdown">
          {results.map((place, idx) => (
            <button
              key={`${place.lat}-${place.lon}-${idx}`}
              type="button"
              className={`location-option ${idx === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => handleSelect(place)}
              onMouseEnter={() => setHighlightedIndex(idx)}
            >
              <MapPin size={14} className="option-icon" />
              <div className="option-text">
                <span className="option-name">{place.shortName}</span>
                <span className="option-detail">{place.displayName}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results found */}
      {showDropdown && results.length === 0 && !isSearching && query.trim().length >= 2 && (
        <div className="location-dropdown">
          <div className="location-no-results">
            <Search size={14} />
            <span>No locations found in India. Try a different search.</span>
          </div>
        </div>
      )}
    </div>
  );
}
