import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
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
  TextField,
  TextareaAutosize,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled, useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import MassSearch from './MassSearch';
import MassSearchSimple from './MassSearchSimple';
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
  marginLeft: '8px', // 减少左边距，为指示线留空间
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
  marginLeft: -9,
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

// 可点击文本行样式 - 参考Toc导航的选中效果
const ClickableListItem = styled(Typography)(({ theme, selected }) => ({
  fontSize: '14px',
  fontWeight: selected ? '600' : '400',
  lineHeight: '20px',
  padding: '10px 12px 10px 16px',
  margin: '1px 0',
  cursor: 'pointer',
  userSelect: 'none',
  color: selected ? theme.palette.primary.main : '#4a4a4a',
  backgroundColor: selected ? theme.palette.primary.main + '08' : 'transparent',
  borderRadius: '6px',
  position: 'relative',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // 左侧指示线（选中状态）
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '2px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: selected ? '3px' : '0',
    height: selected ? '18px' : '0',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '2px',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: selected ? theme.palette.primary.main + '12' : theme.palette.primary.main + '04',
    fontWeight: selected ? '600' : '500',
    
    // hover时的左侧指示线
    '&::before': {
      width: selected ? '3px' : '2px',
      height: selected ? '18px' : '14px',
      backgroundColor: theme.palette.primary.main,
    },
  },
  
  '&:active': {
    backgroundColor: theme.palette.primary.main + '16',
    transform: 'scale(0.98)',
  },
}));

