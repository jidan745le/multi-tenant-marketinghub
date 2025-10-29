import React, { useState, useCallback, Fragment } from 'react';
import {
  Box,
  Button,
  Card,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Autocomplete,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Remove as RemoveIcon,
  Search as SearchIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';

// Mock 数据
const MOCK_BRANDS = [
  { name: 'Kendo', value: 'Kendo', languages: ['en', 'es', 'fr','de','it','es','ja','zh'] },
  { name: 'Bosch', value: 'Bosch', languages: ['en', 'zh', 'ja'] }
];

const MOCK_PRODUCTS = [
  {
    id: 'BH1001_EU',
    modelNumber: 'BH1001_EU',
    name: 'Kendo Professional Tool',
    image: '/assets/productcard_image.png',
    price: '$199.99',
    ean: 'Tool'
  },
  {
    id: 'BCX3800_EU', 
    modelNumber: 'BCX3800_EU',
    name: 'Kendo Professional X Tool',
    image: '/assets/productcard_image.png',
    price: '$299.99',
    ean: 'Tool'
  },
  {
    id: 'LB7650E_EU',
    modelNumber: 'LB7650E_EU', 
    name: 'Kendo Professional Tool',
    image: '/assets/productcard_image.png',
    price: '$399.99',
    ean: 'Tool'
  },
  {
    id: 'CS1614E_EU',
    modelNumber: 'CS1614E_EU', 
    name: 'Kendo POWER+ Kit',
    image: '/assets/productcard_image.png',
    price: '$399.99',
    ean: 'Kit'
  },
  {
    id: 'LM2135E-SP_EU',
    modelNumber: 'LM2135E-SP_EU', 
    name: 'Kendo Professional Kit',
    image: '/assets/productcard_image.png',
    price: '$399.99',
    ean: 'Kit'
  }
];

const MOCK_COMPARE_DATA = {
  headerData: [
    {
      name: 'Kendo Professional Tool',
      image: '/assets/productcard_image.png',
      modelNumber: 'BH1001_EU',
      price: '$199.99'
    },
    {
      name: 'Kendo Professional X Tool', 
      image: '/assets/productcard_image.png',
      modelNumber: 'BCX3800_EU',
      price: '$299.99'
    },
    {
      name: 'Kendo Professional Tool',
      image: '/assets/productcard_image.png', 
      modelNumber: 'LB7650E_EU',
      price: '$399.99'
    },
    {
      name: 'Kendo POWER+ Kit',
      image: '/assets/productcard_image.png', 
      modelNumber: 'CS1614E_EU',
      price: '$399.99'
    },
    {
      name: 'Kendo Professional Kit',
      image: '/assets/productcard_image.png', 
      modelNumber: 'LM2135E-SP_EU',
      price: '$399.99'
    }
  ],
  basicData: [
    ['Series', 'Kendo Professional', 'Kendo Professional X', 'Kendo Professional', 'Kendo POWER+', 'Kendo Professional'],
    ['Product Type', 'Tool Only', 'Tool Only', 'Tool Only', 'Kit', 'Kit'],
    ['Model Number', 'BH1001_EU', 'BCX3800_EU', 'LB7650E_EU', 'CS1614E_EU', 'LM2135E-SP_EU'],
    ['Long Description', '--', '--', '--', '--', '--'],
    ['Packaging Contains', '--', '--', '--', '--', '--'],
    ['Launch Date', '2021-09-30', '2021-10-30', '2021-09-30', '2021-12-30', '2021-09-29']
  ],
  featureData: [
    [
      'Marketing Features',
      [
        ['Lightweight Design', '✓', '✓', '✗', '✗', '✗'],
        ['Extended Runtime', '✗', '✓', '✓', '✓', '✓']
      ]
    ],
    [
      'Specifications', 
      [
        ['Cell Type', '21700 Li-ion', '21700 Li-ion', '21700 Li-ion', '21700 Li-ion', '21700 Li-ion']
      ]
    ],
    [
      'Noise and vibration levels',
      [
        ['Noise Level', '< 70 dB', '< 70 dB', '< 70 dB']
      ]
    ]
  ]
};

const MOCK_LANGUAGES = [
  { key: 'en', label: 'English', value: 'en' },
  { key: 'zh', label: '中文', value: 'zh' },
  { key: 'ja', label: '日本語', value: 'ja' },
  { key: 'de', label: 'Deutsch', value: 'de' },
  { key: 'fr', label: 'Français', value: 'fr' },
  { key: 'es', label: 'Español', value: 'es' }
];

// 搜索产品弹窗
const SearchProductModal = ({ open, onClose, onAddProduct, existingProducts = [], products }) => {
  const [searchCriteria, setSearchCriteria] = useState('model-number');
  const [inputValue, setInputValue] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [options, setOptions] = useState([]);

  React.useEffect(() => {
    if (open) {
      setInputValue('');
      setSelectedProduct(null);
      setOptions(products.filter(p => !existingProducts.includes(p.modelNumber)));
    }
  }, [open, products, existingProducts]);

  const handleAdd = () => {
    if (selectedProduct) {
      onAddProduct(selectedProduct);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Search Product</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
        </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 12 }}>
          {/* 搜索区域 */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'stretch',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            overflow: 'hidden',
            height: '42px'
          }}>
            {/* 左侧下拉选择 */}
            <FormControl size="small" sx={{ 
              minWidth: 180,
              backgroundColor: 'white'
            }}>
              <Select
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
                variant="standard"
                disableUnderline
                sx={{
                  '& .MuiSelect-select': {
                    padding: '10px 14px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }
                }}
              >
                <MenuItem value="model-number">Model Numbers</MenuItem>
                <MenuItem value="name">Product Name</MenuItem>
                <MenuItem value="ean">ean</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ 
              width: '1px', 
              backgroundColor: '#e0e0e0',
              flexShrink: 0
            }} />
            
            {/* 右侧搜索输入框 */}
            <Box sx={{ 
              flex: 1,
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              minHeight: '42px'
            }}>
              <Autocomplete
                options={options}
                getOptionLabel={(option) => option[searchCriteria === 'model-number' ? 'modelNumber' : searchCriteria]}
                value={selectedProduct}
                onChange={(event, newValue) => setSelectedProduct(newValue)}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                fullWidth
                sx={{
                  backgroundColor: '#f5f5f5',
                  '& .MuiAutocomplete-inputRoot': {
                    backgroundColor: '#f5f5f5',
                    minHeight: '42px',
                    // mb: 1
                  },
                  '& .MuiAutocomplete-endAdornment': {
                    top: 'calc(50% + 7px)',
                    transform: 'translateY(-50%)',
                    right: '14px'
                  }
                }}
                renderInput={(params) => {
                  // 样式配置
                  const inputStyles = {
                    padding: '10px 14px',
                    fontSize: '14px',
                    backgroundColor: '#f5f5f5',
                    minHeight: '42px',
                    '&:before, &:after, &:hover:not(.Mui-disabled):before': {
                      display: 'none'
                    }
                  };

                  return (
                    <TextField
                      {...params}
                      placeholder={
                        searchCriteria === 'model-number' 
                          ? "Search by model number" 
                          : searchCriteria === 'name' 
                            ? "Search by product name" 
                            : "Search by ean"
                      }
                      variant="standard"
                      disableUnderline
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        sx: inputStyles
                      }}
                      sx={{
                        mb: 0.7,
                        backgroundColor: '#f5f5f5',
                        minHeight: '48px',
                        '& .MuiInput-root': {
                          backgroundColor: '#f5f5f5',
                          minHeight: '48px'
                        }
                      }}
                    />
                  );
                }}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.modelNumber}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Box>
          </Box>
        </Box>
        
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            onClick={onClose}
            sx={{ 
              color: 'black',
              border: '1px solid #e0e0e0',
              '&:hover': {
                borderColor: '#bdbdbd',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            CANCEL
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAdd}
            disabled={!selectedProduct}
            sx={{
              backgroundColor: selectedProduct ? 'primary.main' : '#f5f5f5',
              color: selectedProduct ? 'white' : 'text.secondary',
              '&:hover': {
                backgroundColor: selectedProduct ? 'primary.dark' : '#f5f5f5'
              }
            }}
          >
            ADD PRODUCT
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// 公共常量和样式
const TABLE_CONSTANTS = {
  TITLE_COLUMN_WIDTH: 240,
  DATA_COLUMN_WIDTH: 240,
  CARD_WIDTH: 220,
  CARD_GAP: 20,
  MAX_PRODUCTS: 5
};

const TABLE_STYLES = {
  titleCell: {
    width: `${TABLE_CONSTANTS.TITLE_COLUMN_WIDTH}px`,
    minWidth: `${TABLE_CONSTANTS.TITLE_COLUMN_WIDTH}px`,
    maxWidth: `${TABLE_CONSTANTS.TITLE_COLUMN_WIDTH}px`,
    flexShrink: 0,
    boxSizing: 'border-box',
    backgroundColor: '#f7f7f7',
    padding: '16px',
    display: 'flex',
    alignItems: 'center'
  },
  dataCell: (isDifferent, primaryColor, mixWithWhite) => ({
    width: `${TABLE_CONSTANTS.DATA_COLUMN_WIDTH}px`,
    minWidth: `${TABLE_CONSTANTS.DATA_COLUMN_WIDTH}px`,
    maxWidth: `${TABLE_CONSTANTS.DATA_COLUMN_WIDTH}px`,
    flexShrink: 0,
    boxSizing: 'border-box',
    backgroundColor: isDifferent ? mixWithWhite(primaryColor, 0.15) : 'transparent',
    padding: '16px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  titleText: {
    fontSize: '12px',
    fontFamily: 'Roboto-SemiBold',
    fontWeight: 600,
    color: '#4d4d4d',
    textAlign: 'left'
  },
  dataText: {
    fontSize: '12px',
    fontFamily: 'Roboto-Regular',
    fontWeight: 400,
    color: '#4d4d4d',
    textAlign: 'center',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.2'
  },
  tableRow: (isLastRow) => ({
    minHeight: '48px',
    display: 'flex',
    borderTop: '1px solid #cccccc',
    borderBottom: isLastRow ? 'none' : '1px solid #cccccc'
  })
};

// 公共工具函数
const createTableUtils = (visibleHeaderProducts, selectedProducts, compareData) => {
  // 计算表格宽度
  const getTableWidth = () => {
    const totalColumns = visibleHeaderProducts.length + (selectedProducts.length < TABLE_CONSTANTS.MAX_PRODUCTS ? 1 : 0);
    return `${TABLE_CONSTANTS.TITLE_COLUMN_WIDTH + totalColumns * TABLE_CONSTANTS.DATA_COLUMN_WIDTH}px`;
  };

  // 计算卡片容器宽度
  const getCardContainerWidth = () => {
    const totalCards = visibleHeaderProducts.length + (selectedProducts.length < TABLE_CONSTANTS.MAX_PRODUCTS ? 1 : 0);
    return `${TABLE_CONSTANTS.TITLE_COLUMN_WIDTH + totalCards * TABLE_CONSTANTS.CARD_WIDTH + (totalCards - 1) * TABLE_CONSTANTS.CARD_GAP}px`;
  };

  // 数据重排和扩展
  const reorderAndExtendData = (values) => {
    const reorderedValues = visibleHeaderProducts.map(product => {
      const productIndex = compareData.headerData.findIndex(p => p.modelNumber === product.modelNumber);
      return productIndex >= 0 ? values[productIndex] : '--';
    });
    const allValues = [...reorderedValues];
    if (selectedProducts.length < TABLE_CONSTANTS.MAX_PRODUCTS) {
      allValues.push('--');
    }
    return allValues;
  };

  // 检查数据有效性
  const hasValidData = (values) => {
    return values.some(value => 
      value && value !== '--' && value !== '-' && value.toString().trim() !== ''
    );
  };

  return {
    getTableWidth,
    getCardContainerWidth,
    reorderAndExtendData,
    hasValidData
  };
};

// 可复用的表格单元格组件
const TableCell = ({ children, isTitle = false, isDifferent = false, primaryColor, mixWithWhite }) => (
  <Box sx={isTitle ? TABLE_STYLES.titleCell : TABLE_STYLES.dataCell(isDifferent, primaryColor, mixWithWhite)}>
    <Typography sx={isTitle ? TABLE_STYLES.titleText : TABLE_STYLES.dataText}>
      {children}
    </Typography>
  </Box>
);

// 可复用的表格行组件
const TableRow = ({ fieldName, values, isLastRow, primaryColor, mixWithWhite }) => {
  const firstValue = values[0];
  
  return (
    <Box sx={TABLE_STYLES.tableRow(isLastRow)}>
      <TableCell isTitle>{fieldName}</TableCell>
      {values.map((value, cellIndex) => {
        const isEmptyOrDash = !value || value === '--' || value === '-';
        const isDifferent = cellIndex > 0 && value !== firstValue && !isEmptyOrDash;
        return (
          <TableCell 
            key={cellIndex} 
            isDifferent={isDifferent}
            primaryColor={primaryColor}
            mixWithWhite={mixWithWhite}
          >
            {value}
          </TableCell>
        );
      })}
    </Box>
  );
};

// Compare 页面
const ComparePage = () => {
  const { primaryColor } = useTheme();
  const mixWithWhite = useCallback((hexColor, amount = 0.15) => {
    try {
      const hex = (hexColor || '#000000').replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const mix = (c) => Math.round((1 - amount) * 255 + amount * c);
      const nr = mix(r);
      const ng = mix(g);
      const nb = mix(b);
      const toHex = (n) => n.toString(16).padStart(2, '0');
      return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
    } catch {
      return hexColor;
    }
  }, []);
  // 状态管理
  const [currentBrand] = useState(MOCK_BRANDS[0]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedProducts, setSelectedProducts] = useState(['BH1001_EU', 'BCX3800_EU', 'LB7650E_EU', 'CS1614E_EU', 'LM2135E-SP_EU']);
  const compareData = MOCK_COMPARE_DATA;
  
  // UI
  const [basicCollapsed, setBasicCollapsed] = useState(false);
  const [collapseAll, setCollapseAll] = useState(false);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [featureCollapses, setFeatureCollapses] = useState({
    'Marketing Features': false,
    'Specifications': false,
    'Noise and vibration levels': false,
    'Compliance': false
  });
  
  // 弹窗状态
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // 工具函数
  const hasDifferences = useCallback((values) => {
    if (!Array.isArray(values) || values.length <= 1) return false;
    const nonEmptyValues = values.filter(value => 
      value && value !== '--' && value !== '-' && value.toString().trim() !== ''
    );
    
    // 如果有效值少于2个，认为没有差异
    if (nonEmptyValues.length < 2) return false;
    
    // 检查是否所有有效值都相同
    const firstValue = nonEmptyValues[0];
    return nonEmptyValues.some(value => value !== firstValue);
  }, []);

  const toggleCollapseFeature = (section) => {
    setFeatureCollapses(prevState => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const toggleCollapseAll = () => {
    setCollapseAll(!collapseAll);
    setBasicCollapsed(!collapseAll);
    setFeatureCollapses((prevState) =>
      Object.fromEntries(
        Object.entries(prevState).map(([section]) => [
          section,
          !collapseAll
        ])
      )
    );
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
  };

  const handleAddProduct = (product) => {
    if (selectedProducts.length < TABLE_CONSTANTS.MAX_PRODUCTS) {
      setSelectedProducts(prev => [...prev, product.modelNumber]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(id => id !== productId));
  };

  const getCustomOrder = (brandValue) => {
    // 顺序：Marketing Features, Specifications, Noise and vibration levels
    let sections = ["Marketing Features", "Specifications"];
    
    if (brandValue?.includes('Kendo')) {
      sections.push("Noise and vibration levels");
    }
    
    if (brandValue?.includes('Bosch')) {
      sections.push("Compliance");
    }
    
    return sections;
  };

  const customOrder = getCustomOrder(currentBrand.value);
  const filteredFeatureData = customOrder
    .map(sectionName => {
      const section = compareData.featureData.find(item => item[0] === sectionName);
      return section || [sectionName, []];
    });

  // 渲染产品卡片头部
  const visibleHeaderProducts = React.useMemo(() => {
    const all = Array.isArray(compareData?.headerData) ? compareData.headerData : [];
    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) return [];
    return all.filter(p => selectedProducts.includes(p.modelNumber));
  }, [compareData.headerData, selectedProducts]);

  // 创建表格工具函数
  const tableUtils = React.useMemo(() => 
    createTableUtils(visibleHeaderProducts, selectedProducts, compareData),
    [visibleHeaderProducts, selectedProducts, compareData]
  );

  const renderProductHeaders = React.useMemo(() => (
    <Box sx={{ 
      mb: 3,
      transform: 'translate3d(0,0,0)',
      willChange: 'transform'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center'
      }}>
        <Box sx={{ 
          width: tableUtils.getCardContainerWidth(),
          minWidth: '240px',
          display: 'flex',
          gap: `${TABLE_CONSTANTS.CARD_GAP}px`
        }}>
          {/* 保证卡片和数据对齐的占位 */}
          <Box sx={{ 
            width: `${TABLE_CONSTANTS.CARD_WIDTH}px`,
            minWidth: `${TABLE_CONSTANTS.CARD_WIDTH}px`,
            maxWidth: `${TABLE_CONSTANTS.CARD_WIDTH}px`,
            flexShrink: 0,
            boxSizing: 'border-box'
          }} />
          {visibleHeaderProducts.map((product) => (
            <Box 
              key={product.modelNumber}
              sx={{ 
                width: `${TABLE_CONSTANTS.CARD_WIDTH}px`,
                minWidth: `${TABLE_CONSTANTS.CARD_WIDTH}px`,
                maxWidth: `${TABLE_CONSTANTS.CARD_WIDTH}px`,
                flexShrink: 0,
                boxSizing: 'border-box'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: 300,
                  width: '100%',
                  backgroundColor: 'white',
                  borderRadius: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transform: 'none !important',
                  transition: 'none !important'
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleRemoveProduct(product.modelNumber)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    zIndex: 1,
                    color: 'text.primary',
                    background: 'transparent',
                    '&:hover': { background: 'transparent', color: 'error.main' }
                  }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
                
                {/* 产品图片 - 上方 */}
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'contain',
                    flexShrink: 0,
                    backgroundColor: '#ffffff'
                  }}
                  onError={(e) => {
                    e.target.src = '/static/images/no-preview-available.svg';
                  }}
                />
                
                {/* 产品信息 - 下方 */}
                <Box sx={{ 
                  flex: 1,
                  p: 2,
                  display: 'flex',
                  mb: 3,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  minHeight: 0
                }}>
                  <Box
                    sx={{
                      fontSize: '0.875rem',
                      color: primaryColor,
                      fontWeight: 600
                    }}
                  >
                    {product.modelNumber}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        
          {selectedProducts.length < TABLE_CONSTANTS.MAX_PRODUCTS && (
            <Box sx={{ 
              width: `${TABLE_CONSTANTS.CARD_WIDTH}px`,
              minWidth: `${TABLE_CONSTANTS.CARD_WIDTH}px`,
              maxWidth: `${TABLE_CONSTANTS.CARD_WIDTH}px`,
              flexShrink: 0,
              boxSizing: 'border-box'
            }}>
              <Box
                sx={{
                  height: 300,
                  width: '100%',
                  borderRadius: 1,
                  border: `1px solid ${mixWithWhite(primaryColor, 0.25)}`,
                  backgroundColor: mixWithWhite(primaryColor, 0.12),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <Typography sx={{ color: 'text.secondary', fontSize: 14, px: 3, textAlign: 'center' }}>
                  Add up to 5 products to compare
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setSearchModalOpen(true)}
                  sx={{
                    color: 'white',
                    backgroundColor: primaryColor,
                    '&:hover': { backgroundColor: primaryColor, opacity: 0.92 },
                    px: 2.5
                  }}
                >
                  ADD PRODUCT
                </Button>
              </Box>
            </Box>
          )}
      </Box>
    </Box>
    </Box>
  ), [visibleHeaderProducts, selectedProducts.length, primaryColor, tableUtils, mixWithWhite]);

  // 渲染基础规格表格
  const renderBasicSpecs = () => {
    
    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mb: 2.5
        }}>
          <Box sx={{ 
            width: tableUtils.getTableWidth(),
            minWidth: '240px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            px: 2
          }}>
            {/* 左侧：Show Differences Only */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              ml: -1.9
            }}>
              <Switch
                checked={showDifferencesOnly}
                onChange={(e) => setShowDifferencesOnly(e.target.checked)}
                size="small"
              />
              <Typography variant="body2" sx={{ fontSize: '14px' }}>
                Show Differences Only
              </Typography>
            </Box>
            
            {/* 右侧：Collapse All / Expand All*/}
            <Button
              variant="outlined"
              onClick={toggleCollapseAll}
              startIcon={collapseAll ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              size="small"
              sx={{ mr: -1.8 }}
            >
              {collapseAll ? 'Expand All' : 'Collapse All'}
            </Button>
          </Box>
        </Box>
        
        {/* Basic Data 区域 */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ 
            width: tableUtils.getTableWidth(),
            minWidth: '240px'
          }}>
            <Box
              sx={{
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                px: 2,
                backgroundColor: 'transparent'
              }}
              onClick={() => setBasicCollapsed(!basicCollapsed)}
            >
              {basicCollapsed ? <AddIcon sx={{ color: '#4d4d4d', mr: 1 }} /> : <RemoveIcon sx={{ color: '#4d4d4d', mr: 1 }} />}
              <Typography 
                sx={{ 
                  fontSize: '16px', 
                  fontFamily: 'Roboto-Medium', 
                  fontWeight: 500,
                  color: '#4d4d4d'
                }}
              >
                Basic Data
              </Typography>
            </Box>
            
            <Collapse in={!basicCollapsed}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ 
                  width: tableUtils.getTableWidth(),
                  minWidth: '240px'
                }}>
                  {(() => {
                    // 过滤有效行
                    const validRows = compareData.basicData.filter((row) => {
                      const values = row.slice(1);
                      const allValues = tableUtils.reorderAndExtendData(values);
                      return tableUtils.hasValidData(allValues);
                    });

                    // Show Differences Only的过滤
                    const finalRows = showDifferencesOnly 
                      ? validRows.filter((row) => {
                          const values = row.slice(1);
                          const allValues = tableUtils.reorderAndExtendData(values);
                          return hasDifferences(allValues);
                        })
                      : validRows;

                    return finalRows.map((row, index) => {
                      const fieldName = row[0];
                      const values = row.slice(1);
                      const allValues = tableUtils.reorderAndExtendData(values);
                      const isLastRow = index === finalRows.length - 1;
                  
                      return (
                        <TableRow
                          key={index}
                          fieldName={fieldName}
                          values={allValues}
                          isLastRow={isLastRow}
                          primaryColor={primaryColor}
                          mixWithWhite={mixWithWhite}
                        />
                      );
                    });
                  })()}
                </Box>
              </Box>
            </Collapse>
          </Paper>
        </Box>
      </Box>
  );
  };

  // 渲染功能特性分组
  const renderFeatureGroups = () => {
    
    return (
      <Fragment>
        {filteredFeatureData.map(([sectionName, features]) => (
          <Box key={sectionName} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Paper sx={{ 
              width: tableUtils.getTableWidth(),
              minWidth: '240px'
            }}>
              <Box
                sx={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  px: 2,
                  backgroundColor: 'transparent'
                }}
                onClick={() => toggleCollapseFeature(sectionName)}
              >
                {featureCollapses[sectionName] ? <AddIcon sx={{ color: '#4d4d4d', mr: 1 }} /> : <RemoveIcon sx={{ color: '#4d4d4d', mr: 1 }} />}
                <Typography 
                  sx={{ 
                    fontSize: '16px', 
                    fontFamily: 'Roboto-Medium', 
                    fontWeight: 500,
                    color: '#4d4d4d'
                  }}
                >
                  {sectionName}
                </Typography>
              </Box>
              
              <Collapse in={!featureCollapses[sectionName]}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ 
                    width: tableUtils.getTableWidth(),
                    minWidth: '240px'
                  }}>
                    {(() => {
                      // 过滤有效特性
                      const validFeatures = features.filter((feature) => {
                        const values = feature.slice(1);
                        const allValues = tableUtils.reorderAndExtendData(values);
                        return tableUtils.hasValidData(allValues);
                      });

                      // Show Differences Only的过滤
                      const finalFeatures = showDifferencesOnly 
                        ? validFeatures.filter((feature) => {
                            const values = feature.slice(1);
                            const allValues = tableUtils.reorderAndExtendData(values);
                            return hasDifferences(allValues);
                          })
                        : validFeatures;

                      return finalFeatures.map((feature, index) => {
                        const featureName = feature[0];
                        const values = feature.slice(1);
                        const allValues = tableUtils.reorderAndExtendData(values);
                        const isLastRow = index === finalFeatures.length - 1;

                        return (
                          <TableRow
                            key={index}
                            fieldName={featureName}
                            values={allValues}
                            isLastRow={isLastRow}
                            primaryColor={primaryColor}
                            mixWithWhite={mixWithWhite}
                          />
                        );
                      });
                    })()}
                  </Box>
                </Box>
              </Collapse>
            </Paper>
          </Box>
        ))}
      </Fragment>
  );
  };

  return (
    <Box sx={{ 
      // 防止页面抖动
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      perspective: '1000px',
      overflow: 'auto',
      '& *': {
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      },
      fontSmooth: 'always',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      msOverflowStyle: 'none',
      scrollbarWidth: 'none'
    }}>
      <Box sx={{ 
        backgroundColor: 'white',
        p: 3,
        width: '100%'
      }}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* 左上角页面名称 */}
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Compare Product
          </Typography>

          {/* 右上角多语言选择框 */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              startAdornment={<LanguageIcon sx={{ mr: 1 }} />}
              sx={{ 
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              {MOCK_LANGUAGES.map(lang => (
                <MenuItem key={lang.key} value={lang.key}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ 
        backgroundColor: '#f5f5f5',
        p: 3,
        width: '100%'
      }}>
        {/* 卡片比较行容器 - 最多5张卡片 */}
        {renderProductHeaders}
      </Box>

      <Box sx={{ 
        backgroundColor: 'white',
        p: 3,
        width: '100%',
        minHeight: 'calc(100vh - 200px)',
        transform: 'translateZ(0)',
        willChange: 'auto'
      }}>

        {/* Basic Data */}
        {renderBasicSpecs()}

        {/* Marketing Features, Specifications, Noise and vibration levels */}
        {renderFeatureGroups()}
      </Box>

      {/* 搜索产品弹窗 */}
      <SearchProductModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onAddProduct={handleAddProduct}
        existingProducts={selectedProducts}
        products={MOCK_PRODUCTS}
      />
    </Box>
  );
};

export default ComparePage;