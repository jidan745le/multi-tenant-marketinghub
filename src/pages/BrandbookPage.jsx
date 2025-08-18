import {
    Box,
    CircularProgress,
    Typography,
    Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useBrand } from '../hooks/useBrand';
import { selectBrandBookPagesByBrand } from '../store/slices/themesSlice';
import Toc from '../components/Toc';
import BrandbookContent from '../components/BrandbookContent';
import { fetchAllBrandbookAssets } from '../services/brandbookAssetsApi';

// 主布局容器（用于加载和错误状态）
const MainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1200px',
  margin: '0 auto'
}));

const BrandbookPage = () => {
  const { currentBrand, currentBrandCode } = useBrand();
  const brandbookPages = useSelector(selectBrandBookPagesByBrand(currentBrandCode));
  
  const isLoading = useSelector(state => state.themes.loading);

  const [activeSection, setActiveSection] = useState('');

  const [assetsData, setAssetsData] = useState({
    logos: [],
    icons: [],
    videos: [],
    lifeStyles: [],
    catelogs: []
  });
  const [assetsLoading, setAssetsLoading] = useState(false);

  // 从PIM获取
  useEffect(() => {
    const fetchAssets = async () => {
      if (!currentBrandCode) return;

      setAssetsLoading(true);
      try {
        console.log(`🎨 Fetching brandbook assets for brand: ${currentBrandCode}`);
        const assets = await fetchAllBrandbookAssets({ 
          brand: currentBrandCode,
          limit: 100 
        });
        
        setAssetsData(assets);
        console.log('Brandbook assets loaded:', assets);
      } catch (error) {
        console.error('Error loading brandbook assets:', error);
        // 保持空数据，不影响页面显示
      } finally {
        setAssetsLoading(false);
      }
    };

    fetchAssets();
  }, [currentBrandCode]);

  // 提取页面所需的所有数据
  const getBrandbookData = () => {
    let bookInfo = [];
    const colors = [];
    const fonts = [];
    
    if (brandbookPages && brandbookPages.length > 0) {
      brandbookPages.forEach(page => {
        if (!page.content_area) {
          return;
        }
       
        page.content_area.forEach((area) => {
          console.log('🔍 Processing content area:', area.__component);

          if (area.__component === 'pages.brand-book') {
            bookInfo.push({
              id: area.id,
              cover: area.book_cover,
              file: area.book_file,
              logo: area.book_logo,
              title: area.title,
              pic_title: area.pic_title,
              nav_title: area.nav_title,
              size: area.book_file.size,
              view_button: area.view_button,
              download_button: area.download_button,
            });
          }
        
          if (area.__component === 'pages.color-list') {
            console.log('Processing colors:', area);
            area.colors?.forEach((colorItem) => {
              colors.push({
                id: colorItem.id,
                category: colorItem.category,
                name: colorItem.name,
                hex: colorItem.hex_code,
                rgb: colorItem.rgb,
                cmyk: colorItem.cmyk,
                phantone: colorItem.phantone,
              });
            });
          }

          if (area.__component === 'pages.font-list') {
            area.fonts?.forEach((fontItem) => {
              fonts.push({
                family: fontItem.font_family,
                id: fontItem.id,
                name: fontItem.name,
              });
            });
          }
        });
      });
    }
    
    // 使用PIM
    console.log('🔗 Using PIM assets data:', assetsData);
    
    return { 
      bookInfo, 
      colors, 
      fonts, 
      logos: assetsData.logos || [],
      icons: assetsData.icons || [],
      lifeStyles: assetsData.lifeStyles || [],
      videos: assetsData.videos || [],
      catelogs: assetsData.catelogs || []
    };
  };

  const { bookInfo, colors, fonts, logos, icons, lifeStyles, videos, catelogs } = getBrandbookData();

  console.log('🔍 Brandbook Debug:', {
    currentBrand,
    currentBrandCode,
    brandbookPages,
    isLoading,
    assetsLoading,
    extractedData: { bookInfo, colors, fonts, logos, icons, lifeStyles, videos, catelogs },
    assetsFromPIM: assetsData
  });

  // 提取的数据
  const brandbookData = useMemo(() => ({
    bookInfo,
    colors,
    fonts,
    logos,
    icons,
    lifeStyles,
    videos,
    catelogs
  }), [bookInfo, colors, fonts, logos, icons, lifeStyles, videos, catelogs]);

  const handleTocClick = useCallback((sectionId, anchor) => {
    console.log('TOC navigation clicked:', sectionId, anchor);
    setActiveSection(sectionId);
  }, []);

  const handleSectionInView = useCallback((sectionId) => {
    setActiveSection(sectionId);
  }, []);

  // 加载状态
  if (isLoading || assetsLoading) {
    return (
      <MainContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          {/* <Typography variant="h6" sx={{ ml: 2 }}>
            {isLoading ? 'loading...' : 'loading...'}
          </Typography> */}
        </Box>
      </MainContainer>
    );
  }

  return (
    <Box 
      sx={{ 
        height: '100vh',
        display: 'flex',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* 左侧目录导航 */}
      <Box sx={{ width: 280, height: '100%' }}>
        <Paper
          elevation={1}
          sx={{
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Toc 
            data={brandbookData}
            activeSection={activeSection}
            onSectionClick={handleTocClick}
          />
        </Paper>
      </Box>

      {/* 右侧主内容区域 */}
      <Box sx={{ flex: 1, height: '100%' }}>
        <Box 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <BrandbookContent 
            data={brandbookData}
            onSectionInView={handleSectionInView}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BrandbookPage;
