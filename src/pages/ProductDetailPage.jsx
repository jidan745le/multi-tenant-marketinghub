import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import { usePdpDataMapping } from '../utils/pdpDataMapper.js';
import ReportDataIssueDialog from '../components/ReportDataIssueDialog.jsx';
import BackToTopButton from '../components/BackToTopButton.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import MainSection from '../components/MainSection.jsx';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import ProductDetailApiService from '../services/productDetailApi';
import { useTheme } from '../hooks/useTheme';
import { useBrand } from '../hooks/useBrand';
import { usePdpPage } from '../hooks/usePdpPage';
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  LinearProgress,
  Divider,
  Avatar,
  Badge,
  Menu,
  MenuItem
} from '@mui/material';
import {
  OutlinedFlag as OutlinedFlagIcon,
} from '@mui/icons-material';
import ProductSidebar from '../components/ProductSidebar';
import ProductCard from '../components/ProductCard';
import UnifiedSkuTable from '../components/UnifiedSkuTable';
import Form from '../components/Form';
import Image from '../components/Image';
import UnifiedInfoTable from '../components/UnifiedInfoTable';
import ProductCardGrid from '../components/ProductCardGrid';
import PackagingTable from '../components/PackagingTable';
import SpecificationTable from '../components/SpecificationTable';
import MediaListTable from '../components/MediaListTable';
import DigitalAssetCard from '../components/DigitalAssetCard';
import manualsImage from '../assets/image/MR.png';
import repairGuideImage from '../assets/image/MR.png';
import packagingImage from '../assets/image/D.png';
import drawingImage from '../assets/image/D.png';
import patentImage from '../assets/image/P.png';
import databaseIcon from '../assets/icon/database.png';
import languageIcon from '../assets/icon/language.png';
import shareIcon from '../assets/icon/Share.png';
import exportIcon from '../assets/icon/file_export.png';
import downloadIcon from '../assets/icon/download.png';
import documentIcon from '../assets/icon/document.png';
import ViewIcon from '../assets/icon/pdp_view.png';
import marketingIcon from '../assets/icon/marketIcon.png';
import referIcon from '../assets/icon/referenceIcon.png';
import packIcon from '../assets/icon/packIcon.png';
import specIcon from '../assets/icon/specIcon.png';
import labelIcon from '../assets/icon/labelIcon.png';
import serviceIcon from '../assets/icon/serviceIcon.png';

import image1 from '../assets/image/image1.png';
// import qrImage1 from '../assets/image/imageQR1.png';
// import eanImage1 from '../assets/image/imageEcode1.png';
import accessoryImage1 from '../assets/image/A1.png';
import bundleImage1 from '../assets/image/B1.png';
import componentImage1 from '../assets/image/C1.png';
// import videoImage1 from '../assets/image/V1.png';

// 导入共享的三角形角标组件
import SmallTriangleIcon from '../components/SmallTriangleIcon';


