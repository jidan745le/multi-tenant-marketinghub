import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputBase,
    Paper,
    Radio,
    RadioGroup,
    TextareaAutosize,
    Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { ScrollBarWrapperBox } from './ScrollBarThemeWrapper';

// Styled Components
const FilterContainer = styled(ScrollBarWrapperBox)(() => ({
  padding: '16px',
  width: '280px',
  boxSizing: 'border-box',
  borderRadius: 0,
  height: 'calc(100vh - 140px)',
  boxShadow: 'none',
  backgroundColor: 'transparent',
}));

const FilterSection = styled(Box)(() => ({
  marginBottom: '16px',
  marginLeft: '12px',
}));

const FilterTitle = styled(Typography)(() => ({
  fontSize: '16px',
  fontWeight: 500,
  marginBottom: '16px',
  color: '#000000',
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  boxShadow: 'none',
  borderRadius: '4px',
  border: '1px solid #BDBDBD',
  backgroundColor: '#fff',
  padding: '2px 2px',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  transition: 'border-color 0.2s ease-in-out',
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
  },
}));

const TextareaContainer = styled(Paper)(({ theme }) => ({
  boxShadow: 'none',
  borderRadius: '4px',
  border: '1px solid #BDBDBD',
  backgroundColor: '#fff',
  padding: '2px 2px',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  transition: 'border-color 0.2s ease-in-out',
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
  },
}));

const MassSearchButton = styled(Typography)(({theme}) => ({
  display: 'inline-block',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '22px',
  userSelect: 'none',
  color: theme.palette.primary.main,
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  marginLeft: 0,
  marginRight: 0,
  color: theme.palette.text.secondary,
  '& .MuiFormControlLabel-label': {
    fontSize: '14px',
  },
}));

