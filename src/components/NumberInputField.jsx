import {
  Box,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useRef } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Styled components
const NumberInputContainer = styled(Box)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#b3b3b3',
  borderWidth: '1px',
  padding: '0px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '40px',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: '#ffffff',
  position: 'relative',
  '&:hover': {
    borderColor: '#999999',
  },
}));

const NumberInput = styled('input')(() => ({
  flex: 1,
  border: 'none',
  outline: 'none',
  padding: '10px',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 400,
  color: '#000000',
  backgroundColor: 'transparent',
  textAlign: 'left',
  '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '&[type=number]': {
    MozAppearance: 'textfield',
  },
}));

const SpinnerButtonGroup = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '100%',
  borderLeft: '1px solid #e0e0e0',
  opacity: 0,
  transition: 'opacity 0.2s ease',
}));

const SpinnerButton = styled(IconButton)(() => ({
  padding: '2px',
  width: '100%',
  height: '50%',
  borderRadius: 0,
  color: '#666666',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&:first-of-type': {
    borderBottom: '1px solid #e0e0e0',
  },
}));

// Number Input Field Component
const NumberInputField = ({ value, onChange, min = 0, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = (Number(value) || 0) + 1;
    if (onChange) {
      onChange(newValue);
    }
    // 保持焦点状态
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = Math.max(min, (Number(value) || 0) - 1);
    if (onChange) {
      onChange(newValue);
    }
    // 保持焦点状态
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === '' || !isNaN(inputValue)) {
      const numValue = inputValue === '' ? 0 : parseInt(inputValue, 10);
      if (onChange) {
        onChange(isNaN(numValue) ? 0 : Math.max(min, numValue));
      }
    }
  };

  return (
    <NumberInputContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={(theme) => ({
        borderColor: isFocused ? (theme.palette.primary.main || '#f16508') : undefined,
        '&:hover': {
          borderColor: isFocused ? (theme.palette.primary.main || '#f16508') : '#999999',
        },
      })}
    >
      <NumberInput
        ref={inputRef}
        type="number"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        min={min}
        {...props}
      />
      <SpinnerButtonGroup
        sx={{
          opacity: isHovered || isFocused ? 1 : 0,
        }}
      >
        <SpinnerButton
          size="small"
          onMouseDown={(e) => {
            e.preventDefault();
            handleIncrement(e);
          }}
          disabled={false}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: '14px' }} />
        </SpinnerButton>
        <SpinnerButton
          size="small"
          onMouseDown={(e) => {
            e.preventDefault();
            handleDecrement(e);
          }}
          disabled={Number(value) <= min}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: '14px' }} />
        </SpinnerButton>
      </SpinnerButtonGroup>
    </NumberInputContainer>
  );
};

export default NumberInputField;

