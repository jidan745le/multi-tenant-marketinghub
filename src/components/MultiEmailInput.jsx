import { Box, Chip, TextField } from '@mui/material';
import { useState } from 'react';

const MultiEmailInput = ({ 
  emails = [], 
  onChange, 
  placeholder = "Enter email addresses...",
  onFocus,
  onBlur,
  style = {},
  ...props 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addEmail();
    } else if (e.key === 'Backspace' && inputValue === '' && emails.length > 0) {
      // Remove last email when backspace is pressed on empty input
      const newEmails = [...emails];
      newEmails.pop();
      onChange(newEmails);
    }
  };

  const addEmail = () => {
    const email = inputValue.trim().replace(/,$/, ''); // Remove trailing comma
    if (email && isValidEmail(email) && !emails.includes(email)) {
      onChange([...emails, email]);
      setInputValue('');
    }
  };

  const removeEmail = (emailToRemove) => {
    onChange(emails.filter(email => email !== emailToRemove));
  };

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    addEmail(); // Add email on blur if there's text
    onBlur?.(e);
  };

  return (
    <Box
      sx={{
        border: `1px solid ${focused ? '#1976d2' : '#E5E5E5'}`,
        borderRadius: '4px',
        padding: '8px',
        minHeight: '40px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '4px',
        cursor: 'text',
        transition: 'border-color 0.2s ease',
        '&:hover': {
          borderColor: focused ? '#1976d2' : '#999',
        },
        ...style
      }}
      onClick={() => {
        // Focus the hidden input when clicking on the container
        const input = document.querySelector('.multi-email-input');
        input?.focus();
      }}
      {...props}
    >
      {/* Render email chips */}
      {emails.map((email, index) => (
        <Chip
          key={index}
          label={email}
          size="small"
          onDelete={() => removeEmail(email)}
          sx={{
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            '& .MuiChip-deleteIcon': {
              color: '#1976d2',
              '&:hover': {
                color: '#1565c0',
              },
            },
          }}
        />
      ))}
      
      {/* Hidden input for typing */}
      <TextField
        className="multi-email-input"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={emails.length === 0 ? placeholder : ''}
        variant="standard"
        sx={{
          flex: 1,
          minWidth: '120px',
          '& .MuiInput-underline:before': { display: 'none' },
          '& .MuiInput-underline:after': { display: 'none' },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': { display: 'none' },
          '& .MuiInputBase-input': {
            padding: 0,
            fontSize: '14px',
          },
        }}
      />
    </Box>
  );
};

export default MultiEmailInput;
