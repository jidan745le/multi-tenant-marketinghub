import { Box, CircularProgress, Grid, Pagination, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DigitalAssetCard from './DigitalAssetCard';

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
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

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
    console.log('🔧 ConfigurableProductGrid: Config changed', {
      fetchProductsBrand: fetchProducts?.brand,
      pageSize: pageSize,
      configTitle: config?.productConfig?.title
    });
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
      console.log('🔄 ConfigurableProductGrid: Skipping duplicate API call (same params and fetchProducts)');
      return; // 参数和函数都没有变化，不重复调用
    }
    
    console.log('🔄 ConfigurableProductGrid: Parameters or fetchProducts changed, scheduling API call');

    // 设置新的定时器
    debounceTimerRef.current = setTimeout(async () => {
      let isCancelled = false;

      const loadProducts = async () => {
        setLoading(true);
        try {
          console.log('🔄 ConfigurableProductGrid: Starting API call');
          console.log('📋 ConfigurableProductGrid: Params:', params);
          const result = await fetchProducts(params);
          
          // 如果组件已卸载，不更新状态
          if (isCancelled) return;
          
          // 支持不同的返回格式
          if (result && typeof result === 'object') {
            if (result.list && Array.isArray(result.list) && typeof result.totalSize !== 'undefined') {
              // 真实API格式: { startIndex: number, totalSize: number, pageSize: number, list: [] }
              setProducts(result.list);
              setTotalPages(Math.ceil((result.totalSize || 0) / pageSize));
            } else if (result.data && Array.isArray(result.data.list)) {
              // 格式: { data: { list: [], total: number } }
              setProducts(result.data.list);
              setTotalPages(Math.ceil((result.data.total || 0) / pageSize));
            } else if (Array.isArray(result.data)) {
              // 格式: { data: [] }
              setProducts(result.data);
              setTotalPages(Math.ceil(result.data.length / pageSize));
            } else if (Array.isArray(result)) {
              // 格式: []
              setProducts(result);
              setTotalPages(Math.ceil(result.length / pageSize));
            } else if (result.list && Array.isArray(result.list)) {
              // 格式: { list: [], total: number }
              setProducts(result.list);
              setTotalPages(Math.ceil((result.total || 0) / pageSize));
            }
          }
        } catch (error) {
          if (!isCancelled) {
            console.error('❌ ConfigurableProductGrid: Failed to fetch products:', error);
            setProducts([]);
            setTotalPages(0);
          }
        } finally {
          if (!isCancelled) {
            console.log('✅ ConfigurableProductGrid: API call completed');
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
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <DigitalAssetCard
                      product={product}
                      isSelected={selectedProducts.some(p => p.id === product.id)}
                      onSelect={handleProductSelect}
                      onProductClick={onProductClick}
                      onDownload={onProductDownload}
                      cardActionsConfig={cardActionsConfig}
                    />
                  </Grid>
                ))}
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
                    No products found
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
          />
        </Box>
      )}
    </Box>
  );
};

export default ConfigurableProductGrid; 