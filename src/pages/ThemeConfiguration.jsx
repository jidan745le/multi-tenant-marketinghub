import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { SectionCard, SectionTitle, SubTitle } from '../components/SettingsComponents';

// Styled Components
const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
  },
}));

const ConfigSection = styled(Box)(() => ({
  marginBottom: 32,
}));

const CheckboxGroup = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}));

const TwoColumnLayout = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 24,
}));

function ThemeConfiguration() {
  // State for demo purposes
  const [saving, setSaving] = useState(false);
  const [activeFunctionality, setActiveFunctionality] = useState({
    brandBook: true,
    derivateManagement: true,
    feature1: false,
    feature2: false,
    feature3: false,
    feature4: false,
    feature5: false,
    feature6: false,
  });

  const [dataSheet, setDataSheet] = useState('Data_Sheet_01');
  const [pimConnector, setPimConnector] = useState('Informatica');
  const [serverUrl, setServerUrl] = useState('');

  // Handlers
  const handleFunctionalityChange = (key) => {
    setActiveFunctionality(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setSaving(false);
      console.log('Configuration saved:', {
        activeFunctionality,
        dataSheet,
        pimConnector,
        serverUrl
      });
    }, 1000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Activate Functionality */}
      <SectionCard>
        <SectionTitle>Activate Functionality</SectionTitle>
        
        <TwoColumnLayout>
          {/* Left Column */}
          <CheckboxGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.brandBook}
                  onChange={() => handleFunctionalityChange('brandBook')}
                  sx={{ 
                    color: '#ff6600',
                    '&.Mui-checked': {
                      color: '#ff6600',
                    },
                  }}
                />
              }
              label="Brand Book"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.derivateManagement}
                  onChange={() => handleFunctionalityChange('derivateManagement')}
                  sx={{ 
                    color: '#ff6600',
                    '&.Mui-checked': {
                      color: '#ff6600',
                    },
                  }}
                />
              }
              label="Derivate Management"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.feature1}
                  onChange={() => handleFunctionalityChange('feature1')}
                />
              }
              label="Feature 1"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.feature2}
                  onChange={() => handleFunctionalityChange('feature2')}
                />
              }
              label="Feature 2"
              sx={{ mb: 1 }}
            />
          </CheckboxGroup>

          {/* Right Column */}
          <CheckboxGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.feature3}
                  onChange={() => handleFunctionalityChange('feature3')}
                />
              }
              label="Feature 3"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.feature4}
                  onChange={() => handleFunctionalityChange('feature4')}
                />
              }
              label="Feature 4"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.feature5}
                  onChange={() => handleFunctionalityChange('feature5')}
                />
              }
              label="Feature 5"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.feature6}
                  onChange={() => handleFunctionalityChange('feature6')}
                />
              }
              label="Feature 6"
              sx={{ mb: 1 }}
            />
          </CheckboxGroup>
        </TwoColumnLayout>
      </SectionCard>

      {/* Data Sheet */}
      <SectionCard>
        <SectionTitle>Data Sheet</SectionTitle>
        
        <Box sx={{ mb: 3 }}>
          <SubTitle>SELECT MAIN DATA SHEET</SubTitle>
          <Select
            fullWidth
            value={dataSheet}
            onChange={(e) => setDataSheet(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{ mt: 1 }}
          >
            <MenuItem value="Data_Sheet_01">Data_Sheet_01</MenuItem>
            <MenuItem value="Data_Sheet_02">Data_Sheet_02</MenuItem>
            <MenuItem value="Data_Sheet_03">Data_Sheet_03</MenuItem>
          </Select>
        </Box>
      </SectionCard>

      {/* Settings Control */}
      <SectionCard>
        <SectionTitle>Settings Control</SectionTitle>
        <Box sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Settings control configuration area
          </Typography>
        </Box>
      </SectionCard>

      {/* Filter Logic */}
      <SectionCard>
        <SectionTitle>Filter Logic</SectionTitle>
        <Box sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Filter logic configuration area
          </Typography>
        </Box>
      </SectionCard>

      {/* PIM Settings */}
      <SectionCard>
        <SectionTitle>PIM Settings</SectionTitle>
        
        <TwoColumnLayout>
          {/* PIM Connector */}
          <Box>
            <SubTitle>PIM CONNECTOR</SubTitle>
            <Select
              fullWidth
              value={pimConnector}
              onChange={(e) => setPimConnector(e.target.value)}
              variant="outlined"
              size="medium"
              sx={{ mt: 1 }}
            >
              <MenuItem value="Informatica">Informatica</MenuItem>
              <MenuItem value="SAP">SAP</MenuItem>
              <MenuItem value="Oracle">Oracle</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </Box>

          {/* Server URL API */}
          <Box>
            <SubTitle>SERVER URL API</SubTitle>
            <TextField
              fullWidth
              placeholder="Enter API"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              variant="outlined"
              size="medium"
              sx={{ mt: 1 }}
            />
          </Box>
        </TwoColumnLayout>
      </SectionCard>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 4 }}>
        <SaveButton 
          variant="contained" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
          Save Configuration
        </SaveButton>
      </Box>
    </Box>
  );
}

export default ThemeConfiguration;
