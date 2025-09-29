/**
 * Selected Assets Context
 * Manages globally selected assets for batch operations like download
 */
import React, { createContext, useContext, useState } from 'react';

const SelectedAssetsContext = createContext();

export const useSelectedAssets = () => {
  const context = useContext(SelectedAssetsContext);
  if (!context) {
    // Instead of throwing error, return safe fallback values
    console.warn('useSelectedAssets used outside of SelectedAssetsProvider, returning fallback values');
    return {
      selectedAssets: [],
      addAsset: () => {},
      removeAsset: () => {},
      toggleAsset: () => {},
      clearSelection: () => {},
      selectAll: () => {},
      isAssetSelected: () => false,
      selectedCount: 0
    };
  }
  return context;
};

export const SelectedAssetsProvider = ({ children }) => {
  const [selectedAssets, setSelectedAssets] = useState([]);

  const addAsset = (asset) => {
    setSelectedAssets(prev => {
      // Avoid duplicates
      if (prev.some(item => item.id === asset.id)) {
        return prev;
      }
      return [...prev, asset];
    });
  };

  const removeAsset = (assetId) => {
    setSelectedAssets(prev => prev.filter(item => item.id !== assetId));
  };

  const toggleAsset = (asset, isSelected) => {
    if (isSelected) {
      addAsset(asset);
    } else {
      removeAsset(asset.id);
    }
  };

  const clearSelection = () => {
    setSelectedAssets([]);
  };

  const selectAll = (assets) => {
    setSelectedAssets([...assets]);
  };

  const isAssetSelected = (assetId) => {
    return selectedAssets.some(item => item.id === assetId);
  };

  const value = {
    selectedAssets,
    addAsset,
    removeAsset,
    toggleAsset,
    clearSelection,
    selectAll,
    isAssetSelected,
    selectedCount: selectedAssets.length
  };

  return (
    <SelectedAssetsContext.Provider value={value}>
      {children}
    </SelectedAssetsContext.Provider>
  );
};

export default SelectedAssetsContext;
