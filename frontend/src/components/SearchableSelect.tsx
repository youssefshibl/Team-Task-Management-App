import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { User } from '../types';

interface SearchableSelectProps {
  options: User[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select a team member',
  required = false,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, bottom: 0 });

  const selectedOption = options.find((opt) => opt.id === value);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.toLowerCase();
    return options.filter(
      (option) =>
        option.name.toLowerCase().includes(query) ||
        option.email.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const updateDropdownPosition = () => {
      if (isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 300; // max height
        
        // Position below if there's enough space, otherwise above
        const shouldPositionAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
        
        // Use getBoundingClientRect() directly since we're using position: fixed
        // This gives us viewport coordinates, no need to add scroll offsets
        setDropdownPosition({
          top: shouldPositionAbove 
            ? rect.top - dropdownHeight - 4
            : rect.bottom + 4,
          left: Math.min(rect.left, viewportWidth - rect.width),
          width: rect.width,
          bottom: shouldPositionAbove ? rect.bottom : 0,
        });
      }
    };

    updateDropdownPosition();
    
    if (isOpen) {
      // Use requestAnimationFrame for smooth updates
      const handleUpdate = () => {
        requestAnimationFrame(updateDropdownPosition);
      };
      
      // Listen to scroll events on window and all scrollable containers
      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);
      
      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isOpen]);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid var(--border-color)',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary-color)';
        }}
        onBlur={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }
        }}
      >
        <span style={{ color: selectedOption ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
          {selectedOption ? `${selectedOption.name} (${selectedOption.email})` : placeholder}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>▼</span>
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              backgroundColor: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 2000,
              maxHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
          <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
          </div>
          <div
            role="listbox"
            style={{
              maxHeight: '250px',
              overflowY: 'auto',
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                }}
              >
                No members found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  role="option"
                  aria-selected={value === option.id}
                  onClick={() => handleSelect(option.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(option.id);
                    }
                  }}
                  tabIndex={0}
                  style={{
                    padding: '0.75rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: value === option.id ? '#eff6ff' : 'transparent',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (value !== option.id) {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== option.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ fontWeight: value === option.id ? 600 : 400 }}>
                    {option.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      marginTop: '0.25rem',
                    }}
                  >
                    {option.email}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>,
        document.body
      )}

      {required && (
        <input
          type="hidden"
          id={id}
          value={value}
          required={required}
        />
      )}
    </div>
  );
};

