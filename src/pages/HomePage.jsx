import { Box, Card, CardContent, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useBrand } from '../hooks/useBrand';
import { useLanguage } from '../hooks/useLanguage';
import { selectHomePagesByBrand } from '../store/slices/themesSlice';

const HomePage = () => {
  const { currentBrand } = useBrand();
  const { currentLanguage } = useLanguage();
  
  // 获取当前品牌的首页数据
  const homePages = useSelector(selectHomePagesByBrand(currentBrand?.code));

  // 调试数据
  useEffect(() => {
    if (homePages.length > 0) {
      console.log('🏠 HomePage - 当前品牌:', currentBrand?.code);
      console.log('🏠 HomePage - 当前语言:', currentLanguage);
      console.log('🏠 HomePage - 首页数据:', homePages);
      
      // 使用调试工具

    }
  }, [homePages, currentBrand?.code, currentLanguage]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        首页配置
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        品牌: {currentBrand?.displayName} ({currentBrand?.code})
      </Typography>
      
      <Typography variant="body1" gutterBottom>
        语言: {currentLanguage?.name} ({currentLanguage?.code})
      </Typography>

      {homePages.length > 0 ? (
        homePages.map((page) => (
          <Card key={`${page.brandCode}-${page.id}`} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {page.name} (ID: {page.id})
              </Typography>
              
              <Typography color="text.secondary" gutterBottom>
                模板: {page.page_template} | 语言: {page.locale}
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                创建时间: {new Date(page.createdAt).toLocaleString()}
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                更新时间: {new Date(page.updatedAt).toLocaleString()}
              </Typography>

              {/* 内容区域 */}
              {page.content_area && page.content_area.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    内容区域 ({page.content_area.length}个组件):
                  </Typography>
                  
                  {page.content_area.map((area, areaIndex) => (
                    <Paper key={areaIndex} sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        组件类型: {area.__component}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        组件ID: {area.id}
                      </Typography>

                      {/* 根据组件类型显示不同内容 */}
                      {area.__component === 'homepage.home-page-widget-list' && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            首页小部件列表:
                          </Typography>
                          
                          {area.home_page_widget_list && area.home_page_widget_list.map((widget, widgetIndex) => (
                            <Box key={widgetIndex} sx={{ p: 2, mb: 1, backgroundColor: 'white', borderRadius: 1 }}>
                              <Typography variant="h6">
                                {widget.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {widget.sub_title}
                              </Typography>
                              <Typography variant="caption" display="block">
                                类型: {widget.type} | 网格: {widget.grid}
                              </Typography>
                              
                              {widget.image && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" display="block">
                                    图片: {widget.image.name}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    尺寸: {widget.image.width} x {widget.image.height}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          ))}
                        </Box>
                      )}

                      {area.__component === 'shared.link-list' && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            链接列表:
                          </Typography>
                          
                          {area.link_list && area.link_list.map((link, linkIndex) => (
                            <Box key={linkIndex} sx={{ p: 2, mb: 1, backgroundColor: 'white', borderRadius: 1 }}>
                              <Typography variant="h6">
                                {link.link_label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {link.link_url}
                              </Typography>
                              <Typography variant="caption" display="block">
                                类型: {link.type} | 标题: {link.type_title}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {area.__component === 'homepage.contact-list' && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            联系人列表:
                          </Typography>
                          
                          {area.contact && area.contact.map((contact, contactIndex) => (
                            <Box key={contactIndex} sx={{ p: 2, mb: 1, backgroundColor: 'white', borderRadius: 1 }}>
                              <Typography variant="h6">
                                {contact.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {contact.email}
                              </Typography>
                              <Typography variant="caption" display="block">
                                {contact.description}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Box>
              )}

              {(!page.content_area || page.content_area.length === 0) && (
                <Typography color="text.secondary">
                  暂无内容区域数据
                </Typography>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography color="text.secondary">
          当前品牌暂无首页配置数据
        </Typography>
      )}
    </Box>
  );
};

export default HomePage; 