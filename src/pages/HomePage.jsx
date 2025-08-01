import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Link,
  Tooltip,
  Tooltip as MuiTooltip,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useBrand } from '../hooks/useBrand';
import { selectHomePagesByBrand } from '../store/slices/themesSlice';


// 主布局
const MainLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(8), // 左右两侧的间距
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: '1392px',
  flexWrap: 'nowrap', // 强制不换行
}));

// 左侧卡片区域Container
const ContentArea = styled(Box)({
  flex: 1,
  minWidth: 0, // 防止flex布局溢出
});

// 右侧侧边栏Container
const Sidebar = styled(Box)({
  width: '320px',
  minWidth: '320px',
  maxWidth: '320px',
  flexShrink: 0,
  height: 'fit-content',
});

// 左侧卡片样式
const WidgetCardStyled = styled(Card)({
  height: '100%',
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #E0E0E0',
  borderRadius: 8,
  boxShadow: 'none',
  flex: '1 1 auto',
  boxSizing: 'border-box', // 确保边框包含在宽度内
});

// 右侧侧边栏分区样式
const SidebarSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SidebarTitle = styled(Typography)({
  fontSize: '1rem',
  fontWeight: 'bold',
  marginBottom: '8px',
  color: '#000',
});

// HomePage专用的Tooltip
const HomePageTooltip = styled(({ className, ...props }) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: '#fff',
    color: theme.palette.secondary.main,
    fontSize: '12px',
    padding: '6px 10px',
    border: '2px solid',
    borderRadius: '2px',
    fontWeight: '600',
    maxWidth: '300px',
  },
}));

// --- HomePage ---

