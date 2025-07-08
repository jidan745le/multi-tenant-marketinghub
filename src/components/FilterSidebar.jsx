import {
  ArrowDropDown,
  CheckBox,
  CheckBoxOutlineBlank
} from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { ScrollBarWrapperBox } from './ScrollBarThemeWrapper';

// Styled Components
const FilterPanelContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
  position: 'relative',
}));

const FilterPanel = styled(ScrollBarWrapperBox)(() => ({
  padding: '16px 16px 32px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
  position: 'relative',
  boxShadow: 'none',
  backgroundColor: 'transparent',
}));

const FilterSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  position: 'relative',
}));

const SideNavHeading = styled(Box)(() => ({
  padding: '0px 12px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  height: '44px',
  position: 'relative',
}));

const Heading = styled(Typography)(() => ({
  color: '#000000',
  fontSize: '16px',
  lineHeight: '24px',
  letterSpacing: '0.15px',
  fontWeight: 500,
  fontFamily: '"Roboto-Medium", sans-serif',
}));

const SearchBarContainer = styled(Box)(() => ({
  padding: '0px 12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  position: 'relative',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: '40px',
    borderRadius: '4px',
    borderColor: '#cccccc',
    fontSize: '14px',
    '& fieldset': {
      borderColor: '#cccccc',
      borderWidth: '0.5px',
    },
    '&:hover fieldset': {
      borderColor: '#cccccc',
      borderWidth: '0.5px',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '1px',
    },
  },
  '& .MuiInputBase-input': {
    color: '#999999',
    outline: 'none',
    '&::placeholder': {
      color: '#999999',
      opacity: 1,
    },
  },
}));

const SideNavDivider = styled(Box)(() => ({
  borderRadius: '100px',
  padding: '20px 0px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
}));

const CustomDivider = styled('div')(() => ({
  background: '#cccccc',
  width: '100%',
  height: '1px',
}));

const TextButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  padding: '0px 12px',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  height: '40px',
  textTransform: 'uppercase',
  color: theme.palette.primary.main,
  '& .MuiButton-startIcon':{
     margin:'0px',
  },
  '& .MuiSvgIcon-root': {
    strokeWidth: '1.5',
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '0A', // 4% opacity
  },
}));

const CheckBoxContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  position: 'relative',
}));

const CheckBoxItem = styled(Box)(() => ({
  padding: '0px 12px 0px 0px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  position: 'relative',
  minHeight: '40px',
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  width: '100%',
  '& .MuiFormControlLabel-label': {
    color: '#000000',
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.25px',
    fontWeight: 400,
    fontFamily: '"Roboto-Regular", sans-serif',
    flex: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  '& .MuiCheckbox-root': {
    color: '#999999',
    '&.Mui-checked': {
      color: theme.palette.primary.main,
    },
  },
}));

const ProductCategoryContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  height: '240px',
  position: 'relative',
  overflow: 'hidden',
}));

const ShowMoreButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  padding: '0px 12px',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '40px',
  color: theme.palette.primary.main,
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'uppercase',
  textDecoration: 'underline',
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '0A', // 4% opacity
    textDecoration: 'underline',
  },
}));

// SearchBar Component
const SearchBar = ({ placeholder, onSearch }) => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  return (
    <SearchBarContainer>
      <StyledTextField
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
               <span className="material-symbols-outlined">search</span>
            </InputAdornment>
          ),
        }}
      />
    </SearchBarContainer>
  );
};

// MassSearchButton Component
const MassSearchButton = ({ onClick }) => (
  <TextButton onClick={onClick} startIcon={<span className="material-symbols-outlined">pageview</span>}>
    Mass Search
  </TextButton>
);

// CheckboxGroup Component
const CheckboxGroup = ({ title, options, selectedValues, onChange }) => {
  const handleChange = (value) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter(item => item !== value)
      : [...selectedValues, value];
    onChange(newSelected);
  };

  return (
    <FilterSection>
      <SideNavHeading>
        <Heading>{title}</Heading>
      </SideNavHeading>
      <CheckBoxContainer>
        {options.map((option) => (
          <CheckBoxItem key={option.value}>
            <StyledFormControlLabel
              control={
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleChange(option.value)}
                  icon={<CheckBoxOutlineBlank />}
                  checkedIcon={<CheckBox />}
                />
              }
              label={option.label}
            />
          </CheckBoxItem>
        ))}
      </CheckBoxContainer>
    </FilterSection>
  );
};

