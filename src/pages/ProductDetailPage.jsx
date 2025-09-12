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
import image2 from '../assets/image/image2.png';
import image3 from '../assets/image/image3.png';
import qrImage1 from '../assets/image/imageQR1.png';
import qrImage2 from '../assets/image/imageQR2.png';
import qrImage3 from '../assets/image/imageQR3.png';
import eanImage1 from '../assets/image/imageEcode1.png';
import eanImage2 from '../assets/image/imageEcode2.png';
import eanImage3 from '../assets/image/imageEcode3.png';
import accessoryImage1 from '../assets/image/A1.png';
import accessoryImage2 from '../assets/image/A2.png';
import accessoryImage3 from '../assets/image/A3.png';
import bundleImage1 from '../assets/image/B1.png';
import bundleImage2 from '../assets/image/B2.png';
import componentImage1 from '../assets/image/C1.png';
import componentImage2 from '../assets/image/C2.png';
import componentImage3 from '../assets/image/C3.png';
import onWhiteImage1 from '../assets/image/O1.png';
import onWhiteImage2 from '../assets/image/O2.png';
import onWhiteImage3 from '../assets/image/O3.png';
import onWhiteImage4 from '../assets/image/O4.png';
import videoImage1 from '../assets/image/V1.png';
import videoImage2 from '../assets/image/V2.png';

