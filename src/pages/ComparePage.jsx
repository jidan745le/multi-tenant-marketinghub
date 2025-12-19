import React, { useState, useCallback, Fragment, useEffect } from 'react';
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
  Paper,
  CircularProgress,
  Alert
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
// import { useBrand } from '../hooks/useBrand'; // 暂时未使用
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import compareApi from '../services/compareApi';
import { fetchProductList } from '../services/productListApi';

const MOCK_LANGUAGES = [
  { key: 'en', label: 'English', value: 'en' },
  { key: 'zh', label: '中文', value: 'zh' },
  { key: 'ja', label: '日本語', value: 'ja' },
  { key: 'de', label: 'Deutsch', value: 'de' },
  { key: 'fr', label: 'Français', value: 'fr' },
  { key: 'es', label: 'Español', value: 'es' }
];

// 空数据结构
const EMPTY_COMPARE_DATA = {
  headerData: [],
  basicData: [],
  featureData: []
};

// 数据转换函数：将 API 格式转换为页面使用的格式
const transformApiData = (apiData) => {
  if (!apiData) return EMPTY_COMPARE_DATA;

  console.log('API 数据:', apiData);

  // headerData: {assetId, modelNumber, productName} -> {name, image, modelNumber, assetId}
  const transformedHeaderData = (apiData.headerData || []).map(item => ({
    name: item.productName || '',
    image: item.assetId 
      ? `https://marketinghub-test.rg-experience.com/apis/kendo/asset-thumbnail/${item.assetId}`
      : '/assets/productcard_image.png', // 默认图片
    modelNumber: item.modelNumber || '',
    assetId: item.assetId || ''
  }));

  // basicData: [{name, values}] -> [['FieldName', 'val1', 'val2', ...]]
  const transformedBasicData = (apiData.basicData || []).map(item => [
    item.name || '',
    ...(item.values || [])
  ]);

  // featureData: [{category, features: [{name, values}]}] -> [['Category', [['Feature', 'val1', 'val2']]]]
  const transformedFeatureData = (apiData.featureData || []).map(section => [
    section.category || '',
    (section.features || []).map(feature => [
      feature.name || '',
      ...(feature.values || [])
    ])
  ]);

  console.log('转换后的数据:', {
    headerData: transformedHeaderData,
    basicData: transformedBasicData,
    featureData: transformedFeatureData
  });

  return {
    headerData: transformedHeaderData,
    basicData: transformedBasicData,
    featureData: transformedFeatureData
  };
};