// Clickable List 容器样式
const ClickableListContainer = styled(Box)(() => ({
  margin: '0 -8px 0 -4px', // 负边距确保指示线能够贴边显示
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
  onMassSearch,
  useNewMassSearch = true // 默认使用新的 MassSearch 组件
}) => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const [internalValues, setInternalValues] = useState({});
  const [collapseState, setCollapseState] = useState({});
  const [treeData, setTreeData] = useState({});
  const [treeExpandState, setTreeExpandState] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [currentChildItem, setCurrentChildItem] = useState(null);

  // 通用日期计算函数：根据 days 配置计算日期
  const calculateDateFromDays = (days) => {
    if (!days) return null;
    
    const now = new Date();
    let targetDate;
    
    if (days === 'year-start') {
      // 今年1月1日
      targetDate = new Date(now.getFullYear(), 0, 1);
    } else if (typeof days === 'number') {
      // 往前推 N 天
      targetDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    } else {
      return null;
    }
    
    return targetDate.toISOString().split('T')[0];
  };

  // 只在组件挂载时初始化一次
  useEffect(() => {
    if (!config?.filters) return;
    
    const initialValues = {};
    const initialCollapseState = {};
    
    config.filters.forEach((item) => {
      initialValues[item.key] = item.defaultValue || initFieldValueType(item.type);
      
      if ((item.component === 'checkbox' || item.component === 'clickable-list') && item.enum) {
        initialCollapseState[item.key] = item.enum.length > (item.defaultCollapseCount || 7);
      }
      
      // Load tree data if component is tree
      if (item.component === 'tree' && item.fetchTreeData) {
        console.log(`🌳 ConfigurableFilterSidebar: Loading tree data for ${item.key}`);
        item.fetchTreeData().then(data => {
          console.log(`✅ ConfigurableFilterSidebar: Tree data loaded for ${item.key}:`, data);
          setTreeData(prev => ({
            ...prev,
            [item.key]: data
          }));
          
          // 默认收起所有节点（不设置展开状态）
          // 用户需要手动点击箭头展开节点
          console.log(`📁 Tree nodes collapsed by default`);
        }).catch(error => {
          console.error(`❌ ConfigurableFilterSidebar: Failed to load tree data for ${item.key}:`, error);
        });
      } else if (item.component === 'tree' && !item.fetchTreeData) {
        console.warn(`⚠️ ConfigurableFilterSidebar: Tree component ${item.key} has no fetchTreeData function`);
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

  // 混色函数
  const mixWithWhite = (hexColor, amount = 0.15) => {
    try {
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const mix = (c) => Math.round((1 - amount) * 255 + amount * c);
      const toHex = (n) => n.toString(16).padStart(2, '0');
      return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
    } catch {
      return hexColor;
    }
  };

  const renderTagsField = (item) => {
    const currentValue = internalValues[item.key] || '';
    const tagsArray = typeof currentValue === 'string' 
      ? currentValue.split(/[,;]/).map(t => t.trim()).filter(Boolean)
      : Array.isArray(currentValue) 
        ? currentValue 
        : [];

    // 处理标签变化
    const handleTagsChange = (event, newValue) => {
      const tags = newValue.map(v => typeof v === 'string' ? v : v.value || v.label || String(v));
      handleValueChange(item.key, tags.join(','));
    };

    return (
      <SearchContainer>
        <Autocomplete
          multiple
          freeSolo
          disableClearable
          options={[]}
          value={tagsArray}
          onChange={handleTagsChange}
          renderInput={(params) => {
            const { InputProps, ...other } = params;
            // 当有标签时，不显示 placeholder
            const showPlaceholder = tagsArray.length === 0;
            return (
              <TextField
                {...other}
                placeholder={showPlaceholder ? (item.placeholder || 'Search by tags') : ''}
                variant="standard"
                InputProps={{
                  ...InputProps,
                  disableUnderline: true,
                  startAdornment: (
                    <>
                      <span style={{color:'#999999',marginRight:'8px'}} className='material-symbols-outlined'>search</span>
                      {InputProps.startAdornment}
                    </>
                  ),
                  sx: {
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0.25px',
                    fontWeight: '400',
                    '& input': {
                      outline: 'none',
                      padding: '0 !important',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0.25px',
                      fontWeight: '400',
                    },
                    '& input::placeholder': {
                      color: '#999999',
                      opacity: 1,
                    },
                  },
                }}
              />
            );
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option}
                {...getTagProps({ index })}
                deleteIcon={<CloseIcon sx={{ fontSize: '16px' }} />}
                sx={{
                  height: '24px',
                  fontSize: '12px',
                  marginRight: '4px',
                  marginBottom: '4px',
                  backgroundColor: mixWithWhite(primaryColor, 0.05),
                  border: `1px solid ${mixWithWhite(primaryColor, 0.80)}`,
                  color: primaryColor,
                  borderRadius: '12px', 
                  fontFamily: '"Roboto-Regular", sans-serif',
                  '& .MuiChip-deleteIcon': {
                    fontSize: '16px',
                    color: primaryColor,
                    margin: '0 4px 0 -4px',
                    '&:hover': {
                      color: primaryColor,
                      opacity: 0.7,
                      backgroundColor: 'transparent',
                    },
                  },
                }}
              />
            ))
          }
          sx={{
            width: '100%',
            '& .MuiAutocomplete-inputRoot': {
              padding: '8px 8px 8px 0 !important',
              minHeight: '40px',
              height: 'auto',
            },
            '& .MuiAutocomplete-input': {
              padding: '0 !important',
            },
          }}
        />
      </SearchContainer>
    );
  };

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
        {item.enum && item.enum.length > (item.defaultCollapseCount || 7) && (
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
        {item.enum && item.enum.length > (item.defaultCollapseCount || 7) && (
          <ShowMoreButton onClick={() => toggleCollapse(item.key)}>
            {isCollapsed ? 'Show More' : 'Show Less'}
          </ShowMoreButton>
        )}
      </div>
    );
  };

  const renderDateField = (item) => {
    const currentValue = internalValues[item.key] || '';
    const isCollapsed = collapseState[item.key];
    const displayEnum = isCollapsed && item.enum 
      ? item.enum.slice(0, item.defaultCollapseCount || 7)
      : item.enum || [];

    return (
      <div>
        <FormControl>
          <RadioGroup
            value={currentValue}
            onChange={(event) => {
              const selectedOption = item.enum?.find(opt => opt.value === event.target.value);
              if (selectedOption?.days) {
                // 根据 days 配置自动计算日期
                const calculatedDate = calculateDateFromDays(selectedOption.days);
                handleValueChange(item.key, calculatedDate || event.target.value);
              } else {
                handleValueChange(item.key, event.target.value);
              }
            }}
          >
            {displayEnum.map((option) => {
              // 计算并显示实际日期
              const calculatedDate = option.days ? calculateDateFromDays(option.days) : null;
              const displayLabel = option.label;
              
              return (
                <StyledFormControlLabel
                  key={option.value}
                  value={calculatedDate || option.value}
                  control={<Radio size="small" />}
                  label={displayLabel}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
        {item.enum && item.enum.length > (item.defaultCollapseCount || 7) && (
          <ShowMoreButton onClick={() => toggleCollapse(item.key)}>
            {isCollapsed ? 'Show More' : 'Show Less'}
          </ShowMoreButton>
        )}
      </div>
    );
  };

  const renderClickableListField = (item) => {
    const currentValues = internalValues[item.key] || [];
    const isCollapsed = collapseState[item.key];
    const displayEnum = isCollapsed && item.enum 
      ? item.enum.slice(0, item.defaultCollapseCount || 7)
      : item.enum || [];

    return (
      <ClickableListContainer>
        {displayEnum.map((option) => {
          const isSelected = currentValues.includes(option.value);
          return (
            <ClickableListItem
              key={option.value}
              selected={isSelected}
              onClick={() => {
                let newValues;
                if (item.allowMultiple !== false) {
                  // 多选模式（默认）
                  newValues = isSelected
                    ? currentValues.filter(v => v !== option.value)
                    : [...currentValues, option.value];
                } else {
                  // 单选模式
                  newValues = isSelected ? [] : [option.value];
                }
                handleValueChange(item.key, newValues);
              }}
            >
              {option.label}
            </ClickableListItem>
          );
        })}
        {item.enum && item.enum.length > (item.defaultCollapseCount || 7) && (
          <Box sx={{ paddingLeft: '16px', marginTop: '8px' }}>
            <ShowMoreButton onClick={() => toggleCollapse(item.key)}>
              {isCollapsed ? 'Show More' : 'Show Less'}
            </ShowMoreButton>
          </Box>
        )}
      </ClickableListContainer>
    );
  };

  const toggleTreeNode = (itemKey, nodeId) => {
    setTreeExpandState(prev => {
      const itemState = prev[itemKey] || {};
      return {
        ...prev,
        [itemKey]: {
          ...itemState,
          [nodeId]: !itemState[nodeId]
        }
      };
    });
  };

  // 收集节点下所有叶子节点的值
  const collectLeafValues = (node) => {
    const leafValues = [];
    const traverse = (n) => {
      if (!n.children || n.children.length === 0) {
        // 叶子节点
        leafValues.push(n.value);
      } else {
        // 非叶子节点，继续遍历子节点
        n.children.forEach(traverse);
      }
    };
    traverse(node);
    return leafValues;
  };

  // 检查节点是否应该被选中（子节点全部选中则父节点也选中）
  const isNodeChecked = (node, currentValues) => {
    const hasChildren = node.children && node.children.length > 0;
    if (!hasChildren) {
      // 叶子节点：直接检查是否在选中列表中
      return currentValues.includes(node.value);
    } else {
      // 父节点：检查所有叶子节点是否都被选中
      const leafValues = collectLeafValues(node);
      return leafValues.length > 0 && leafValues.every(v => currentValues.includes(v));
    }
  };

  // 检查节点是否处于半选中状态（部分子节点被选中）
  const isNodeIndeterminate = (node, currentValues) => {
    const hasChildren = node.children && node.children.length > 0;
    if (!hasChildren) {
      return false;
    }
    const leafValues = collectLeafValues(node);
    const selectedCount = leafValues.filter(v => currentValues.includes(v)).length;
    return selectedCount > 0 && selectedCount < leafValues.length;
  };

  const renderTreeNode = (node, itemKey, currentValues, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = treeExpandState[itemKey]?.[node.id];
    const indentSize = level * 16;
    
    const isChecked = isNodeChecked(node, currentValues);
    const isIndeterminate = isNodeIndeterminate(node, currentValues);

    const handleCheckboxChange = (event) => {
      const checked = event.target.checked;
      
      if (hasChildren) {
        // 父节点：切换所有叶子节点的选中状态
        const leafValues = collectLeafValues(node);
        console.log(`🌲 Parent node "${node.label}" ${checked ? 'checked' : 'unchecked'}, affecting ${leafValues.length} leaf nodes:`, leafValues);
        
        let newValues;
        
        if (checked) {
          // 选中：添加所有叶子节点
          newValues = [...new Set([...currentValues, ...leafValues])];
        } else {
          // 取消选中：移除所有叶子节点
          newValues = currentValues.filter(v => !leafValues.includes(v));
        }
        
        console.log(`✅ Updated values (only leaf CategoryIDs):`, newValues);
        handleValueChange(itemKey, newValues);
      } else {
        // 叶子节点：只切换自己
        const newValues = checked
          ? [...currentValues, node.value]
          : currentValues.filter(v => v !== node.value);
        console.log(`🍃 Leaf node "${node.label}" (${node.value}) ${checked ? 'checked' : 'unchecked'}`);
        handleValueChange(itemKey, newValues);
      }
    };

    return (
      <Box key={node.id}>
        <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: `${indentSize}px` }}>
          {hasChildren && (
            <Box
              onClick={() => toggleTreeNode(itemKey, node.id)}
              sx={{
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
              }}
            >
              <span 
                className="material-symbols-outlined" 
                style={{ 
                  fontSize: '18px',
                  transition: 'transform 0.2s',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                }}
              >
                chevron_right
              </span>
            </Box>
          )}
          {!hasChildren && <Box sx={{ width: '24px' }} />}
          
          {/* 所有节点都显示复选框，支持级联选择 */}
          <StyledFormControlLabel
            sx={{ flex: 1, marginLeft: 0 }}
            control={
              <Checkbox
                size="small"
                checked={isChecked}
                indeterminate={isIndeterminate}
                onChange={handleCheckboxChange}
              />
            }
            label={node.label}
          />
        </Box>
        {hasChildren && isExpanded && (
          <Box>
            {node.children.map(child => renderTreeNode(child, itemKey, currentValues, level + 1))}
          </Box>
        )}
      </Box>
    );
  };

  const renderTreeField = (item) => {
    const currentValues = internalValues[item.key] || [];
    const data = treeData[item.key] || [];

    if (data.length === 0) {
      return (
        <Typography sx={{ fontSize: '14px', color: '#999', fontStyle: 'italic' }}>
          Loading categories...
        </Typography>
      );
    }

    return (
      <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
        {data.map(node => renderTreeNode(node, item.key, currentValues, 0))}
      </Box>
    );
  };

  const renderField = (item) => {
    console.log(`🎨 Rendering field: ${item.key}, component: ${item.component}, hasFetchTreeData: ${!!item.fetchTreeData}`);
    
    switch (item.component) {
      case 'input':
        // tags
        if (item.key === 'tags') {
          return renderTagsField(item);
        }
        return renderInputField(item);
      case 'textarea':
        return renderTextareaField(item);
      case 'checkbox':
        return renderCheckboxField(item);
      case 'radio':
        return renderRadioField(item);
      case 'date':
        return renderDateField(item);
      case 'clickable-list':
        return renderClickableListField(item);
      case 'tree':
        return renderTreeField(item);
      case 'tags':
        return renderTagsField(item);
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

      {/* 旧的批量搜索对话框 - 用于 productAssets 页面 */}
      {!useNewMassSearch && (
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
      )}

      {/* 新的 MassSearch 组件 - 用于 product library 和 new releases 页面 */}
      {useNewMassSearch && (
        <>
          {/* 
            SKU Code 的处理逻辑：
            - 如果是 product library/category 页面（通过检查 config 中是否有 product-category 字段判断），使用 MassSearch（带 validate）
            - 如果是 assets 页面（Media, Videos, After Sales, Internal Documents, Certifications），使用 MassSearchSimple（无 validate）
          */}
          {currentItem?.key === 'sku-code' ? (
            // 检查是否是 product library/category 页面
            // 通过检查 config.filters 中是否有 'product-category' 字段来判断
            (config?.filters?.some(filter => filter.key === 'product-category')) ? (
              // Product library/category 页面：使用 MassSearch（带 validate）
              <MassSearch
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                initialValue={dialogContent}
                description={currentChildItem?.desc || 'Please paste multiple SKU codes separated by semicolons.'}
                onConfirm={(value) => {
                  setDialogContent(value);
                  if (currentItem) {
                    handleValueChange(currentItem.key, value);
                  }
                  setDialogOpen(false);
                  onMassSearch?.(currentItem, currentChildItem);
                }}
              />
            ) : (
              // Assets 页面（Media, Videos, After Sales, Internal Documents, Certifications）：使用 MassSearchSimple（无 validate）
              <MassSearchSimple
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                initialValue={dialogContent}
                description={currentChildItem?.desc || 'Please paste multiple SKU codes separated by semicolons.'}
                onConfirm={(value) => {
                  setDialogContent(value);
                  if (currentItem) {
                    handleValueChange(currentItem.key, value);
                  }
                  setDialogOpen(false);
                  onMassSearch?.(currentItem, currentChildItem);
                }}
              />
            )
          ) : (
            // 非 SKU Code 的其他字段，使用 MassSearch（带 validate）
            <MassSearch
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              initialValue={dialogContent}
              description={currentChildItem?.desc || 'Please paste multiple value for Model No & Model Name below.'}
              onConfirm={(value) => {
                setDialogContent(value);
                if (currentItem) {
                  handleValueChange(currentItem.key, value);
                }
                setDialogOpen(false);
                onMassSearch?.(currentItem, currentChildItem);
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default ConfigurableFilterSidebar; 