const ShowMoreButton = styled(Typography)(({theme}) => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
  fontSize: '14px',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

// 初始化字段值类型
const initFieldValueType = (type) => {
  switch (type) {
    case 'array':
      return [];
    case 'string':
      return '';
    case 'number':
      return undefined;
    case 'object':
      return {};
    default:
      return undefined;
  }
};

const ConfigurableFilterSidebar = ({ 
  config, 
  onChange, 
  onMassSearch 
}) => {
  const theme = useTheme();
  const [internalValues, setInternalValues] = useState({});
  const [collapseState, setCollapseState] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [currentChildItem, setCurrentChildItem] = useState(null);

  // 只在组件挂载时初始化一次
  useEffect(() => {
    if (!config?.filters) return;
    
    const initialValues = {};
    const initialCollapseState = {};
    
    config.filters.forEach((item) => {
      initialValues[item.key] = item.defaultValue || initFieldValueType(item.type);
      
      if (item.component === 'checkbox' && item.enum) {
        initialCollapseState[item.key] = item.enum.length > 7;
      }
    });
    
    setInternalValues(initialValues);
    setCollapseState(initialCollapseState);
    
    // 初始化后立即通知父组件
    onChange?.(initialValues);
  }, [config, onChange]);

  const handleValueChange = (key, value) => {
    setInternalValues(prev => {
      const newValues = {
        ...prev,
        [key]: value
      };
      // 直接在状态更新时通知父组件
      onChange?.(newValues);
      return newValues;
    });
  };

  const handleMassSearchClick = (item, childItem) => {
    setCurrentItem(item);
    setCurrentChildItem(childItem);
    setDialogContent(internalValues[item.key] || '');
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (currentItem) {
      handleValueChange(currentItem.key, dialogContent);
    }
    setDialogOpen(false);
    onMassSearch?.(currentItem, currentChildItem);
  };

  const toggleCollapse = (key) => {
    setCollapseState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderInputField = (item) => (
    <SearchContainer>
      <InputBase
        sx={{ 
          height: '40px',
          ml: 1, 
          flex: 1,
          fontSize: '14px',
          lineHeight: '20px',
          letterSpacing: '0.25px',
          fontWeight: '400',
          '& input': {
            outline: 'none',
          },
          '& .MuiInputBase-startAdornment': {
          }
        }}
        placeholder={item.placeholder || ''}
        // startAdornment={<SearchTwoToneIcon fontSize="small" />}
        startAdornment={<span style={{color:'#999999',marginRight:'8px'}} className='material-symbols-outlined'>search</span>}
        value={internalValues[item.key] || ''}
        onChange={(event) => handleValueChange(item.key, event.target.value)}
      />
    </SearchContainer>
  );

  const renderTextareaField = (item) => (
    <div>
      <TextareaContainer>
        <TextareaAutosize
          style={{
            width: '100%',
            // minHeight: '20px',
            // maxHeight: '48px',
            height: '40px',
            padding: '0px 8px',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.25px',
            fontWeight: '400',
            border: 'none',
            outline: 'none',
            resize: 'none',
            overflow: 'auto',
            backgroundColor: '#fff',
            fontFamily: 'inherit',
          }}
          placeholder={item.placeholder || ''}
          startAdornment={<span style={{color:'#999999',marginRight:'8px'}} className='material-symbols-outlined'>search</span>}
          value={internalValues[item.key] || ''}
          onChange={(event) => handleValueChange(item.key, event.target.value)}
        />
      </TextareaContainer>
      {item.children?.map((childItem) => (
        <MassSearchButton
          key={childItem.key}
          onClick={() => handleMassSearchClick(item, childItem)}
        >
          {childItem.label}
        </MassSearchButton>
      ))}
    </div>
  );

  const renderCheckboxField = (item) => {
    const currentValues = internalValues[item.key] || [];
    const isCollapsed = collapseState[item.key];
    const displayEnum = isCollapsed && item.enum 
      ? item.enum.slice(0, item.defaultCollapseCount || 7)
      : item.enum || [];

    return (
      <div>
        <FormControl>
          <FormGroup>
            {displayEnum.map((option) => (
              <StyledFormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    size="small"
                    checked={currentValues.includes(option.value)}
                    onChange={(event) => {
                      const newValues = event.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter(v => v !== option.value);
                      handleValueChange(item.key, newValues);
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        </FormControl>
        {item.enum && item.enum.length > 7 && (
          <ShowMoreButton onClick={() => toggleCollapse(item.key)}>
            {isCollapsed ? 'Show More' : 'Show Less'}
          </ShowMoreButton>
        )}
      </div>
    );
  };

  const renderRadioField = (item) => {
    const currentValue = internalValues[item.key] || '';
    const isCollapsed = collapseState[item.key];
    const displayEnum = isCollapsed && item.enum 
      ? item.enum.slice(0, 7)
      : item.enum || [];

    return (
      <div>
        <FormControl>
          <RadioGroup
            value={currentValue}
            onChange={(event) => handleValueChange(item.key, event.target.value)}
          >
            {displayEnum.map((option) => (
              <StyledFormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio size="small" />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
        {item.enum && item.enum.length > 7 && (
          <ShowMoreButton onClick={() => toggleCollapse(item.key)}>
            {isCollapsed ? 'Show More' : 'Show Less'}
          </ShowMoreButton>
        )}
      </div>
    );
  };

  const renderField = (item) => {
    switch (item.component) {
      case 'input':
        return renderInputField(item);
      case 'textarea':
        return renderTextareaField(item);
      case 'checkbox':
        return renderCheckboxField(item);
      case 'radio':
        return renderRadioField(item);
      default:
        return <div>Unsupported component type: {item.component}</div>;
    }
  };

  if (!config?.filters) {
    return <div>No filter configuration provided</div>;
  }

  // 按 order 字段排序
  const sortedFilters = [...config.filters].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <>
      <FilterContainer>
        {sortedFilters.map((item, index) => (
          <React.Fragment key={item.key}>
            <FilterSection>
              <FilterTitle>{item.label}</FilterTitle>
              {renderField(item)}
            </FilterSection>
            {index < sortedFilters.length - 1 && (
              <Divider sx={{ my: 3, backgroundColor: '#e0e0e0' }} />
            )}
          </React.Fragment>
        ))}
      </FilterContainer>

      {/* 批量搜索对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <div style={{ width: '480px', height: '616px', padding: '12px' }}>
          <DialogContent>
            <DialogContentText sx={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              Mass Search
            </DialogContentText>
            <DialogContentText sx={{ margin: '16px 0' }}>
              {currentChildItem?.desc || 'Enter search terms separated by semicolons'}
            </DialogContentText>
            <TextareaAutosize
              style={{
                width: '100%',
                height: '418px',
                padding: '8px',
                borderRadius: '4px',
                overflow: 'auto',
                resize: 'none',
                border: '1px solid #BDBDBD',
                outline: 'none',
                transition: 'border-color 0.2s ease-in-out',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.palette.primary.main;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#BDBDBD';
              }}
              value={dialogContent}
              onChange={(e) => setDialogContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDialogOpen(false)}
              sx={{ color: '#333', border: '1px solid #E5E5E5' }}
            >
              CANCEL
            </Button>
            <Button 
              onClick={handleDialogConfirm}
              sx={{ background: theme.palette.primary.main, color: '#fff' }}
            >
              SEARCH
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};

export default ConfigurableFilterSidebar; 