// Main FilterSidebar Component
function FilterSidebar() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const typeOptions = [
    { value: 'combo-kit', label: 'Combo Kit' },
    { value: 'kit', label: 'Kit' },
    { value: 'tool-only', label: 'Tool Only' },
  ];

  const allCategoryOptions = [
    { value: 'hand-tools', label: 'Hand Tools' },
    { value: 'power-tool-accessories', label: 'Power Tool Accessories' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'renovation', label: 'Renovation' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'ppe', label: 'PPE' },
    { value: 'batteries-chargers', label: 'Batteries & Chargers' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'telescopic', label: 'Telescopic' },
    { value: 'ride-on-mowers', label: 'Ride on Mowers' },
    { value: 'robot-mowers', label: 'Robot Mowers' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'auger', label: 'Auger' },
    { value: 'snow-throwers', label: 'Snow Throwers' },
  ];

  const visibleCategoryOptions = showAllCategories 
    ? allCategoryOptions 
    : allCategoryOptions.slice(0, 6);

  const handleModelNameSearch = (value) => {
    console.log('Model Name search:', value);
  };

  const handleModelNumberSearch = (value) => {
    console.log('Model Number search:', value);
  };

  const handleEANSearch = (value) => {
    console.log('EAN search:', value);
  };

  const handleMassSearch = () => {
    console.log('Mass search clicked');
  };

  const toggleShowMore = () => {
    setShowAllCategories(!showAllCategories);
  };

  return (
    <FilterPanelContainer>
      <FilterPanel>
        {/* Model Name Filter */}
        <FilterSection>
          <SideNavHeading>
            <Heading>Model Name</Heading>
          </SideNavHeading>
          <SearchBar 
            placeholder="search model name" 
            onSearch={handleModelNameSearch}
          />
        </FilterSection>

        {/* Divider */}
        <SideNavDivider>
          <CustomDivider />
        </SideNavDivider>

        {/* Model Number Filter */}
        <FilterSection>
          <SideNavHeading>
            <Heading>Model Number</Heading>
          </SideNavHeading>
          <SearchBar 
            placeholder="Search model number" 
            onSearch={handleModelNumberSearch}
          />
          <MassSearchButton onClick={handleMassSearch} />
        </FilterSection>

        {/* Divider */}
        <SideNavDivider>
          <CustomDivider />
        </SideNavDivider>

        {/* EAN Filter */}
        <FilterSection>
          <SideNavHeading>
            <Heading>EAN</Heading>
          </SideNavHeading>
          <SearchBar 
            placeholder="Search ean" 
            onSearch={handleEANSearch}
          />
          <MassSearchButton onClick={handleMassSearch} />
        </FilterSection>

        {/* Divider */}
        <SideNavDivider>
          <CustomDivider />
        </SideNavDivider>

        {/* Type Filter */}
        <CheckboxGroup
          title="Type"
          options={typeOptions}
          selectedValues={selectedTypes}
          onChange={setSelectedTypes}
        />

        {/* Divider */}
        <SideNavDivider>
          <CustomDivider />
        </SideNavDivider>

        {/* Product Category Filter */}
        <FilterSection>
          <SideNavHeading>
            <Heading>Product Category</Heading>
          </SideNavHeading>
          <ProductCategoryContainer>
            <CheckBoxContainer>
              {visibleCategoryOptions.map((option) => (
                <CheckBoxItem key={option.value}>
                  <StyledFormControlLabel
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(option.value)}
                        onChange={() => {
                          const newSelected = selectedCategories.includes(option.value)
                            ? selectedCategories.filter(item => item !== option.value)
                            : [...selectedCategories, option.value];
                          setSelectedCategories(newSelected);
                        }}
                        icon={<CheckBoxOutlineBlank />}
                        checkedIcon={<CheckBox />}
                      />
                    }
                    label={option.label}
                  />
                </CheckBoxItem>
              ))}
            </CheckBoxContainer>
          </ProductCategoryContainer>
          
          <ShowMoreButton 
            onClick={toggleShowMore}
            endIcon={<ArrowDropDown />}
          >
            {showAllCategories ? 'Show Less' : 'Show More'}
          </ShowMoreButton>
        </FilterSection>
      </FilterPanel>
    </FilterPanelContainer>
  );
}

export default FilterSidebar; 