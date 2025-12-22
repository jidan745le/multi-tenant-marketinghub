import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelectedAssets } from '../context/SelectedAssetsContext';

// Styled components based on the provided CSS
const AssetViewActionBar = styled(Box)(() => ({
  background: 'rgba(250, 250, 250, 0.3)',
  padding: '12px 16px',
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  alignSelf: 'stretch',
  flexShrink: 0,
  position: 'relative',
  backdropFilter: 'blur(5px)',
  boxSizing: 'border-box',
}));

const ActionButton = styled(Button)(() => ({
  background: '#ffffff',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#cccccc',
  borderWidth: '1px',
  padding: '0px 12px',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexShrink: 0,
  height: '40px',
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
    backgroundColor: '#f5f5f5',
    borderColor: '#cccccc',
  },
  '&:disabled': {
    backgroundColor: '#f0f0f0',
    color: '#999999',
    borderColor: '#e0e0e0',
  },
}));

const AssetViewActionBarComponent = ({ 
  onDownloadSelection, 
  selectedAssets, 
  selectedCount, 
  clearSelection,
  selectAll,
  isAllSelected = false
}) => {
  const navigate = useNavigate();
  const { lang, brand } = useParams();
  
  // 兼容性处理：如果没有传入选中状态相关props，则使用全局context
  const globalSelectedAssets = useSelectedAssets();
  const finalSelectedAssets = selectedAssets || globalSelectedAssets.selectedAssets;
  const finalSelectedCount = selectedCount !== undefined ? selectedCount : globalSelectedAssets.selectedCount;
  const finalClearSelection = clearSelection || globalSelectedAssets.clearSelection;
  const finalSelectAll = selectAll || globalSelectedAssets.selectAll;

  const handleSelectAll = () => {
    if (isAllSelected) {
      // 如果全部选中，则取消全选
      finalClearSelection?.();
    } else {
      // 否则全选
      finalSelectAll?.();
    }
  };

  const handleDownloadSelection = () => {
    if (finalSelectedCount === 0) {
      alert('Please select assets to download');
      return;
    }
    
    console.log('Download Selection clicked, selected assets:', finalSelectedAssets);
    onDownloadSelection?.(finalSelectedAssets);
  };

  const productIds = finalSelectedAssets
    // .map(asset => asset.customerFacingProductCode)
    .map(asset => asset.customerFacingProductCode)
    .filter(Boolean);

  // 判断是否显示 COMPARE 按钮：至少选中2个产品
  const showCompareButton = productIds.length >= 2;

  const handleCompare = () => {
    if (productIds.length < 2) {
      alert('Please select at least 2 products to compare');
      return;
    }
    
    // 构建比较页面URL: /:lang/:brand/compare?id=id1,id2,id3，这个url现在的ids参数应该为customerFacingProductCode
    const compareUrl = `/${lang || 'en_GB'}/${brand || 'kendo'}/compare?id=${productIds.join(',')}`;
    navigate(compareUrl);
  };

  return (
    <AssetViewActionBar>
      <ActionButton onClick={handleSelectAll}>
        {isAllSelected ? 'UNSELECT ALL' : 'SELECT ALL'}
      </ActionButton>
      
      {showCompareButton && (
        <ActionButton onClick={handleCompare}>
          Compare
        </ActionButton>
      )}
      
      <ActionButton 
        onClick={handleDownloadSelection}
        disabled={finalSelectedCount === 0}
        sx={{
          ...(finalSelectedCount > 0 && {
         
          })
        }}
      >
        Download Selection {finalSelectedCount > 0 && `(${finalSelectedCount})`}
      </ActionButton>
    </AssetViewActionBar>
  );
};

export default AssetViewActionBarComponent;
