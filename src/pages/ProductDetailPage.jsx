import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductDetailApiService from '../services/productDetailApi';
import { useTheme } from '../hooks/useTheme';
import { useBrand } from '../hooks/useBrand';
import { usePdpPage } from '../hooks/usePdpPage';
import { selectCurrentLanguage } from '../store/slices/themesSlice';
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
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
  // 从Redux获取数据
  const { primaryColor, currentBrand } = useTheme();
  const { currentBrandCode } = useBrand();
  const currentLanguage = useSelector(selectCurrentLanguage);

  // 使用自定义 Hook 获取 PDP 页面数据
  const pdpPageData = usePdpPage(currentBrandCode);

  // 简化的数据提取函数
  const getPdpPageData = React.useMemo(() => {
    const page = pdpPageData?.pages && pdpPageData.pages.length > 0 ? pdpPageData.pages[0] : null;
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
        mediaWidgets: []
      };
    }

    // 数据映射器 - 类似 Brandbook 的模式
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
        raw: block
      }),
      
      'pdp-page.form': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        columnType: block.columnType,
        show: block.showLanguages,
        download: block.showDownload,
        raw: block
      }),
      
      'pdp-page.image-widget': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        download: block.showDownload,
        type: block.type,
        raw: block
      }),

      'pdp-page.code-widget': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        download: block.showDownload,
        type: block.type,
        raw: block
      }),
      
      'pdp-page.reference-list-widget': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        type: block.type,
        raw: block
      }),
      
      'pdp-page.packaging-widget': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        download: block.showDownload,
        raw: block
      }),

      'pdp-page.specification-widget': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        show: block.showLanguages,
        download: block.showDownload,
        raw: block
      }),
      
      'pdp-page.media-widget-list': (block) => ({
        id: block.id,
        title: block.title,
        fields: block.fields || [],
        show: block.showPreview,
        download: block.showDownload,
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
      mediaWidgets: []
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
          default:
            console.warn('Unknown component type:', componentType);
        }
      }
    });

    return result;
  }, [pdpPageData]);


  //productCardData待处理
  const productCardData = getPdpPageData.productCard;
  
  // 提取字段标题
  const PRODUCT_FIELDS = (productCardData?.fields || [])
    .filter(field => field.type === 'Field')
    .map(field => field.title);

  //待处理数据
  const tableData = getPdpPageData.table;
  const basicFormData = getPdpPageData.forms?.find(form => form.title === 'Basic Data');
  const sapFormData = getPdpPageData.forms?.find(form => form.title === 'SAP Detail');
  const marketingFormData = getPdpPageData.forms?.find(form => form.title === 'Marketing Copy');
  const iconsAndPicturesData = getPdpPageData.images?.find(image => image.title === 'Icons & Pictures');
  const onWhiteData = getPdpPageData.images?.find(image => image.title === 'On White');
  const actionAndLifestyleData = getPdpPageData.images?.find(image => image.title === 'Action & Lifestyle');
  const qrCodesData = getPdpPageData.codes?.find(code => code.title === 'QR Codes');
  const eansData = getPdpPageData.codes?.find(code => code.title === 'EANS');
  const bundlesData = getPdpPageData.referenceLists?.find(referenceList => referenceList.title === 'Bundles');
  const componentsData = getPdpPageData.referenceLists?.find(referenceList => referenceList.title === 'Components');
  const accessoriesData = getPdpPageData.referenceLists?.find(referenceList => referenceList.title === 'Accessories');
  const packagingData = getPdpPageData.packagingWidgets;
  const specificationData = getPdpPageData.specificationWidgets;
  const mediaData = getPdpPageData.mediaWidgets;
  


  // 路由参数 id 与产品数据状态
  const { id: routeProductId } = useParams();
  
  // 添加加载和错误状态
  const [loading, setLoading] = useState(true);
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
      productClassification: '-',
      productType: 'Accessory',
      countryOfOrigin: 'China',
      modelNumber: '90330',
      warranty: '1 Year',
      version: '1.0',
      lastChangedOn: '2025-01-01',
      customerFacingModel: '90330',
      lifecycleStatus: 'Active',
      productSeries: 'Roller Cabinet',
      enrichmentStatus: 'Local Data Ready',
      sellable: 'Yes',
      firstShippingDate: '2025-01-01',
      recognition: '-',
      createdOn: '2025-01-01'
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

  // 调试信息 - 仅在开发环境启用 (移到productData定义之后)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Strapi PDP Page Data:', getPdpPageData);
      console.log('Product Card Strapi Config:', productCardData);
      console.log('SAP Form Strapi Config:', sapFormData);
      console.log('Table Data:', tableData);
      console.log('完整PIM数据结构:', productData);
      console.log('ProductCard特定调试:');
      console.log('ProductCard Fields从Strapi:', productCardData?.fields);
      console.log('ProductCardInfo从PIM:', productData.productCardInfo);
      console.log('Status从兼容层:', productData.status);
    }
  }, [getPdpPageData, productCardData, tableData, sapFormData, productData]);

  //方法，方法
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
      // 支持嵌套路径，如 'basicData.brand' 或 'marketingData.categoryBullets'
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

  // 完整的字段路径映射 - 支持PIM接口数据结构
  const getFieldPath = React.useCallback((fieldName, context) => {
    // 详细的字段路径映射表 - 基于PIM接口返回结构
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
      brand: 'basicData.brand',
      region: 'basicData.region',
      productType: 'basicData.productType',
      modelNumber: 'basicData.modelNumber',
      version: 'basicData.version',
      customerFacingModel: 'basicData.customerFacingModel',
      productSeries: 'basicData.productSeries',
      sellable: 'basicData.sellable',
      recognition: 'basicData.recognition',
      productClassification: 'basicData.productClassification',
      countryOfOrigin: 'basicData.countryOfOrigin',
      warranty: 'basicData.warranty',
      lastChangedOn: 'basicData.lastChangedOn',
      firstShippingDate: 'basicData.firstShippingDate',
      createdOn: 'basicData.createdOn',
      
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
    
    // 否则按约定生成路径 (兼容原有逻辑)
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

  // 优化后的SAP映射 - 基于正确的映射方式进行改进
  const sapValueGetterMap = React.useMemo(() => {
    // 如果有Strapi配置，尝试使用动态映射
    if (sapFormData?.fields && sapFormData.fields.length > 0) {
      const dynamicMap = buildGetterMap(sapFormData.fields, 'sap');
      // 验证动态映射是否有效
      if (Object.keys(dynamicMap).length > 0) {
        return dynamicMap;
      }
    }
    
    // 回退到优化前的正确映射方式
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
      
      if (import.meta.env.DEV) {
        console.log(`Field [${index}]: ${fieldName}`);
        console.log(`  - Label: ${label}`);
        console.log(`  - Getter exists: ${!!getter}`);
        console.log(`  - PIM Value: ${pimValue}`);
        console.log(`  - Compat Value: ${productData.status?.[fieldName]}`);
        console.log(`  - Final Value: ${finalValue}`);
      }
      
      return {
        label,
        value: finalValue,
        withStatus: field.withStatus ?? (index === 0) // 第一个字段默认显示状态
      };
    });
    
    if (import.meta.env.DEV) {
      console.log('🔍 Final ProductCard InfoPairs:', result);
    }
    return result;
  }, [productCardData, productCardValueGetterMap, productData]);



  // 简化版ProductCard配置
  const productCardConfig = React.useMemo(() => ({
    modelNumberField: productCardData?.modelNumberField || 'modelNumber',
    announcementPrefix: productCardData?.announcementPrefix || 'New Version Available:',
    statusText: productCardData?.statusText || 'In Development'
  }), [productCardData]);

  // After Service 图片 - 使用PIM数据 - 移动到这里避免Hook顺序问题
  const afterServiceAssets = React.useMemo(() => {
    const pimAfterService = productData.afterService;
    
    return {
      manuals: pimAfterService?.manuals?.[0] ? {
        image: pimAfterService.manuals[0].thumbnailUrl ? `https://pim-test.kendo.com${pimAfterService.manuals[0].thumbnailUrl}` : manualsImage,
        modelNumber: productData.basicData?.modelNumber || '',
        productType: productData.basicData?.productNumber || '',
        name: pimAfterService.manuals[0].title || ''
      } : {
        image: manualsImage,
        modelNumber: '',
        productType: '',
        name: ''
      },
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

  // 避免在多个位置重复大小写/空格处理
  const normalize = React.useCallback((val) => (val ?? '').toString().trim().toUpperCase(), []);
  const makeKey = React.useCallback((sectionId, subItem) => `${normalize(sectionId)}|${normalize(subItem)}`, [normalize]);

  //声明所有可导航锚点的地方
  const navAnchorEntries = React.useMemo(() => ([
    // Basic Data
    ['basic-data', 'Sku Data', skuDataTitleRef],
    ['basic-data', 'Basic Data', basicDataTitleRef],
    ['basic-data', 'Sap Detail', sapDetailTitleRef],
    // Marketing Data
    ['marketing-data', 'Marketing Copy', marketingCopyTitleRef],
    ['marketing-data', 'Icons & Pictures', iconsPicturesTitleRef],
    ['marketing-data', 'Qr Codes', qrCodesTitleRef],
    ['marketing-data', 'Eans', eansTitleRef],
    // References & Relationships
    ['reference-relationship', 'Bundles', bundlesTitleRef],
    ['reference-relationship', 'Components', componentsTitleRef],
    ['reference-relationship', 'Accessories', accessoriesTitleRef],
    // Packaging & Logistics
    ['packaging-logistics', 'Packaging Data', packagingDataTitleRef],
    // USPS & Benefits
    ['usps-benefits', 'Packaging & Spec', packagingSpecTitleRef],
    // Marketing Collaterals
    ['marketing-collaterals', 'On white', onWhiteTitleRef],
    ['marketing-collaterals', 'Action & Lifestyle', actionLifestyleTitleRef],
    ['marketing-collaterals', 'Videos', videosTitleRef],
    // After Service
    ['after-service', 'Manuals', manualsTitleRef],
    ['after-service', 'Repair guide', repairGuideTitleRef],
    ['after-service', 'Packaging', packagingTitleRef],
    ['after-service', 'Drawing', drawingTitleRef],
    ['after-service', 'Patent', patentTitleRef]
  ]), []);

  // 获得目标 ref的地方
  const navTargetMap = React.useMemo(() => {
    const map = Object.create(null);
    navAnchorEntries.forEach(([sectionId, subItem, ref]) => {
      map[makeKey(sectionId, subItem)] = ref;
    });
    return map;
  }, [navAnchorEntries, makeKey]);

  const handleNavigate = (sectionId, subItem) => {
    const key = makeKey(sectionId, subItem);
    const container = contentScrollRef.current;
    const target = navTargetMap[key]?.current;
    if (!container || !target) return;
    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    const offsetTop = tRect.top - cRect.top + container.scrollTop - 12;
    container.scrollTo({ top: offsetTop, behavior: 'smooth' });
  };

  // 优化的事件处理函数 - 使用useCallback避免重复创建
  const handleShare = React.useCallback(() => { 
    console.log('share clicked'); 
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

  // EAN码处理
  const handleEANDownloadClick = React.useCallback((item, index) => {
    console.log('EAN Download clicked:', item, index);
  }, []);

  const handleEANImageClick = React.useCallback((item, index) => {
    console.log('EAN Image clicked:', item, index);
  }, []);

  // 样式常量 - 移到组件外部避免重复创建
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

  // 顶部动作栏组件
  const TopActionsBar = () => {
    const basicMenu = useMenu();
    const languageMenu = useMenu();
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
            sx={{ ...styles.topButtonBase, width: '160px' }}
          >
            Basic PDP
          </Button>
          <Menu
            anchorEl={basicMenu.anchorEl}
            open={basicMenu.open}
            onClose={basicMenu.closeMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <MenuItem onClick={basicMenu.closeMenu}>Basic PDP</MenuItem>
          </Menu>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Box component="img" src={languageIcon} alt="language" sx={styles.menuIcon} />}
            endIcon={<SmallTriangleIcon expanded={languageMenu.open} color="#000" />}
            onClick={languageMenu.openMenu}
            aria-haspopup="menu"
            aria-expanded={languageMenu.open ? 'true' : undefined}
            sx={{ ...styles.topButtonBase, width: '160px' }}
          >
            English
          </Button>
          <Menu
            anchorEl={languageMenu.anchorEl}
            open={languageMenu.open}
            onClose={languageMenu.closeMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <MenuItem onClick={languageMenu.closeMenu}>English</MenuItem>
          </Menu>
        </Box>
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
    console.log('🔍 PDP页面Redux数据状态:', {
      currentBrand: currentBrand,
      brandCode: currentBrandCode,
      currentLanguage: currentLanguage,
      primaryColor: primaryColor,
      pdpPageData: pdpPageData?.pages?.[0]
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
        setLoading(true);
        setError(null);
        
        const detail = await ProductDetailApiService.getProductDetail(routeProductId);
        
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
          afterService
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
    return () => { mounted = false; };
  }, [routeProductId]);

  


  const navigationItems = [
    {
      id: 'basic-data',
      title: 'BASIC DATA',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['Sku Data', 'Basic Data', 'Sap Detail']
    },
    {
      id: 'marketing-data',
      title: 'MARKETING DATA',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['Marketing Copy', 'Icons & Pictures', 'Qr Codes', 'Eans']
    },
    {
      id: 'reference-relationship',
      title: 'REFERENCE & RELATIONSHIP',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['Bundles', 'Components', 'Accessories']
    },
    {
      id: 'packaging-logistics',
      title: 'PACKAGING & LOGISTICS',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['Packaging Data']
    },
    {
      id: 'usps-benefits',
      title: 'USPS & BENEFITS',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['Packaging & Spec']
    },
    {
      id: 'marketing-collaterals',
      title: 'MARKETING COLLATERALS',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['On white', 'Action & Lifestyle', 'Videos']
    },
    {
      id: 'after-service',
      title: 'AFTER SERVICE',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['Manuals', 'Repair guide', 'Packaging', 'Drawing', 'Patent']
    }
  ];

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
          announcementPrefix={productCardConfig.announcementPrefix}
          announcementLinkText={productData.basicData?.productSeries}
          statusText={productCardConfig.statusText}
          modelNumber={
            productData.productCardInfo?.[productCardConfig.modelNumberField] ??
            productData.productCardInfo?.productNumber ??
            productData.basicData?.modelNumber ??
            productData.id
          }
          title={productData.productCardInfo?.productName || productData.name || "Product Title"}
          strapiData={productCardData}
          infoPairs={generateProductCardInfoPairs()}
          skuData={productData.skuData?.map((sku, index) => ({
            size: sku.size || '',
            material: sku.mainMaterial||'',
            finish: sku.surfaceFinish || '',
            // standard: sku.applicableStandard || '',
            imageUrl: sku.imageUrl || sku.image || (index === 0 ? productData.image : null)
          })) || []}
          infoLabelMinWidth="155px"
          infoValueMinWidth="118px"
          onDownloadClick={() => console.log('download clicked')} 
        />
      </Grid>
    </Grid>
  );

  if (import.meta.env.DEV) {
    console.log('productData111', productData);
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
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#f5f5f5',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h6" color="error">Error: {error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  //初步完成，待优化
  const renderBasicDataSection = () => (
    <Box>
      {/* SKU Data */}
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
    </Box>
  );

  //初步完成，待优化
  const renderMarketingDataSection = () => (
    <Box>
      {/* marketing copy */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 3,
        mb: 2
      }}>
        {/* 标题 */}
        <Typography ref={marketingCopyTitleRef} sx={{
          color: '#4d4d4d',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '24.5px',
          fontWeight: 520
        }}>
          {marketingFormData?.title || 'Marketing Copy'}
        </Typography>

        {/* 操作按钮组 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* 查看语言按钮 */}
          {marketingFormData?.show && (
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
          {marketingFormData?.download && (
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
      {marketingFormItems && marketingFormItems.length > 0 && (
        <Box sx={{ mb: 3, mt: 3 }}>
          <Form
            columns={marketingFormData?.columnType || "single"}
            items={marketingFormItems}
          />
        </Box>
      )}
      {/* Icons & Pictures */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 4,
        mb: 3.5
      }}>
        {/* 标题 */}
        <Typography ref={iconsPicturesTitleRef} sx={{
          color: '#4d4d4d',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '24.5px',
          fontWeight: 520
        }}>
          {iconsAndPicturesData?.title || 'Icons & Pictures'}
        </Typography>

        {/* 操作按钮 */}
        {iconsAndPicturesData?.download && (
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
            onDownloadClick={handleEANDownloadClick}
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
            {
              title: 'LOGO MARKING',
              icon: 'category',
              items: productData.packagingSpec?.logoMarking?.map(logo => ({
                feature: logo.featureName || '',
                value: logo.value || '',
                unit: '',
                showQuestion: true
              })) || []
            }
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
              imageUrl: img.imageUrl || ''
            }))}
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
        Manuals
      </Typography>
      {productData.afterService?.manuals && productData.afterService.manuals.length > 0 && afterServiceAssets.manuals.name && (
        <Box sx={{ mb: 3 }}>
          <DigitalAssetCard 
            product={afterServiceAssets.manuals}
            cardActionsConfig={{
              show_file_type: false,
              show_eyebrow: true,
              show_open_pdf: true,
              show_open_product_page: true,
              show_preview_media: true
            }}
            onDownload={() => console.log('download manuals')}
          />
        </Box>
      )}

      {/* Repair  Guide*/}
      <Typography ref={repairGuideTitleRef} variant="h6" sx={{ mb: 3.5 , fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 580, color:'#4d4d4d' }}>
        Repair Guide
      </Typography>
      {productData.afterService?.repairGuide && productData.afterService.repairGuide.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {afterServiceAssets.repairGuides.map((asset, idx) => (
            <DigitalAssetCard 
              key={`repair-guide-${idx}`}
              product={asset}
              onDownload={() => console.log('download repair guide', idx)}
            />
          ))}
        </Box>
      )}

      {/* Packaging */}
      <Typography ref={packagingTitleRef} variant="h6" sx={{ mb: 3.5, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
        Packaging
      </Typography>
      {productData.afterService?.packaging && productData.afterService.packaging.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {afterServiceAssets.packagings.map((asset, idx) => (
            <DigitalAssetCard 
              key={`packaging-${idx}`}
              product={asset}
              onDownload={() => console.log('download packaging', idx)}
            />
          ))}
        </Box>
      )}

      {/* Drawing */}
      <Typography ref={drawingTitleRef} variant="h6" sx={{ mb: 3.5, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
        Drawing
      </Typography>
      {productData.afterService?.drawing && productData.afterService.drawing.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {afterServiceAssets.drawings.map((asset, idx) => (
            <DigitalAssetCard 
              key={`drawing-${idx}`}
              product={asset}
              onDownload={() => console.log('download drawing', idx)}
            />
          ))}
        </Box>
      )}

      {/* Patent */}
      <Typography ref={patentTitleRef} variant="h6" sx={{ mb: 3.5, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
        Patent
      </Typography>
      {productData.afterService?.patent && productData.afterService.patent.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {afterServiceAssets.patents.map((asset, idx) => (
            <DigitalAssetCard 
              key={`patent-${idx}`}
              product={asset}
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
      }} ref={contentScrollRef}>
        <Box sx={{ 
          px: { xs: 2, sm: 3, md: 4 }, 
          pt: 0, 
          pb: 0, 
          maxWidth: { xs: '100%', sm: 800, md: 1000, lg: 1100, xl: 1188 }, 
          // minWidth: { xs: '100%', sm: 800, md: 1000 }, 
          // maxWidth: 1188,
          minWidth: 1188,
          mx: 'auto',
          // width: '100%',
          overflow: 'hidden'
        }}>
          <Box sx={{ bgcolor: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #eee', p: 0, pb: 3, width: '100%' }}>
            {/* 最顶部功能栏 */}
            <TopActionsBar />

          {/* share / file_export / download */}
          <ToolIconsBar onShare={handleShare} onExport={handleExport} onDownload={handleDownload} />

          <Box sx={{ p: 3 }}>
          {renderProductDataSection()}

          {/* Basic Data 部分 */}
          <Box sx={{ mt: 12 }}>
            <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: '30px',fontFamily: '"Roboto", sans-serif',fontWeight: 900 }}>
              <Box component='img' src={documentIcon} alt='document' sx={{ width: 36, height: 36}} />
              Basic Data
            </Typography>
            {renderBasicDataSection()}
          </Box>

          {/* Marketing Data 部分 */}
          <Box sx={{ mt: 11 }}>
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: '30px',fontFamily: '"Roboto", sans-serif',fontWeight: 900 }}>
            <Box component='img' src={marketingIcon} alt='marketing' sx={{ width: 36, height: 36}} />
            Marketing Data
          </Typography>
            {renderMarketingDataSection()}
          </Box>

          {/* References & Relationships 部分 */}
          <Box sx={{ mt: 11 }}>
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: '30px',fontFamily: '"Roboto", sans-serif',fontWeight: 900 }}>
            <Box component='img' src={referIcon} alt='refer' sx={{ width: 36, height: 36}} />
            References & Relationships
          </Typography>
            {renderReferencesRelationshipsSection()}
          </Box>

          {/* Packaging & Logistics 部分 */}
          <Box sx={{ mt: 11 }}>
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: '30px',fontFamily: '"Roboto", sans-serif',fontWeight: 900 }}>
            <Box component='img' src={packIcon} alt='pack' sx={{ width: 36, height: 36}} />
            Packaging & Logistics
          </Typography>
            {renderPackagingLogisticsSection()}
          </Box>
          {/* USPS & Benefits 部分 */}
          <Box sx={{ mt: 11 }}>
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: '30px',fontFamily: '"Roboto", sans-serif',fontWeight: 900 }}>
            <Box component='img' src={specIcon} alt='spec' sx={{ width: 36, height: 36}} />
            USPS & Benefits
          </Typography>
            {renderUSPSBenefitsSection()}
          </Box>
          {/* Marketing Collaterals 部分 */}
          <Box sx={{ mt: 11 }}>
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: '30px',fontFamily: '"Roboto", sans-serif',fontWeight: 900 }}>
            <Box component='img' src={labelIcon} alt='label' sx={{ width: 36, height: 36}} />
            Marketing Collaterals
          </Typography>
            {renderMarketingCollateralsSection()}
          </Box>
          {/* After Service 部分 */}
          <Box sx={{ mt: 11 }}>
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: '30px',fontFamily: '"Roboto", sans-serif',fontWeight: 900 }}>
            <Box component='img' src={serviceIcon} alt='service' sx={{ width: 36, height: 36}} />
            After Service
          </Typography>
            {renderAfterServiceSection()}
          </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;
