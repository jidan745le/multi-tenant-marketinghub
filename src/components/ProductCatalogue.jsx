import {
  Box,
  Container,
  Paper
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import ConfigurableFilterSidebar from './ConfigurableFilterSidebar';
import ConfigurableProductGrid from './ConfigurableProductGrid';

/**
 * ProductCatalogue 配置数据模型
 * @typedef {Object} ProductCatalogueConfig
 * @property {Object} filterConfig - 筛选器配置
 * @property {Array} filterConfig.filters - 筛选器列表配置
 * @property {Object} productConfig - 产品网格配置
 * @property {Function} productConfig.fetchProducts - 获取产品数据的Promise函数
 * @property {number} productConfig.pageSize - 页面大小
 * @property {Object} productConfig.cardActions - 卡片工具功能配置
 * @property {string} productConfig.title - 网格标题

 */

const ProductCatalogue = ({ 
  config,
  onProductClick,
  onProductDownload,
  onMassSearch,
  ...props 
}) => {
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // 计算搜索参数，避免不必要的对象创建
  const searchParams = useMemo(() => {
    const pageSize = config?.productConfig?.pageSize || 20;
    return {
      ...filterValues,
      offset: (currentPage - 1) * pageSize,
      limit: pageSize,
      page: currentPage
    };
  }, [filterValues, currentPage, config?.productConfig?.pageSize]);

  // 处理筛选器值变化
  const handleFilterChange = useCallback((newValues) => {
    setFilterValues(newValues);
    setCurrentPage(1); // 重置到第一页
  }, []);

  // 处理分页变化
  const handlePageChange = useCallback((pageOrParams) => {
    if (typeof pageOrParams === 'object') {
      // 处理分页大小变化等复杂参数
      const { page = 1, limit } = pageOrParams;
      setCurrentPage(page);
      // 如果分页大小改变，可以在这里处理
      if (limit && limit !== (config?.productConfig?.pageSize || 20)) {
        // 可以在这里添加更新配置的逻辑
        console.log('Page size changed to:', limit);
      }
    } else {
      // 处理简单的页码变化
      setCurrentPage(pageOrParams);
    }
  }, [config?.productConfig?.pageSize]);

  // 处理批量搜索
  const handleMassSearchClick = useCallback((item, childItem) => {
    onMassSearch?.(item, childItem, filterValues);
  }, [onMassSearch, filterValues]);

  if (!config) {
    return <div>No configuration provided</div>;
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        maxWidth: 'none !important',
        padding: '0px !important',
      }}
      {...props}
    >
      <Box 
        sx={{ 
          height: '100%',
          overflow: 'hidden',
          display: 'flex'
        }}
      >
        {/* 左侧筛选区域 */}
        <Box sx={{ width: 280, height: '100%' }}>
          <Paper
            elevation={1}
            sx={{
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <ConfigurableFilterSidebar 
                config={config.filterConfig}
                onChange={handleFilterChange}
                onMassSearch={handleMassSearchClick}
              />
            </Box>
          </Paper>
        </Box>

        {/* 右侧产品网格区域 */}
        <Box sx={{ flex: 1, height: '100%' }}>
          <Box 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* 产品网格 - 可滚动区域 */}
            <Box sx={{ flex: 1, overflow: 'auto', padding: "24px" }}>
              <ConfigurableProductGrid 
                key={`${config?.productConfig?.title}-${config?.productConfig?.fetchProducts?.brand}`} // 确保配置变化时重新渲染
                config={config.productConfig}
                searchParams={searchParams}
                onProductClick={onProductClick}
                onProductDownload={onProductDownload}
                onPageChange={handlePageChange}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductCatalogue; 