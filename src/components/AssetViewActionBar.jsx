import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
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

  const handleMassTagging = () => {
    // TODO: Implement mass tagging functionality
    console.log('Mass Tagging clicked');
  };

  const handleDownloadSelection = () => {
    if (finalSelectedCount === 0) {
      alert('Please select assets to download');
      return;
    }
    
    console.log('Download Selection clicked, selected assets:', finalSelectedAssets);
    onDownloadSelection?.(finalSelectedAssets);
  };

  return (
    <AssetViewActionBar>
      <ActionButton onClick={handleSelectAll}>
        {isAllSelected ? 'UNSELECT ALL' : 'SELECT ALL'}
      </ActionButton>
      
      <ActionButton onClick={handleMassTagging}>
        Mass Tagging
      </ActionButton>
      
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