const HomePage = () => {
  const { currentBrand } = useBrand();
  const homePages = useSelector(selectHomePagesByBrand(currentBrand?.code));

  // 提取页面所需的所有数据
  const getPageData = () => {
    const cardWidgets = [];
    const portalLinks = [];
    const quickLinks = [];
    const contacts = [];
    
    if (!homePages || homePages.length === 0) {
      return { cardWidgets, portalLinks, quickLinks, contacts };
    }
    
    homePages.forEach(page => {
      if (!page.content_area) {
        return;
      }
      page.content_area.forEach((area) => {
        
        // 提取小部件数据
        if (area.__component === 'homepage.home-page-widget-list' && area.home_page_widget_list) {
          area.home_page_widget_list.forEach((widget) => {
            
            // **过滤逻辑**: 只显示用于卡片布局的小部件
            if (widget.type === 'title_below_image') {
              cardWidgets.push(widget);
            }
          });
        }
        
        // 提取链接数据
        if (area.__component === 'shared.link-list' && area.link_list) {
          console.log('Found link-list area with links:', area.link_list);
          area.link_list.forEach(link => {
            console.log('Processing link:', link, 'type:', link.type);
            if (link.type === 'Portal') {
              console.log('Adding portal link:', link);
              portalLinks.push(link);
            } else {
              console.log('Adding quick link:', link);
              quickLinks.push(link);
            }
          });
        } else {
          console.log('Area component:', area.__component, 'has link_list:', !!area.link_list);
        }
        
        // 提取contact数据
        if (area.__component === 'homepage.contact-list' && area.contact) {
          contacts.push(...area.contact);
        }
      });
    });
    
    return { cardWidgets, portalLinks, quickLinks, contacts };
  };

  const { cardWidgets, portalLinks, quickLinks, contacts } = getPageData();
  
  // 渲染单个卡片
  const renderCard = (widget) => {
    
    const imageUrl = widget.image?.url 
      ? `${import.meta.env.VITE_STRAPI_BASE_URL}${widget.image.url}`
      : null;

    const handleClick = () => {
      if (widget.url) {
        if (widget.url.startsWith('http')) {
          window.open(widget.url, '_blank');
        } else {
          window.location.href = widget.url;
        }
      }
    };

    return (
      <WidgetCardStyled onClick={handleClick} sx={{ height: '360px', display: 'flex', flexDirection: 'column' }}>
        {imageUrl && (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={widget.title}
            sx={{ 
              objectFit: 'cover',
              height: '240px', // 2/3 of 360px
              flex: '0 0 240px'
            }}
          />
        )}
        <CardContent sx={{ 
          flex: '1 1 120px', // 1/3 of 360px
          height: '120px',
          p: 2.5, 
          '&:last-child': { paddingBottom: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          paddingTop: '20px'
        }}>
          <HomePageTooltip title={widget.title}>
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '1rem',
                lineHeight: 1.3,
                mb: 0.5,
                cursor: 'pointer',
                color: 'inherit',
                transition: 'color 0.2s ease-in-out',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            >
              {widget.title}
            </Typography>
          </HomePageTooltip>
          
          {widget.sub_title && (
            <HomePageTooltip title={widget.sub_title}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease-in-out',
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
              >
                {widget.sub_title}
              </Typography>
            </HomePageTooltip>
          )}
        </CardContent>
      </WidgetCardStyled>
    );
  };

  // --- 右侧侧边栏渲染 ---

  const renderSidebarLinks = (title, links) => {
    if (links.length === 0) {
      return null;
    }
    
    return (
      <SidebarSection>
        <SidebarTitle>{title}</SidebarTitle>
        <List sx={{ p: 0 }}>
          {links.map((link, index) => (
            <Fragment key={index}>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemAvatar sx={{ minWidth: 40, display: 'flex' }}>
                  {link.link_icon?.url ? (
                    <img 
                      width="24" 
                      height="24" 
                      src={`${import.meta.env.VITE_STRAPI_BASE_URL}${link.link_icon.url}`} 
                      alt=""
                      style={{ objectFit: 'contain' }}
                    />
                  ) : <Box sx={{ width: 24, height: 24 }} />}
                </ListItemAvatar>
                <Link 
                  href={link.link_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ textDecoration: 'none', color: 'text.primary', fontSize: '0.875rem' }}
                >
                  {link.link_label}
                </Link>
              </ListItem>
              <Divider sx={{ borderColor: '#F0F0F0' }}/>
            </Fragment>
          ))}
        </List>
      </SidebarSection>
    );
  };

  const renderContactsSidebar = () => {
    if (contacts.length === 0) return null;
    
    return (
      <SidebarSection>
        <SidebarTitle>Contact</SidebarTitle>
        <List sx={{ p: 0 }}>
          {contacts.map((contact, index) => (
            <Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                <ListItemAvatar>
                  {contact.profile_pic?.url ? (
                    <Avatar
                      sx={{ width: 48, height: 48 }}
                      src={`${import.meta.env.VITE_STRAPI_BASE_URL}${contact.profile_pic.url}`}
                      alt={contact.name}
                    />
                  ) : (
                    <Avatar sx={{ width: 48, height: 48 }}>
                      {contact.name?.charAt(0) || 'U'}
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {contact.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block' }}>
                        {contact.description}
                      </Typography>
                      <Link href={`mailto:${contact.email}`} sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem' }}>
                        {contact.email}
                      </Link>
                    </>
                  }
                />
              </ListItem>
              {index < contacts.length - 1 && <Divider sx={{ borderColor: '#F0F0F0' }}/>}
            </Fragment>
          ))}
        </List>
      </SidebarSection>
    );
  };


  // --- 主渲染 ---

  return (
    <Box sx={{ 
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <Box 
        sx={{ 
          width: '1440px',
          height: '100%',
          margin: '0 auto',
          transform: 'scale(min(100vw / 1440px, 1))',
          transformOrigin: 'top center',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ padding: '64px 24px 32px 24px' }}>
          <MainLayout>
        {/* 左侧卡片区域Container - 二三布局 */}
        <ContentArea>
          {cardWidgets.length > 0 ? (
             <Box sx={{ 
               width: '100%',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center'
             }}>
              {/* 上二布局 */}
              {cardWidgets.length >= 2 && 
                <Box sx={{ 
                  mb: 4,
                  width: '100%',
                  maxWidth: '1200px'
                }}>
                  <Grid 
                    container 
                    spacing={3}
                    sx={{ 
                      flexWrap: 'nowrap',
                      width: '100%',
                      '& .MuiGrid-item': {
                        minWidth: 0,
                        maxWidth: '100%'
                      }
                    }}
                  >
                    <Grid item xs={8} sx={{ display: 'flex', width: '66.666%' }}>
                      {renderCard(cardWidgets[0], true)}
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', width: '33.333%' }}>
                      {renderCard(cardWidgets[1])}
                    </Grid>
                  </Grid>
                </Box>
              }
              
              {/* 下三布局 */}
              {cardWidgets.length >= 3 &&
                <Box sx={{ 
                  width: '100%',
                  maxWidth: '1200px'
                }}>
                  <Grid 
                    container 
                    spacing={3}
                    sx={{ 
                      flexWrap: 'nowrap',
                      width: '100%',
                      '& .MuiGrid-item': {
                        minWidth: 0,
                        maxWidth: '100%'
                      }
                    }}
                  >
                    {cardWidgets.slice(2, 5).map((widget, index) => (
                      <Grid item xs={4} key={`bottom-${index}`} sx={{ display: 'flex', width: '33.333%' }}>
                        {renderCard(widget, true)}
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              }
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '680px',
              gap: 2
            }}>
              <CircularProgress size={80} />
              {/* <Typography variant="body2" color="text.secondary">
                Loading...
              </Typography> */}
            </Box>
          )}
        </ContentArea>

        {/* 右侧侧边栏Container - 右侧侧边栏 */}
        <Sidebar>
          {renderSidebarLinks('Portals', portalLinks)}
          {renderSidebarLinks('Links', quickLinks)}
          {renderContactsSidebar()}
        </Sidebar>
        </MainLayout>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage; 