// 搜索产品弹窗
const SearchProductModal = ({ open, onClose, onAddProduct, existingProducts = [], brand = 'kendo' }) => {
  const [searchCriteria, setSearchCriteria] = useState('model-number');
  const [inputValue, setInputValue] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // 防抖搜索
  const searchTimeoutRef = React.useRef(null);

  // 重置状态
  React.useEffect(() => {
    if (open) {
      setInputValue('');
      setSelectedProduct(null);
      setOptions([]);
      setSearchError(null);
    }
  }, [open]);

  // 搜索产品
  const searchProducts = React.useCallback(async (searchText, criteria) => {
    if (!searchText || searchText.trim().length === 0) {
      setOptions([]);
      return;
    }

    try {
      setLoading(true);
      setSearchError(null);

      // 构建搜索参数
      const searchParams = {
        limit: 50, // 限制返回50个结果
        offset: 0
      };

      // 根据搜索条件设置不同的参数
      if (criteria === 'model-number') {
        searchParams['model-number'] = searchText.trim();
      } else if (criteria === 'name') {
        searchParams['product-name'] = searchText.trim();
      } else if (criteria === 'ean') {
        searchParams['ean'] = searchText.trim();
      }

      // 调用 API
      const result = await fetchProductList(searchParams, brand);

      if (result && result.list && Array.isArray(result.list)) {
        // 过滤掉已存在的产品（根据产品ID或modelNumber）
        const filtered = result.list.filter(product => {
          const productId = product.id || product.productId || product.modelNumber;
          return !existingProducts.includes(productId);
        });

        // 转换数据格式，确保有 modelNumber 和 name 字段
        const formattedProducts = filtered.map(product => ({
          id: product.id || product.productId || product.modelNumber,
          modelNumber: product.modelNumber || product.id || product.productId || '',
          name: product.name || product.productName || '',
          ean: product.ean || product.eanCode || ''
        }));

        setOptions(formattedProducts);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error('搜索产品失败:', error);
      setSearchError(error.message || '搜索失败，请稍后重试');
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [brand, existingProducts]);

  // 处理输入变化，使用防抖
  React.useEffect(() => {
    // 清除之前的定时器
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 如果输入为空，清空选项
    if (!inputValue || inputValue.trim().length === 0) {
      setOptions([]);
      setSelectedProduct(null);
      return;
    }

    // 设置防抖，500ms 后执行搜索
    searchTimeoutRef.current = setTimeout(() => {
      searchProducts(inputValue, searchCriteria);
    }, 500);

    // 清理函数
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [inputValue, searchCriteria, searchProducts]);

  const handleAdd = () => {
    if (selectedProduct) {
      // 使用产品的 ID 或 modelNumber 作为产品标识
      const productId = selectedProduct.id || selectedProduct.modelNumber;
      onAddProduct({
        ...selectedProduct,
        modelNumber: productId // 确保 modelNumber 是产品ID
      });
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
                <MenuItem value="ean">EAN</MenuItem>
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
                getOptionLabel={(option) => {
                  if (searchCriteria === 'model-number') {
                    return option.modelNumber || '';
                  } else if (searchCriteria === 'name') {
                    return option.name || '';
                  } else if (searchCriteria === 'ean') {
                    return option.ean || '';
                  }
                  return option.name || option.modelNumber || '';
                }}
                value={selectedProduct}
                onChange={(event, newValue) => setSelectedProduct(newValue)}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                loading={loading}
                fullWidth
                sx={{
                  backgroundColor: '#f5f5f5',
                  '& .MuiAutocomplete-inputRoot': {
                    backgroundColor: '#f5f5f5',
                    minHeight: '42px',
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
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
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
                      <Typography variant="body1">{option.name || 'N/A'}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.modelNumber || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                )}
                noOptionsText={loading ? '搜索中...' : inputValue ? '未找到产品' : '输入关键词搜索'}
              />
            </Box>
          </Box>
        </Box>

        {/* 错误提示 */}
        {searchError && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }} onClose={() => setSearchError(null)}>
            {searchError}
          </Alert>
        )}
        
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
    borderTop: '1px solid rgba(0, 0, 0, 0.15)',
    borderBottom: isLastRow ? 'none' : '1px solid rgba(0, 0, 0, 0.15)'
  })
};

// 公共工具函数
const createTableUtils = (visibleHeaderProducts, selectedProducts) => {
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

    const reorderedValues = visibleHeaderProducts.map((product, index) => {

      return values[index] !== undefined ? values[index] : '--';
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

  // URL 参数在这里
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  
  // 从 URL 路径获取语言和品牌
  const currentLang = params.lang || 'en_GB';
  const currentBrand = params.brand || 'kendo';
  
  // 获取当前品牌
  // const { currentBrand } = useBrand();
  
  // 从 URL 读取初始值
  const getInitialLanguage = () => {
    const urlLanguage = searchParams.get('language');
    return urlLanguage || 'en';
  };
  
  const getInitialProducts = () => {
    const urlIds = searchParams.get('id');
    if (urlIds) {
      // 将逗号分隔的字符串转换为数组
      return urlIds.split(',').filter(id => id.trim() !== '');
    }
    return [];
  };
  
  const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage());
  const [selectedProducts, setSelectedProducts] = useState(getInitialProducts());
  
  // API 数据状态
  const [compareData, setCompareData] = useState(EMPTY_COMPARE_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // UI
  const [basicCollapsed, setBasicCollapsed] = useState(false);
  const [collapseAll, setCollapseAll] = useState(false);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [featureCollapses, setFeatureCollapses] = useState({});
  
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

  // 更新 URL 参数
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    if (selectedProducts && selectedProducts.length > 0) {
      newSearchParams.set('id', selectedProducts.join(','));
    }
    if (currentLanguage) {
      newSearchParams.set('language', currentLanguage);
    }
    
    // 更新 URL
    setSearchParams(newSearchParams, { replace: true });
  }, [selectedProducts, currentLanguage, setSearchParams]);

  // 从 API 获取比较数据
  useEffect(() => {
    const fetchCompareData = async () => {
      // 至少需要2个产品才能比较
      if (!selectedProducts || selectedProducts.length < 2) {
        setCompareData(EMPTY_COMPARE_DATA);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 调用 compareApi
        const apiData = await compareApi.compareProducts(selectedProducts, currentLanguage);
        
        console.log('成功获取比较数据:', apiData);
        
        // 转换 API 数据格式
        if (apiData && (apiData.headerData || apiData.featureData || apiData.basicData)) {
          const transformedData = transformApiData(apiData);
          console.log('转换后的 compareData:', {
            headerDataCount: transformedData.headerData?.length || 0,
            basicDataCount: transformedData.basicData?.length || 0,
            featureDataCount: transformedData.featureData?.length || 0,
            headerModelNumbers: transformedData.headerData?.map(p => p.modelNumber) || []
          });
          setCompareData(transformedData);
        } else {
          console.warn('API 返回数据格式不符合预期', apiData);
          setCompareData(EMPTY_COMPARE_DATA);
        }
      } catch (err) {
        console.error('获取比较数据失败:', err);
        setError(err.message || '获取比较数据失败，请稍后重试');
        // 出错时使用空数据
        setCompareData(EMPTY_COMPARE_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchCompareData();
  }, [selectedProducts, currentLanguage]);

  const handleAddProduct = (product) => {
    if (selectedProducts.length < TABLE_CONSTANTS.MAX_PRODUCTS) {
      // 使用产品的 ID 作为标识（product.modelNumber 在 SearchProductModal 中已经被设置为产品ID）
      const productId = product.modelNumber || product.id;
      if (productId) {
        setSelectedProducts(prev => [...prev, productId]);
      }
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(id => id !== productId));
  };

  // 处理点击 modelNumber 跳转到 PDP 页面
  const handleModelNumberClick = useCallback((productId) => {
    if (!productId) return;
    
    // 构建 PDP 页面 URL: /:lang/:brand/product-detail/:id
    const pdpUrl = `/${currentLang}/${currentBrand}/product-detail/${productId}?layout=internalPDPBasic`;
    navigate(pdpUrl);
  }, [currentLang, currentBrand, navigate]);

  // 直接使用API返回的featureData
  const filteredFeatureData = React.useMemo(() => {
    if (!Array.isArray(compareData.featureData) || compareData.featureData.length === 0) {
      console.log('featureData为空或不是数组');
      return [];
    }

    console.log('处理 featureData:', {
      featureDataCount: compareData.featureData.length,
      featureDataCategories: compareData.featureData.map(item => item[0])
    });

    console.log('filteredFeatureData 结果:', {
      resultCount: compareData.featureData.length,
      sections: compareData.featureData.map(([name, features]) => ({
        name,
        featuresCount: features?.length || 0
      }))
    });

    return compareData.featureData;
  }, [compareData.featureData]);

  // 初始化featureCollapses状态，基于API返回的category名称
  useEffect(() => {
    if (filteredFeatureData.length > 0) {
      setFeatureCollapses(prevState => {
        const newState = { ...prevState };
        filteredFeatureData.forEach(([sectionName]) => {
          // 如果这个section还没有在状态中，初始化为false（展开状态）
          if (!(sectionName in newState)) {
            newState[sectionName] = false;
          }
        });
        return newState;
      });
    }
  }, [filteredFeatureData]);


  const visibleHeaderProducts = React.useMemo(() => {
    const all = Array.isArray(compareData?.headerData) ? compareData.headerData : [];
    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      console.log('visibleHeaderProducts: selectedProducts is empty', { selectedProducts, all });
      return [];
    }


    const filtered = all.slice(0, Math.min(selectedProducts.length, all.length));
    
    console.log('visibleHeaderProducts filtered result:', {
      selectedProducts,
      allHeaderData: all,
      filtered,
      modelNumbers: all.map(p => p.modelNumber),
      assetIds: all.map(p => p.assetId),
      matchCount: filtered.length,
      selectedCount: selectedProducts.length
    });
    return filtered;
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
          {visibleHeaderProducts.map((product, index) => {
            // 根据索引找到对应的 selectedProducts 中的值
            const productId = selectedProducts[index];
            return (
            <Box 
              key={`${product.modelNumber}-${index}`}
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
                  onClick={() => handleRemoveProduct(productId)}
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
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  minHeight: 0
                }}>
                  <Box
                    onClick={() => handleModelNumberClick(productId)}
                    sx={{
                      fontSize: '0.875rem',
                      color: primaryColor,
                      fontWeight: 600,
                      flexShrink: 0,
                      mb: 0.5,
                      width: '100%',
                      cursor: 'pointer',
                      // '&:hover': {
                      //   textDecoration: 'underline'
                      // }
                    }}
                  >
                    {product.modelNumber}
                  </Box>
                  <Box
                    sx={{
                      fontSize: '0.9rem',
                      color: '#4d4d4d',
                      fontWeight: 500,
                      lineHeight: 1.4,
                      width: '100%',
                      wordBreak: 'break-word',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'normal'
                    }}
                  >
                    {product.name}
                  </Box>
                </Box>
              </Box>
            </Box>
            );
          })}
        
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
  ), [visibleHeaderProducts, selectedProducts, primaryColor, tableUtils, mixWithWhite, handleModelNumberClick]);

  // 渲染基础规格表格
  const renderBasicSpecs = () => {
    
    return (
      <Box sx={{ mb: 3 }}>
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
            minWidth: '240px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)'
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
          <Box key={sectionName} sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Paper sx={{ 
              width: tableUtils.getTableWidth(),
              minWidth: '240px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)'
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
                      // 检查features是否存在且为数组
                      if (!Array.isArray(features) || features.length === 0) {
                        return null;
                      }

                      // 过滤有效特性
                      const validFeatures = features.filter((feature) => {
                        const values = feature.slice(1);
                        const allValues = tableUtils.reorderAndExtendData(values);
                        const isValid = tableUtils.hasValidData(allValues);
                        if (!isValid) {
                          console.log(`  过滤掉无效特性: "${feature[0]}"`, {
                            values,
                            allValues
                          });
                        }
                        return isValid;
                      });

                      // Show Differences Only的过滤
                      const finalFeatures = showDifferencesOnly 
                        ? validFeatures.filter((feature) => {
                            const values = feature.slice(1);
                            const allValues = tableUtils.reorderAndExtendData(values);
                            const hasDiff = hasDifferences(allValues);
                            if (!hasDiff) {
                              console.log(`  过滤掉无差异特性: "${feature[0]}"`, {
                                values,
                                allValues
                              });
                            }
                            return hasDiff;
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
      position: 'relative',
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
      {/* 全页面 Loading 遮罩层 */}
      {loading && selectedProducts.length >= 2 && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <CircularProgress 
            size={60} 
            sx={{ 
              color: primaryColor 
            }} 
          />
        </Box>
      )}

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
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 100
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
        {/* 错误状态 */}
        {error && selectedProducts.length >= 2 && !loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '400px',
            width: '100%'
          }}>
            <Alert severity="error" sx={{ maxWidth: '600px' }}>
              {error}
            </Alert>
          </Box>
        ) : !loading && (
          <>
            {/* Basic Data */}
            {renderBasicSpecs()}

            {/* Marketing Features, Specifications */}
            {renderFeatureGroups()}
          </>
        )}
      </Box>

      {/* 搜索产品弹窗 */}
      <SearchProductModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onAddProduct={handleAddProduct}
        existingProducts={selectedProducts}
        brand={currentBrand}
      />
    </Box>
  );
};

export default ComparePage;