// 三角形角标（与侧边栏一致风格，可配置颜色）
const SmallTriangleIcon = ({ expanded, color = '#000' }) => (
  <Box
    component="span"
    sx={{
      width: 0,
      height: 0,
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: expanded ? 'none' : `6px solid ${color}`,
      borderBottom: expanded ? `6px solid ${color}` : 'none',
      transition: 'all 0.15s ease-in-out',
      display: 'inline-block',
      ml: 0.5
    }}
  />
);


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
  


  // 调试信息
  useEffect(() => {
    console.log('PDP Page Data:', getPdpPageData);
    console.log('Product Card Data:', productCardData);
    console.log('Table Data:', tableData);
  }, [getPdpPageData, productCardData, tableData]);

  // 路由参数 id 与产品数据状态（防止数据空的情况，待优化）
  const { id: routeProductId } = useParams();
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

  //待改进：左是strapi的取值，右是pim对应的值
  const basicValueGetterMap = React.useMemo(() => ({
    brand:            (d) => d.basicData?.brand,
    productNumber:    (d) => d.basicData?.productNumber,
    region:           (d) => d.basicData?.region,
    productClassification: (d) => d.basicData?.productClassification,
    productType:      (d) => d.basicData?.productType,
    countryOfOrigin:  (d) => d.basicData?.countryOfOrigin,
    modelNumber:      (d) => d.basicData?.modelNumber,
    warranty:         (d) => d.basicData?.warranty,
    version:          (d) => d.basicData?.version,
    lastChangedOn:    (d) => d.basicData?.lastChangedOn,
    customerFacingModel: (d) => d.basicData?.customerFacingModel,
    lifecycleStatus:  (d) => d.basicData?.lifecycleStatus,
    productSeries:    (d) => d.basicData?.productSeries,
    enrichmentStatus: (d) => d.basicData?.enrichmentStatus,
    sellable:         (d) => d.basicData?.sellable,
    firstShippingDate:(d) => d.basicData?.firstShippingDate,
    recognition:      (d) => d.basicData?.recognition,
    createdOn:        (d) => d.basicData?.createdOn
  }), []);

  const sapValueGetterMap = React.useMemo(() => ({
    basicUnitofMeasurement: (d) => d.sapDetail?.basicUnitOfMeasurement,
    productDimensions:      (d) => d.sapDetail?.productDimensions,
    consolidationSkuNumbers:(d) => d.sapDetail?.consolidationSkuNumbers,
    factoryInstructionCn:     (d) => d.sapDetail?.factoryInstruction,
    sapShortDescriptionEn:     (d) => d.sapDetail?.sapShortDescription
  }), []);


  const marketingValueGetterMap = React.useMemo(() => ({
    modelName:         (d) => d.marketingData?.modelName,
    categoryBullets:   (d) => (d.marketingData?.categoryBullets || []).join(', '),
    popShortDescription: (d) => d.marketingData?.popShortDescription,
    longDescription:   (d) => d.marketingData?.longDescription,
    packagingContains: (d) => d.marketingData?.packagingContains,
    specifications:    (d) => d.marketingData?.specifications
  }), []);

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

  const sapFormItems = React.useMemo(() => 
    buildItemsFromFields(sapFormData, sapValueGetterMap, productData), [buildItemsFromFields, sapFormData, sapValueGetterMap, productData]
  );
  
  const marketingFormItems = React.useMemo(() => 
    buildItemsFromFields(marketingFormData, marketingValueGetterMap, productData), [buildItemsFromFields, marketingFormData, marketingValueGetterMap, productData]
  );



  // ProductCard 配置
  const productCardConfig = React.useMemo(() => ({
    modelNumberField: productCardData?.modelNumberField || 'modelNumber',
    // modelNameField: productCardData?.modelNameField || 'modelName',
    // thumbnailUrlField: productCardData?.thumbnailUrlField || 'thumbnailUrl',
    filename: productCardData?.filename || 'product'
  }), [productCardData]);

  console.log('productCardConfig', productCardConfig);

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

  // 顶部操作栏：点击处理[待改动]
  const handleShare = () => { console.log('share clicked'); };
  const handleExport = () => { console.log('export clicked'); };
  const handleDownload = () => { console.log('download clicked'); };

  // 样式常量
  const topButtonBaseSx = {
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
  };
  const menuIconSx = { display: 'block' };

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
            startIcon={<Box component="img" src={databaseIcon} alt="database" sx={menuIconSx} />}
            endIcon={<SmallTriangleIcon expanded={basicMenu.open} />}
            onClick={basicMenu.openMenu}
            aria-haspopup="menu"
            aria-expanded={basicMenu.open ? 'true' : undefined}
            sx={{ ...topButtonBaseSx, width: '160px' }}
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
            startIcon={<Box component="img" src={languageIcon} alt="language" sx={menuIconSx} />}
            endIcon={<SmallTriangleIcon expanded={languageMenu.open} />}
            onClick={languageMenu.openMenu}
            aria-haspopup="menu"
            aria-expanded={languageMenu.open ? 'true' : undefined}
            sx={{ ...topButtonBaseSx, width: '160px' }}
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
  
  

  // 根据id加载产品详情
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!routeProductId) return;
      try {
        const detail = await ProductDetailApiService.getProductDetail(routeProductId);
        console.log('ProductDetailPage fetched detail:', detail);
        if (!mounted || !detail) return;
        const { 
          productCardInfo, 
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
        
        
        setProductData(prev => ({
          ...prev,
          id: productCardInfo?.productNumber || String(routeProductId),
          name: productCardInfo?.productName || prev.name,
          image: productCardInfo?.thumbnailUrl ? `https://pim-test.kendo.com${productCardInfo.thumbnailUrl}` : 
                 productCardInfo?.imageUrl ? `https://pim-test.kendo.com${productCardInfo.imageUrl}` : 
                 prev.image,
          status: {
            lifecycle: productCardInfo?.lifeCycleStatus || prev.status.lifecycle,
            regionalLaunchDate: productCardInfo?.regionalLaunchDate || prev.status.regionalLaunchDate,
            enrichmentStatus: productCardInfo?.enrichmentStatus || prev.status.enrichmentStatus,
            finalReleaseDate: productCardInfo?.finalReleaseDate || prev.status.finalReleaseDate
          },
          basicData: {
            ...prev.basicData,
            brand: basicData?.brand ?? prev.basicData.brand,
            productNumber: basicData?.productNumber ?? prev.basicData.productNumber,
            region: basicData?.region ?? prev.basicData.region,
            productType: basicData?.productType ?? prev.basicData.productType,
            modelNumber: basicData?.modelNumber ?? prev.basicData.modelNumber,
            version: basicData?.version ?? prev.basicData.version,
            customerFacingModel: basicData?.customerFacingModel ?? prev.basicData.customerFacingModel,
            productSeries: basicData?.productSeries ?? prev.basicData.productSeries,
            sellable: basicData?.sellable ?? prev.basicData.sellable,
            recognition: basicData?.recognition ?? prev.basicData.recognition,
            productClassification: basicData?.productClassification ?? prev.basicData.productClassification,
            countryOfOrigin: basicData?.countryOfOrigin ?? prev.basicData.countryOfOrigin,
            warranty: basicData?.warranty ?? prev.basicData.warranty,
            lastChangedOn: basicData?.lastChangedOn ?? prev.basicData.lastChangedOn,
            lifecycleStatus: basicData?.lifeCycleStatus ?? prev.basicData.lifecycleStatus,
            enrichmentStatus: basicData?.enrichmentStatus ?? prev.basicData.enrichmentStatus,
            firstShippingDate: basicData?.firstShippingDate ?? prev.basicData.firstShippingDate,
            createdOn: basicData?.createdOn ?? prev.basicData.createdOn
          },
          sapDetail: {
            ...prev.sapDetail,
            basicUnitOfMeasurement: sapData?.basicUnitOfMeasurement ?? prev.sapDetail.basicUnitOfMeasurement,
            productDimensions: sapData?.productDimensions ?? prev.sapDetail.productDimensions,
            consolidationSkuNumbers: sapData?.consolidationSkuNumbers ?? prev.sapDetail.consolidationSkuNumbers,
            factoryInstruction: sapData?.factoryInstructionCn ?? prev.sapDetail.factoryInstruction
          },
          marketingData: {
            modelName: marketingData?.modelName ?? prev.marketingData.modelName,
            categoryBullets: marketingData?.categoryBullets ?? prev.marketingData.categoryBullets,
            popShortDescription: marketingData?.popShortDescription ?? prev.marketingData.popShortDescription,
            longDescription: marketingData?.longDescription ?? prev.marketingData.longDescription,
            packagingContains: marketingData?.packagingContains ?? prev.marketingData.packagingContains,
            specifications: marketingData?.specifications ?? prev.marketingData.specifications
          },
          // 新增PIM数据
          pimData: {
            referenceRelationship,
            iconsPictures,
            qrCodes,
            eans,
            packagingData,
            packagingSpec,
            marketingCollaterals,
            afterService
          }
        }));
      } catch (e) {
        console.error('load product by id failed', e);
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
  
  //初步完成，待优化
  const renderProductDataSection = () => (
    <Grid container spacing={3} sx={{mt: 1}}>
      <Grid item xs={12}>
        <ProductCard 
          announcementPrefix="New Version Available:"
          announcementLinkText={
            productData.basicData?.productSeries
          }
          statusText={"In Development"}
          modelNumber={
            productData.basicData?.[productCardConfig.modelNumberField] ??
            productData.basicData?.modelNumber ??
            productData.basicData?.productNumber ??
            productData.id
          }
          title={productData.name || "Product Title"}
          strapiData={productCardData}
          infoPairs={[
            { label: PRODUCT_FIELDS[0] || 'Lifecycle', value: productData.status?.lifecycle || 'Active', withStatus: true },
            { label: PRODUCT_FIELDS[1] || 'Regional Launch Date', value: productData.status?.regionalLaunchDate || '2025-01-01' },
            { label: PRODUCT_FIELDS[2] || 'Enrichment Status', value: productData.status?.enrichmentStatus || 'Global data ready' },
            { label: PRODUCT_FIELDS[3] || 'Final Release Date', value: productData.status?.finalReleaseDate || '2025-06-01' }
          ]}
          skuData={[
            { 
              size: '160mm/6"', 
              material: productData.basicData?.modelNumber || productData.id, 
              finish: 'Nickel Iron Plated', 
              imageUrl: productData.image || '/assets/productcard_image.png' 
            },
            { size: '180mm/6"', material: 'A01010502', finish: 'Nickel Iron Plated', imageUrl: '/assets/productcard_image.png'  },
            { size: '200mm/6"', material: 'A01010503', finish: 'Nickel Iron Plated', imageUrl: ''  },
          ]}
          infoLabelMinWidth="155px"
          infoValueMinWidth="118px"
          onDownloadClick={() => console.log('download clicked')} 
        />
      </Grid>
    </Grid>
  );

  //初步完成，待优化
  const renderBasicDataSection = () => (
    <Box>
      {/* SKU Data */}
      <Typography ref={skuDataTitleRef} variant="h6" sx={{ mb: 2, fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
       {tableData?.title|| 'SKU Data'}
      </Typography>
      <Box sx={{ mb: 3, mt: 3.5 }}>
        <UnifiedSkuTable 
          data={productData.skus} 
          variant="detail" 
          showStandard={true} 
        />
      </Box>

      {/* Basic Data */}
      <Typography ref={basicDataTitleRef} variant="h6" sx={{ mb: 2 , fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 580, color:'#4d4d4d' }}>
        {basicFormData?.title || 'Basic Data'}
      </Typography>
      <Box sx={{ mb: 3, mt: 3 }}>
        <Form
          columns={basicFormData?.columnType || "double"}
          items={basicFormItems}
        />
      </Box>

      {/* SAP Detail */}
      <Typography ref={sapDetailTitleRef} variant="h6" sx={{ mb: 2, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
        {sapFormData?.title || 'SAP Detail'}
      </Typography>
      <Box sx={{ mb: 3, mt: 3 }}>
        <Form
          columns={sapFormData?.columnType || "single"}
          items={sapFormItems}
        />
      </Box>
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
                ...topButtonBaseSx,
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
                ...topButtonBaseSx,
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
      <Box sx={{ mb: 3, mt: 3 }}>
        <Form
          columns={marketingFormData?.columnType || "single"}
          items={marketingFormItems}
        />
      </Box>
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
                ...topButtonBaseSx,
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
      <Box sx={{ mb: 3 }}>
        <Image 
          type={ iconsAndPicturesData?.type || "simple"}
          // images={productData.pimData?.iconsPictures?.icons?.map(icon => ({
          //   src: icon.imageUrl ? `https://pim-test.kendo.com${icon.imageUrl}` : image1,
          //   alt: icon.type || 'Icon'
          // })) || [
          images={ [
            { src: image1, alt: 'Image 1' },
            { src: image2, alt: 'Image 2' },
            { src: image3, alt: 'Image 3' }
          ]}
          onImageClick={(image, index) => console.log('Image clicked:', image, index)}
        />
      </Box>     
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
                ...topButtonBaseSx,
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
      <Box sx={{ mb: 3 }}>
        <UnifiedInfoTable 
          type="qrcode"
          // data={productData.pimData?.qrCodes?.qrCodes?.map(qr => ({
          //   image: qrImage1, // 使用默认QR码图片
          //   name: qr.name || 'QR Code',
          //   link: qr.link || '#'
          // })) || [
          data={ [
            { image: qrImage1, name: 'QR Code 1', link: 'https://example.com/qr1' },
            { image: qrImage2, name: 'QR Code 2', link: 'https://example.com/qr2' },
            { image: qrImage3, name: 'QR Code 3', link: 'https://example.com/qr3' }
          ]}
          onLinkClick={(item, index) => console.log('QR Link clicked:', item, index)}
          onImageClick={(item, index) => console.log('QR Image clicked:', item, index)}
        />
      </Box>
      
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
                ...topButtonBaseSx,
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
      <Box sx={{ mb: 3 }}>
        <UnifiedInfoTable 
          type="barcode"
          // data={productData.pimData?.eans?.eans?.map(ean => ({
          //   image: eanImage1, // 使用默认EAN图片
          //   name: ean.name || 'EAN Code',
          //   eanCode: ean.eanCode || ''
          // })) || [
          data={ [
            { image: eanImage1, name: 'Single Product EAN', eanCode: '6903366101012' },
            { image: eanImage2, name: 'Inner Box EAN Code', eanCode: '6903366101012' },
            { image: eanImage3, name: 'Master Carton EAN Code', eanCode: '6903366101012' }
          ]}
          onDownloadClick={(item, index) => console.log('EAN Download clicked:', item, index)}
          onImageClick={(item, index) => console.log('EAN Image clicked:', item, index)}
        />
      </Box>
    </Box>
  );

  const renderReferencesRelationshipsSection = () => (
    <Box>
      {/* Bundles */}
      <Typography ref={bundlesTitleRef} variant="h6" sx={{ mb: 2.5, fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520}}>
        {bundlesData?.title || 'Bundles'}
      </Typography>
      
      {/* Bundles Product Grid */}
      <Box sx={{ mb: 3 }}>
        <ProductCardGrid 
          // products={productData.pimData?.referenceRelationship?.bundles?.map(bundle => ({
          //   image: bundle.imageUrl ? `https://pim-test.kendo.com${bundle.imageUrl}` : bundleImage1,
          //   name: bundle.productName || 'Bundle Product',
          //   code: bundle.productNumber || 'B001'
          // })) || [
          products={ [
            {
              image: bundleImage1,
              name: 'Bundle Product 1',
              code: 'B001'
            },
            {
              image: bundleImage2,
              name: 'Bundle Product 2',
              code: 'B002'
            }
          ]}
          onProductClick={(product, index) => console.log('Bundle Product clicked:', product, index)}
          onImageClick={(product, index) => console.log('Bundle Image clicked:', product, index)}
        />
      </Box>

      {/* Components */}
      <Typography ref={componentsTitleRef} variant="h6" sx={{ mb: 2.5 , fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 580 }}>
        {componentsData?.title || 'Components'}
      </Typography>
      
      {/* Components Product Grid */}
      <Box sx={{ mb: 3 }}>
        <ProductCardGrid 
          // products={productData.pimData?.referenceRelationship?.components?.map(component => ({
          //   image: component.imageUrl ? `https://pim-test.kendo.com${component.imageUrl}` : componentImage1,
          //   name: component.productName || 'Component Product',
          //   code: component.productNumber || 'C001'
          // })) || [
          products={ [
            {
              image: componentImage1,
              name: 'Component Product 1',
              code: 'C001'
            },
            {
              image: componentImage2,
              name: 'Component Product 2',
              code: 'C002'
            },
            {
              image: componentImage3,
              name: 'Component Product 3',
              code: 'C003'
            }
          ]}
          onProductClick={(product, index) => console.log('Component Product clicked:', product, index)}
          onImageClick={(product, index) => console.log('Component Image clicked:', product, index)}
        />
      </Box>

      {/* Accessories */}
      <Typography ref={accessoriesTitleRef} variant="h6" sx={{ mb: 2.5, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520}}>
        {accessoriesData?.title || 'Accessories'}
      </Typography>
      
      {/* Accessories Table */}
      <Box sx={{ mb: 3 }}>
        <UnifiedInfoTable 
          type={"accessory"}
          // data={productData.pimData?.referenceRelationship?.accessories?.map(accessory => ({
          //   image: accessory.imageUrl ? `https://pim-test.kendo.com${accessory.imageUrl}` : accessoryImage1,
          //   model: accessory.model || 'Unknown',
          //   name: accessory.name || 'Accessory',
          //   quantity: accessory.quantity || '1'
          // })) || [
          data={ [
            {
              image: accessoryImage1,
              model: '90257',
              name: '47cm / 19" Plastic Tools Box',
              quantity: '1'
            },
            {
              image: accessoryImage2,
              model: '90256', 
              name: '42cm / 17" Plastic Tools Box',
              quantity: '1'
            },
            {
              image: accessoryImage3,
              model: '90162',
              name: '32cm / 12" Multifunctional Nylon Open Mouth Tool Bag',
              quantity: '1'
            }
          ]}
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
                ...topButtonBaseSx,
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
          data={productData.pimData?.packagingData?.rows?.map(row => ({
            label: row[0],
            values: row.slice(1)
          })) || [
          // data={ [
            {
              label: 'Packaging Type',
              values: ['PP Card Hanger', 'Brown Carton Box', 'Brown Carton Box']
            },
            {
              label: 'Quantity(pcs)',
              values: ['1', '6', '60']
            },
            {
              label: 'Measurement Unit Type',
              values: ['-', 'pc', 'pc']
            },
            {
              label: 'Size Wx Hx L(cm)',
              values: ['-', '-', '23x25x38']
            },
            {
              label: 'Net Weight(kg)',
              values: ['0.216', '0', '12.96']
            },
            {
              label: 'Gross Weight(kg)',
              values: ['0', '0', '14']
            },
            {
              label: 'Size L(cm)',
              values: ['0', '0', '38']
            },
            {
              label: 'Size W(cm)',
              values: ['0', '0', '23']
            },
            {
              label: 'Size H(cm)',
              values: ['0', '0', '25']
            },
            {
              label: 'Volume(M3)',
              values: ['0', '0', '0.021855']
            }
          ]}
          columns={productData.pimData?.packagingData?.headers || ['ITEM', 'INNER BOX', 'MASTER CARTON']}
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
                ...topButtonBaseSx,
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
                ...topButtonBaseSx,
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
              items: productData.pimData?.packagingSpec?.technicalSpecs?.map(spec => ({
                feature: spec.featureName || '',
                value: spec.value || '',
                unit: spec.unit || '',
                showQuestion: true
              })) || [
              // items: [
                {
                  feature: 'Material - Body I',
                  value: 'C55 High carbon steel',
                  unit: '',
                  showQuestion: true
                },
                {
                  feature: 'Material - Handle I',
                  value: 'TPR',
                  unit: '',
                  showQuestion: true
                },
                {
                  feature: 'Surface Finish I',
                  value: 'Nickel Iron Plated',
                  unit: '',
                  showQuestion: true
                },
                {
                  feature: 'Hardness- Body',
                  value: '40-52',
                  unit: '',
                  showQuestion: true
                },
                {
                  feature: 'Hardness Rivet(HRC)',
                  value: '25-50',
                  unit: '',
                  showQuestion: true
                },
                {
                  feature: 'Hardness - Cutting Edge(HRC)',
                  value: '50-62',
                  unit: '',
                  showQuestion: true
                },
                {
                  feature: 'Size - Metric(mm)',
                  value: '160',
                  unit: 'mm',
                  showQuestion: true
                },
                {
                  feature: 'Size - Inch(")',
                  value: '6',
                  unit: '',
                  showQuestion: true
                },
                {
                  feature: 'Cutting Capacity.Soft(mm)',
                  value: '2.6',
                  unit: 'mm',
                  showQuestion: true
                },
                {
                  feature: 'Cutting Capacity - Medium(mm)',
                  value: '2',
                  unit: '',
                  showQuestion: true
                },
                {
                  feature: 'Cutting CapacityHard(mm)',
                  value: '',
                  unit: '',
                  showQuestion: true
                },
                {
                  feature: 'Jaws Opening(mm)',
                  value: '',
                  unit: '',
                  showQuestion: true
                }
              ]
            },
            {
              title: 'LOGO MARKING',
              icon: 'category',
              items: productData.pimData?.packagingSpec?.logoMarking?.map(logo => ({
                feature: logo.featureName || '',
                value: logo.value || '',
                unit: '',
                showQuestion: true
              })) || [
              // items: [
                {
                  feature: 'AdditionalPrinting',
                  value: '',
                  unit: '',
                  showQuestion: true
                },
                {
                  feature: 'Logo 1',
                  value: 'Laser printed',
                  unit: '',
                  showQuestion: true
                },
                {
                  feature: 'Logo 2',
                  value: 'Embossed',
                  unit: '',
                  showQuestion: true
                }
              ]
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
                ...topButtonBaseSx,
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
      <Box sx={{ mb: 3 }}>
        <Image 
          type={ onWhiteData?.type || "gallery"}
          mainImage=
          {productData.pimData?.marketingCollaterals?.onWhite?.[0] ? {
            src: `https://pim-test.kendo.com${productData.pimData.marketingCollaterals.onWhite[0].imageUrl}`,
            alt: 'On White 1',
            fileName: productData.pimData.marketingCollaterals.onWhite[0].fileName || 'ON-WHITE-1.PSD'
          } : 
          { src: onWhiteImage1, alt: 'On White 1', fileName: 'ON-WHITE-1.PSD' }}
          // thumbnailImages={productData.pimData?.marketingCollaterals?.onWhite?.map((img, index) => ({
          //   src: `https://pim-test.kendo.com${img.imageUrl}`,
          //   alt: `On White ${index + 1}`,
          //   fileName: img.fileName || `ON-WHITE-${index + 1}.PSD`
          // })) || [
          thumbnailImages={ [
            { src: onWhiteImage1, alt: 'On White 1', fileName: 'ON-WHITE-1.PSD' },
            { src: onWhiteImage2, alt: 'On White 2', fileName: 'ON-WHITE-2.PSD' },
            { src: onWhiteImage3, alt: 'On White 3', fileName: 'ON-WHITE-3.PSD' },
            { src: onWhiteImage4, alt: 'On White 4', fileName: 'ON-WHITE-4.PSD' }
          ]}
          onImageSelect={(image, index) => console.log('On White selected:', index, image)}
        />
      </Box>
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
                ...topButtonBaseSx,
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
      <Box sx={{ mb: 3 }}>
        <Image 
          type={ actionAndLifestyleData?.type || "gallery"}
          mainImage={productData.pimData?.marketingCollaterals?.actionLifestyle?.[0] ? {
            src: `https://pim-test.kendo.com${productData.pimData.marketingCollaterals.actionLifestyle[0].imageUrl}`,
            alt: 'Action & Lifestyle 1',
            fileName: productData.pimData.marketingCollaterals.actionLifestyle[0].fileName || 'ACTION-1.PSD'
          } : { src: onWhiteImage2, alt: 'On White 2', fileName: 'ON-WHITE-2.PSD' }}
          // thumbnailImages={productData.pimData?.marketingCollaterals?.actionLifestyle?.map((img, index) => ({
          //   src: `https://pim-test.kendo.com${img.imageUrl}`,
          //   alt: `Action & Lifestyle ${index + 1}`,
          //   fileName: img.fileName || `ACTION-${index + 1}.PSD`
          // })) || [
          thumbnailImages={ [
            { src: onWhiteImage2, alt: 'On White 2', fileName: 'ON-WHITE-2.PSD' },
            { src: onWhiteImage1, alt: 'On White 1', fileName: 'ON-WHITE-1.PSD' },
            { src: onWhiteImage4, alt: 'On White 4', fileName: 'ON-WHITE-4.PSD' }
          ]}
          onImageSelect={(image, index) => console.log('Action & Lifestyle selected:', index, image)}
        />
      </Box>
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
                ...topButtonBaseSx,
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
          data={productData.pimData?.marketingCollaterals?.videos?.map(video => ({
            image: video.thumbnailUrl ? `https://pim-test.kendo.com${video.thumbnailUrl}` : videoImage1,
            name: video.videoTitle || 'Video',
            language: video.language || 'English',
            type: video.type || 'Walk Around',
            format: video.format || 'Video',
            duration: video.duration || '0:00'
          })) || [
            {
              image: videoImage1,
              name: 'Kendo Black Roller Cabinet with 6 Drawer',
              language: 'English',
              type: 'Walk Around',
              format: 'Video',
              duration: '0:31'
            },
            {
              image: videoImage2,
              name: 'Kendo at the International Hardware Store',
              language: 'English',
              type: 'Walk Around',
              format: 'Video',
              duration: '0:51'
            }
          ]}
          onViewClick={(item) => console.log('View video:', item)}
          onDownloadClick={(item) => console.log('Download video:', item)}
        />
      </Box>
    </Box>
    
  );

  // After Service 图片 - 使用PIM数据
  const afterServiceAssets = React.useMemo(() => {
    const pimAfterService = productData.pimData?.afterService;
    
    return {
      manuals: pimAfterService?.manuals?.[0] ? {
        image: pimAfterService.manuals[0].thumbnailUrl ? `https://pim-test.kendo.com${pimAfterService.manuals[0].thumbnailUrl}` : manualsImage,
        modelNumber: productData.basicData?.modelNumber || '35462',
        productType: productData.basicData?.productNumber || '90330',
        name: pimAfterService.manuals[0].title || productData.name || 'Big Capacity Black Roller Cabinet with 6 Drawer'
      } : {
        image: manualsImage,
        modelNumber: '35462',
        productType: '90330',
        name: 'Big Capacity Black Roller Cabinet with 6 Drawer'
      },
      repairGuides: pimAfterService?.repairGuide?.map(guide => ({
        image: guide.thumbnailUrl ? `https://pim-test.kendo.com${guide.thumbnailUrl}` : repairGuideImage,
        modelNumber: productData.basicData?.modelNumber || '35462',
        productType: `${productData.basicData?.productNumber || '90330'} - ${guide.title || 'Guide'}`,
        name: guide.title || productData.name || 'Big Capacity Black Roller Cabinet with 6 Drawer'
      })) || [
        {
          image: repairGuideImage,
          modelNumber: '35462',
          productType: '90330 - English US',
          name: 'Big Capacity Black Roller Cabinet with 6 Drawer'
        },
        {
          image: repairGuideImage,
          modelNumber: '35462',
          productType: '90330 - German',
          name: 'Big Capacity Black Roller Cabinet with 6 Drawer'
        },
        {
          image: repairGuideImage,
          modelNumber: '35462',
          productType: '90330 - Chinese',
          name: 'Big Capacity Black Roller Cabinet with 6 Drawer'
        }
      ],
      // Packaging 列表
      packagings: pimAfterService?.packaging?.map(pack => ({
        image: pack.thumbnailUrl ? `https://pim-test.kendo.com${pack.thumbnailUrl}` : packagingImage,
        modelNumber: productData.basicData?.modelNumber || '35462',
        productType: productData.basicData?.productNumber || '90330',
        name: pack.title || productData.name || 'Big Capacity Black Roller Cabinet with 6 Drawer'
      })) || [
        {
          image: packagingImage,
          modelNumber: '35462',
          productType: '90330',
          name: 'Big Capacity Black Roller Cabinet with 6 Drawer'
        },
        {
          image: packagingImage,
          modelNumber: '35462',
          productType: '90330',
          name: 'Big Capacity Black Roller Cabinet with 6 Drawer'
        },
        {
          image: packagingImage,
          modelNumber: '35462',
          productType: '90330',
          name: 'Big Capacity Black Roller Cabinet with 6 Drawer'
        }
      ],
      // Drawing 列表
      drawings: pimAfterService?.drawing?.map(drawing => ({
        image: drawing.thumbnailUrl ? `https://pim-test.kendo.com${drawing.thumbnailUrl}` : drawingImage,
        modelNumber: productData.basicData?.modelNumber || '35462',
        productType: productData.basicData?.productNumber || '90330',
        name: drawing.title || productData.name || 'Big Capacity Black Roller Cabinet with 6 Drawer'
      })) || [
        {
          image: drawingImage,
          modelNumber: '35462',
          productType: '90330',
          name: 'Big Capacity Black Roller Cabinet with 6 Drawer'
        },
        {
          image: drawingImage,
          modelNumber: '35462',
          productType: '90330',
          name: 'Big Capacity Black Roller Cabinet with 6 Drawer'
        }
      ],
      // Patent 列表
      patents: pimAfterService?.patent?.map(patent => ({
        image: patent.thumbnailUrl ? `https://pim-test.kendo.com${patent.thumbnailUrl}` : patentImage,
        modelNumber: productData.basicData?.modelNumber || '35462',
        productType: productData.basicData?.productNumber || '90330',
        name: patent.title || productData.name || 'Big Capacity Black Roller Cabinet with 6 Drawer'
      })) || [
        {
          image: patentImage,
          modelNumber: '35462',
          productType: '90330',
          name: 'Big Capacity Black Roller Cabinet with 6 Drawer'
        },
        {
          image: patentImage,
          modelNumber: '35462',
          productType: '90330',
          name: 'Big Capacity Black Roller Cabinet with 6 Drawer'
        }
      ]
    };
  }, [productData.pimData?.afterService, productData.basicData, productData.name]);

  const renderAfterServiceSection = () => (
    <Box>
      {/* Manuals */}
      <Typography ref={manualsTitleRef} variant="h6" sx={{ mb: 3.5, fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d'}}>
        Manuals
      </Typography>
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

      {/* Repair  Guide*/}
      <Typography ref={repairGuideTitleRef} variant="h6" sx={{ mb: 3.5 , fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 580, color:'#4d4d4d' }}>
        Repair Guide
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {afterServiceAssets.repairGuides.map((asset, idx) => (
          <DigitalAssetCard 
            key={`repair-guide-${idx}`}
            product={asset}
            onDownload={() => console.log('download repair guide', idx)}
          />
        ))}
      </Box>

      {/* Packaging */}
      <Typography ref={packagingTitleRef} variant="h6" sx={{ mb: 3.5, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
        Packaging
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {afterServiceAssets.packagings.map((asset, idx) => (
          <DigitalAssetCard 
            key={`packaging-${idx}`}
            product={asset}
            onDownload={() => console.log('download packaging', idx)}
          />
        ))}
      </Box>

      {/* Drawing */}
      <Typography ref={drawingTitleRef} variant="h6" sx={{ mb: 3.5, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
        Drawing
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {afterServiceAssets.drawings.map((asset, idx) => (
          <DigitalAssetCard 
            key={`drawing-${idx}`}
            product={asset}
            onDownload={() => console.log('download drawing', idx)}
          />
        ))}
      </Box>

      {/* Patent */}
      <Typography ref={patentTitleRef} variant="h6" sx={{ mb: 3.5, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
        Patent
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {afterServiceAssets.patents.map((asset, idx) => (
          <DigitalAssetCard 
            key={`patent-${idx}`}
            product={asset}
            onDownload={() => console.log('download patent', idx)}
          />
        ))}
      </Box>
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
