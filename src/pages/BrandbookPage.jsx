import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    Stack,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useSelector } from 'react-redux';
import { useBrand } from '../hooks/useBrand';
import { selectBrandBookPagesByBrand } from '../store/slices/themesSlice';

// 主布局容器
const MainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1200px',
  margin: '0 auto'
}));

// 品牌手册卡片样式
const BrandbookCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease-in-out'
  }
}));

// 页面标题样式
const PageTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: 600,
  color: theme.palette.primary.main
}));

// 信息项样式
const InfoItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[200]}`
}));

const BrandbookPage = () => {
  const { currentBrand, currentBrandCode } = useBrand();
  
  // 获取当前品牌的 brandbook 页面数据
  const brandbookPages = useSelector(selectBrandBookPagesByBrand(currentBrandCode));
  
  // 获取加载状态
  const isLoading = useSelector(state => state.themes.loading);

  console.log('🔍 Brandbook Debug:', {
    currentBrand,
    currentBrandCode,
    brandbookPages,
    isLoading
  });

  // 加载状态
  if (isLoading) {
    return (
      <MainContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            加载品牌手册中...
          </Typography>
        </Box>
      </MainContainer>
    );
  }

  // 无数据状态
  if (!brandbookPages || brandbookPages.length === 0) {
    return (
      <MainContainer>
        <PageTitle variant="h4">
          {currentBrand?.brand_name || currentBrandCode} 品牌手册
        </PageTitle>
        <Alert severity="info">
          暂无品牌手册信息可用。请联系管理员或稍后再试。
        </Alert>
      </MainContainer>
    );
  }

  // 渲染单个品牌手册页面
  const renderBrandbookPage = (page, index) => (
    <BrandbookCard key={page.id || index}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {page.page_title || `品牌手册 ${index + 1}`}
        </Typography>
        
        <Grid container spacing={2}>
          {/* 基本信息 */}
          <Grid item xs={12} md={6}>
            <InfoItem>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                基本信息
              </Typography>
              <Typography variant="body2">
                <strong>页面ID:</strong> {page.id}
              </Typography>
              <Typography variant="body2">
                <strong>品牌代码:</strong> {page.brandCode || currentBrandCode}
              </Typography>
              <Typography variant="body2">
                <strong>页面模板:</strong> {page.page_template}
              </Typography>
              {page.documentId && (
                <Typography variant="body2">
                  <strong>文档ID:</strong> {page.documentId}
                </Typography>
              )}
            </InfoItem>
          </Grid>

          {/* 时间信息 */}
          <Grid item xs={12} md={6}>
            <InfoItem>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                时间信息
              </Typography>
              {page.createdAt && (
                <Typography variant="body2">
                  <strong>创建时间:</strong> {new Date(page.createdAt).toLocaleString('zh-CN')}
                </Typography>
              )}
              {page.updatedAt && (
                <Typography variant="body2">
                  <strong>更新时间:</strong> {new Date(page.updatedAt).toLocaleString('zh-CN')}
                </Typography>
              )}
              {page.publishedAt && (
                <Typography variant="body2">
                  <strong>发布时间:</strong> {new Date(page.publishedAt).toLocaleString('zh-CN')}
                </Typography>
              )}
            </InfoItem>
          </Grid>

          {/* 内容区域 */}
          {page.content_area && (
            <Grid item xs={12}>
              <InfoItem>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  内容区域信息
                </Typography>
                <Typography variant="body2" component="pre" sx={{ 
                  whiteSpace: 'pre-wrap', 
                  backgroundColor: '#f5f5f5', 
                  padding: 2, 
                  borderRadius: 1,
                  maxHeight: '200px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(page.content_area, null, 2)}
                </Typography>
              </InfoItem>
            </Grid>
          )}

          {/* 状态标签 */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              {page.publishedAt && (
                <Chip label="已发布" color="success" size="small" />
              )}
              {page.locale && (
                <Chip label={`语言: ${page.locale}`} color="info" size="small" />
              )}
              {page.page_template === 'brandbook' && (
                <Chip label="品牌手册模板" color="primary" size="small" />
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </BrandbookCard>
  );

  return (
    <MainContainer>
      <PageTitle variant="h4">
        {currentBrand?.brand_name || currentBrandCode} 品牌手册
      </PageTitle>
      
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        共找到 {brandbookPages.length} 个品牌手册页面
      </Typography>

      {/* 渲染所有品牌手册页面 */}
      {brandbookPages.map((page, index) => renderBrandbookPage(page, index))}
    </MainContainer>
  );
};

export default BrandbookPage;
