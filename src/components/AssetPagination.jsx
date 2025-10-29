import { Search } from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    styled,
    TextField,
    Typography
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
// 使用本地状态管理
import AssetViewActionBar from './AssetViewActionBar';
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
  searchPlaceholder = 'Search file name'
}) => {
  // 状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState([]); // Store media IDs instead of full objects

  // 本地选中状态管理
  const [selectedAssets, setSelectedAssets] = useState([]);
  const selectedCount = selectedAssets.length;
  
  const addAsset = useCallback((asset) => {
    setSelectedAssets(prev => {
      if (prev.some(item => item.id === asset.id)) {
        return prev;
      }
      return [...prev, asset];
    });
  }, []);
  
  const removeAsset = useCallback((assetId) => {
    setSelectedAssets(prev => prev.filter(item => item.id !== assetId));
  }, []);
  
  const toggleAsset = useCallback((asset, isSelected) => {
    if (isSelected) {
      addAsset(asset);
    } else {
      removeAsset(asset.id);
    }
  }, [addAsset, removeAsset]);
  
  const clearSelection = useCallback(() => {
    setSelectedAssets([]);
  }, []);
  
  const selectAll = useCallback((assets) => {
    setSelectedAssets([...assets]);
  }, []);
  
  const isAssetSelected = useCallback((assetId) => {
    return selectedAssets.some(item => item.id === assetId);
  }, [selectedAssets]);

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

  // 计算是否全部选中
  const isAllSelected = useMemo(() => {
    return paginatedItems.length > 0 && selectedCount === paginatedItems.length;
  }, [selectedCount, paginatedItems.length]);

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


  const handleDownloadSelection = useCallback(() => {
    if (selectedCount > 0) {
      // Extract IDs from selected assets
      const mediaIds = selectedAssets.map(item => item.id || item.mediaId).filter(Boolean);
      console.log('📤 AssetPagination: Passing selected media IDs to download dialog:', mediaIds);
      setSelectedMediaIds(mediaIds);
      setDownloadDialogOpen(true);
    }
  }, [selectedAssets, selectedCount]);

  // 处理 AssetViewActionBar 的下载选择
  const handleActionBarDownloadSelection = useCallback((selectedAssets) => {
    // Extract IDs from selected assets
    const mediaIds = selectedAssets.map(item => item.id || item.mediaId).filter(Boolean);
    console.log('📤 AssetPagination: Passing ActionBar media IDs to download dialog:', mediaIds);
    setSelectedMediaIds(mediaIds);
    setDownloadDialogOpen(true);
  }, []);


  const handleDownloadDialogClose = useCallback(() => {
    setDownloadDialogOpen(false);
    setSelectedMediaIds([]);
  }, []);

  const handleItemClick = useCallback((item) => {
    if (onItemClick) {
      onItemClick(item);
    }
  }, [onItemClick]);

  const handleItemDownload = useCallback((item) => {
    // Extract ID from single item
    const mediaId = item.id || item.mediaId;
    console.log('📤 AssetPagination: Passing single media ID to download dialog:', mediaId);
    setSelectedMediaIds(mediaId ? [mediaId] : []);
    setDownloadDialogOpen(true);
  }, []);

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
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                height: '36px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main'
                },
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }
              },
              '& .MuiInputBase-input': {
                height: '36px',
                padding: '0 14px'
              }
            }}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
          
          {/* Download Selection 按钮 */}
          <Button
            variant="outlined"
            onClick={handleDownloadSelection}
            disabled={selectedCount === 0}
            sx={{
              background: '#f5f5f5', 
              borderRadius: '4px',
              borderStyle: 'solid',
              borderColor: 'primary.main', 
              borderWidth: '1px',
              padding: '8px 12px',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexShrink: 0,
              height: '36px',
              position: 'relative',
              color: '#000000',
              textAlign: 'left',
              fontFamily: '"Roboto-Medium", sans-serif',
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              fontWeight: 500,
              textTransform: 'uppercase',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: '#e8e8e8', 
                borderColor: 'primary.main', 
              },
              '&:disabled': {
                backgroundColor: '#e0e0e0', 
                color: '#999999',
                borderColor: '#e0e0e0',
              }
            }}
          >
            Download Selection {selectedCount > 0 && `(${selectedCount})`}
          </Button>
          
          {/* Date Created 下拉框 */}
          <FormControl size="small" sx={{ minWidth: 160}}>
            <InputLabel 
              sx={{ 
                fontFamily: '"Roboto-Medium", sans-serif',
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.1px',
                fontWeight: 500,
                color: '#000000',
                textTransform: 'uppercase',
              }}
            >
              DATE CREATED
            </InputLabel>
            <Select
              value={selectedDate}
              onChange={handleDateChange}
              label="DATE CREATED"
              sx={{ 
                backgroundColor: '#f5f5f5', 
                borderRadius: 1,
                height: '36px', 
                '& .MuiOutlinedInput-notchedOutline': {
                  height: '40px',
                  borderColor: 'primary.main'
                },
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  height: '36px',
                  fontFamily: '"Roboto-Medium", sans-serif',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.1px',
                  fontWeight: 500,
                  padding: '8px 12px',
                  boxSizing: 'border-box'
                },
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

      {/* Asset Action Bar */}
       {selectedCount > 0 && (
         <Box sx={{ mb: 1.5,ml: -2,mt: -1 }}>
           <AssetViewActionBar 
             onDownloadSelection={handleActionBarDownloadSelection}
             selectedAssets={selectedAssets}
             selectedCount={selectedCount}
             clearSelection={clearSelection}
             selectAll={() => selectAll(paginatedItems)}
             isAllSelected={isAllSelected}
           />
         </Box>
       )}

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
                showCheckbox={true}
                cardActionsConfig={{
                  show_file_type: true,
                  show_eyebrow: true,
                  show_open_pdf: false,
                  show_open_product_page: false,
                  show_preview_media: true,
                  show_select_checkbox: true,   // 显示复选框
                }}
                isAssetSelected={isAssetSelected}
                toggleAsset={toggleAsset}
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
        selectedMediaIds={selectedMediaIds}
      />
    </>
  );
};

export default AssetPagination;
