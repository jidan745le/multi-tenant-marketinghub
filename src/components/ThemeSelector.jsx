import React from 'react';

const ThemeSelector = ({ themes, currentTheme, onThemeChange }) => {
  if (!themes || themes.length <= 1) {
    return null; // Don't show selector if only one theme or no themes
  }

  return (
    <select 
      value={currentTheme || ''}
      onChange={(e) => onThemeChange(e.target.value)}
      style={{
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        backgroundColor: 'white',
        cursor: 'pointer',
        marginLeft: '8px'
      }}
    >
      {themes.map(theme => (
        <option key={theme.theme_key} value={theme.theme_key}>
          {theme.theme_name}
        </option>
      ))}
    </select>
  );
};

export default ThemeSelector;
