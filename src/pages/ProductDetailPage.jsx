import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetailApiService from '../services/productDetailApi';
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
import databaseIcon from '../assets/icon/database.png';
import languageIcon from '../assets/icon/language.png';
import shareIcon from '../assets/icon/Share.png';
import exportIcon from '../assets/icon/file_export.png';
import downloadIcon from '../assets/icon/download.png';
import documentIcon from '../assets/icon/document.png';

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
  const skuDataTitleRef = useRef(null);
  const basicDataTitleRef = useRef(null);
  const sapDetailTitleRef = useRef(null);

  const handleNavigate = (sectionId, subItem) => {
    const map = {
      'basic-data|SKU DATA': skuDataTitleRef,
      'basic-data|BASIC DATA': basicDataTitleRef,
      'basic-data|SAP DETAIL': sapDetailTitleRef
    };
    const key = `${sectionId}${subItem ? '|' + subItem : ''}`;
    const container = contentScrollRef.current;
    const target = map[key]?.current;
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
        <IconButton size="small" aria-label="share" onClick={onShare} sx={{ color: '#333333',fontSize: '20px' }}>
          <Box component="img" src={shareIcon} alt="share" sx={{ display: 'block' }} />
        </IconButton>
        <IconButton size="small" aria-label="export" onClick={onExport} sx={{ color: '#333333',fontSize: '20px' }}>
          <Box component="img" src={exportIcon} alt="export" sx={{ display: 'block' }} />
        </IconButton>
        <IconButton size="small" aria-label="download" onClick={onDownload} sx={{ color: '#333333',fontSize: '20px' }}>
          <Box component="img" src={downloadIcon} alt="download" sx={{ display: 'block' }} />
        </IconButton>
      </Box>
    </Box>
  );

  // 路由参数 id 与产品数据状态
  const { id: routeProductId } = useParams();
  const [productData, setProductData] = useState({
    id: '90330',
    name: 'Big Capacity Black Roller Cabinet with 6 Drawer - 160mm/6"',
    image: 'https://via.placeholder.com/400x400/2c3e50/ffffff?text=Roller+Cabinet', // 使用占位符图片
    status: {
      lifecycle: 'Active',
      regionalLaunchDate: '2025-01-01',
      enrichmentStatus: 'Global data ready',
      finalReleaseDate: '2025-06-01'
    },
    skus: [
      { size: '160mm/6"', material: '90257', finish: 'Nickel Iron Plated', standard: '' },
      { size: '180mm/6"', material: '90258', finish: 'Nickel Iron Plated', standard: '' },
      { size: '200mm/6"', material: '90259', finish: 'Nickel Iron Plated', standard: '' }
    ],
    basicData: {
      brand: 'Kendo',
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
    }
  });

  // 根据id加载产品详情
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!routeProductId) return;
      try {
        const detail = await ProductDetailApiService.getProductDetail(routeProductId);
        console.log('ProductDetailPage fetched detail:', detail);
        if (!mounted || !detail) return;
        const { productCardInfo, basicData, sapData } = detail;
        setProductData(prev => ({
          ...prev,
          id: productCardInfo?.productNumber || String(routeProductId),
          name: productCardInfo?.productName || prev.name,
          image: productCardInfo?.imageUrl || prev.image,
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
      title: 'Basic Data',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['SKU DATA', 'BASIC DATA', 'SAP DETAIL']
    },
    {
      id: 'marketing-data',
      title: 'Marketing Data',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['MARKETING COPY', 'ICONS & PICTURES', 'QR CODES', 'EANS']
    },
    {
      id: 'reference-relationship',
      title: 'Reference & Relationship',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['BUNDLES', 'COMPONENTS', 'ACCESSORIES']
    },
    {
      id: 'packaging-logistics',
      title: 'Packaging & Logistics',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['PACKAGING DATA', 'PACKAGING & SPEC']
    },
    {
      id: 'usps-benefits',
      title: 'USPs & Benefits',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['PACKAGING & SPEC']
    },
    {
      id: 'marketing-collaterals',
      title: 'Marketing Collaterals',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['ON WHITE', 'ACTION & LIFESTYLE', 'VIDEOS']
    },
    {
      id: 'after-service',
      title: 'After Service',
      icon: <Box component='img' src={documentIcon} alt='document' sx={{ width: 16, height: 16 }} />,
      subItems: ['MANUALS', 'REPAIR GUIDE', 'PACKAGING']
    }
  ];

  const handleSectionToggle = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  

  const renderBasicDataSection = () => (
    <Box>
      {/* SKU Data */}
      <Typography ref={skuDataTitleRef} variant="h6" sx={{ mb: 2, fontSize: '24px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
        SKU Data
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
        Basic Data
      </Typography>
      <Box sx={{ mb: 3, mt: 3 }}>
        <Form
          columns={2}
          items={[
            { label: 'Brand', value: productData.basicData.brand },
            { label: 'Product Number', value: productData.basicData.productNumber },
            { label: 'Region', value: productData.basicData.region },
            { label: 'Product Classification', value: productData.basicData.productClassification },
            { label: 'Product Type', value: productData.basicData.productType },
            { label: 'Country of Origin', value: productData.basicData.countryOfOrigin },
            { label: 'Model Number', value: productData.basicData.modelNumber },
            { label: 'Warranty', value: productData.basicData.warranty },
            { label: 'Version', value: productData.basicData.version },
            { label: 'Last Changed on', value: productData.basicData.lastChangedOn },
            { label: 'Customer Facing Model', value: productData.basicData.customerFacingModel },
            { label: 'Life Cycle Status', value: productData.basicData.lifecycleStatus, type: 'status' },
            { label: 'Product Series', value: productData.basicData.productSeries },
            { label: 'Enrichment Status', value: productData.basicData.enrichmentStatus },
            { label: 'Sellable', value: productData.basicData.sellable },
            { label: 'First Shipping Date', value: productData.basicData.firstShippingDate },
            { label: 'Recognition', value: productData.basicData.recognition },
            { label: 'Created on', value: productData.basicData.createdOn }
          ]}
        />
      </Box>

      {/* SAP Detail */}
      <Typography ref={sapDetailTitleRef} variant="h6" sx={{ mb: 2, fontSize: '24.5px', fontFamily: '"Open Sans", sans-serif', fontWeight: 520, color:'#4d4d4d' }}>
        SAP Detail
      </Typography>
      <Box sx={{ mb: 3, mt: 3 }}>
        <Form
          columns={1}
          items={[
            { label: 'Basic Unit of Measurement', value: productData.sapDetail.basicUnitOfMeasurement },
            { label: 'Product Dimensions', value: productData.sapDetail.productDimensions || '-' },
            { label: 'Consolidation SKU Numbers [10bit]', value: productData.sapDetail.consolidationSkuNumbers || '-' },
            { label: 'Factory Instruction CN', value: productData.sapDetail.factoryInstruction }
          ]}
        />
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
        brandName="KENDO"
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
        <Box sx={{ px: 3, pt: 0, pb: 3, maxWidth: 1400, minWidth: 1400, mx: 'auto' }}>
          <Box sx={{ bgcolor: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #eee', p: 0, minWidth: '1000px' }}>
            {/* 最顶部功能栏 */}
            <TopActionsBar />

          {/* share / file_export / download */}
          <ToolIconsBar onShare={handleShare} onExport={handleExport} onDownload={handleDownload} />

          <Box sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{mt: 1}}>
            <Grid item xs={12}>
              <ProductCard onDownloadClick={() => console.log('download clicked')} />
            </Grid>
          </Grid>

          {/* Basic Data 部分 */}
          <Box sx={{ mt: 12 }}>
            <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: '30px',fontFamily: '"Roboto", sans-serif',fontWeight: 900 }}>
              <Box component='img' src={documentIcon} alt='document' sx={{ width: 36, height: 36}} />
              Basic Data
            </Typography>
            {renderBasicDataSection()}
          </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;
