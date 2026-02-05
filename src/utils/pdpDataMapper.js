/**
 * PDP页面数据映射
 */

import React from 'react';

/**
 * @param {Array} items - 数据数组
 * @param {string} keyField - 作为索引的字段名
 * @returns {Object} 索引映射对象
 */
const createIndexMap = (items, keyField = 'title') => {
  if (!Array.isArray(items)) return {};
  
  return items.reduce((map, item) => {
    if (item && item[keyField]) {
      map[item[keyField]] = item;
    }
    return map;
  }, {});
};

/**
 * 数据映射配置
 */
const DATA_MAPPING_CONFIG = {
  forms: {
    basicFormData: 'pdp.sections.basicData',
    sapFormData: 'pdp.sections.sapDetail', 
    marketingFormData: 'pdp.sections.marketingCopy',
    seoFormData: 'pdp.sections.seo',
    dangerousGoodsFormData: 'pdp.sections.dangerousGoods'
  },
  
  images: {
    iconsAndPicturesData: 'pdp.sections.iconsAndPictures',
    onWhiteData: 'pdp.sections.onWhite',
    actionAndLifestyleData: 'pdp.sections.actionAndLifestyle',
    galleryData: 'pdp.sections.gallery'
  },
  
  codes: {
    qrCodesData: 'pdp.sections.qrCodes',
    eansData: 'pdp.sections.eans'
  },
  
  referenceLists: {
    bundlesData: 'pdp.sections.bundles',
    componentsData: 'pdp.sections.components',
    accessoriesData: 'pdp.sections.accessories'
  },
  
  documentWidgets: {
    manualsData: 'pdp.sections.manuals',
    repairGuidesData: 'pdp.sections.repairGuide',
    packagingsData: 'pdp.sections.packaging',
    drawingsData: 'pdp.sections.drawing',
    patentData: 'pdp.sections.patent'
  }
};

/**
 * 创建PDP数据映射器
 * @param {Object} rawData - 原始PDP数据
 * @param {Function} t - 多语言翻译函数
 * @returns {Object} 映射后的数据对象
 */
export const createPdpDataMapper = (rawData, t) => {
  // 参数验证
  if (!rawData || typeof t !== 'function') {
    console.warn('PDP数据映射器: 无效的参数');
    return createEmptyMappedData();
  }

  // 创建索引映射以提高查找效率 O(1)
  const indexedData = {
    forms: createIndexMap(rawData.forms),
    images: createIndexMap(rawData.images),
    codes: createIndexMap(rawData.codes),
    referenceLists: createIndexMap(rawData.referenceLists),
    documentWidgets: createIndexMap(rawData.documentWidgets)
  };

  // 映射结果对象
  const mappedData = {};

  // 批量映射有查找逻辑的数据
  Object.entries(DATA_MAPPING_CONFIG).forEach(([category, mappings]) => {
    const categoryIndex = indexedData[category];
    
    Object.entries(mappings).forEach(([dataKey, i18nKey]) => {
      try {
        const translatedTitle = t(i18nKey);
        mappedData[dataKey] = categoryIndex[translatedTitle] || null;
      } catch (error) {
        console.warn(`PDP数据映射错误 - ${dataKey}:`, error);
        mappedData[dataKey] = null;
      }
    });
  });

  // 直接映射的数据（无需查找）
  mappedData.tableData = rawData.table || null;
  mappedData.packagingData = rawData.packagingWidgets || [];
  mappedData.specificationData = rawData.specificationWidgets || [];
  mappedData.mediaData = rawData.mediaWidgets || [];
  mappedData.documentData = rawData.documentWidgets || [];

  return mappedData;
};

/**
 * 空的映射数据结构
 * @returns {Object} 空的映射数据
 */
const createEmptyMappedData = () => ({
  basicFormData: null,
  sapFormData: null,
  marketingFormData: null,
  seoFormData: null,
  dangerousGoodsFormData: null,

  iconsAndPicturesData: null,
  onWhiteData: null,
  actionAndLifestyleData: null,
  galleryData: null,
  
  qrCodesData: null,
  eansData: null,
  
  bundlesData: null,
  componentsData: null,
  accessoriesData: null,
  
  manualsData: null,
  repairGuidesData: null,
  packagingsData: null,
  drawingsData: null,
  patentData: null,
  
  tableData: null,
  packagingData: [],
  specificationData: [],
  mediaData: [],
  documentData: []
});

/**
 * React Hook: 使用PDP数据映射器
 * @param {Object} rawData - 原始数据
 * @param {Function} t - 翻译函数
 * @returns {Object} 映射后的数据
 */
export const usePdpDataMapping = (rawData, t) => {
  return React.useMemo(() => {
    try {
      return createPdpDataMapper(rawData, t);
    } catch (error) {
      console.error('PDP数据映射失败:', error);
      return createEmptyMappedData();
    }
  }, [rawData, t]);
};

export default {
  createPdpDataMapper,
  usePdpDataMapping,
  createIndexMap
};
