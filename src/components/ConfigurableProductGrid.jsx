import { Box, CircularProgress, Grid, Pagination, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelectedAssets } from '../context/SelectedAssetsContext';
import AssetViewActionBar from './AssetViewActionBar';
import DigitalAssetCard from './DigitalAssetCard';
import ProductGridCard from './ProductGridCard';

// 外层容器，不处理滚动
const ProductGridOuterContainer = styled(Box)(() => ({
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
}));

// 内层滚动容器
const ProductGridContainer = styled(Box)(() => ({
  height: '100%',
  overflow: 'auto', // 始终允许滚动
  padding: '16px',
  paddingRight: '16px',
  
  // 自定义滚动条样式 - 默认透明，hover时显示
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    borderRadius: '8px',
    backgroundColor: 'transparent', // 默认透明
    border: 'none',
    transition: 'background-color 0.2s ease',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '8px',
    backgroundColor: 'transparent', // 默认透明
    transition: 'background-color 0.2s ease',
  },
  
  // hover时显示滚动条
  '&:hover': {
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#e7e7e7',
      border: '1px solid #cacaca',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'gray',
  },
  '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#555',
    },
    // Firefox hover效果
    scrollbarColor: 'gray #e7e7e7',
  },
  
  // Firefox 滚动条样式
  scrollbarWidth: 'thin',
  scrollbarColor: 'transparent transparent',
}));

const ConfigurableProductGrid = ({
  config,
  searchParams = {},
  onProductClick,
  onProductDownload,
  onPageChange,
  onDownloadSelection, // Add new prop for batch download
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  
  // Get selected assets count to conditionally show ActionBar
  const { selectedCount } = useSelectedAssets();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cardActionsConfig, setCardActionsConfig] = useState({
    show_file_type: false,
    show_eyebrow: true,
    show_open_pdf: true,
    show_open_product_page: true,
    show_preview_media: true,
  });

  // 防抖定时器引用
  const debounceTimerRef = useRef(null);
  const lastSearchParamsRef = useRef(null);

  // 从config中获取配置
  const {
    fetchProducts,
    pageSize = 12,
    cardActions = {}
  } = config || {};

  // 更新卡片操作配置
  useEffect(() => {
    setCardActionsConfig(prev => ({ ...prev, ...cardActions }));
  }, [cardActions]);

  // 监听配置变化
  useEffect(() => {
    // Config changed
  }, [config, fetchProducts, pageSize]);

  // 防抖的数据获取函数
  const debouncedFetchProducts = useCallback(async (params) => {
    if (!fetchProducts) return;

    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 检查参数是否真的发生了变化
    const paramsString = JSON.stringify(params);
    const fetchProductsKey = fetchProducts.toString().substring(0, 100); // 使用函数的字符串表示作为key的一部分
    const combinedKey = paramsString + fetchProductsKey;
    
    if (lastSearchParamsRef.current === combinedKey) {
      return; // 参数和函数都没有变化，不重复调用
    }

    // 设置新的定时器
    debounceTimerRef.current = setTimeout(async () => {
      let isCancelled = false;

      const loadProducts = async () => {
        setLoading(true);
        try {
          const result = await fetchProducts(params);
          
          // 如果组件已卸载，不更新状态
          if (isCancelled) return;
          
          // 支持不同的返回格式
          if (result && typeof result === 'object') {
              // 真实API格式: { startIndex: number, totalSize: number, pageSize: number, list: [] }
              setProducts(result.list);
              setTotalPages(Math.ceil((result.totalSize || 0) / pageSize));
            
          }
        } catch (error) {
          if (!isCancelled) {
            setProducts([]);
            setTotalPages(0);
          }
        } finally {
          if (!isCancelled) {
            setLoading(false);
          }
        }
      };

      await loadProducts();
      lastSearchParamsRef.current = combinedKey;
    }, 300); // 300ms 防抖延迟
  }, [fetchProducts, pageSize]);

  // 获取产品数据
  useEffect(() => {
    debouncedFetchProducts(searchParams);

    // 清理函数
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debouncedFetchProducts, searchParams]);

  // 处理产品选择
  const handleProductSelect = (product, isSelected) => {
    setSelectedProducts(prev => {
      if (isSelected) {
        return [...prev, product];
      } else {
        return prev.filter(p => p.id !== product.id);
      }
    });
  };

  const currentPage = searchParams.page || 1;

  if (!config) {
    return <Typography>No grid configuration provided</Typography>;
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Asset Action Bar - 只在有选中assets时显示 */}
      {selectedCount > 0 && (
        <AssetViewActionBar onDownloadSelection={onDownloadSelection} />
      )}
      
      {/* 产品网格 - 使用自定义滚动条 */}
      <ProductGridOuterContainer>
        <ProductGridContainer>
          {loading ? (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 200 
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => {
                  // 判断是资产还是产品：资产有 mediaType 属性
                  const isAsset = Boolean(product.mediaType);
                  const CardComponent = isAsset ? DigitalAssetCard : ProductGridCard;
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                      <CardComponent
                        product={product}
                        isSelected={selectedProducts.some(p => p.id === product.id)}
                        onSelect={handleProductSelect}
                        onProductClick={onProductClick}
                        onDownload={onProductDownload}
                        cardActionsConfig={cardActionsConfig}
                      />
                    </Grid>
                  );
                })}
              </Grid>

              {products.length === 0 && !loading && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: 200 
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                  </Typography>
                </Box>
              )}
            </>
          )}
        </ProductGridContainer>
      </ProductGridOuterContainer>

      {/* 分页器 */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, p: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => onPageChange?.(page)}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root.Mui-selected': {
                color: '#ffffff !important',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ConfigurableProductGrid; 