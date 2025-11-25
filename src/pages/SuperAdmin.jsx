import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
  } from '@mui/material';
  import { styled } from '@mui/material/styles';
  import CloseIcon from '@mui/icons-material/Close';
  import React, { useState, useEffect } from 'react';
  import templateApi from '../services/templateApi';
  import { CircularProgress, Alert } from '@mui/material';
  import NewPublicationDialog from '../components/NewPublicationDialog';
  import UploadDialog from '../components/UploadDialog';
  
  // Styled components
  const HeaderContainer = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
  }));
  
  const Title = styled(Typography)(() => ({
    fontSize: '20px',
    fontWeight: 600,
    fontFamily: 'var(--label-large-font-family, "Roboto-Medium", sans-serif)',
    paddingTop: '20px',
  }));
  
  const TableHeader = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.grey[200], 
    fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    fontSize: '15px',
    borderTop: `2px solid ${theme.palette.grey[300]}`,
    borderBottom: `2px solid ${theme.palette.grey[300]}`, 
    padding: '10px 12px',
    height: '75px',
    '& *': {
      fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    '& .MuiTypography-root': {
      fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    }
  }));
  
  const TableRowStyled = styled(TableRow)(() => ({
    height: '36px', 
    '& .MuiTableCell-root': {
      padding: '6px 12px', 
      height: '40px',
      lineHeight: '24px',
    },
  }));
  
const TableCellStyled = styled(TableCell)(({ theme }) => ({
  padding: '8px 16px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  height: '40px', 
  lineHeight: '24px', 
}));

const StickyHeader = styled(TableHeader)(({ theme }) => ({
  position: 'sticky',
  right: 0,
  backgroundColor: theme.palette.grey[200],
  zIndex: 10,
  borderLeft: `1px solid ${theme.palette.primary.main}`,
  fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: 500,
  '& *': {
    fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
  },
  '& .MuiTypography-root': {
    fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
  }
}));