const ProductDetailPage = () => {
  // 获取数据
  const { primaryColor, currentBrand } = useTheme();
  const { currentBrandCode } = useBrand();
  const { currentLanguage, getCurrentLanguageInfo } = useLanguage();
  const currentLanguageInfo = getCurrentLanguageInfo();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // URL查询参数处理
  const [searchParams, setSearchParams] = useSearchParams();

  // 使用自定义 Hook 获取 PDP 页面数据
  const pdpPageData = usePdpPage(currentBrandCode);
  
  // 翻译状态检查
  const checkPdpTranslationStatus = React.useCallback(() => {
    const sampleKeys = ['pdp.sections.basicData', 'pdp.sections.marketingCopy', 'pdp.sections.qrCodes'];
    const missingKeys = sampleKeys.filter(key => t(key) === key);
    
    return {
      isComplete: missingKeys.length === 0,
      missingCount: missingKeys.length,
      totalChecked: sampleKeys.length,
      language: currentLanguageInfo.nativeName
    };
  }, [t, currentLanguageInfo]);

  if (import.meta.env.DEV) {
    const translationStatus = checkPdpTranslationStatus();
    console.log('PDP语言状态:', {
      currentLanguage,
      languageInfo: currentLanguageInfo,
      brand: currentBrandCode,
      translationStatus
    });
  }

  // 兼容 Marketing+Basic 与 MarketingBasic；写入统一为 MarketingBasic
  const parseLayoutFromUrl = React.useCallback((rawLayout) => {
    const v = (rawLayout || '').toString();
    const normalized = v.replace(/\+/g, ''); // 去掉加号
    const lower = normalized.toLowerCase();
    if (lower.includes('overview')) return 'Overview';
    if (lower.includes('marketing') && lower.includes('basic')) return 'MarketingBasic';
    return 'MarketingBasic';
  }, []);

  const encodeLayoutForUrl = React.useCallback((tab) => {
    const t = (tab || '').toString().toLowerCase();
    if (t.includes('overview')) return 'Overview';
    if (t.includes('marketing') && t.includes('basic')) return 'MarketingBasic';
    return 'MarketingBasic';
  }, []);

  // 从URL获取layout参数，默认为'MarketingBasic'
  const layoutFromUrl = searchParams.get('layout') || 'MarketingBasic';
  const normalizedLayoutFromUrl = parseLayoutFromUrl(layoutFromUrl);
  
  // 下拉选择：Overview / Marketing Basic
  const [basicTab, setBasicTab] = useState(normalizedLayoutFromUrl);
  // 防抖处理
  const [, startTransition] = React.useTransition();
  const updateTabTimerRef = React.useRef(null);

  useEffect(() => {
    const newLayoutFromUrl = searchParams.get('layout') || 'MarketingBasic';
    const normalizedLayout = parseLayoutFromUrl(newLayoutFromUrl);
    if (normalizedLayout !== basicTab) {
      // 这里也在防抖，双重防抖
      startTransition(() => setBasicTab(normalizedLayout));
    }
  }, [searchParams, basicTab, parseLayoutFromUrl]);

  // 更新basicTab和URL
  const updateBasicTabAndUrl = React.useCallback((newTab) => {
    // 防抖，是的防抖
    if (updateTabTimerRef.current) {
      clearTimeout(updateTabTimerRef.current);
    }
    updateTabTimerRef.current = setTimeout(() => {
      startTransition(() => {
        const newSearchParams = new URLSearchParams(searchParams);
        const encoded = encodeLayoutForUrl(newTab);
        newSearchParams.set('layout', encoded);
        setSearchParams(newSearchParams, { replace: true });
      });
    }, 120);
  }, [searchParams, setSearchParams, encodeLayoutForUrl]);

  // 简化的数据提取函数
    const getPdpPageData = React.useMemo(() => {
    const pages = Array.isArray(pdpPageData?.pages) ? pdpPageData.pages : [];
    // 先按当前语言过滤页面；若该语言没有数据，再回退到全部
    // const pages = (() => {
    //   const lang = (currentLanguage || '').toLowerCase();
    //   const localized = allPages.filter(p => (p?.locale || '').toLowerCase() === lang);
    //   return localized.length > 0 ? localized : allPages;
    // })();

    let page = null;
    if (pages.length >= 1) {
      const desired = (basicTab || '').toLowerCase();
      const normalizeName = (tpl) => (
        (tpl?.name || tpl?.title || '').toString().toLowerCase()
      );
      
      
      let matched = null;
      if (desired.includes('overview')) {
        matched = pages.find(tpl => {
          const normalized = normalizeName(tpl);
          const matches = normalized === 'overview';
          return matches;
        }) || null;

      } else if (desired.includes('marketing') && desired.includes('basic')) {
        matched = pages.find(tpl => {
          const n = normalizeName(tpl);
          return n === 'marketing basic';
        }) || null;

      }
      page = matched;

      if (import.meta.env.DEV) {
        console.log('page', { name: page?.name, locale: page?.locale });
      }
    }

    const contentArea = page?.contentArea;

    console.log('contentArea', contentArea);

    if (!Array.isArray(contentArea)) {
      return {
        productCard: null,
        table: null,
        forms: [],
        images: [],
        codes: [],
        referenceLists: [],
        packagingWidgets: [],
        specificationWidgets: [],
        mediaWidgets: [],
        documentWidgets: []
      };
    }

    // 数据映射器
    const DATA_MAPPERS = {
      'pdp-page.product-card': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        // modelNumberFieldName: block.modelNumberFieldName,
        filename: block.filename,
        show: block.showDownload,
        export: block.showExport,
        share: block.showShare,
        raw: block
      }),
      
      'pdp-page.table': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        navPath: block.navPath,
        raw: block
      }),
      
      'pdp-page.form': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        columnType: block.columnType,
        show: block.showLanguages,
        download: block.showDownload,
        navPath: block.navPath,
        raw: block
      }),
      
      'pdp-page.image-widget': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        download: block.showDownload,
        type: block.type,
        navPath: block.navPath,
        raw: block
      }),

      'pdp-page.code-widget': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        download: block.showDownload,
        type: block.type,
        navPath: block.navPath,
        raw: block
      }),
      
      'pdp-page.reference-list-widget': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        type: block.type,
        navPath: block.navPath,
        raw: block
      }),
      
      'pdp-page.packaging-widget': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        download: block.showDownload,
        navPath: block.navPath,
        raw: block
      }),

      'pdp-page.specification-widget': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        show: block.showLanguages,
        download: block.showDownload,
        navPath: block.navPath,
        raw: block
      }),
      
      'pdp-page.media-widget-list': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        show: block.showPreview,
        download: block.showDownload,
        navPath: block.navPath,
        raw: block
      }),
      
      'pdp-page.document-widget-list': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        show: block.showPreview,
        download: block.showDownload,
        type: block.type,
        navPath: block.navPath,
        raw: block
      })
    };

    // 初始化数据容器
    const result = {
      productCard: null,
      table: null,
      forms: [],
      images: [],
      codes: [],
      referenceLists: [],
      packagingWidgets: [],
      specificationWidgets: [],
      mediaWidgets: [],
      documentWidgets: []
    };

    // 遍历 contentArea 并应用映射器
    contentArea.forEach((block) => {
      const componentType = block?.__component || 'unknown_component';
      const mapper = DATA_MAPPERS[componentType];
      
      if (mapper) {
        const mappedData = mapper(block);
        
        // 根据组件类型分配到对应容器
        switch (componentType) {
          case 'pdp-page.product-card':
            result.productCard = mappedData;
            break;
          case 'pdp-page.table':
            result.table = mappedData;
            break;
          case 'pdp-page.form':
            result.forms.push(mappedData);
            break;
          case 'pdp-page.image-widget':
            result.images.push(mappedData);
            break;
          case 'pdp-page.code-widget':
            result.codes.push(mappedData);
            break;
          case 'pdp-page.reference-list-widget':
            result.referenceLists.push(mappedData);
            break;
          case 'pdp-page.packaging-widget':
            result.packagingWidgets.push(mappedData);
            break;
          case 'pdp-page.specification-widget':
            result.specificationWidgets.push(mappedData);
            break;
          case 'pdp-page.media-widget-list':
            result.mediaWidgets.push(mappedData);
            break;
          case 'pdp-page.document-widget-list':
            result.documentWidgets.push(mappedData);
            break;
          default:
            console.warn('Unknown component type:', componentType);
        }

        if (import.meta.env.DEV) {
          console.log('result', mappedData);
        }
      }
    });

    return result;
  }, [pdpPageData, basicTab]);


  //productCardData待处理
  const productCardData = getPdpPageData.productCard;
  
  // 使用优化后的数据映射器
  const mappedData = usePdpDataMapping(getPdpPageData, t);
  
  const {
    tableData,
    basicFormData,
    sapFormData,
    marketingFormData,
    iconsAndPicturesData,
    onWhiteData,
    actionAndLifestyleData,
    qrCodesData,
    eansData,
    bundlesData,
    componentsData,
    accessoriesData,
    packagingData,
    specificationData,
    mediaData,
    documentData,
    manualsData,
    repairGuidesData,
    packagingsData,
    drawingsData,
    patentData
  } = mappedData;

  console.log('mappedData111', mappedData);


  // 从路由参数获取产品ID
  const { id: routeProductId } = useParams();
  
  // 添加加载和错误状态
  const [loading, setLoading] = useState(true);
  const isFirstLoadRef = React.useRef(true);
  const [error, setError] = useState(null);
  
  const [productData, setProductData] = useState({
    id: '90330',
    name: 'Big Capacity Black Roller Cabinet with 6 Drawer - 160mm/6"',
    image: 'https://via.placeholder.com/400x400/2c3e50/ffffff?text=Roller+Cabinet',
    status: {
      lifecycle: 'Active',
      regionalLaunchDate: '2025-01-01',
      enrichmentStatus: 'Global data ready',
      finalReleaseDate: '2025-06-01'
    },
    skus: [
      { size: '160mm/6"', material: 'A01010501', finish: 'Nickel Iron Plated', standard: '' },
      { size: '180mm/6"', material: 'A01010502', finish: 'Nickel Iron Plated', standard: '' },
      { size: '200mm/6"', material: 'A01010503', finish: 'Nickel Iron Plated', standard: '' }
    ],
    basicData: {
      brand: currentBrand || 'Kendo',
      productNumber: '90330',
      region: 'EMEA',
      productType: 'Accessory',
      countryOfOrigin: 'China',
      modelNumber: '90330',
      warranty: '1 Year',
      lastChangedOn: '2025-01-01',
      lifecycleStatus: 'Active',
      enrichmentStatus: 'Local Data Ready',
      sellable: 'Yes',
      firstShippingDate: '2025-01-01',
      createdOn: '2025-01-01',
      customerFacingProductCode: '90330',
      erpMaterialCode: 'ERP-90330',
      onlineDate: '2025-01-01',
      productName: 'Roller Cabinet 90330',
      abc: 'A',
      priceListUsd: '299.99',
      exportRestrictions: 'None',
      inchMeasurementUnitMarkets: 'US, UK'
    },
    sapDetail: {
      basicUnitOfMeasurement: 'BA',
      productDimensions: '',
      consolidationSkuNumbers: '',
      factoryInstruction: 'KENDO定牌德式钢丝钳规格：硬度40-52HRC，25-50HRC，刃部50-62HRC，材质#55碳钢，表面处理喷砂+镍铁镀层，激光打标，手柄颜色橙色165C(TPR)+黑色(TPR)，用途：夹持/弯曲薄板、圆柱形金属件、切断铜线1.6mm以下'
    },
    marketingData: {
      modelName: '',
      categoryBullets: [],
      popShortDescription: '',
      longDescription: '',
      packagingContains: '',
      specifications: ''
    }
  });

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Strapi PDP Page Data:', getPdpPageData);
      console.log('Product Card Strapi Config:', productCardData);
      console.log('SAP Form Strapi Config:', sapFormData);
      console.log('Table Data:', tableData);
      console.log('Document WidgetstableData Data:', documentData);
      console.log('PIM数据结构:', productData);
      console.log('ProductCard Fields从Strapi:', productCardData?.fields);
      console.log('ProductCardInfo从PIM:', productData.productCardInfo);
      console.log('Status:', productData.status);
    }
  }, [getPdpPageData, productCardData, tableData, sapFormData, documentData, productData]);

  //方法，各种方法
  // 字段值获取方法
  const getFieldValue = React.useCallback((field, fallback = '-') => {
    if (!field) return fallback;
    return field.value || field.defaultValue || fallback;
  }, []);

  // 标签格式化方法
  const formatLabel = React.useCallback((key) => {
    if (!key) return '';
    return key.replace(/_/g, ' ')
              .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
              .replace(/^[a-z]/, s => s.toUpperCase());
  }, []);

  // 通用的动态数据获取器
  const getValueByPath = React.useCallback((obj, path, transformer = null) => {
    if (!obj || !path) return undefined;
    
    try {
      // 支持嵌套路径，比如 'basicData.brand'这种
      const value = path.split('.').reduce((current, key) => {
        return current && current[key];
      }, obj);
      
      // 支持数据转换器
      if (transformer && value !== undefined) {
        return transformer(value);
      }
      
      return value;
    } catch (error) {
      console.warn(`Error accessing path ${path}:`, error);
      return undefined;
    }
  }, []);

  // 简化版数据转换器
  const dataTransformers = React.useMemo(() => ({
    arrayToString: (value) => Array.isArray(value) ? value.join(', ') : value,
    booleanToString: (value) => typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value,
    formatDate: (value) => {
      if (!value) return '';
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
  }), []);


  // 简化版数据转换器映射
  const transformerMappings = React.useMemo(() => ({
    sellable: 'booleanToString',
    categoryBullets: 'arrayToString',
    // lastChangedOn: 'formatDate',
    // firstShippingDate: 'formatDate',
    // createdOn: 'formatDate'
  }), []);

  // 从navPath中提取标题的辅助函数
  const extractTitleFromNavPath = React.useCallback((navPath, fallbackTitle = '') => {
    if (!navPath || typeof navPath !== 'string') {
      return fallbackTitle;
    }
    
    // 提取"/"前的部分
    const parts = navPath.split('/');
    const title = parts[0]?.trim();
    
    return title || fallbackTitle;
  }, []);

  // 完整的字段路径映射 - PIM接口返回结构
  const getFieldPath = React.useCallback((fieldName, context) => {
    const pathMaps = {
      // ProductCard字段映射 (对应PIM的productCardInfo)
      productNumber: 'productCardInfo.productNumber',
      productName: 'productCardInfo.productName',
      developmentStatus: 'productCardInfo.developmentStatus',
      lifeCycleStatus: 'productCardInfo.lifeCycleStatus',
      lifecycle: 'productCardInfo.lifeCycleStatus',
      enrichmentStatus: 'productCardInfo.enrichmentStatus',
      regionalLaunchDate: 'productCardInfo.regionalLaunchDate',
      finalReleaseDate: 'productCardInfo.finalReleaseDate',
      
      // Basic Data字段映射 (对应PIM的basicData)
      modelNumber: 'basicData.modelNumber',        
      brand: 'basicData.brand',                     
      region: 'basicData.region',              
      productType: 'basicData.productType',           
      customerFacingProductCode: 'basicData.customerFacingProductCode', 
      sellable: 'basicData.sellable',               
      countryOfOrigin: 'basicData.countryOfOrigin', 
      warranty: 'basicData.warranty',                
      lastChangedOn: 'basicData.lastChangedOn',   
      firstShippingDate: 'basicData.firstShippingDate', 
      createdOn: 'basicData.createdOn',           
      erpMaterialCode: 'basicData.erpMaterialCode',  
      onlineDate: 'basicData.onlineDate',            
      basicProductName: 'basicData.productName',     
      abc: 'basicData.abc',                         
      priceListUsd: 'basicData.priceListUsd',      
      exportRestrictions: 'basicData.exportRestrictions', 
      inchMeasurementUnitMarkets: 'basicData.inchMeasurementUnitMarkets', 
      
      // SAP Detail字段映射 (对应PIM的sapData)
      basicUnitOfMeasurement: 'sapData.basicUnitOfMeasurement',
      basicUnitofMeasurement: 'sapData.basicUnitOfMeasurement',
      productDimensions: 'sapData.productDimensions',
      consolidationSkuNumbers: 'sapData.consolidationSkuNumbers',
      factoryInstructionCn: 'sapData.factoryInstructionCn',
      factoryInstruction: 'sapData.factoryInstructionCn',
      sapShortDescriptionEn: 'sapData.sapShortDescriptionEn',
      
      // Marketing Data字段映射 (对应PIM的marketingData)
      modelName: 'marketingData.modelName',
      categoryBullets: 'marketingData.categoryBullets',
      popShortDescription: 'marketingData.popShortDescription',
      longDescription: 'marketingData.longDescription',
      packagingContains: 'marketingData.packagingContains',
      specifications: 'marketingData.specifications'
    };
    
    // 如果有特殊映射，使用特殊映射
    if (pathMaps[fieldName]) {
      return pathMaps[fieldName];
    }
    
    // 否则按约定生成路径：兼容原有逻辑
    switch (context) {
      case 'basic': return `basicData.${fieldName}`;
      case 'sap': return `sapData.${fieldName}`;
      case 'marketing': return `marketingData.${fieldName}`;
      case 'productCard': return `productCardInfo.${fieldName}`;
      default: return `${fieldName}`;
    }
  }, []);

  // 简化版映射器构建函数
  const buildGetterMap = React.useCallback((fields, context) => {
    if (!fields || !Array.isArray(fields)) return {};
    
    const getterMap = {};
    
    fields.forEach(field => {
      const fieldName = field.fieldName;
      if (!fieldName) return;
      
      // 简化优先级：字段配置 > 约定路径
      const pimPath = field.pimMappingPath || getFieldPath(fieldName, context);
      const transformer = transformerMappings[fieldName];
      
      getterMap[fieldName] = (data) => {
        const transformerFn = transformer ? dataTransformers[transformer] : null;
        return getValueByPath(data, pimPath, transformerFn);
      };
    });
    
    return getterMap;
  }, [getFieldPath, transformerMappings, dataTransformers, getValueByPath]);

  // 使用简化版映射器
  const basicValueGetterMap = React.useMemo(() => 
    buildGetterMap(basicFormData?.fields, 'basic'), 
    [buildGetterMap, basicFormData?.fields]
  );

  // 动态映射
  const sapValueGetterMap = React.useMemo(() => {
    // 如果有Strapi配置，尝试使用动态映射
    if (sapFormData?.fields && sapFormData.fields.length > 0) {
      const dynamicMap = buildGetterMap(sapFormData.fields, 'sap');
      // 验证动态映射是否有效
      if (Object.keys(dynamicMap).length > 0) {
        return dynamicMap;
      }
    }
    
    // 硬编码方式
    return {
      basicUnitofMeasurement: (d) => d.sapDetail?.basicUnitOfMeasurement,
      productDimensions: (d) => d.sapDetail?.productDimensions,
      consolidationSkuNumbers: (d) => d.sapDetail?.consolidationSkuNumbers,
      factoryInstructionCn: (d) => d.sapDetail?.factoryInstruction,
      sapShortDescriptionEn: (d) => d.sapDetail?.sapShortDescription
    };
  }, [buildGetterMap, sapFormData?.fields]);

  const marketingValueGetterMap = React.useMemo(() => 
    buildGetterMap(marketingFormData?.fields, 'marketing'), 
    [buildGetterMap, marketingFormData?.fields]
  );

  const productCardValueGetterMap = React.useMemo(() => 
    buildGetterMap(productCardData?.fields, 'productCard'), 
    [buildGetterMap, productCardData?.fields]
  );

  // 大标题
  const sectionTitles = React.useMemo(() => {
    return {
      basicSection: extractTitleFromNavPath(basicFormData?.navPath, 'Basic Data'),
    
      marketingSection: extractTitleFromNavPath(marketingFormData?.navPath, 'Marketing Data'),
      
      referencesSection: extractTitleFromNavPath(bundlesData?.navPath || componentsData?.navPath || accessoriesData?.navPath, 'References & Relationships'),
      
      packagingSection: extractTitleFromNavPath(packagingData?.[0]?.navPath, 'Packaging & Logistics'),
      
      uspsSection: extractTitleFromNavPath(specificationData?.[0]?.navPath, 'USPS & Benefits'),
      
      marketingCollateralsSection: extractTitleFromNavPath(onWhiteData?.navPath || actionAndLifestyleData?.navPath || mediaData?.[0]?.navPath, 'Marketing Collaterals'),
      
      afterServiceSection: extractTitleFromNavPath(manualsData?.navPath || repairGuidesData?.navPath || packagingsData?.navPath || drawingsData?.navPath || patentData?.navPath, 'After Service'),
    };
  }, [
    extractTitleFromNavPath, basicFormData, marketingFormData,
    bundlesData, componentsData, accessoriesData,
    packagingData, specificationData, onWhiteData, actionAndLifestyleData, mediaData,
    manualsData, repairGuidesData, packagingsData, drawingsData, patentData
  ]);

  const buildItemsFromFields = React.useCallback((formData, getterMap, sourceData) => {
    if (!formData?.fields) return [];
    return formData.fields.map((field) => {
      const fieldName = (field.fieldName || '').toString();
      const title = field.label || field.title || formatLabel(fieldName);
      const getter = getterMap?.[fieldName];
      const pimValue = getter ? getter(sourceData) : undefined;
      const fallback = getFieldValue(field, '-');
      return {
        label: title,
        value: pimValue ?? fallback ?? '-',
        type: /status/i.test(fieldName) ? 'status' : 'text'
      };
    });
  }, [getFieldValue, formatLabel]);

  // 这里是各种表单数据，都在这构建
  const basicFormItems = React.useMemo(() => 
    buildItemsFromFields(basicFormData, basicValueGetterMap, productData), [buildItemsFromFields, basicFormData, basicValueGetterMap, productData]
  );


  // 优化后的SAP表单项构建 - 基于正确的映射方式
  const sapFormItems = React.useMemo(() => {
    // 如果有Strapi配置且动态映射有效，使用动态构建
    if (sapFormData?.fields && sapFormData.fields.length > 0) {
      const dynamicItems = buildItemsFromFields(sapFormData, sapValueGetterMap, productData);
      if (dynamicItems && dynamicItems.length > 0) {
        return dynamicItems;
      }
    }
    
    // 否则使用优化前的正确映射方式作为回退
    return [
      {
        label: 'Basic Unit of Measurement',
        value: productData.sapDetail?.basicUnitOfMeasurement || '-',
        type: 'text'
      },
      {
        label: 'Product Dimensions',
        value: productData.sapDetail?.productDimensions || '-',
        type: 'text'
      },
      {
        label: 'Consolidation SKU Numbers',
        value: productData.sapDetail?.consolidationSkuNumbers || '-',
        type: 'text'
      },
      {
        label: 'Factory Instruction',
        value: productData.sapDetail?.factoryInstruction || '-',
        type: 'text'
      }
    ];
  }, [sapFormData, sapValueGetterMap, productData, buildItemsFromFields]);
  
  const marketingFormItems = React.useMemo(() => 
    buildItemsFromFields(marketingFormData, marketingValueGetterMap, productData), [buildItemsFromFields, marketingFormData, marketingValueGetterMap, productData]
  );

  // 简化版ProductCard infoPairs生成器
  const generateProductCardInfoPairs = React.useCallback(() => {
    // 默认字段配置 - 按照UI显示顺序
    const defaultFields = [
      { fieldName: 'lifecycle', title: 'Life Cycle Status', withStatus: true },
      { fieldName: 'finalReleaseDate', title: 'Final Release Date' },
      { fieldName: 'regionalLaunchDate', title: 'Regional Launch Date' },
      { fieldName: 'enrichmentStatus', title: 'Enrichment Status' }
    ];

    // 使用Strapi配置或默认配置
    const fields = productCardData?.fields?.filter(field => field.type === 'Field') || defaultFields;
    
    if (import.meta.env.DEV) {
      console.log('ProductCard Debug Info:');
      console.log('Strapi ProductCard Fields:', productCardData?.fields);
      console.log('Filtered Fields:', fields);
      console.log('Default Fields:', defaultFields);
      console.log('ProductCard Value Getter Map:', productCardValueGetterMap);
      console.log('Product Data Status:', productData.status);
      console.log('Product Data ProductCardInfo:', productData.productCardInfo);
    }
    
    const result = fields.map((field, index) => {
      const fieldName = field.fieldName || defaultFields[index]?.fieldName;
      const label = field.title || field.label || defaultFields[index]?.title || fieldName;
      
      // 获取PIM数据
      const getter = productCardValueGetterMap?.[fieldName];
      const pimValue = getter ? getter(productData) : undefined;
      
      // ProductCard字段特殊处理：有PIM数据显示PIM数据，没有就显示"Unknown"
      let finalValue;
      if (pimValue && pimValue !== '' && pimValue !== null && pimValue !== undefined) {
        finalValue = pimValue;
      } else {
        // 检查兼容层数据
        const compatValue = productData.status?.[fieldName];
        if (compatValue && compatValue !== '' && compatValue !== null && compatValue !== undefined) {
          finalValue = compatValue;
        } else {
          finalValue = 'Unknown';
        }
      }
      
      return {
        label,
        value: finalValue,
        withStatus: field.withStatus ?? (index === 0) // 第一个字段默认显示状态
      };
    });
    
    if (import.meta.env.DEV) {
      console.log('Final ProductCard InfoPairs:', result);
    }
    return result;
  }, [productCardData, productCardValueGetterMap, productData]);



  // 简化版ProductCard配置
  const productCardConfig = React.useMemo(() => ({
    modelNumberField: productCardData?.modelNumberField || 'modelNumber',
    announcementPrefix: productCardData?.announcementPrefix || 'New Version Available:',
    // statusText: productCardData?.statusText || 'In Development'
  }), [productCardData]);

  // After Service 图片 - 使用PIM数据 - 移动到这里避免Hook顺序问题
  const afterServiceAssets = React.useMemo(() => {
    const pimAfterService = productData.afterService;
    
    return {
      manuals: pimAfterService?.manuals?.map(manual => ({
        image: manual.thumbnailUrl ? `https://pim-test.kendo.com${manual.thumbnailUrl}` : manualsImage,
        modelNumber: productData.basicData?.modelNumber || '',
        productType: productData.basicData?.productNumber || '',
        name: manual.title || '',
        show: manual.show || false,
        download: manual.download || false
      })) || [],
      repairGuides: pimAfterService?.repairGuide?.map(guide => ({
        image: guide.thumbnailUrl ? `https://pim-test.kendo.com${guide.thumbnailUrl}` : repairGuideImage,
        modelNumber: productData.basicData?.modelNumber || '',
        productType: guide.title ? `${productData.basicData?.productNumber || ''} - ${guide.title}` : '',
        name: guide.title || ''
      })) || [],
      // Packaging 列表
      packagings: pimAfterService?.packaging?.map(pack => ({
        image: pack.thumbnailUrl ? `https://pim-test.kendo.com${pack.thumbnailUrl}` : packagingImage,
        modelNumber: productData.basicData?.modelNumber || '',
        productType: productData.basicData?.productNumber || '',
        name: pack.title || ''
      })) || [],
      // Drawing 列表
      drawings: pimAfterService?.drawing?.map(drawing => ({
        image: drawing.thumbnailUrl ? `https://pim-test.kendo.com${drawing.thumbnailUrl}` : drawingImage,
        modelNumber: productData.basicData?.modelNumber || '',
        productType: productData.basicData?.productNumber || '',
        name: drawing.title || ''
      })) || [],
      // Patent 列表
      patents: pimAfterService?.patent?.map(patent => ({
        image: patent.thumbnailUrl ? `https://pim-test.kendo.com${patent.thumbnailUrl}` : patentImage,
        modelNumber: productData.basicData?.modelNumber || '',
        productType: productData.basicData?.productNumber || '',
        name: patent.title || ''
      })) || []
    };
  }, [productData.afterService, productData.basicData]);

  if (import.meta.env.DEV) {
    console.log('productCardConfig', productCardConfig);
  }

  // 导航栏
  const [expandedSections, setExpandedSections] = useState({
    'basic-data': true,
    'marketing-data': true,
    'reference-relationship': true,
    'packaging-logistics': true,
    'usps-benefits': true,
    'marketing-collaterals': true,
    'after-service': true
  });

  // 顶部菜单控制与样式
  const useMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const openMenu = (event) => setAnchorEl(event.currentTarget);
    const closeMenu = () => setAnchorEl(null);
    return { anchorEl, open, openMenu, closeMenu };
  };

  // 滚动容器与锚点
  const contentScrollRef = useRef(null);
  // Basic Data anchors
  const skuDataTitleRef = useRef(null);
  const basicDataTitleRef = useRef(null);
  const sapDetailTitleRef = useRef(null);
  // Marketing Data anchors
  const marketingCopyTitleRef = useRef(null);
  const iconsPicturesTitleRef = useRef(null);
  const qrCodesTitleRef = useRef(null);
  const eansTitleRef = useRef(null);
  // References & Relationships anchors
  const bundlesTitleRef = useRef(null);
  const componentsTitleRef = useRef(null);
  const accessoriesTitleRef = useRef(null);
  // Packaging & Logistics anchors
  const packagingDataTitleRef = useRef(null);
  const packagingSpecTitleRef = useRef(null);
  // Marketing Collaterals anchors
  const onWhiteTitleRef = useRef(null);
  const actionLifestyleTitleRef = useRef(null);
  const videosTitleRef = useRef(null);
  // After Service anchors
  const manualsTitleRef = useRef(null);
  const repairGuideTitleRef = useRef(null);
  const packagingTitleRef = useRef(null);
  const drawingTitleRef = useRef(null);
  const patentTitleRef = useRef(null);

  // 避免重复大小写/空格处理
  const normalize = React.useCallback((val) => (val ?? '').toString().trim().toUpperCase(), []);

  // 多语言导航配置
  const NAVIGATION_CONFIG = React.useMemo(() => [
    // Basic Data
    { sectionId: 'basic-data', i18nKey: 'pdp.sections.skuData', ref: skuDataTitleRef },
    { sectionId: 'basic-data', i18nKey: 'pdp.sections.basicData', ref: basicDataTitleRef },
    { sectionId: 'basic-data', i18nKey: 'pdp.sections.sapDetail', ref: sapDetailTitleRef },
    // Marketing Data  
    { sectionId: 'marketing-data', i18nKey: 'pdp.sections.marketingCopy', ref: marketingCopyTitleRef },
    { sectionId: 'marketing-data', i18nKey: 'pdp.sections.iconsAndPictures', ref: iconsPicturesTitleRef },
    { sectionId: 'marketing-data', i18nKey: 'pdp.sections.qrCodes', ref: qrCodesTitleRef },
    { sectionId: 'marketing-data', i18nKey: 'pdp.sections.eans', ref: eansTitleRef },
    // References & Relationships
    { sectionId: 'reference-relationship', i18nKey: 'pdp.sections.bundles', ref: bundlesTitleRef },
    { sectionId: 'reference-relationship', i18nKey: 'pdp.sections.components', ref: componentsTitleRef },
    { sectionId: 'reference-relationship', i18nKey: 'pdp.sections.accessories', ref: accessoriesTitleRef },
    // Packaging & Logistics
    { sectionId: 'packaging-logistics', i18nKey: 'pdp.sections.packagingData', ref: packagingDataTitleRef },
    // USPS & Benefits
    { sectionId: 'usps-benefits', i18nKey: 'pdp.sections.packagingSpec', ref: packagingSpecTitleRef },
    // Marketing Collaterals
    { sectionId: 'marketing-collaterals', i18nKey: 'pdp.sections.onWhite', ref: onWhiteTitleRef },
    { sectionId: 'marketing-collaterals', i18nKey: 'pdp.sections.actionAndLifestyle', ref: actionLifestyleTitleRef },
    { sectionId: 'marketing-collaterals', i18nKey: 'pdp.sections.videos', ref: videosTitleRef },
    // After Service
    { sectionId: 'after-service', i18nKey: 'pdp.sections.manuals', ref: manualsTitleRef },
    { sectionId: 'after-service', i18nKey: 'pdp.sections.repairGuide', ref: repairGuideTitleRef },
    { sectionId: 'after-service', i18nKey: 'pdp.sections.packaging', ref: packagingTitleRef },
    { sectionId: 'after-service', i18nKey: 'pdp.sections.drawing', ref: drawingTitleRef },
    { sectionId: 'after-service', i18nKey: 'pdp.sections.patent', ref: patentTitleRef }
  ], []);

  // 导航查找
  const getNavTarget = React.useCallback((translatedText) => {
    const normalizedText = normalize(translatedText);
    return NAVIGATION_CONFIG.find(config => 
      normalize(t(config.i18nKey)) === normalizedText
    )?.ref;
  }, [NAVIGATION_CONFIG, t, normalize]);

  const handleNavigate = (sectionId, subItem) => {
    const container = contentScrollRef.current;
    const targetRef = getNavTarget(subItem);
    const target = targetRef?.current;
    
    if (import.meta.env.DEV) {
      console.log('PDP导航:', {
        section: sectionId,
        item: subItem,
        language: currentLanguageInfo.nativeName,
        hasTarget: !!target
      });
    }
    
    if (!container || !target) {
      console.warn('PDP导航失败:', { 
        hasContainer: !!container, 
        hasTarget: !!target,
        section: sectionId,
        item: subItem,
        language: currentLanguage
      });
      return;
    }
    
    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    const offsetTop = tRect.top - cRect.top + container.scrollTop - 12;
    container.scrollTo({ top: offsetTop, behavior: 'smooth' });
  };

  // Toast通知
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 2000); // 2秒后自动消失
  };

  // 复制链接到剪贴板
  const handleShare = React.useCallback(async () => { 
    const url = window.location.href;
    
    try {
      // 使用API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        console.log('URL copied:', url);
      } else {
        // 回退方法
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('URL copied (fallback):', url);
      }
      
      // 显示成功提示
      showToast('Copied to clipboard !', 'success');
    } catch (error) {
      console.error('Copy failed:', error);
      showToast('Copied to clipboard !', 'success'); // 即使失败也显示成功消息
    }
  }, []);
  
  const handleExport = React.useCallback(() => { 
    console.log('export clicked'); 
  }, []);
  
  const handleDownload = React.useCallback(() => { 
    console.log('download clicked'); 
  }, []);

  // 图片点击处理
  const handleImageClick = React.useCallback((image, index) => {
    console.log('Image clicked:', image, index);
  }, []);

  // QR码相关点击处理
  const handleQRLinkClick = React.useCallback((item, index) => {
    console.log('QR Link clicked:', item, index);
  }, []);

  const handleQRImageClick = React.useCallback((item, index) => {
    console.log('QR Image clicked:', item, index);
  }, []);


  const handleEANImageClick = React.useCallback((item, index) => {
    console.log('EAN Image clicked:', item, index);
  }, []);

  // 样式常量
  const styles = React.useMemo(() => ({
    topButtonBase: {
      bgcolor: '#f7f7f7',
      borderColor: '#cccccc',
      color: '#333333',
      textTransform: 'uppercase',
      height: '40px',
      borderRadius: '3.87px',
      fontSize: '15px',
      lineHeight: '20px',
      letterSpacing: '0.25px',
      fontFamily: '"Roboto-Medium", sans-serif',
      fontWeight: 700,
      '& .MuiButton-startIcon svg': { fontSize: 22 },
      '& .MuiButton-startIcon img': { width: 26.5, height: 26.5 },
      '&:hover': { bgcolor: '#eaeaea', borderColor: '#cccccc', color: '#333333' }
    },
    menuIcon: { display: 'block' },
    sectionTitle: {
      color: '#4d4d4d',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '24.5px',
      fontWeight: 520
    },
    whiteButton: {
      bgcolor: '#ffffff',
      borderColor: '#cccccc',
      color: '#333333',
      px: 2,
      width: 'auto',
      '&:hover': { bgcolor: '#eaeaea', borderColor: '#cccccc', color: '#000000' }
    }
  }), []);
  // ThemedIcon逻辑已移至MainSectionTitle组件

  // 顶部动作栏组件
  const TopActionsBar = () => {
    const basicMenu = useMenu();
    const languageMenu = useMenu();
    const { supportedLanguages, getCurrentLanguageInfo, changeLanguage, currentLanguage } = useLanguage();
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const handleReportSubmit = (payload) => {
      console.log('Report Data Issue submit:', payload);
      setReportDialogOpen(false);
    };
    const getMenuProps = (anchorEl) => ({
      PaperProps: {
        elevation: 4,
        sx: {
          borderRadius: 1.5,
          mt: 1,
          width: anchorEl ? anchorEl.offsetWidth : undefined,
          bgcolor: 'background.paper',
          '& .MuiMenuItem-root': { 
            py: 1, 
            fontSize: 14,
            '&:hover': {
              backgroundColor: `${primaryColor}20`, 
            },
            '&.Mui-selected': {
              backgroundColor: `${primaryColor}15`, 
              color: primaryColor,
              '&:hover': {
                backgroundColor: `${primaryColor}25`, 
              }
            }
          }
        }
      },
      MenuListProps: {
        dense: false,
        sx: { py: 0.5 }
      },
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
      transformOrigin: { vertical: 'top', horizontal: 'left' }
    });
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          mt: 5,
          ml: 1,
          mr: 1
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<OutlinedFlagIcon />}
          sx={{
            bgcolor: '#ffffff',
            borderColor: '#cccccc',
            color: '#333333',
            textTransform: 'uppercase',
            fontSize: '15px',
            lineHeight: '20px',
            letterSpacing: '0.25px',
            fontFamily: '"Roboto-Medium", sans-serif',
            fontWeight:700,
            height: '40px',
            width: '200px',
            borderRadius: '3.87px',
            '& .MuiButton-startIcon svg': { fontSize: 22},
            '&:hover': { bgcolor: '#eaeaea', borderColor: '#cccccc', color: '#000000' }
          }}
          onClick={() => setReportDialogOpen(true)}
        >
          Report Data Issue
        </Button>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Box component="img" src={databaseIcon} alt="database" sx={styles.menuIcon} />}
              endIcon={<SmallTriangleIcon expanded={basicMenu.open} color="#000" />}
            onClick={basicMenu.openMenu}
            aria-haspopup="menu"
            aria-expanded={basicMenu.open ? 'true' : undefined}
          sx={{ ...styles.topButtonBase, width: 'auto', minWidth: '160px', px: 2.5 }}
          >
          {basicTab === 'MarketingBasic' ? 'Marketing Basic' : basicTab}
          </Button>
          <Menu
            anchorEl={basicMenu.anchorEl}
            open={basicMenu.open}
            onClose={basicMenu.closeMenu}
            {...getMenuProps(basicMenu.anchorEl)}
          >
          <MenuItem 
            selected={basicTab === 'MarketingBasic'}
            onClick={() => { basicMenu.closeMenu(); updateBasicTabAndUrl('MarketingBasic'); }}
          >
            Marketing Basic
          </MenuItem>
          <MenuItem 
            selected={basicTab === 'Overview'}
            onClick={() => { basicMenu.closeMenu(); updateBasicTabAndUrl('Overview'); }}
          >
            Overview
          </MenuItem>
          </Menu>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Box component="img" src={languageIcon} alt="language" sx={styles.menuIcon} />}
            endIcon={<SmallTriangleIcon expanded={languageMenu.open} color="#000" />}
            onClick={languageMenu.openMenu}
            aria-haspopup="menu"
            aria-expanded={languageMenu.open ? 'true' : undefined}
            sx={{ ...styles.topButtonBase, width: 'auto', minWidth: '160px', px: 2.5 }}
          >
            {getCurrentLanguageInfo().nativeName}
          </Button>
          <Menu
            anchorEl={languageMenu.anchorEl}
            open={languageMenu.open}
            onClose={languageMenu.closeMenu}
            {...getMenuProps(languageMenu.anchorEl)}
          >
            {supportedLanguages.map((language) => (
              <MenuItem 
                key={language.code} 
                onClick={() => { changeLanguage(language.code); languageMenu.closeMenu(); }}
                selected={language.code === currentLanguage}
              >
                {language.nativeName}
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <ReportDataIssueDialog
          open={reportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
          onSubmit={handleReportSubmit}
        />
      </Box>
    );
  };

  // 右上角图标按钮栏
  const ToolIconsBar = ({ onShare, onExport, onDownload }) => (
    <Box sx={{ px: 3, pt: 1, pb: 0 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '13.53px',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}
      >
        {productCardData?.share && (
          <IconButton size="small" aria-label="share" onClick={onShare} sx={{ color: '#333333',fontSize: '20px' }}>
            <Box component="img" src={shareIcon} alt="share" sx={{ display: 'block' }} />
          </IconButton>
        )}
        {productCardData?.export && (
          <IconButton size="small" aria-label="export" onClick={onExport} sx={{ color: '#333333',fontSize: '20px' }}>
            <Box component="img" src={exportIcon} alt="export" sx={{ display: 'block' }} />
          </IconButton>
        )}
        {productCardData?.show && (
          <IconButton size="small" aria-label="download" onClick={onDownload} sx={{ color: '#333333',fontSize: '20px' }}>
            <Box component="img" src={downloadIcon} alt="download" sx={{ display: 'block' }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );

  // Strapi 页面数据
  useEffect(() => {
    console.log('PDP页面Redux数据状态:', {
      currentBrand: currentBrand,
      brandCode: currentBrandCode,
      currentLanguage: currentLanguage,
      primaryColor: primaryColor,
      pdpPageData: pdpPageData?.pages
    });
  }, [currentBrand, currentBrandCode, currentLanguage, primaryColor, pdpPageData]);
  
  

  // 根据id加载产品详情 - 优化版本
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!routeProductId) {
        setLoading(false);
        return;
      }
      
      try {
        if (isFirstLoadRef.current) {
          setLoading(true);
        }
        setError(null);
        
        console.log('API调用参数:', {
          routeProductId,
          type: typeof routeProductId,
          length: routeProductId?.length
        });
        
        const detail = await ProductDetailApiService.getProductDetail(routeProductId);

        console.log('API响应结果:', {
          detail,
          hasData: !!detail,
          dataKeys: detail ? Object.keys(detail) : 'no data'
        }); 
        
        if (import.meta.env.DEV) {
          console.log('ProductDetailPage fetched detail:', detail);
        }
        
        if (!mounted) return;
        
        if (!detail) {
          setError('Product not found');
          setLoading(false);
          return;
        }
        const { 
          productCardInfo, 
          skuData, 
          basicData, 
          sapData, 
          marketingData, 
          referenceRelationship,
          iconsPictures,
          qrCodes,
          eans,
          packagingData,
          packagingSpec,
          marketingCollaterals,
          afterService,
          successor
        } = detail;
        
        if (import.meta.env.DEV) {
          console.log('productCardInfo', productCardInfo);
          console.log('basicData', basicData);
          console.log('skuData', skuData);
          console.log('sapData', sapData);
          console.log('marketingData', marketingData);
          console.log('referenceRelationship', referenceRelationship);
          console.log('iconsPictures', iconsPictures);
          console.log('qrCodes', qrCodes);
          console.log('eans', eans);
          console.log('packagingData', packagingData);
          console.log('packagingSpec', packagingSpec);
          console.log('marketingCollaterals', marketingCollaterals);
          console.log('afterService', afterService);
          console.log('successor', successor);
        }
        
        // 直接使用PIM接口返回的数据结构
        setProductData({
          // 保持兼容性的基本信息
          id: productCardInfo?.productNumber || String(routeProductId),
          name: productCardInfo?.productName || 'Unknown Product',
          image: productCardInfo?.thumbnailUrl ? `https://pim-test.kendo.com${productCardInfo.thumbnailUrl}` : 
                 productCardInfo?.imageUrl ? `https://pim-test.kendo.com${productCardInfo.imageUrl}` : 
                 '/assets/productcard_image.png',
          
          // 直接使用PIM返回的数据结构
          productCardInfo: productCardInfo || {},
          skuData: skuData || [],
          basicData: basicData || {},
          sapData: sapData || {},
          marketingData: marketingData || {},
          referenceRelationship: referenceRelationship || {},
          iconsPictures: iconsPictures || {},
          qrCodes: qrCodes || {},
          eans: eans || {},
          packagingData: packagingData || {},
          packagingSpec: packagingSpec || {},
          marketingCollaterals: marketingCollaterals || {},
          afterService: afterService || {},
          successor: successor || {},
          
          // 兼容旧版本的数据结构
          status: {
            lifecycle: productCardInfo?.lifeCycleStatus || 'Active',
            regionalLaunchDate: productCardInfo?.regionalLaunchDate || '',
            enrichmentStatus: productCardInfo?.enrichmentStatus || '',
            finalReleaseDate: productCardInfo?.finalReleaseDate || ''
          },
          sapDetail: {
            basicUnitOfMeasurement: sapData?.basicUnitOfMeasurement || '',
            productDimensions: sapData?.productDimensions || '',
            consolidationSkuNumbers: sapData?.consolidationSkuNumbers || '',
            factoryInstruction: sapData?.factoryInstructionCn || ''
          },
          skus: skuData?.map((sku, index) => ({
            productNumber: sku.productNumber || '',
            size: sku.size || '',
            material: sku.mainMaterial||'',
            finish: sku.surfaceFinish || '',
            standard: sku.applicableStandard || '',
            imageUrl: sku.imageUrl || (index === 0 && productCardInfo?.imageUrl) || ''
          })) || []
        });
        
        setLoading(false);
      } catch (e) {
        console.error('load product by id failed', e);
        if (mounted) {
          setError(e.message || 'Failed to load product');
          setLoading(false);
        }
      }
    };
    load();
    isFirstLoadRef.current = false;
    return () => { mounted = false; };
  }, [routeProductId]);

  


  const navigationItems = React.useMemo(() => {
    const slugify = (s) => (s || '').toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
    const titleKey = (s) => (s || '').toString().trim().toLowerCase();

    const insertPath = (rootsMap, order, rawPath) => {
      if (!rawPath || typeof rawPath !== 'string') return;
      const segments = rawPath.split('/').map(p => p.trim()).filter(Boolean);
      if (segments.length === 0) return;
      let parentMap = rootsMap;
      let parentOrder = order;
      for (let i = 0; i < segments.length; i += 1) {
        const seg = segments[i];
        const key = titleKey(seg);
        if (!parentMap[key]) {
          parentMap[key] = { title: seg, id: slugify(seg), childrenMap: Object.create(null), childrenOrder: [] };
          parentOrder.push(parentMap[key]);
        }
        const node = parentMap[key];
        parentMap = node.childrenMap;
        parentOrder = node.childrenOrder;
      }
    };

    const rootsMap = Object.create(null);
    const rootsOrder = [];

    const blocks = [];
    if (getPdpPageData?.table) blocks.push(getPdpPageData.table);
    (getPdpPageData?.forms || []).forEach(b => blocks.push(b));
    (getPdpPageData?.images || []).forEach(b => blocks.push(b));
    (getPdpPageData?.codes || []).forEach(b => blocks.push(b));
    (getPdpPageData?.referenceLists || []).forEach(b => blocks.push(b));
    (getPdpPageData?.packagingWidgets || []).forEach(b => blocks.push(b));
    (getPdpPageData?.specificationWidgets || []).forEach(b => blocks.push(b));
    (getPdpPageData?.mediaWidgets || []).forEach(b => blocks.push(b));
    (getPdpPageData?.documentWidgets || []).forEach(b => blocks.push(b));

    blocks.forEach(b => insertPath(rootsMap, rootsOrder, b?.navPath));

    const toNavigationItems = () => {
      const items = rootsOrder.map(root => {
        const subSet = new Set();
        const subs = root.childrenOrder
          .map(c => c.title)
          .filter(title => {
            const k = titleKey(title);
            
            // 多语言适配的过滤逻辑
            const skuDataKey = titleKey(t('pdp.sections.skuData'));
            
            if (k === skuDataKey && !(Array.isArray(productData?.skuData) && productData.skuData.length >= 2)) {
              return false;
            }
            if (subSet.has(k)) return false;
            subSet.add(k);
            return true;
          });
        return {
          id: root.id,
          title: (root.title || '').toString().toUpperCase(),
          icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
          subItems: subs
        };
      });
      return items;
    };
    //动态目录的地方
    const dynamicItems = toNavigationItems();

    if (import.meta.env.DEV) {
      console.log('动态目录调试:', {
        language: currentLanguage,
        basicTab,
        dynamicItemsCount: dynamicItems.length,
        dynamicItems: dynamicItems.map(item => ({
          id: item.id,
          title: item.title,
          subItems: item.subItems
        })),
        blocks: blocks.map(b => ({
          title: b.title,
          navPath: b.navPath,
          type: b.__component || 'unknown'
        }))
      });
    }

    if (dynamicItems && dynamicItems.length > 0) return dynamicItems;

    const staticSubItems = [];
    // SKU Data>1就显示
    if (Array.isArray(productData?.skuData) && productData.skuData.length >= 2) {
      staticSubItems.push(t('pdp.sections.skuData'));
    }
    //一直会显示Basic Data
    staticSubItems.push(t('pdp.sections.basicData'));

    return [
      {
        id: 'basic-data',
        title: t('pdp.sections.basicData').toUpperCase(),
        icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
        subItems: staticSubItems
      }
    ];
  }, [getPdpPageData, productData?.skuData, t, currentLanguage, basicTab]);

  const handleSectionToggle = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  //待优化
  const renderProductDataSection = () => (
    <Grid container spacing={3} sx={{mt: 1}}>
      <Grid item xs={12}>
        <ProductCard 
          key={routeProductId}
          announcementPrefix={productCardConfig.announcementPrefix}
          announcementLinkText={productData.basicData?.productName}
          showAnnouncement={!!(productData.successor && (Object.keys(productData.successor).length > 0))}
          statusText={(() => {
            const enrichmentStatus = productData?.status?.enrichmentStatus;
            if (enrichmentStatus == 'Global Data Ready' || enrichmentStatus == 'Deactivated') {
              return enrichmentStatus;
            }
            return 'In Development';
          })()}
          modelNumber={routeProductId}
          title={productData.productCardInfo?.productName || productData.name || "Product Title"}
          strapiData={productCardData}
          infoPairs={generateProductCardInfoPairs()}
          productImage={productData.image}
          skuData={productData.skuData?.map((sku, index) => ({
            productNumber: sku.productNumber || '',
            size: sku.size || '',
            material: sku.mainMaterial||'',
            finish: sku.surfaceFinish || '',
            // standard: sku.applicableStandard || '',
            imageUrl: sku.imageUrl || sku.image || (index === 0 ? productData.image : null)
          })) || []}
          infoLabelMinWidth="155px"
          infoValueMinWidth="150px"
          onDownloadClick={() => console.log('download clicked')} 
          onSkuNavigate={(pn) => {
            if (pn) {
              // 保持当前的layout参数
              const currentLayout = searchParams.get('layout') || 'MarketingBasic';
              // 解析现有layout并按规范重新编码
              const normalized = parseLayoutFromUrl(currentLayout);
              const encoded = encodeLayoutForUrl(normalized);
              navigate(`/${currentLanguage}/${currentBrandCode}/product-detail/${pn}?layout=${encoded}`);
            }
          }}
        />
      </Grid>
    </Grid>
  );

  if (import.meta.env.DEV) {
    console.log('productData', productData);
  }

  // 加载状态
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#f5f5f5'
      }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  // 错误状态
  if (error) {
    // return (
    //   <Box sx={{ 
    //     display: 'flex', 
    //     justifyContent: 'center', 
    //     alignItems: 'center', 
    //     height: '100vh',
    //     bgcolor: '#f5f5f5',
    //     flexDirection: 'column',
    //     gap: 2
    //   }}>
    //     <Typography variant="h6" color="error">Error: {error}</Typography>
    //     <Button variant="contained" onClick={() => window.location.reload()}>
    //       Retry
    //     </Button>
    //   </Box>
    // );
  }

  //初步完成，待优化
  const renderBasicDataSection = () => (
    <Box>
      {/* SKU Data */}
      {Array.isArray(productData?.skuData) && productData.skuData.length >= 2 && (
        <>
          <Typography ref={skuDataTitleRef} variant="h6" sx={{ mb: 2, fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
           {tableData?.title|| 'SKU Data'}
          </Typography>
          {productData.skus && productData.skus.length > 0 && (
            <Box sx={{ mb: 3, mt: 3.5 }}>
              <UnifiedSkuTable 
                data={productData.skus} 
                variant="detail" 
                showStandard={true} 
              />
            </Box>
          )}
        </>
      )}

      {/* Basic Data */}
      <Typography ref={basicDataTitleRef} variant="h6" sx={{ mb: 2 , fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 580, color:'#4d4d4d' }}>
        {basicFormData?.title || 'Basic Data'}
      </Typography>
      {basicFormItems && basicFormItems.length > 0 && (
        <Box sx={{ mb: 3, mt: 3 }}>
          <Form
            columns={basicFormData?.columnType || "double"}
            items={basicFormItems}
          />
        </Box>
      )}

      {/* SAP Detail */}
      {basicTab === 'MarketingBasic' && (
        <>
          <Typography ref={sapDetailTitleRef} variant="h6" sx={{ mb: 2, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
            {sapFormData?.title || 'SAP Detail'}
          </Typography>
          {sapFormItems && sapFormItems.length > 0 && (
            <Box sx={{ mb: 3, mt: 3 }}>
              <Form
                columns={sapFormData?.columnType || "single"}
                items={sapFormItems}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );

  //初步完成，待优化
  const renderMarketingDataSection = () => (
    <Box>
      {/* Marketing Copy */}
      <SectionHeader
        titleRef={marketingCopyTitleRef}
        title={marketingFormData?.title || 'Marketing Copy'}
        showView={marketingFormData?.show}
        showDownload={marketingFormData?.download}
        downloadText="Download Languages"
        onViewClick={() => {/* 查看语言功能 */}}
        onDownloadClick={() => {/* 下载语言功能 */}}
      />
      {marketingFormItems && marketingFormItems.length > 0 && (
        <Box sx={{ mb: 3, mt: 3 }}>
          <Form
            columns={marketingFormData?.columnType || "single"}
            items={marketingFormItems}
          />
        </Box>
      )}
      {/* Icons & Pictures */}
      <SectionHeader
        titleRef={iconsPicturesTitleRef}
        title={iconsAndPicturesData?.title || 'Icons & Pictures'}
        showDownload={iconsAndPicturesData?.download}
        onDownloadClick={() => {/* 下载所有图标功能 */}}
      />
      {productData.iconsPictures?.icons && productData.iconsPictures.icons.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Image 
            type={ iconsAndPicturesData?.type || "simple"}
            images={productData.iconsPictures.icons.map(icon => ({
              src: icon.thumbnailUrl? `https://pim-test.kendo.com${icon.thumbnailUrl}` : image1,
              alt: icon.type || ''
            }))}
            onImageClick={handleImageClick}
          />
        </Box>
      )}     
      {/* QR Codes */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 4,
        mb: 3.5
      }}>
        {/* 标题 */}
        <Typography ref={qrCodesTitleRef} sx={{
          color: '#4d4d4d',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '24.5px',
          fontWeight: 520
        }}>
          {qrCodesData?.title || 'QR Codes'}
        </Typography>

        {/* 操作按钮 */}
        {qrCodesData?.download && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* 下载语言按钮 */}
            <Button
              variant="outlined"
              startIcon={
                <Box component="img" src={downloadIcon} alt="download" sx={{ width: 20, height: 20, display: 'block' }} />
              }
              onClick={() => console.log('Download languages clicked')}
              sx={{
                ...styles.topButtonBase,
                bgcolor: '#ffffff',
                borderColor: '#cccccc',
                color: '#333333',
                px: 2,
                width: 'auto',
                minWidth: '160px',
                '&:hover': { bgcolor: '#eaeaea', borderColor: '#cccccc', color: '#000000' }
              }}
            >
              Download All
            </Button>
          </Box>
        )}
      </Box>
      
      {/* QR Code Table */}
      {productData.qrCodes?.qrCodes && productData.qrCodes.qrCodes.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <UnifiedInfoTable 
            type="qrcode"
            data={productData.qrCodes.qrCodes.map(qr => ({
              // image: qr.imageUrl ? `https://pim-test.kendo.com${qr.imageUrl}` : qrImage1,
              name: qr.name || '',
              link: qr.link || ''
            }))}
            onLinkClick={handleQRLinkClick}
            onImageClick={handleQRImageClick}
          />
        </Box>
      )}
      
      {/* EANS */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 4,
        mb: 3.5
      }}>
        {/* 标题 */}
        <Typography ref={eansTitleRef} sx={{
          color: '#4d4d4d',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '24.5px',
          fontWeight: 520
        }}>
          {eansData?.title || 'EANS'}
        </Typography>

        {/* 操作按钮 */}
        {eansData?.download && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* 下载语言按钮 */}
            <Button
              variant="outlined"
              startIcon={
                <Box component="img" src={downloadIcon} alt="download" sx={{ width: 20, height: 20, display: 'block' }} />
              }
              onClick={() => console.log('Download languages clicked')}
              sx={{
                ...styles.topButtonBase,
                bgcolor: '#ffffff',
                borderColor: '#cccccc',
                color: '#333333',
                px: 2,
                width: 'auto',
                minWidth: '160px',
                '&:hover': { bgcolor: '#eaeaea', borderColor: '#cccccc', color: '#000000' }
              }}
            >
              Download All
            </Button>
          </Box>
        )}
      </Box>
      
      {/* EAN Code Table */}
      {productData.eans?.eans && productData.eans.eans.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <UnifiedInfoTable 
            type="barcode"
            data={productData.eans.eans.map(ean => ({
              // image: ean.imageUrl ? `https://pim-test.kendo.com${ean.imageUrl}` : eanImage1,
              name: ean.name || '',
              eanCode: ean.eanCode || ''
            }))}
            onImageClick={handleEANImageClick}
          />
        </Box>
      )}
    </Box>
  );

  const renderReferencesRelationshipsSection = () => (
    <Box>
      {/* Bundles */}
      <Typography ref={bundlesTitleRef} variant="h6" sx={{ mb: 2.5, fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520}}>
        {bundlesData?.title || 'Bundles'}
      </Typography>
      
      {/* Bundles Product Grid */}
      {productData.referenceRelationship?.bundles && productData.referenceRelationship.bundles.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          <ProductCardGrid 
            products={productData.referenceRelationship.bundles.map(bundle => ({
              image: bundle.imageUrl ? `https://pim-test.kendo.com${bundle.imageUrl}` : bundleImage1,
              name: bundle.productName || '',
              code: bundle.productNumber || ''
            }))}
            onProductClick={(product, index) => console.log('Bundle Product clicked:', product, index)}
            onImageClick={(product, index) => console.log('Bundle Image clicked:', product, index)}
          />
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          <ProductCardGrid 
            products={[]}
            onProductClick={(product, index) => console.log('Bundle Product clicked:', product, index)}
            onImageClick={(product, index) => console.log('Bundle Image clicked:', product, index)}
          />
        </Box>
      )}

      {/* Components */}
      <Typography ref={componentsTitleRef} variant="h6" sx={{ mb: 2.5 , fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 580 }}>
        {componentsData?.title || 'Components'}
      </Typography>
      
      {/* Components Product Grid */}
      {productData.referenceRelationship?.components && productData.referenceRelationship.components.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          <ProductCardGrid 
            products={productData.referenceRelationship.components.map(component => ({
              image: component.imageUrl ? `https://pim-test.kendo.com${component.imageUrl}` : componentImage1,
              name: component.productName || '',
              code: component.productNumber || ''
            }))}
            onProductClick={(product, index) => console.log('Component Product clicked:', product, index)}
            onImageClick={(product, index) => console.log('Component Image clicked:', product, index)}
          />
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          <ProductCardGrid 
            products={[]}
            onProductClick={(product, index) => console.log('Component Product clicked:', product, index)}
            onImageClick={(product, index) => console.log('Component Image clicked:', product, index)}
          />
        </Box>
      )}

      {/* Accessories */}
      <Typography ref={accessoriesTitleRef} variant="h6" sx={{ mb: 2.5, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520}}>
        {accessoriesData?.title || 'Accessories'}
      </Typography>
      
      {/* Accessories Table */}
      <Box sx={{ mb: 3 }}>
        <UnifiedInfoTable 
          type={"accessory"}
          data={productData.referenceRelationship?.accessories?.map(accessory => ({
            image: accessory.imageUrl ? `https://pim-test.kendo.com${accessory.imageUrl}` : accessoryImage1,
            model: accessory.model || '',
            name: accessory.name || '',
            quantity: accessory.quantity || ''
          })) || []}
          onImageClick={(item, index) => console.log('Accessory Image clicked:', item, index)}
        />
      </Box>
    </Box>
  );

  const renderPackagingLogisticsSection = () => (
    <Box>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 3.5,
        mb: 3.5
      }}>
        {/* 标题 */}
        <Typography ref={packagingDataTitleRef} sx={{
          color: '#4d4d4d',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '24.5px',
          fontWeight: 520
        }}>
          {packagingData?.[0]?.title || 'Packaging Data'}
        </Typography>

        {/* 操作按钮组 */}
        {packagingData?.[0]?.download && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* 下载语言按钮 */}
            <Button
              variant="outlined"
              startIcon={
                <Box component="img" src={downloadIcon} alt="download" sx={{ width: 20, height: 20, display: 'block' }} />
              }
              onClick={() => console.log('Download languages clicked')}
              sx={{
                ...styles.topButtonBase,
                bgcolor: '#ffffff',
                borderColor: '#cccccc',
                color: '#333333',
                px: 2,
                width: 'auto',
                minWidth: '200px',
                '&:hover': { bgcolor: '#eaeaea', borderColor: '#cccccc', color: '#000000' }
              }}
            >
              Download
            </Button>
          </Box>
        )}
      </Box>
      
      {/* Packaging Table */}
      <Box sx={{ mb: 3 }}>
        <PackagingTable 
          data={productData.packagingData?.rows?.map(row => ({
            values: row || []
          })) || []}
          columns={productData.packagingData?.headers || []}
        />
      </Box>
    </Box>
  );

  const renderUSPSBenefitsSection = () => (
    <Box>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 3.5,
        mb: 3.5
      }}>
        {/* 标题 */}
        <Typography ref={packagingSpecTitleRef} sx={{
          color: '#4d4d4d',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '24.5px',
          fontWeight: 520
        }}>
          {specificationData?.[0]?.title || 'Packaging & Spec'}
        </Typography>

        {/* 操作按钮组 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* 查看语言按钮 */}
          {specificationData?.[0]?.show && (
            <Button
              variant="outlined"
              startIcon={
                <Box component="img" src={ViewIcon} alt="view" sx={{ width: 20, height: 20, display: 'block' }} />
              }
              onClick={() => console.log('Show languages clicked')}
              sx={{
                ...styles.topButtonBase,
                bgcolor: '#ffffff',
                borderColor: '#cccccc',
                color: '#333333',
                px: 2,
                width: 'auto',
                minWidth: '160px',
                '&:hover': { bgcolor: '#eaeaea', borderColor: '#cccccc', color: '#000000' }
              }}
            >
              Show Languages
            </Button>
          )}

          {/* 下载语言按钮 */}
          {specificationData?.[0]?.download && (
            <Button
              variant="outlined"
              startIcon={
                <Box component="img" src={downloadIcon} alt="download" sx={{ width: 20, height: 20, display: 'block' }} />
              }
              onClick={() => console.log('Download languages clicked')}
              sx={{
                ...styles.topButtonBase,
                bgcolor: '#ffffff',
                borderColor: '#cccccc',
                color: '#333333',
                px: 2,
                width: 'auto',
                minWidth: '200px',
                '&:hover': { bgcolor: '#eaeaea', borderColor: '#cccccc', color: '#000000' }
              }}
            >
              Download Languages
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Specification Table */}
      <Box sx={{ mb: 3 }}>
        <SpecificationTable 
          data={[
            {
              title: 'TECHNICAL SPECS',
              icon: 'straighten',
              items: productData.packagingSpec?.technicalSpecs?.map(spec => ({
                feature: spec.featureName || '',
                value: spec.value || '',
                unit: spec.unit || '',
                showQuestion: true
              })) || []
            },
            ...(basicTab === 'MarketingBasic' ? [{
              title: 'LOGO MARKING',
              icon: 'category',
              items: productData.packagingSpec?.logoMarking?.map(logo => ({
                feature: logo.featureName || '',
                value: logo.value || '',
                unit: '',
                showQuestion: true
              })) || []
            }] : [])
          ]}
          columns={['Feature Name', 'Value', 'Unit']}
        />
      </Box>
    </Box>
  );

  const renderMarketingCollateralsSection = () => (
    <Box>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 3.5,
        mb: 3.5
      }}>
        {/* 标题 */}
        <Typography ref={onWhiteTitleRef} sx={{
          color: '#4d4d4d',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '24.5px',
          fontWeight: 520
        }}>
          {onWhiteData?.title || 'On White'}
        </Typography>

        {/* 操作按钮 */}
        {onWhiteData?.download && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* 下载语言按钮 */}
            <Button
              variant="outlined"
              startIcon={
                <Box component="img" src={downloadIcon} alt="download" sx={{ width: 20, height: 20, display: 'block' }} />
              }
              onClick={() => console.log('Download languages clicked')}
              sx={{
                ...styles.topButtonBase,
                bgcolor: '#ffffff',
                borderColor: '#cccccc',
                color: '#333333',
                px: 2,
                width: 'auto',
                minWidth: '160px',
                '&:hover': { bgcolor: '#eaeaea', borderColor: '#cccccc', color: '#000000' }
              }}
            >
              Download All
            </Button>
          </Box>
        )}
      </Box>
      {/* On White Images */}
      {productData.marketingCollaterals?.onWhite && productData.marketingCollaterals.onWhite.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Image 
            type={ onWhiteData?.type || "gallery"}
            mainImage={{
              src: `https://pim-test.kendo.com${productData.marketingCollaterals.onWhite[0].thumbnailUrl}`,
              alt: productData.marketingCollaterals.onWhite[0].altText || '',
              fileName: productData.marketingCollaterals.onWhite[0].fileName || ''
            }}
            thumbnailImages={productData.marketingCollaterals.onWhite.map((img) => ({
              src: `https://pim-test.kendo.com${img.thumbnailUrl}`,
              alt: img.altText || '',
              fileName: img.fileName || '',
              basicInfo: img.basicInfo || {},
              technical: img.technical || {},
              downloadUrl: img.downloadUrl || '',
              imageUrl: img.imageUrl || '',
              keywords: Array.isArray(img.keywords) ? img.keywords : []
            }))}
            // 标签映射
            infoLabels={{
              basic: [
                { key: 'modelNumber', label: 'Model Number' },
                { key: 'imageType', label: 'Image Type' },
                { key: 'lockDate', label: 'Lock Date' },
                { key: 'countryRestrictions', label: 'Country Restrictions' },
                { key: 'usageRights', label: 'Usage Rights' },
                { key: 'approvalStatus', label: 'Approval Status' }
              ],
              technical: [
                { key: 'colorSpace', label: 'Color Space' },
                { key: 'colorProfile', label: 'Color Profile' },
                { key: 'resolution', label: 'Resolution' },
                { key: 'dimensions', label: 'Dimensions' },
                { key: 'size', label: 'Size' },
                { key: 'createdOn', label: 'Created On' },
                { key: 'changeDate', label: 'Change Date' }
              ]
            }}
            onImageSelect={(image, index) => console.log('On White selected:', index, image)}
          />
        </Box>
      )}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 3.5,
        mb: 3.5
      }}>
        {/* 标题 */}
        <Typography ref={actionLifestyleTitleRef} sx={{
          color: '#4d4d4d',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '24.5px',
          fontWeight: 520
        }}>
          {actionAndLifestyleData?.title || 'Action & Lifestyle'}
        </Typography>

        {/* 操作按钮 */}
        {actionAndLifestyleData?.download && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* 下载语言按钮 */}
            <Button
              variant="outlined"
              startIcon={
                <Box component="img" src={downloadIcon} alt="download" sx={{ width: 20, height: 20, display: 'block' }} />
              }
              onClick={() => console.log('Download languages clicked')}
              sx={{
                ...styles.topButtonBase,
                bgcolor: '#ffffff',
                borderColor: '#cccccc',
                color: '#333333',
                px: 2,
                width: 'auto',
                minWidth: '160px',
                '&:hover': { bgcolor: '#eaeaea', borderColor: '#cccccc', color: '#000000' }
              }}
            >
              Download All
            </Button>
          </Box>
        )}
      </Box>
      {/* Action & Lifestyle Images */}
      {productData.marketingCollaterals?.actionLifestyle && productData.marketingCollaterals.actionLifestyle.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Image 
            type={ actionAndLifestyleData?.type || "gallery"}
            mainImage={{
              src: `https://pim-test.kendo.com${productData.marketingCollaterals.actionLifestyle[0].thumbnailUrl}`,
              alt: productData.marketingCollaterals.actionLifestyle[0].altText || '',
              fileName: productData.marketingCollaterals.actionLifestyle[0].fileName || ''
            }}
            thumbnailImages={productData.marketingCollaterals.actionLifestyle.map((img) => ({
              src: `https://pim-test.kendo.com${img.thumbnailUrl}`,
              alt: img.altText || '',
              fileName: img.fileName || '',
              basicInfo: img.basicInfo || {},
              technical: img.technical || {},
              downloadUrl: img.downloadUrl || '',
              imageUrl: img.imageUrl || ''
            }))}
            onImageSelect={(image, index) => console.log('Action & Lifestyle selected:', index, image)}
          />
        </Box>
      )}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 3.5,
        mb: 3.5
      }}>
        {/* 标题 */}
        <Typography ref={videosTitleRef} sx={{
          color: '#4d4d4d',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '24.5px',
          fontWeight: 520
        }}>
          {mediaData?.[0]?.title || 'Videos'}
        </Typography>

        {/* 操作按钮 */}
        {mediaData?.[0]?.download && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* 下载语言按钮 */}
            <Button
              variant="outlined"
              startIcon={
                <Box component="img" src={downloadIcon} alt="download" sx={{ width: 20, height: 20, display: 'block' }} />
              }
              onClick={() => console.log('Download languages clicked')}
              sx={{
                ...styles.topButtonBase,
                bgcolor: '#ffffff',
                borderColor: '#cccccc',
                color: '#333333',
                px: 2,
                width: 'auto',
                minWidth: '160px',
                '&:hover': { bgcolor: '#eaeaea', borderColor: '#cccccc', color: '#000000' }
              }}
            >
              Download All
            </Button>
          </Box>
        )}
      </Box>

      {/* Videos Media List */}
      <Box sx={{ mb: 3 }}>
        <MediaListTable
          data={productData.marketingCollaterals?.videos?.map(video => ({
            image: video.thumbnailUrl ? `https://pim-test.kendo.com${video.thumbnailUrl}` : '',
            name: video.videoTitle || '',
            language: video.language || '',
            type: video.type || '',
            format: video.format || '',
            duration: video.duration || '',
            downloadUrl: video.downloadUrl || '',
            videoUrl: video.downloadUrl ? `https://pim-test.kendo.com${video.downloadUrl}` : ''
          })) || []}
          onViewClick={(item) => {
            if (item.videoUrl) {
              window.open(item.videoUrl, '_blank');
            } else {
              console.log('No video URL available for:', item);
            }
          }}
          onDownloadClick={(item) => {
            if (item.videoUrl) {
              const link = document.createElement('a');
              link.href = item.videoUrl;
              link.download = item.name || 'video';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              console.log('No download URL available for:', item);
            }
          }}
        />
      </Box>
    </Box>
    
  );


  const renderAfterServiceSection = () => (
    <Box>
      {/* Manuals */}
      <Typography ref={manualsTitleRef} variant="h6" sx={{ mb: 3.5, fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d'}}>
        {manualsData?.title || 'Manuals'}
      </Typography>
      {productData.afterService?.manuals && productData.afterService.manuals.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {afterServiceAssets.manuals.map((asset, idx) => (
            <DigitalAssetCard 
              key={`manuals-${idx}`}
              product={asset}
              cardActionsConfig={{
                show_file_type: false,
                show_eyebrow: true,
                show_open_pdf: false,
                show_open_product_page: false,
                show_preview_media: asset.show || true
              }}
              onDownload={() => console.log('download manuals', idx)}
            />
          ))}
        </Box>
      )}

      {/* Repair  Guide*/}
      <Typography ref={repairGuideTitleRef} variant="h6" sx={{ mb: 3.5 , fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 580, color:'#4d4d4d' }}>
        {repairGuidesData?.title || 'Repair Guide'}
      </Typography>
      {productData.afterService?.repairGuide && productData.afterService.repairGuide.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {afterServiceAssets.repairGuides.map((asset, idx) => (
            <DigitalAssetCard 
              key={`repair-guide-${idx}`}
              product={asset}
              cardActionsConfig={{
                show_file_type: false,
                show_eyebrow: true,
                show_open_pdf: false,
                show_open_product_page: false,
                show_preview_media: asset.show || true
              }}
              onDownload={() => console.log('download repair guide', idx)}
            />
          ))}
        </Box>
      )}

      {/* Packaging */}
      {basicTab === 'MarketingBasic' && (
        <>
          <Typography ref={packagingTitleRef} variant="h6" sx={{ mb: 3.5, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
            {packagingsData?.title || 'Packaging'}
          </Typography>
          {productData.afterService?.packaging && productData.afterService.packaging.length > 0 && (
            <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {afterServiceAssets.packagings.map((asset, idx) => (
                <DigitalAssetCard 
                  key={`packaging-${idx}`}
                  product={asset}
                  cardActionsConfig={{
                    show_file_type: false,
                    show_eyebrow: true,
                    show_open_pdf: false,
                    show_open_product_page: false,
                    show_preview_media: asset.show || true
                  }}
                  onDownload={() => console.log('download packaging', idx)}
                />
              ))}
            </Box>
          )}
        </>
      )}

      {/* Drawing */}
      <Typography ref={drawingTitleRef} variant="h6" sx={{ mb: 3.5, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
        {drawingsData?.title || 'Drawing'}
      </Typography>
      {productData.afterService?.drawing && productData.afterService.drawing.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {afterServiceAssets.drawings.map((asset, idx) => (
            <DigitalAssetCard 
              key={`drawing-${idx}`}
              product={asset}
              cardActionsConfig={{
                show_file_type: false,
                show_eyebrow: true,
                show_open_pdf: false,
                show_open_product_page: false,
                show_preview_media: asset.show || true
              }}
              onDownload={() => console.log('download drawing', idx)}
            />
          ))}
        </Box>
      )}

      {/* Patent */}
      <Typography ref={patentTitleRef} variant="h6" sx={{ mb: 3.5, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
        {patentData?.title || 'Patent'}
      </Typography>
      {productData.afterService?.patent && productData.afterService.patent.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {afterServiceAssets.patents.map((asset, idx) => (
            <DigitalAssetCard 
              key={`patent-${idx}`}
              product={asset}
              cardActionsConfig={{
                show_file_type: false,
                show_eyebrow: true,
                show_open_pdf: false,
                show_open_product_page: false,
                show_preview_media: asset.show || true
              }}
              onDownload={() => console.log('download patent', idx)}
            />
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      bgcolor: '#f5f5f5',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000
    }}>
      {/* 左侧导航 */}
      <ProductSidebar
        navigationItems={navigationItems}
        expandedSections={expandedSections}
        onSectionToggle={handleSectionToggle}
        onNavigate={handleNavigate}
        brandName={currentBrand?.toUpperCase() || "KENDO"}
      />

      {/* 右侧内容 */}
      <Box sx={{ 
        flex: 1, 
        bgcolor: '#f5f5f5', 
        overflow: 'auto',
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        '&::-moz-scrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }} ref={contentScrollRef} data-scroll-container>
        <Box sx={{ 
          px: { xs: 2, sm: 3, md: 4 }, 
          pt: 0, 
          pb: 0, 
          maxWidth: { xs: '100%', sm: 800, md: 1000, lg: 1100, xl: 1188 }, 
          minWidth: 1188,
          mx: 'auto',
          overflow: 'hidden'
        }}>
          <Box sx={{ bgcolor: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #eee', p: 0, pb: 3, width: '100%', position: 'relative' }}>
            {/* 最顶部功能栏 */}
            <TopActionsBar />

          {/* share / file_export / download */}
          <ToolIconsBar onShare={handleShare} onExport={handleExport} onDownload={handleDownload} />

          <Box sx={{ p: 3 }}>
          {renderProductDataSection()}

          {/* 主要功能区块 */}
          <MainSection 
            icon={documentIcon} 
            title={sectionTitles.basicSection}
            primaryColor={primaryColor}
            isFirst={true}
          >
            {renderBasicDataSection()}
          </MainSection>

          <MainSection 
            icon={marketingIcon} 
            title={sectionTitles.marketingSection}
            primaryColor={primaryColor}
          >
            {renderMarketingDataSection()}
          </MainSection>

          <MainSection 
            icon={referIcon} 
            title={sectionTitles.referencesSection}
            primaryColor={primaryColor}
          >
            {renderReferencesRelationshipsSection()}
          </MainSection>

          <MainSection 
            icon={packIcon} 
            title={sectionTitles.packagingSection}
            primaryColor={primaryColor}
          >
            {renderPackagingLogisticsSection()}
          </MainSection>

          <MainSection 
            icon={specIcon} 
            title={sectionTitles.uspsSection}
            primaryColor={primaryColor}
          >
            {renderUSPSBenefitsSection()}
          </MainSection>

          <MainSection 
            icon={labelIcon} 
            title={sectionTitles.marketingCollateralsSection}
            primaryColor={primaryColor}
          >
            {renderMarketingCollateralsSection()}
          </MainSection>

          <MainSection 
            icon={serviceIcon} 
            title={sectionTitles.afterServiceSection}
            primaryColor={primaryColor}
          >
            {renderAfterServiceSection()}
          </MainSection>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Toast通知 */}
      {toast.show && (
        <Box
          sx={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: `${primaryColor}`,
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 500,
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            animation: 'fadeInDown 0.3s ease-out',
            '@keyframes fadeInDown': {
              from: {
                opacity: 0,
                transform: 'translateX(-50%) translateY(-20px)',
              },
              to: {
                opacity: 1,
                transform: 'translateX(-50%) translateY(0)',
              },
            },
          }}
        >
          {toast.message}
        </Box>
      )}

      {/* Back to Top Button */}
      <BackToTopButton />
    </Box>
  );
};

export default ProductDetailPage;
