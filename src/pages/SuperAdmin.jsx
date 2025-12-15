import {
    Box,
    Button,
    Chip,
    Checkbox,
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
    Typography,
    Autocomplete
  } from '@mui/material';
  import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect, useCallback, useRef } from 'react';
  import templateApi from '../services/templateApi';
  import fileApi from '../services/fileApi';
  import CookieService from '../utils/cookieService';
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
    backgroundColor: theme.palette.grey[100],
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
    wordBreak: 'break-word',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
  }));
  
  const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      minHeight: '40px',
      height: 'auto',
      '& fieldset': {
        borderColor: '#b3b3b3',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#b3b3b3',
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main || '#f16508',
      },
    },
    '& .MuiAutocomplete-inputRoot': {
      padding: '5px 14px !important',
      minHeight: '40px',
      height: 'auto',
      '&.MuiOutlinedInput-root': {
        padding: '5px 14px !important',
      },
      '& .MuiAutocomplete-input': {
        padding: '0px !important',
        fontSize: '14px',
        fontFamily: '"Roboto-Regular", sans-serif',
        color: '#4d4d4d',
        height: '20px',
      },
    },
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
      
      // 判断是否有 icon（PDF Example 也使用相同的 icon）
      const hasIcon = item.iconFileId && item.iconFileId !== null && item.iconFileId !== undefined && item.iconFileId !== '';
      
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
        image: hasIcon ? `/srv/v1.0/main/files/${item.iconFileId}` : null,
        pdfExample: hasIcon ? `/srv/v1.0/main/files/${item.iconFileId}` : null, // PDF Example 显示和 Image 相同的图片
        tenant: item.tenant || '-',
        theme: item.theme || '-',
        type: item.typeName || '-',
        usage: usage.length > 0 ? usage : ['-'],
        templateType: templateType,
        parentId: item.parentId !== null && item.parentId !== undefined ? item.parentId : '-',
        created: formatDate(item.createdAt || '-'),
        createdBy: item.createdBy || '-',
        lastUpdate: formatDate(item.updatedAt || '-'),
        lastUpdatedBy: item.updatedBy || '-',
        css: hasCss ? 'Edit' : '-',
        html: hasHtml ? 'Edit' : '-',
      };
    });
  };

  // 带认证的图片组件
  const AuthenticatedImage = ({ src, alt, templateId, onLoadImage, blobUrl, sx }) => {
    const [imageSrc, setImageSrc] = useState(blobUrl || src);
    const [loading, setLoading] = useState(!blobUrl);
    const [error, setError] = useState(false);

    // 当 blobUrl 变化时，更新 imageSrc
    useEffect(() => {
      if (blobUrl) {
        setImageSrc(blobUrl);
        setLoading(false);
        setError(false);
      } else if (src) {
        setImageSrc(src);
      }
    }, [blobUrl, src]);

    useEffect(() => {
      if (!blobUrl && src) {
        setLoading(true);
        setError(false);
        onLoadImage(src, templateId).then(url => {
          if (url) {
            setImageSrc(url);
          } else {
            setError(true);
          }
          setLoading(false);
        }).catch(() => {
          setError(true);
          setLoading(false);
        });
      }
    }, [src, templateId, blobUrl, onLoadImage]);

    if (error || loading) {
      return <ImagePlaceholder />;
    }

    return (
      <Box
        component="img"
        src={imageSrc}
        alt={alt}
        onError={() => {
          console.error('图片加载失败:', src, 'templateId:', templateId);
          setError(true);
        }}
        onLoad={() => {
          console.log('图片加载成功:', src, 'templateId:', templateId);
        }}
        sx={sx}
      />
    );
  };

  function SuperAdmin() {
    const [selectedTenant, setSelectedTenant] = useState('tenant1');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [_error, setError] = useState(null);
    const [imageBlobUrls, setImageBlobUrls] = useState(new Map());
    const imageBlobUrlsRef = useRef(new Map()); 
    
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
    
    // 行编辑模式状态
    const [editingRows, setEditingRows] = useState(new Set());

    const loadAuthenticatedImage = useCallback(async (imageUrl, templateId) => {
      try {
        const token = CookieService.getToken();
        if (!token) {
          console.error('No authentication token available');
          return null;
        }

        if (imageBlobUrlsRef.current.has(templateId)) {
          return imageBlobUrlsRef.current.get(templateId);
        }

        const headers = fileApi.getHeaders(false); 
        const response = await fetch(imageUrl, {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error('Unauthorized: Token may be expired or invalid');
          }
          throw new Error(`Failed to load image: ${response.status}`);
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        imageBlobUrlsRef.current.set(templateId, blobUrl);
        setImageBlobUrls(new Map(imageBlobUrlsRef.current));
        
        return blobUrl;
      } catch (error) {
        console.error('Error loading authenticated image:', error);
        return null;
      }
    }, []);

    useEffect(() => {
      const ref = imageBlobUrlsRef.current;
      return () => {
        ref.forEach(url => URL.revokeObjectURL(url));
        ref.clear();
      };
    }, []);
  
    // 从 API 获取模板数据
    useEffect(() => {
      const fetchTemplates = async () => {
        try {
          setLoading(true);
          setError(null);
          
          console.log('开始获取模板数据...');
          const apiData = await templateApi.getTemplateAll();
          
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
  
    const handleUsageChange = (rowId, newValue) => {
      // 将小写的值转换为首字母大写的格式用于显示
      const formattedUsage = Array.isArray(newValue) 
        ? newValue.map(u => {
            const lower = u.toLowerCase();
            if (lower === 'internal') return 'Internal';
            if (lower === 'external') return 'External';
            return u.charAt(0).toUpperCase() + u.slice(1).toLowerCase();
          })
        : [];
      
      setData(prevData =>
        prevData.map(row =>
          row.id === rowId
            ? { ...row, usage: formattedUsage.length > 0 ? formattedUsage : ['-'] }
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

    const handleNameChange = (rowId, newName) => {
      // 限制最多 30 个字符
      const truncatedName = newName.length > 30 ? newName.slice(0, 30) : newName;
      setData(prevData =>
        prevData.map(row =>
          row.id === rowId
            ? { ...row, name: truncatedName }
            : row
        )
      );
    };

    const handleDescriptionChange = (rowId, newDescription) => {
      // 限制最多 150 个字符
      const truncatedDescription = newDescription.length > 150 ? newDescription.slice(0, 150) : newDescription;
      setData(prevData =>
        prevData.map(row =>
          row.id === rowId
            ? { ...row, description: truncatedDescription }
            : row
        )
      );
    };

    const handleSaveRowData = async (rowId) => {
      try {
        const rowData = data.find(row => row.id === rowId);
        if (!rowData) {
          console.error('Row data not found for ID:', rowId);
          return;
        }

        const templateData = await templateApi.getTemplateById(rowId);

        const typeId = await templateApi.getTypeId(rowData.type);
        if (!typeId) {
          throw new Error(`Failed to get type ID for ${rowData.type}`);
        }

        const updateData = {
          name: rowData.name || templateData.name || '',
          description: rowData.description || templateData.description || '',
          typeId: typeId,
          usage: rowData.usage && rowData.usage.length > 0 && rowData.usage[0] !== '-'
            ? rowData.usage.map(u => u.toLowerCase())
            : (Array.isArray(templateData.usage) ? templateData.usage : []),
          tenant: templateData.tenant || '',
          theme: templateData.theme || '',
          html: templateData.html || '',
          css: templateData.css || '',
        };

        if (templateData.pdfFileId) {
          updateData.pdfFileId = templateData.pdfFileId;
        }
        if (templateData.iconFileId) {
          updateData.iconFileId = templateData.iconFileId;
        }

        if (templateData.parentId !== null && templateData.parentId !== undefined) {
          updateData.parentId = templateData.parentId;
        }

        await templateApi.updateTemplate(rowId, updateData);
        
        console.log('Row data saved successfully for ID:', rowId);

        // 刷新数据列表
        const apiData = await templateApi.getTemplateAll();
        let transformedData = transformApiData(Array.isArray(apiData) ? apiData : (apiData._embedded?.templates || apiData.content || []));
        
        // 根据 selectedTenant 过滤数据
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
        setError(null); // 清除之前的错误
      } catch (saveError) {
        console.error('Failed to save row data:', saveError);
        setError(`Failed to save: ${saveError.message}`);
      }
    };

    // 处理编辑图标点击
    const handleEditClick = async (templateId, type) => {
      setCurrentTemplateId(templateId);
      setEditType(type);
      setDialogOpen(true);
      setEditContent('');
      setLoadingContent(true);
      
      try {
        // 从模板详情中获取 CSS 或 HTML 内容
        const templateData = await templateApi.getTemplateById(templateId);
        const content = templateData[type] || ''; // type 是 'css' 或 'html'
        setEditContent(content);
      } catch (error) {
        console.error(`Failed to get ${type.toUpperCase()} content:`, error);
        setEditContent(''); // 如果获取失败，显示空内容
      } finally {
        setLoadingContent(false);
      }
    };

    // 关闭 Dialog
    const handleCloseDialog = () => {
      setDialogOpen(false);
    };

    // 对话框完全关闭后清理状态
    const handleDialogExited = () => {
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
        const apiData = await templateApi.getTemplateAll();
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
        const fileItem = files[0];
        
        if (!fileItem.fileId) {
          throw new Error('File ID is missing. File may not have been uploaded successfully.');
        }

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


        const existingFileId = uploadType === 'pdfExample' 
          ? templateData.pdfFileId 
          : templateData.iconFileId;

        if (existingFileId && existingFileId !== fileItem.fileId) {
          await fileApi.updateFile(existingFileId, fileItem.file);
          if (uploadType === 'pdfExample') {
            updateData.pdfFileId = existingFileId;
          } else if (uploadType === 'icon') {
            updateData.iconFileId = existingFileId;
          }
        } else {
          if (uploadType === 'pdfExample') {
            updateData.pdfFileId = fileItem.fileId;
          } else if (uploadType === 'icon') {
            updateData.iconFileId = fileItem.fileId;
          }
        }

        // 更新模板
        await templateApi.updateTemplate(uploadingTemplateId, updateData);

        // 清除该模板的图片缓存，强制重新加载
        if (uploadType === 'icon') {
          const oldBlobUrl = imageBlobUrlsRef.current.get(uploadingTemplateId);
          if (oldBlobUrl) {
            URL.revokeObjectURL(oldBlobUrl);
          }
          imageBlobUrlsRef.current.delete(uploadingTemplateId);
          setImageBlobUrls(new Map(imageBlobUrlsRef.current));
        }

        // 刷新数据
        const apiData = await templateApi.getTemplateAll();
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

    // 切换行编辑模式
    const handleToggleRowEdit = async (rowId) => {
      setEditingRows(prev => {
        const newSet = new Set(prev);
        if (newSet.has(rowId)) {
          newSet.delete(rowId);
          handleSaveRowData(rowId).catch(err => {
            console.error('Failed to save row data on exit edit mode:', err);
          });
        } else {
          newSet.add(rowId);
        }
        return newSet;
      });
    };

    // 删除
    const handleDeleteClick = async (rowId) => {
      if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
        return;
      }

      try {
        setData(prevData => prevData.filter(row => row.id !== rowId));
        
        await templateApi.deleteTemplate(rowId);
        
        console.log('Template deleted successfully:', rowId);

        const apiData = await templateApi.getTemplateAll();
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
        setError(null);
      } catch (error) {
        console.error('Failed to delete template:', error);
        try {
          const apiData = await templateApi.getTemplateAll();
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
        } catch (refreshError) {
          console.error('Failed to refresh data after delete error:', refreshError);
        }
        setError(`Failed to delete: ${error.message}`);
      }
    };

    return (
      <Box sx={{ backgroundColor: 'grey.200', height: '85vh', paddingTop: 6, paddingLeft: 5, paddingRight: 5,paddingBottom: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ backgroundColor: 'background.paper', padding: 3, boxShadow: 'none', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <HeaderContainer>
            <Title>Manage Publications (Global)</Title>
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

          {/* 加载状态 */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && (
            <Box sx={{ paddingTop: '0px', flex: 1, overflow: 'visible', display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
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
                  position: 'relative',
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
                        <TableHeader sx={{ minWidth: 140, textAlign: 'center', fontWeight: 'bold' }}>Image</TableHeader>
                        <TableHeader sx={{ minWidth: 100, textAlign: 'center', fontWeight: 'bold' }}>ID</TableHeader>
                        <TableHeader sx={{ minWidth: 190, textAlign: 'center', fontWeight: 'bold'}}>Name</TableHeader>
                        <TableHeader sx={{ minWidth: 190, textAlign: 'center', fontWeight: 'bold' }}>Template Type</TableHeader>
                        <TableHeader sx={{ minWidth: 200, textAlign: 'center', fontWeight: 'bold' }}>Type</TableHeader>
                        <TableHeader sx={{ minWidth: 140, textAlign: 'center', fontWeight: 'bold' }}>Tenant</TableHeader>
                        <TableHeader sx={{ minWidth: 140, textAlign: 'center', fontWeight: 'bold' }}>Theme</TableHeader>
                        <TableHeader sx={{ minWidth: 200, textAlign: 'center', fontWeight: 'bold' }}>Parent</TableHeader>
                        <TableHeader sx={{ minWidth: 400, textAlign: 'center', fontWeight: 'bold' }}>Description</TableHeader>
                        <TableHeader sx={{ minWidth: 265, textAlign: 'center', fontWeight: 'bold' }}>Usage</TableHeader>
                        <TableHeader sx={{ minWidth: 150, textAlign: 'center', fontWeight: 'bold' }}>PDF per Product</TableHeader>
                        <TableHeader sx={{ minWidth: 200, textAlign: 'center', fontWeight: 'bold' }}>Created</TableHeader>
                        <TableHeader sx={{ minWidth: 180, textAlign: 'center', fontWeight: 'bold' }}>Created by</TableHeader>
                        <TableHeader sx={{ minWidth: 200, textAlign: 'center', fontWeight: 'bold' }}>Last Update</TableHeader>
                        <TableHeader sx={{ minWidth: 180, textAlign: 'center', fontWeight: 'bold' }}>Last Updated by</TableHeader>
                        <TableHeader sx={{ minWidth: 220, textAlign: 'center', fontWeight: 'bold' }}>CSS</TableHeader>
                        <TableHeader sx={{ minWidth: 220, textAlign: 'center', fontWeight: 'bold' }}>HTML</TableHeader>
                        <TableHeader sx={{ minWidth: 120, textAlign: 'center', fontWeight: 'bold' }}>PDF Example</TableHeader>
                        <StickyHeader sx={{ minWidth: 120, textAlign: 'center', fontWeight: 'bold' }}>Operation</StickyHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={19} sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No data
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.map((row) => (
                      <TableRowStyled key={row.id} hover>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                            {row.image ? (
                              <AuthenticatedImage
                                src={row.image}
                                alt={row.name}
                                templateId={row.id}
                                onLoadImage={loadAuthenticatedImage}
                                blobUrl={imageBlobUrls.get(row.id)}
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
                            {editingRows.has(row.id) && (
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
                            )}
                          </Box>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Typography variant="body2">{row.id}</Typography>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'left', width: '190px', minWidth: '190px', maxWidth: '190px' }}>
                          {editingRows.has(row.id) ? (
                            <TextField
                              value={row.name}
                              onChange={(e) => handleNameChange(row.id, e.target.value)}
                              variant="outlined"
                              size="small"
                              multiline
                              maxRows={3}
                              inputProps={{ maxLength: 30 }}
                              sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-root': {
                                  fontSize: '14px',
                                  padding: '5px 14px',
                                  minHeight: '40px',
                                  height: 'auto',
                                },
                              }}
                            />
                          ) : (
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
                          )}
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Typography variant="body2">{row.templateType}</Typography>
                        </TableCellStyled>
                        <TableCellStyled>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            {editingRows.has(row.id) ? (
                              <FormControl size="small" sx={{ minWidth: 110 }}>
                                <Select
                                  value={row.type}
                                  onChange={(e) => handleTypeChange(row.id, e.target.value)}
                                  sx={{
                                    fontSize: '14px',
                                    minHeight: '40px',
                                    height: 'auto',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      padding: '5px 14px',
                                    },
                                    '& .MuiSelect-select': {
                                      padding: '5px 14px',
                                    },
                                  }}
                                >
                                  <MenuItem value="Catalog">Catalog</MenuItem>
                                  <MenuItem value="Shelfcard">Shelfcard</MenuItem>
                                  <MenuItem value="DataSheet">DataSheet</MenuItem>
                                  <MenuItem value="Flyer">Flyer</MenuItem>
                                </Select>
                              </FormControl>
                            ) : (
                              <Typography variant="body2">{row.type}</Typography>
                            )}
                          </Box>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Typography variant="body2">{row.tenant}</Typography>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Typography variant="body2">{row.theme}</Typography>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Typography variant="body2">{row.parentId}</Typography>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'left' }}>
                          {editingRows.has(row.id) ? (
                            <TextField
                              value={row.description}
                              onChange={(e) => handleDescriptionChange(row.id, e.target.value)}
                              variant="outlined"
                              size="small"
                              multiline
                              maxRows={3}
                              inputProps={{ maxLength: 150 }}
                              sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-root': {
                                  fontSize: '14px',
                                  padding: '5px 14px',
                                  minHeight: '40px',
                                  height: 'auto',
                                },
                              }}
                            />
                          ) : (
                            <DescriptionText>{row.description}</DescriptionText>
                          )}
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          {editingRows.has(row.id) ? (
                            <StyledAutocomplete
                              multiple
                              disableClearable
                              options={['internal', 'external']}
                              value={row.usage
                                .filter(u => u !== '-')
                                .map(u => u.toLowerCase())}
                              onChange={(event, newValue) => handleUsageChange(row.id, newValue)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={row.usage.filter(u => u !== '-').length === 0 ? 'Select Usage' : ''}
                                  InputProps={{
                                    ...params.InputProps,
                                    sx: {
                                      '& input::placeholder': {
                                        color: '#808080',
                                        opacity: 1,
                                        fontSize: '14px',
                                        fontFamily: '"Roboto-Regular", sans-serif',
                                      },
                                    },
                                  }}
                                />
                              )}
                              renderTags={(value, getTagProps) =>
                                value.map((option, index) => {
                                  const { key, ...tagProps } = getTagProps({ index });
                                  return (
                                    <Chip
                                      key={key}
                                      label={option.charAt(0).toUpperCase() + option.slice(1)}
                                      {...tagProps}
                                      deleteIcon={<CloseIcon />}
                                    sx={(theme) => ({
                                      height: '24px',
                                      fontSize: '12px',
                                      marginRight: '4px',
                                      backgroundColor: theme.palette.grey[200],
                                      border: `1px solid ${theme.palette.grey[400]}`,
                                      color: '#4d4d4d',
                                      fontFamily: '"Roboto-Regular", sans-serif',
                                      '& .MuiChip-deleteIcon': {
                                        fontSize: '16px',
                                        color: theme.palette.text.secondary,
                                        margin: '0 4px 0 -4px',
                                        '&:hover': {
                                          color: theme.palette.error.main,
                                          backgroundColor: 'transparent',
                                        },
                                      },
                                    })}
                                    />
                                  );
                                })
                              }
                              renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                  {option.charAt(0).toUpperCase() + option.slice(1)}
                                </Box>
                              )}
                              PaperComponent={({ children, ...other }) => (
                                <Box
                                  {...other}
                                  sx={{
                                    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
                                    borderRadius: '4px',
                                    marginTop: '4px',
                                    backgroundColor: '#ffffff !important',
                                    '& .MuiAutocomplete-listbox': {
                                      backgroundColor: '#ffffff !important',
                                      padding: 0,
                                    },
                                    '& .MuiAutocomplete-option': {
                                      fontSize: '14px',
                                      fontFamily: '"Roboto-Regular", sans-serif',
                                      padding: '8px 16px',
                                      minHeight: 'auto',
                                      backgroundColor: '#ffffff !important',
                                      opacity: '1 !important',
                                      '&:hover': {
                                        backgroundColor: '#f5f5f5 !important',
                                        opacity: '1 !important',
                                      },
                                      '&.Mui-focused': {
                                        backgroundColor: '#f5f5f5 !important',
                                        opacity: '1 !important',
                                      },
                                      '&[aria-selected="true"]': {
                                        backgroundColor: '#f5f5f5 !important',
                                        opacity: '1 !important',
                                        '&.Mui-focused': {
                                          backgroundColor: '#eeeeee !important',
                                          opacity: '1 !important',
                                        },
                                      },
                                    },
                                  }}
                                >
                                  {children}
                                </Box>
                              )}
                              getOptionLabel={(option) => option}
                              isOptionEqualToValue={(option, value) => option === value}
                              filterOptions={(options) => {
                                const currentUsage = row.usage
                                  .filter(u => u !== '-')
                                  .map(u => u.toLowerCase());
                                return options.filter((option) => !currentUsage.includes(option));
                              }}
                            />
                          ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                              {row.usage.filter(u => u !== '-').length > 0 ? (
                                row.usage.filter(u => u !== '-').map((usage, index) => (
                                  <UsageChip
                                    key={index}
                                    label={usage}
                                    sx={{
                                      '& .MuiChip-deleteIcon': {
                                        display: 'none',
                                      },
                                    }}
                                  />
                                ))
                              ) : (
                                <Typography variant="body2">-</Typography>
                              )}
                            </Box>
                          )}
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Checkbox 
                            disabled={!editingRows.has(row.id)}
                            sx={{
                              '&.Mui-disabled': {
                                color: (theme) => theme.palette.grey[400],
                              },
                            }}
                          />
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
                            onClick={editingRows.has(row.id) ? () => handleEditClick(row.id, 'css') : undefined}
                            sx={{
                              width: 20,
                              height: 20,
                              objectFit: 'contain',
                              cursor: editingRows.has(row.id) ? 'pointer' : 'not-allowed',
                              opacity: editingRows.has(row.id) ? 1 : 0.5,
                              filter: editingRows.has(row.id) ? 'none' : 'grayscale(100%)',
                            }}
                          />
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Box
                            component="img"
                            src="/assets/edit.png"
                            alt="Edit HTML"
                            onClick={editingRows.has(row.id) ? () => handleEditClick(row.id, 'html') : undefined}
                            sx={{
                              width: 20,
                              height: 20,
                              objectFit: 'contain',
                              cursor: editingRows.has(row.id) ? 'pointer' : 'not-allowed',
                              opacity: editingRows.has(row.id) ? 1 : 0.5,
                              filter: editingRows.has(row.id) ? 'none' : 'grayscale(100%)',
                            }}
                          />
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <PdfThumbnailContainer>
                              {row.pdfExample ? (
                                <AuthenticatedImage
                                  src={row.pdfExample}
                                  alt="PDF Example"
                                  templateId={row.id}
                                  onLoadImage={loadAuthenticatedImage}
                                  blobUrl={imageBlobUrls.get(row.id)}
                                  sx={{
                                    width: 35,
                                    height: 50,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                  }}
                                />
                              ) : (
                                <PdfThumbnail>
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>
                                    PDF
                                  </Typography>
                                </PdfThumbnail>
                              )}
                              {editingRows.has(row.id) && (
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
                              )}
                            </PdfThumbnailContainer>
                          </Box>
                        </TableCellStyled>
                        <StickyCell sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                            <Box
                              component="img"
                              src="/assets/edit.png"
                              alt="Edit"
                              onClick={() => handleToggleRowEdit(row.id)}
                              sx={{
                                width: 20,
                                height: 20,
                                objectFit: 'contain',
                                cursor: 'pointer',
                              }}
                            />
                            <Box
                              component="img"
                              src="/assets/delete.png"
                              alt="Delete"
                              onClick={() => handleDeleteClick(row.id)}
                              sx={{
                                width: 20,
                                height: 20,
                                objectFit: 'contain',
                                cursor: 'pointer',
                              }}
                            />
                          </Box>
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
          TransitionProps={{
            onExited: handleDialogExited
          }}
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
          onConfirm={async (formData) => {
            try {
              if (!formData.name) {
                throw new Error('Template name is required');
              }

              const templateTypeName = formData.publicationType === 'global' ? 'Global' : 'Specific';
              const templateTypeId = await templateApi.getTemplateTypeId(templateTypeName);
              
              if (!templateTypeId) {
                throw new Error(`Failed to get template type ID for ${templateTypeName}`);
              }
              
              // 获取类型ID
              const typeId = await templateApi.getTypeId(formData.type);
              
              if (!typeId) {
                throw new Error(`Failed to get type ID for ${formData.type}`);
              }
              
              // 构建模板元数据
              const metadata = {
                name: formData.name,
                description: formData.description || '',
                usage: formData.usage || [],
                typeId: typeId,
                typeName: formData.type,
                templateTypeId: templateTypeId,
                html: '',
                css: '',
                pdfPerModel: false,
                iconFileId: formData.iconFileId || null,
                pdfFileId: formData.pdfFileId || null,
              };

              const createdTemplate = await templateApi.createTemplate(metadata);

              if (templateTypeName === 'Global' && createdTemplate && createdTemplate.id) {
                try {
                  const templateData = await templateApi.getTemplateById(createdTemplate.id);
                  
                  const updateData = {
                    name: templateData.name || '',
                    type: templateData.type || templateData.typeName || '',
                    description: templateData.description || '',
                    usage: Array.isArray(templateData.usage) ? templateData.usage : [],
                    tenant: templateData.tenant || '',
                    theme: templateData.theme || '',
                    parentId: createdTemplate.id, // 设置为自己的 id
                  };
                  
                  await templateApi.updateTemplate(createdTemplate.id, updateData);
                } catch (updateError) {
                  console.error('Failed to update parentId:', updateError);
                }
              }

              // 刷新数据列表
              const apiData = await templateApi.getTemplateAll();
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
              setNewPublicationDialogOpen(false);
              setError(null);
            } catch (err) {
              console.error('Failed to create publication:', err);
              setError(`Failed to create publication: ${err.message}`);
            }
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
  
  