const StickyCell = styled(TableCellStyled)(({ theme }) => ({
  position: 'sticky',
  right: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 9,
  borderLeft: `1px solid ${theme.palette.primary.main}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));
  
  const ImagePlaceholder = styled(Box)(({ theme }) => ({
    width: 40,
    height: 40,
    backgroundColor: theme.palette.grey[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    border: `1px dashed ${theme.palette.grey[400]}`,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundImage: `
        linear-gradient(0deg, transparent 24%, ${theme.palette.grey[300]} 25%, ${theme.palette.grey[300]} 26%, transparent 27%, transparent 74%, ${theme.palette.grey[300]} 75%, ${theme.palette.grey[300]} 76%, transparent 77%, transparent),
        linear-gradient(90deg, transparent 24%, ${theme.palette.grey[300]} 25%, ${theme.palette.grey[300]} 26%, transparent 27%, transparent 74%, ${theme.palette.grey[300]} 75%, ${theme.palette.grey[300]} 76%, transparent 77%, transparent)
      `,
      backgroundSize: '20px 20px',
      opacity: 0.3,
    },
  }));
  
  const PdfThumbnailContainer = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  }));
  
  const PdfThumbnail = styled(Box)(({ theme }) => ({
    width: 35,
    height: 50,
    backgroundColor: theme.palette.grey[100],
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      boxShadow: theme.shadows[2],
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%)',
    },
  }));
  
  const UploadIconButton = styled(IconButton)(({ theme }) => ({
    padding: 4,
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.primary.main,
    },
  }));
  
  const UsageChip = styled(Chip)(({ theme }) => ({
    height: 24,
    fontSize: '12px',
    marginRight: 4,
    backgroundColor: theme.palette.grey[200],
    border: `1px solid ${theme.palette.grey[400]}`,
    '& .MuiChip-deleteIcon': {
      fontSize: '16px',
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.error.main,
      },
    },
  }));
  
  const DescriptionText = styled(Typography)(() => ({
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'rgba(0, 0, 0, 0.87)',
    width: '100%', 
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  }));
  
  
  const transformApiData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) {
      return [];
    }

    return apiData.map((item, index) => {
      const usage = Array.isArray(item.usage) && item.usage.length > 0 
        ? item.usage.map(u => {
            // 如果已经是字符串，转换为首字母大写的格式
            if (typeof u === 'string') {
              const lower = u.toLowerCase();
              if (lower === 'internal') return 'Internal';
              if (lower === 'external') return 'External';
              return u.charAt(0).toUpperCase() + u.slice(1).toLowerCase();
            }
            return String(u);
          })
        : [];

      // 日期格式
      const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}/${month}/${day}`;
        } catch {
          return dateString;
        }
      };

      const templateId = item.id || item.templateId || index + 1;
      
      // 判断是否有 icon 和 pdfExample
      const hasIcon = item.iconFileId && item.iconFileId !== null;
      const hasPdfExample = item.pdfFileId && item.pdfFileId !== null;
      
      // 判断 templateType：根据 templateTypeName 判断
      let templateType = 'Specific';
      if (item.templateTypeName) {
        templateType = item.templateTypeName === 'Global' ? 'Global' : 'Specific';
      } else if (!item.tenant || item.tenant === 'global') {
        templateType = 'Global';
      }
      
      // 判断 css 和 html
      const hasCss = item.css && item.css.trim() !== '' && item.css !== 'string';
      const hasHtml = item.html && item.html.trim() !== '' && item.html !== 'string';
      
      return {
        id: templateId,
        name: item.name || '-',
        description: item.description || '-',
        image: hasIcon ? `/srv/v1/main/publication/templates/${templateId}/assets/icon` : null,
        pdfExample: hasPdfExample ? `/srv/v1/main/publication/templates/${templateId}/assets/pdf-example` : null,
        tenant: item.tenant || '-',
        theme: item.theme || '-',
        type: item.typeName || '-',
        usage: usage.length > 0 ? usage : ['-'],
        templateType: templateType,
        created: formatDate(item.createdAt || '-'),
        createdBy: item.createdBy || '-',
        lastUpdate: formatDate(item.updatedAt || '-'),
        lastUpdatedBy: item.updatedBy || '-',
        css: hasCss ? 'Edit' : '-',
        html: hasHtml ? 'Edit' : '-',
      };
    });
  };

  function SuperAdmin() {
    const [selectedTenant, setSelectedTenant] = useState('tenant1');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Dialog 相关状态
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editType, setEditType] = useState(null); // 'css' 或 'html'
    const [currentTemplateId, setCurrentTemplateId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [loadingContent, setLoadingContent] = useState(false);
    
    // NewPublicationDialog 相关状态
    const [newPublicationDialogOpen, setNewPublicationDialogOpen] = useState(false);
    
    // UploadDialog 相关状态
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [uploadingTemplateId, setUploadingTemplateId] = useState(null);
    const [uploadType, setUploadType] = useState(null); // 'icon' 或 'pdfExample'
  
    // 从 API 获取模板数据
    useEffect(() => {
      const fetchTemplates = async () => {
        try {
          setLoading(true);
          setError(null);
          
          console.log('开始获取模板数据...');
          const apiData = await templateApi.getTemplates();
          
          console.log('成功获取模板数据:', apiData);
          
          // 转换数据格式
          let transformedData = transformApiData(Array.isArray(apiData) ? apiData : (apiData._embedded?.templates || apiData.content || []));
          
          if (selectedTenant === 'global') {
            transformedData = transformedData.filter(item => 
              item.templateType === 'Global'
            );
          } else if (selectedTenant === 'tenant1' || selectedTenant === 'specific') {
            transformedData = transformedData.filter(item => 
              item.templateType === 'Specific'
            );
          }
          
          console.log('过滤后的数据:', {
            selectedTenant,
            totalCount: transformedData.length,
            data: transformedData
          });
          
          setData(transformedData);
          console.log('转换后的数据:', transformedData);
        } catch (err) {
          console.error('获取模板数据失败:', err);
          setData([]);
        } finally {
          setLoading(false);
        }
      };

      fetchTemplates();
    }, [selectedTenant]);
  
    const handleTenantChange = (event) => {
      setSelectedTenant(event.target.value);
    };
  
    const handleUsageDelete = (rowId, usageIndex) => {
      setData(prevData =>
        prevData.map(row =>
          row.id === rowId
            ? { ...row, usage: row.usage.filter((_, index) => index !== usageIndex) }
            : row
        )
      );
    };

    const handleTypeChange = (rowId, newType) => {
      setData(prevData =>
        prevData.map(row =>
          row.id === rowId
            ? { ...row, type: newType }
            : row
        )
      );
    };

    // 处理编辑图标点击
    const handleEditClick = async (templateId, type) => {
      setCurrentTemplateId(templateId);
      setEditType(type);
      setDialogOpen(true);
      setEditContent('');
      setLoadingContent(true);
      
      try {
        // 获取当前模板的 CSS 或 HTML 内容
        const blob = await templateApi.downloadTemplateAsset(templateId, type);
        const text = await blob.text();
        setEditContent(text);
      } catch (error) {
        console.error(`failed to get ${type} content:`, error);
        setEditContent(''); // 如果获取失败，显示空内容
      } finally {
        setLoadingContent(false);
      }
    };

    // 关闭 Dialog
    const handleCloseDialog = () => {
      setDialogOpen(false);
      setEditType(null);
      setCurrentTemplateId(null);
      setEditContent('');
    };

    // 保存编辑内容
    const handleSaveContent = async () => {
      if (!currentTemplateId || !editType) return;
      
      try {
        setSaving(true);
        
        // 获取当前模板的完整数据
        const templateData = await templateApi.getTemplateById(currentTemplateId);
        
        // 只更新 css 或 html 字段
        const updateData = {
          name: templateData.name || '',
          type: templateData.type || templateData.typeName || '',
          description: templateData.description || '',
          usage: Array.isArray(templateData.usage) ? templateData.usage : [], // 使用数组格式
          tenant: templateData.tenant || '',
          theme: templateData.theme || '',
          [editType]: editContent
        };
        
        // 更新模板
        await templateApi.updateTemplate(currentTemplateId, updateData);
        
        // 刷新数据
        const apiData = await templateApi.getTemplates();
        let transformedData = transformApiData(Array.isArray(apiData) ? apiData : (apiData._embedded?.templates || apiData.content || []));
        
        if (selectedTenant === 'global') {
          transformedData = transformedData.filter(item => 
            item.templateType === 'Global'
          );
        } else if (selectedTenant === 'tenant1' || selectedTenant === 'specific') {
          transformedData = transformedData.filter(item => 
            item.templateType === 'Specific'
          );
        }
        
        setData(transformedData);
        handleCloseDialog();
        
        // 显示成功消息
        setError(null);
      } catch (error) {
        console.error(`保存${editType.toUpperCase()}失败:`, error);
        setError(`保存失败: ${error.message}`);
      } finally {
        setSaving(false);
      }
    };

    // 处理上传图标点击
    const handleUploadClick = (templateId, type) => {
      setUploadingTemplateId(templateId);
      setUploadType(type); // 'icon' 或 'pdfExample'
      setUploadDialogOpen(true);
    };

    // 处理文件上传
    const handleUploadFiles = async (files) => {
      if (!uploadingTemplateId || !uploadType || !files || files.length === 0) {
        return;
      }

      try {
        const file = files[0].file;
        const templateData = await templateApi.getTemplateById(uploadingTemplateId);

        // 准备更新数据
        const updateData = {
          name: templateData.name || '',
          type: templateData.type || templateData.typeName || '',
          description: templateData.description || '',
          usage: Array.isArray(templateData.usage) ? templateData.usage : [],
          tenant: templateData.tenant || '',
          theme: templateData.theme || '',
        };

        // 根据上传类型决定传递哪个文件
        const pdfExample = uploadType === 'pdfExample' ? file : null;
        const icon = uploadType === 'icon' ? file : null;

        // 更新模板
        await templateApi.updateTemplate(uploadingTemplateId, updateData, pdfExample, icon);

        // 刷新数据
        const apiData = await templateApi.getTemplates();
        let transformedData = transformApiData(Array.isArray(apiData) ? apiData : (apiData._embedded?.templates || apiData.content || []));
        
        if (selectedTenant === 'global') {
          transformedData = transformedData.filter(item => 
            item.templateType === 'Global'
          );
        } else if (selectedTenant === 'tenant1' || selectedTenant === 'specific') {
          transformedData = transformedData.filter(item => 
            item.templateType === 'Specific'
          );
        }
        
        setData(transformedData);
        setUploadDialogOpen(false);
        setUploadingTemplateId(null);
        setUploadType(null);
      } catch (error) {
        console.error('上传文件失败:', error);
      }
    };

    // 关闭上传对话框
    const handleCloseUploadDialog = () => {
      setUploadDialogOpen(false);
      setUploadingTemplateId(null);
      setUploadType(null);
    };
  
    return (
      <Box sx={{ backgroundColor: 'grey.200', height: '85vh', paddingTop: 6, paddingLeft: 5, paddingRight: 5,paddingBottom: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ backgroundColor: 'background.paper', padding: 3, boxShadow: 'none', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <HeaderContainer>
            <Title>Super Admin</Title>
            <Box sx={{ marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControl size="small" sx={{ minWidth: 125 }}>
                <Select
                  value={selectedTenant}
                  onChange={handleTenantChange}
                  displayEmpty
                  sx={{
                    backgroundColor: 'background.paper',
                    height: '30px', 
                    fontSize: '14px', 
                    marginTop: '40px',
                  }}
                >
                  <MenuItem value="global">Global</MenuItem>
                  <MenuItem value="tenant1">Specific</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                size="small"
                onClick={() => setNewPublicationDialogOpen(true)}
                sx={(theme) => ({
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  fontSize: '12px',
                  padding: '4px 20px',
                  minWidth: 'auto',
                  width: 'auto',
                  textTransform: 'none',
                  marginTop: '40px',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: 'none',
                  },
                })}
              >
                + ADD
              </Button>
            </Box>
          </HeaderContainer>

          {/* 错误提示 */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* 加载状态 */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && (
            <Box sx={{ paddingTop: 0, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <TableContainer 
                component={Paper} 
                sx={{ 
                  boxShadow: 1, 
                  minWidth: 1200,
                  height: '100%', 
                  overflowX: 'auto',
                  overflowY: 'auto', 
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                  // 隐藏垂直滚动条，保留水平滚动条
                  '&::-webkit-scrollbar': {
                    width: 0, 
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: (theme) => theme.palette.grey[200],
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: (theme) => theme.palette.grey[400],
                    borderRadius: '4px',
                    '&:hover': {
                      background: (theme) => theme.palette.grey[500],
                    },
                  },
                  scrollbarWidth: 'thin',
                  scrollbarColor: (theme) => `${theme.palette.grey[400]} ${theme.palette.grey[200]}`,
                }}
              >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableHeader sx={{ minWidth: 190, textAlign: 'center', fontWeight: 'bold'}}>Name</TableHeader>
                        <TableHeader sx={{ minWidth: 500, fontWeight: 'bold' }}>Description</TableHeader>
                        <TableHeader sx={{ minWidth: 140, textAlign: 'center', fontWeight: 'bold' }}>Image</TableHeader>
                        <TableHeader sx={{ minWidth: 220, textAlign: 'center', fontWeight: 'bold' }}>PDF Example</TableHeader>
                        <TableHeader sx={{ minWidth: 140, fontWeight: 'bold' }}>Tenant</TableHeader>
                        <TableHeader sx={{ minWidth: 140, fontWeight: 'bold' }}>Theme</TableHeader>
                        <TableHeader sx={{ minWidth: 200, textAlign: 'center', fontWeight: 'bold' }}>Type</TableHeader>
                        <TableHeader sx={{ minWidth: 180, textAlign: 'center', fontWeight: 'bold' }}>Usage</TableHeader>
                        <TableHeader sx={{ minWidth: 190, textAlign: 'center', fontWeight: 'bold' }}>Template Type</TableHeader>
                        <TableHeader sx={{ minWidth: 200, textAlign: 'center', fontWeight: 'bold' }}>Created</TableHeader>
                        <TableHeader sx={{ minWidth: 180, textAlign: 'center', fontWeight: 'bold' }}>Created by</TableHeader>
                        <TableHeader sx={{ minWidth: 200, textAlign: 'center', fontWeight: 'bold' }}>Last Update</TableHeader>
                        <TableHeader sx={{ minWidth: 180, textAlign: 'center', fontWeight: 'bold' }}>Last Updated by</TableHeader>
                        <TableHeader sx={{ minWidth: 220, textAlign: 'center', fontWeight: 'bold' }}>CSS</TableHeader>
                        <TableHeader sx={{ minWidth: 220, textAlign: 'center', fontWeight: 'bold' }}>HTML</TableHeader>
                        <StickyHeader sx={{ minWidth: 120, textAlign: 'center', fontWeight: 'bold' }}>Operation</StickyHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={16} sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No data
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.map((row) => (
                      <TableRowStyled key={row.id} hover>
                        <TableCellStyled sx={{ textAlign: 'center', width: '190px', minWidth: '190px', maxWidth: '190px' }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              width: '100%',
                              maxWidth: '100%',
                              wordBreak: 'break-word',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal'
                            }}
                          >
                            {row.name}
                          </Typography>
                        </TableCellStyled>
                        <TableCellStyled>
                          <DescriptionText>{row.description}</DescriptionText>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                            {row.image ? (
                              <Box
                                component="img"
                                src={row.image}
                                alt={row.name}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                }}
                              />
                            ) : (
                              <ImagePlaceholder />
                            )}
                            <UploadIconButton 
                              size="small"
                              onClick={() => handleUploadClick(row.id, 'icon')}
                            >
                              <Box
                                component="img"
                                src="/assets/upload.png"
                                alt="Upload"
                                sx={{
                                  width: 16,
                                  height: 16,
                                  objectFit: 'contain',
                                }}
                              />
                            </UploadIconButton>
                          </Box>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <PdfThumbnailContainer>
                              <PdfThumbnail>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>
                                  PDF
                                </Typography>
                              </PdfThumbnail>
                              <UploadIconButton 
                                size="small"
                                onClick={() => handleUploadClick(row.id, 'pdfExample')}
                              >
                                <Box
                                  component="img"
                                  src="/assets/upload.png"
                                  alt="Upload"
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    objectFit: 'contain',
                                  }}
                                />
                              </UploadIconButton>
                            </PdfThumbnailContainer>
                          </Box>
                        </TableCellStyled>
                        <TableCellStyled>
                          <Typography variant="body2">{row.tenant}</Typography>
                        </TableCellStyled>
                        <TableCellStyled>
                          <Typography variant="body2">{row.theme}</Typography>
                        </TableCellStyled>
                        <TableCellStyled >
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <FormControl size="small" sx={{ minWidth: 110 }}>
                              <Select
                                value={row.type}
                                onChange={(e) => handleTypeChange(row.id, e.target.value)}
                                sx={{
                                  fontSize: '14px',
                                  height: '28px',
                                }}
                              >
                                <MenuItem value="Catalog">Catalog</MenuItem>
                                <MenuItem value="Shelfcard">Shelfcard</MenuItem>
                                <MenuItem value="DataSheet">DataSheet</MenuItem>
                                <MenuItem value="Flyer">Flyer</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                            {row.usage.map((usage, index) => (
                              <UsageChip
                                key={index}
                                label={usage}
                                onDelete={() => handleUsageDelete(row.id, index)}
                                deleteIcon={<CloseIcon />}
                              />
                            ))}
                          </Box>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Typography variant="body2">{row.templateType}</Typography>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Typography variant="body2">{row.created}</Typography>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Typography variant="body2">{row.createdBy || '-'}</Typography>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Typography variant="body2">{row.lastUpdate || '-'}</Typography>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Typography variant="body2">{row.lastUpdatedBy || '-'}</Typography>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Box
                            component="img"
                            src="/assets/edit.png"
                            alt="Edit CSS"
                            onClick={() => handleEditClick(row.id, 'css')}
                            sx={{
                              width: 20,
                              height: 20,
                              objectFit: 'contain',
                              cursor: 'pointer',
                            }}
                          />
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Box
                            component="img"
                            src="/assets/edit.png"
                            alt="Edit HTML"
                            onClick={() => handleEditClick(row.id, 'html')}
                            sx={{
                              width: 20,
                              height: 20,
                              objectFit: 'contain',
                              cursor: 'pointer',
                            }}
                          />
                        </TableCellStyled>
                        <StickyCell sx={{ textAlign: 'center' }}>
                          <Box
                            component="img"
                            src="/assets/delete.png"
                            alt="Delete"
                            sx={{
                              width: 20,
                              height: 20,
                              objectFit: 'contain',
                              cursor: 'pointer',
                            }}
                          />
                        </StickyCell>
                      </TableRowStyled>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
            </Box>
          )}
        </Paper>

        {/* 编辑 CSS/HTML 的 Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              minHeight: '500px',
              maxHeight: '90vh'
            }
          }}
        >
          <DialogTitle>
            Edit {editType?.toUpperCase() || ''}
          </DialogTitle>
          <DialogContent>
            {loadingContent ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                <TextField
                  placeholder={`Enter your ${editType?.toUpperCase()} content here...`}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={15}
                  sx={{
                    width: "100%",
                    '& .MuiOutlinedInput-root': {
                      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                      fontSize: '14px',
                      backgroundColor: '#2d2d2d',
                      color: '#ffffff',
                      '& fieldset': {
                        borderColor: '#555',
                      },
                      '&:hover fieldset': {
                        borderColor: '#777',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: (theme) => theme.palette.primary.main,
                      },
                    }
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveContent}
              variant="contained"
              disabled={saving || loadingContent}
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              {saving ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* New Publication Dialog */}
        <NewPublicationDialog
          open={newPublicationDialogOpen}
          onClose={() => setNewPublicationDialogOpen(false)}
          onConfirm={(formData) => {
            // TODO: 实现创建新 publication 的逻辑
            console.log('Confirm new publication:', formData);
            setNewPublicationDialogOpen(false);
          }}
        />

        {/* Upload Dialog */}
        <UploadDialog
          open={uploadDialogOpen}
          onClose={handleCloseUploadDialog}
          onNext={handleUploadFiles}
          onCancel={handleCloseUploadDialog}
          uploadType={uploadType}
        />
      </Box>
    );
  }
  
  export default SuperAdmin;
  
  