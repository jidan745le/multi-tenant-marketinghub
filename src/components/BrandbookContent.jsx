import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Paper,
  Chip,
  Button,
  styled
} from '@mui/material';
import { Download, Visibility, Search } from '@mui/icons-material';
import { ScrollBarWrapperBox } from './ScrollBarThemeWrapper';
import ProductCard from './DigitalAssetCard';
import AssetPagination from './AssetPagination';
import AssetDetailDialog from './AssetDetailDialog';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box as MuiBox
} from '@mui/material';

// 内容区域
const ContentSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  '&:last-child': {
    marginBottom: theme.spacing(3),
  }
}));

// 卡片
const MediaCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  }
}));


const BrandbookContent = ({ data, onSectionInView }) => {
  const [activeSection, setActiveSection] = useState('');
  // const [selectedItems, setSelectedItems] = useState(new Set());
  // const [searchTerms, setSearchTerms] = useState({});
  // const [selectedDates, setSelectedDates] = useState({});
  const sectionRefs = useRef({});
  const scrollContainerRef = useRef(null);

  // AssetDetailDialog 状态
  const [assetDetailOpen, setAssetDetailOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [selectedAssetData, setSelectedAssetData] = useState(null);

  // const [selectedLanguages, setSelectedLanguages] = useState({});



  // 监听滚动
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {

      const sections = Object.keys(sectionRefs.current);
      let currentSection = '';

      for (const sectionId of sections) {
        const element = sectionRefs.current[sectionId];
        if (element) {
          const rect = element.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          
          if (rect.top <= containerRect.top + containerRect.height / 3) {
            currentSection = sectionId;
          }
        }
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
        onSectionInView?.(currentSection);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection, onSectionInView]);

  const handleAssetDetailClose = useCallback(() => {
    setAssetDetailOpen(false);
    setSelectedAssetId(null);
    setSelectedAssetData(null);
  }, []);

  // 这里是AssetDetailDialog 中的下载
  const handleAssetDetailDownload = useCallback((assetId) => {
    console.log('Download from AssetDetailDialog in Brandbook:', assetId);
    
    if (selectedAssetData) {
      try {
        // 构建下载URL
        const downloadUrl = selectedAssetData.downloadUrl || selectedAssetData.fullpath;
        if (downloadUrl) {
          const fullDownloadUrl = downloadUrl.startsWith('http') 
            ? downloadUrl 
            : `https://pim-test.kendo.com${downloadUrl}`;
          
          const link = document.createElement('a');
          link.href = fullDownloadUrl;
          link.download = selectedAssetData.filename || selectedAssetData.name || 'asset';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          console.log('Asset download initiated:', fullDownloadUrl);
        } else {
          console.warn('No download URL available for asset:', selectedAssetData);
        }
      } catch (error) {
        console.error('Error downloading asset:', error);
      }
    }
  }, [selectedAssetData]);

  const registerSectionRef = (sectionId, element) => {
    if (element) {
      sectionRefs.current[sectionId] = element;
    }
  };

  // 渲染品牌信息
  const renderBrandInfo = () => {
    const brandInfo = data?.bookInfo?.[0];
    if (!brandInfo) return null;

    return (
      <ContentSection 
        id="brand-info" 
        ref={(el) => registerSectionRef('brand-info', el)}
      >
        <Box sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.5)', 
          margin: '-24px -24px 24px -23px',
          padding: '12px 24px',
          position: 'relative'
        }}>
          <Typography variant="h4" component="h2" fontWeight="bold" fontSize="1.6rem" sx={{ mb: 0 }}>
            {brandInfo.title || 'Brand Book'}
          </Typography>
        </Box>
        
        <Paper elevation={0} sx={{ overflow: 'hidden', mb: 3, borderRadius: 1 }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'stretch',
            height:'280px'
          }}>
            {/* 左侧图片 */}
            <Box sx={{ 
              flex: '0 0 290px',
              display: 'flex',
              alignItems: 'stretch'
            }}>
              {brandInfo.cover && brandInfo.cover[0]?.url ? (
                <Box
                  component="img"
                  src={`${import.meta.env.VITE_STRAPI_BASE_URL}${brandInfo.cover[0].url}`}
                  alt={brandInfo.cover[0].alt || brandInfo.title || 'Brand Book Cover'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              ) : (
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    No Cover Image
                  </Typography>
                </Box>
              )}
            </Box>

            {/* 右侧内容区域 */}
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 4 
            }}>
              {/* 标题和描述 */}
              <Box>
                <Typography 
                  variant="h4" 
                  component="h3" 
                  fontWeight="bold"
                  sx={{ mb: 1, fontSize: '3rem' }}
                >
                  {brandInfo.pic_title || 'Kendo Brand Book'}
                </Typography>
                
                {brandInfo.size && (
                  <Typography 
                    variant="subtitle1"
                    fontSize={'1rem'} 
                    sx={{ mb: 1 }}
                  >
                    {brandInfo.size}
                  </Typography>
                )}
                
              </Box>

              {/* 右侧按钮区域 - 上下排列 */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1.5,
                alignSelf: 'flex-end',
                mt: 'auto'
              }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Visibility />}
                  sx={{ 
                    minWidth: 260,
                    fontWeight: 'bold',
                    color: 'white',
                    textTransform: 'uppercase'
                  }}
                  onClick={() => {
                    const link = brandInfo.file?.url ? `${import.meta.env.VITE_STRAPI_BASE_URL}${brandInfo.file.url}` : null;
                    if (link) {
                      window.open(link, '_blank');
                    }
                  }}

                >
                  {brandInfo.view_button?.label || 'View Brand Book'}  
                </Button>
                
                <Button
                  variant="outlined"
                  // color="text."
                  size="large"
                  startIcon={<Download />}
                  sx={{ 
                    minWidth: 260,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: (theme) => theme.palette.grey[700],
                    borderColor: (theme) => theme.palette.grey[700],
                    '&:hover': {
                      borderColor: (theme) => theme.palette.grey[800],
                      color: (theme) => theme.palette.grey[800]
                    }
                  }}
                  onClick={async () => {
                    const link = brandInfo.file?.url ? `${import.meta.env.VITE_STRAPI_BASE_URL}${brandInfo.file.url}` : null;
                    if (link) {
                      try {
                        // fetch
                        const response = await fetch(link);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const downloadLink = document.createElement('a');
                        downloadLink.href = url;
                        downloadLink.download = brandInfo.title || 'brand-book.pdf';
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                        window.URL.revokeObjectURL(url);
                      } catch {
                        const downloadLink = document.createElement('a');
                        downloadLink.href = link;
                        downloadLink.download = brandInfo.title || 'brand-book.pdf';
                        downloadLink.target = '_self';
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                      }
                    }
                  }}

                >
                  {brandInfo.download_button?.label || 'Download Asset Pack'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </ContentSection>
    );
  };

  // 渲染颜色调色板 
  const renderColors = () => {
    if (!data?.colors || data.colors.length === 0) return null;

    return (
      <ContentSection 
        id="colors" 
        ref={(el) => registerSectionRef('colors', el)}
      >
        <Box sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.5)', 
          margin: '-24px -24px 24px -24px',
          padding: '12px 24px',
          position: 'relative'
        }}>
          <Typography variant="h4" component="h2" fontWeight="bold" fontSize="1.6rem" sx={{ mb: 0 }}>
            {data?.sectionSubTitles?.colors || 'Color Palette'}
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ flexWrap: 'nowrap', overflow: 'auto' }}>
          {data.colors.map((color, colorIndex) => (
            <Grid item key={color.id || colorIndex} sx={{ minWidth: 0, flex: '0 0 270px' }}>
              <Paper 
                id={`color-section-${colorIndex}`}
                ref={(el) => registerSectionRef(`color-${colorIndex}`, el)}
                sx={{ 
                  height: '360px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  width: '100%'
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: 180,
                    backgroundColor: color.hex,
                    display: 'block'
                  }}
                />
                
                {/* 颜色信息  */}
                <Box sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {color.category || 'Primary'} ({color.name || 'Color Name'})
                  </Typography>
                  
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {color.hex}
                  </Typography>
                  
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {color.rgb}
                  </Typography>
                  
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {color.cmyk}
                  </Typography>
                  
                  {color.phantone && (
                    <Typography variant="body2" fontWeight="bold">
                      {color.phantone}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </ContentSection>
    );
  };

  // 渲染字体排版
  const renderFonts = () => {
    if (!data?.fonts || data.fonts.length === 0) return null;

    return (
      <ContentSection 
        id="fonts" 
        ref={(el) => registerSectionRef('fonts', el)}
      >
        <Box sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.5)', 
          margin: '-24px -24px 24px -24px',
          padding: '12px 24px',
          position: 'relative'
        }}>
          <Typography variant="h4" component="h2" fontWeight="bold" fontSize="1.6rem" sx={{ mb: 0 }}>
            {data?.sectionSubTitles?.fonts || 'Typography'}
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ flexWrap: 'nowrap', overflow: 'auto' }}>
          {data.fonts.map((font, fontIndex) => (
            <Grid item key={font.id || fontIndex} sx={{ minWidth: 0, flex: '0 0 270px' }}>
              <Paper 
                id={`font-section-${fontIndex}`}
                ref={(el) => registerSectionRef(`font-${fontIndex}`, el)}
                sx={{ 
                  height: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  width: '100%'
                }}
              >
                <Box sx={{ p: 3, pb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {fontIndex === 0 ? 'Open Sans Bold' : fontIndex === 1 ? 'Arial' : 'Arial'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {fontIndex === 0 ? 'Web • Headline' : fontIndex === 1 ? 'Web • Title' : 'Web • Body'}
                  </Typography>
                </Box>
                
                {/* 字体 */}
                <Box
                  sx={{
                    width: '100%',
                    height: 180,
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    p: 3,
                    overflow: 'hidden'
                  }}
                >
                  {fontIndex === 0 && (
                    <>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: 'Open Sans',
                          fontWeight: 'bold',
                          color: '#FF6600',
                          lineHeight: 1.1,
                          fontSize: '36px',
                          mb: 6
                        }}
                      >
                        Dedicated  engineering and...
                      </Typography>
                    </>
                  )}
                  
                  {fontIndex === 1 && (
                    <>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: 'Arial',
                          fontWeight: 'bold',
                          color: '#000000',
                          textTransform: 'uppercase',
                          lineHeight: 1.1,
                          fontSize: '24px',
                          mb: 3
                        }}
                      >
                        DEDICATED ENGINEERING AND QUALITY ASSURANCE STAFFS IN OUR TESTING...
                      </Typography>
                    </>
                  )}
                  
                  {fontIndex === 2 && (
                    <>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'Arial',
                          color: '#000000',
                          lineHeight: 1.4,
                          fontSize: '14px',
                          mb: 3
                        }}
                      >
                        Dedicated engineering and quality assurance staffs in our testing center provide various kinds of technical support service. Drawings and documents have been changed to online technical supports for our quality improvement.
                      </Typography>
                    </>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </ContentSection>
    );
  };

  // 渲染媒体资源
  const renderMediaSection = (items, title, sectionId, list) => {
    console.log(`renderMediaSection called:`, {
      sectionId,
      title,
      itemsCount: items?.length || 0,
      items: items,
      list: list
    });
    if (!items || items.length === 0) return null;

    // 处理单个项目点击
    const handleItemClick = (item) => {
      console.log('Brandbook item clicked:', item);
      
      // 如果有资产ID，打开 AssetDetailDialog
      if (item.id) {
        setSelectedAssetId(item.id);
        setSelectedAssetData(item);
        setAssetDetailOpen(true);
      } else {
        // 否则使用原来的逻辑，在新窗口打开图片
        const imageUrl = item.image || item.img;
        if (imageUrl) {
          window.open(imageUrl, '_blank');
        }
      }
    };

    // 单个下载
    const handleItemDownload = (item) => {
      console.log('Item download requested:', item);
    };

    // 批量下载
    const handleDownloadAll = (allItems) => {
      console.log('Download all items:', allItems);

      allItems.forEach(item => {
        handleItemDownload(item);
      });
    };

    return (
      <ContentSection 
        id={sectionId} 
        ref={(el) => registerSectionRef(sectionId, el)}
      >
        <AssetPagination
          title={title}
          items={items}
          loading={false}
          pageSize={24}
          onItemClick={handleItemClick}
          onItemDownload={handleItemDownload}
          onDownloadAll={handleDownloadAll}
          searchPlaceholder="Search file name"
        />
      </ContentSection>
    );
  };

  return (
    <ScrollBarWrapperBox
      ref={scrollContainerRef}
      sx={{
        height: '100%',
        overflow: 'auto',
        p: 3,
      }}
    >
      {renderBrandInfo()}
      
      {renderColors()}
      
      {renderFonts()}

      {renderMediaSection(data?.icons, data?.externalMedias?.[0]?.title, data?.externalMedias?.[0]?.mediaType,data?.externalMedias?.[0])}
      
      {renderMediaSection(data?.logos, data?.externalMedias?.[1]?.title, data?.externalMedias?.[1]?.mediaType,data?.externalMedias?.[1])}

      {renderMediaSection(data?.catelogs, data?.externalMedias?.[2]?.title, data?.externalMedias?.[2]?.mediaType,data?.externalMedias?.[2])}
      
      {/* 资产详情弹窗 */}
      <AssetDetailDialog
        open={assetDetailOpen}
        onClose={handleAssetDetailClose}
        assetId={selectedAssetId}
        mediaData={selectedAssetData}
        onDownload={handleAssetDetailDownload}
      />
    </ScrollBarWrapperBox>
  );
};

export default BrandbookContent;
