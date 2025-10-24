import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Pagination,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useSelectedAssets } from '../context/SelectedAssetsContext';
import DigitalAssetCard from './DigitalAssetCard';
import MediaDownloadDialog from './MediaDownloadDialog';


const PaginationContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  padding: '16px 24px',
  marginTop: '24px',
  flexShrink: 0
}));

/**
 * 资产分页网格组件
 * - 支持搜索功能
 * - 支持分页显示
 * - 支持批量下载
 * - 支持单个下载
 */
const AssetPagination = ({
  title = 'Iconography',
  items = [],
  loading = false,
  pageSize = 24,
  onItemClick,
  onDownloadAll,
  searchPlaceholder = 'Search file name'
}) => {
  // 状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [downloadAllSelection, setDownloadAllSelection] = useState('');
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedItemsForDownload, setSelectedItemsForDownload] = useState([]);

  // 获取选中状态
  const { selectedAssets, toggleAsset, selectedCount } = useSelectedAssets();

  // 搜索和分页逻辑
  const filteredItems = useMemo(() => {
    let filtered = items;
    
    // 搜索过滤
    if (searchTerm.trim()) {
      filtered = filtered.filter(item => 
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.filename || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 日期过滤
    if (selectedDate) {
      const now = new Date();
      let cutoffDate;
      
      switch (selectedDate) {
        case 'last_1_week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last_1_month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last_3_months':
          cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'last_6_months':
          cutoffDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          break;
        case 'this_year':
          cutoffDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          cutoffDate = new Date(0);
      }
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createOn || item.createdDate || 0);
        return !isNaN(itemDate.getTime()) && itemDate >= cutoffDate;
      });
    }
    
    return filtered;
  }, [items, searchTerm, selectedDate]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  // 事件处理
  const handlePageChange = useCallback((event, page) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // 搜索时重置到第一页
  }, []);

  const handleDateChange = useCallback((event) => {
    setSelectedDate(event.target.value);
    setCurrentPage(1); // 日期过滤时重置到第一页
  }, []);

  const handleDownloadAll = useCallback(() => {
    if (onDownloadAll) {
      onDownloadAll(filteredItems);
    } else {
      // 默认打开下载对话框
      setSelectedItemsForDownload(filteredItems);
      setDownloadDialogOpen(true);
    }
  }, [filteredItems, onDownloadAll]);


  const handleDownloadAllSelect = useCallback((value) => {
    setDownloadAllSelection(value);
    
    if (value === 'selected') {
      // 下载选中的东西
      setSelectedItemsForDownload(selectedAssets);
      setDownloadDialogOpen(true);
    } else {
      // 下载所有
      handleDownloadAll();
    }
  }, [handleDownloadAll, selectedAssets]);

  // 当选中状态变化时，自动重置下拉框选择
  useEffect(() => {
    if (selectedCount === 0 && downloadAllSelection === 'selected') {
      setDownloadAllSelection('');
    }
  }, [selectedCount, downloadAllSelection]);


  const handleDownloadDialogClose = useCallback(() => {
    setDownloadDialogOpen(false);
    setSelectedItemsForDownload([]);
  }, []);

  const handleItemClick = useCallback((item) => {
    if (onItemClick) {
      onItemClick(item);
    }
  }, [onItemClick]);

  const handleItemDownload = useCallback((item) => {
    setSelectedItemsForDownload([item]);
    setDownloadDialogOpen(true);
  }, []);

  // 处理选中状态切换
  const handleAssetToggle = useCallback((item) => {
    const isCurrentlySelected = selectedAssets.some(asset => asset.id === (item.id || item.identifier));
    toggleAsset(item, !isCurrentlySelected);
  }, [selectedAssets, toggleAsset]);

  return (
    <>
      {/* 头部区域  */}
      <Box sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        margin: '-24px -24px 24px -24px',
        padding: '12px 24px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 4
      }}>
        <Typography variant="h4" component="h2" fontWeight="bold" fontSize="1.6rem" sx={{ mb: 0 }}>
          {title}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          marginLeft: 'auto',
          marginRight: 'min(55px, 3vw)',
          flexWrap: 'wrap'
        }}>
          {/* 搜索框 */}
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: 1,
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }
              }
            }}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
          
          {/* Download All 下拉框 */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>DOWNLOAD ALL</InputLabel>
            <Select
              value={downloadAllSelection}
              label="DOWNLOAD ALL"
              onChange={(e) => handleDownloadAllSelect(e.target.value)}
              sx={{ 
                backgroundColor: 'white',
                borderRadius: 1,
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem 
                value="selected" 
                disabled={selectedCount === 0}
                sx={{
                  opacity: selectedCount === 0 ? 0.5 : 1,
                  '&.Mui-disabled': {
                    color: 'text.disabled'
                  }
                }}
              >
                Selected {selectedCount > 0 && `(${selectedCount})`}
              </MenuItem>
            </Select>
          </FormControl>
          
          {/* Date Created 下拉框 */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>DATE CREATED</InputLabel>
            <Select
              value={selectedDate}
              onChange={handleDateChange}
              label="DATE CREATED"
              sx={{ 
                backgroundColor: 'white',
                borderRadius: 1,
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="last_1_week">Last 1 week</MenuItem>
              <MenuItem value="last_1_month">Last 1 month</MenuItem>
              <MenuItem value="last_3_months">Last 3 months</MenuItem>
              <MenuItem value="last_6_months">Last 6 months</MenuItem>
              <MenuItem value="this_year">This year</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* 网格内容区域 */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, 270px)',
        columnGap: 3,
        rowGap: 3,
        justifyContent: 'start'
      }}>
        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 200,
              gridColumn: '1 / -1'
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {paginatedItems.map((item) => (
              <DigitalAssetCard
                key={item.id || item.identifier}
                product={item}
                onProductClick={handleItemClick}
                onDownload={handleItemDownload}
                isSelected={selectedAssets.some(asset => asset.id === (item.id || item.identifier))}
                onSelect={() => handleAssetToggle(item)}
                cardActionsConfig={{
                  show_file_type: true,
                  show_eyebrow: true,
                  show_open_pdf: false,
                  show_open_product_page: false,
                  show_preview_media: true,
                  show_select_checkbox: true,   // 显示复选框
                }}
              />
            ))}

            {paginatedItems.length === 0 && !loading && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: 200,
                  gridColumn: '1 / -1'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {searchTerm || selectedDate ? 'No items found matching your criteria.' : 'No items available.'}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* 分页器 */}
      {totalPages > 1 && (
        <PaginationContainer>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root.Mui-selected': {
                color: '#ffffff !important',
              },
            }}
          />
        </PaginationContainer>
      )}

      {/* 下载对话框 */}
      <MediaDownloadDialog
        open={downloadDialogOpen}
        onClose={handleDownloadDialogClose}
        selectedMedia={selectedItemsForDownload}
      />
    </>
  );
};

export default AssetPagination;
