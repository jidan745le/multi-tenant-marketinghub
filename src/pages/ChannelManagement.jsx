import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import AddTemplateDialog from '../components/AddTemplateDialog';
import AddChannelDialog from '../components/AddChannelDialog';

// Styled components
const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
}));

const Title = styled(Typography)(() => ({
  color: '#212121',
  textAlign: 'left',
  fontFamily: '"Lato-SemiBold", sans-serif',
  fontSize: '21px',
  lineHeight: '140%',
  fontWeight: 600,
  position: 'relative',
}));

const AddChannelButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main || '#eb6100',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#eb6100',
  borderWidth: '1px',
  padding: '6px 16px',
  color: '#ffffff',
  fontFamily: '"Lato-Medium", sans-serif',
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: '0.4px',
  fontWeight: 500,
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark || '#d5570a',
    borderColor: theme.palette.primary.dark || '#d5570a',
  },
}));

const TableWrapper = styled(Box)(() => ({
  flex: 1,
  overflow: 'hidden',
  paddingTop: 0,
  minHeight: 0,
}));

const MainTableContainer = styled(TableContainer)(({ theme }) => ({
  height: '100%',
  overflowX: 'auto',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[200],
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[400],
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.grey[500],
    },
  },
}));

const TableHeader = styled(TableCell)(() => ({
  backgroundColor: '#fafafa',
  borderStyle: 'solid',
  borderColor: '#e0e0e0',
  borderWidth: '0px 0px 1px 0px',
  padding: '16px',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 400,
  color: '#212121',
  height: '72px',
}));

const TableRowStyled = styled(TableRow)(() => ({
  borderStyle: 'solid',
  borderColor: '#e0e0e0',
  borderWidth: '0px 0px 1px 0px',
  height: '81px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
}));

const TableCellStyled = styled(TableCell)(() => ({
  padding: '30px 16px',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 400,
  color: '#212121',
  verticalAlign: 'middle',
}));

const ChannelNameCell = styled(TableCell)(() => ({
  padding: '16px',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 400,
  color: '#212121',
  verticalAlign: 'middle',
}));

const ChannelNameContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingLeft: '18px',
}));

const ExpandIcon = styled(Typography)(() => ({
  color: '#000000',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '20px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 700,
  width: '12px',
  cursor: 'pointer',
  userSelect: 'none',
}));

const IconContainer = styled(Box)(() => ({
  borderStyle: 'solid',
  borderColor: '#bdbdbd',
  borderWidth: '1.2px',
  width: '38.4px',
  height: '38.4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  overflow: 'hidden',
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
}));

const ChannelNameText = styled(Typography)(() => ({
  color: '#212121',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '16px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 700,
  flex: 1,
}));

const FileNameText = styled(Typography)(() => ({
  color: '#212121',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 400,
}));

const OperationHeader = styled(TableHeader)(({ theme }) => ({
  position: 'sticky',
  right: 0,
  backgroundColor: '#fafafa',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#eb6100',
  borderWidth: '0px 0px 0px 1px',
  fontFamily: '"Lato-SemiBold", sans-serif',
  fontWeight: 600,
  zIndex: 10,
}));

const OperationCell = styled(TableCellStyled)(({ theme }) => ({
  position: 'sticky',
  right: 0,
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#eb6100',
  borderWidth: '0px 0px 0px 1px',
  zIndex: 9,
}));

const OperationContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '32px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
}));

const IconGroup = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '32px',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#bdbdbd',
  borderWidth: '1px',
  padding: '7px 15px',
  minWidth: '117px',
  height: '35px',
  color: theme.palette.primary.main || '#eb6100',
  fontFamily: '"Lato-SemiBold", sans-serif',
  fontSize: '14px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: theme.palette.primary.main || '#eb6100',
  },
}));

const StyledIconButton = styled(IconButton)(() => ({
  padding: 0,
  width: '24px',
  height: '24px',
  color: 'inherit',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));


// Mock data
const mockData = [
  {
    id: 1,
    isChannel: true,
    name: 'Syndication Connection',
    icon: '/assets/ego-logo-10.png',
    theme: 'KENDO',
    type: 'Channel',
    tenant: '-',
    mappings: '-',
    description: '-',
    expanded: true, // 默认展开
    templates: [
      { id: 11, name: 'SetubsheetEMEA', theme: 'KENDO', type: 'Line', tenant: 'SAAME', mappings: '2 mappings', file: 'SetupSheetEMEA.xlsx', description: '-' },
      { id: 12, name: 'Set EMEA', theme: 'KENDO', type: 'Line', tenant: 'SAAME', mappings: '1 mappings', file: 'SetupSheetEMEA.xlsx', description: '-' },
      { id: 13, name: 'Set EMEA', theme: 'KENDO', type: 'Line', tenant: 'SAAME', mappings: '1 mappings', file: 'SetupSheetEMEA.xlsx', description: '-' },
      { id: 14, name: 'Set EMEA', theme: 'KENDO', type: 'Line', tenant: 'SAAME', mappings: '1 mappings', file: 'SetupSheetEMEA.xlsx', description: '-' },
      { id: 15, name: 'Set EMEA', theme: 'KENDO', type: 'Line', tenant: 'SAAME', mappings: '1 mappings', file: 'SetupSheetEMEA.xlsx', description: '-' },
    ],
  },
  {
    id: 2,
    isChannel: true,
    name: 'General Sheet SAMME',
    icon: '/assets/group-2-70.png',
    theme: 'KENDO',
    type: 'Channel',
    tenant: '-',
    mappings: '-',
    description: '-',
    expanded: true, // 默认展开
    templates: [
      { id: 21, name: 'Setupsheet SAMME V2', theme: 'KENDO', type: 'Line', tenant: 'SAAME', mappings: '2 mappings', file: 'SetupsheetEMEA_V2_Updated.xdsx', description: '-' },
    ],
  },
  {
    id: 3,
    isChannel: true,
    name: 'Amazon',
    icon: '/assets/oip-c-10.png',
    theme: 'KENDO',
    type: 'Channel',
    tenant: '-',
    mappings: '-',
    description: '-',
    expanded: false, // 默认折叠
    templates: [],
  },
];

function ChannelManagement() {
  const [data, setData] = useState(mockData);
  const [addTemplateDialogOpen, setAddTemplateDialogOpen] = useState(false);
  const [addChannelDialogOpen, setAddChannelDialogOpen] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const [editingChannel, setEditingChannel] = useState(null);
  const [copyingChannel, setCopyingChannel] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [copyingTemplate, setCopyingTemplate] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const handleToggleExpand = (id) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const handleAddChannel = () => {
    setEditingChannel(null);
    setCopyingChannel(null);
    setAddChannelDialogOpen(true);
  };

  const handleCloseAddChannelDialog = () => {
    setAddChannelDialogOpen(false);
    setEditingChannel(null);
    setCopyingChannel(null);
  };

  const handleSaveChannel = (formData) => {
    if (editingChannel) {
      // 编辑模式：更新现有 channel
      setData(prevData =>
        prevData.map(item =>
          item.id === editingChannel.id
            ? {
                ...item,
                name: formData.name,
                description: formData.description || '-',
                icon: formData.icon || item.icon,
                type: formData.type === 'Channel' ? 'Channel' : 'Custom',
                // 如果 type 是 Channel，保持 theme，否则可能需要从 description 中提取
                theme: formData.type === 'Channel' ? (item.theme || 'KENDO') : (item.theme || 'KENDO'),
              }
            : item
        )
      );
    } else {
      // 新增模式：添加新 channel
      const newId = Math.max(...data.map(item => item.id), 0) + 1;
      const newChannel = {
        id: newId,
        isChannel: true,
        name: formData.name,
        icon: formData.icon || null,
        theme: 'KENDO', // 默认主题，可以根据需要调整
        type: formData.type === 'Channel' ? 'Channel' : 'Custom',
        tenant: '-',
        mappings: '-',
        description: formData.description || '-',
        expanded: false, // 默认折叠
        templates: [],
      };
      setData(prevData => [...prevData, newChannel]);
    }
    handleCloseAddChannelDialog();
  };

  const handleAddTemplate = (channelId) => {
    setCurrentChannelId(channelId);
    setEditingTemplate(null);
    setCopyingTemplate(null);
    setAddTemplateDialogOpen(true);
  };

  const handleCloseAddTemplateDialog = () => {
    setAddTemplateDialogOpen(false);
    setCurrentChannelId(null);
    setEditingTemplate(null);
    setCopyingTemplate(null);
  };

  const handleSaveTemplate = (formData) => {
    if (editingTemplate) {
      // 编辑模式：更新现有 template
      setData(prevData =>
        prevData.map(channel => {
          if (channel.templates && channel.templates.some(t => t.id === editingTemplate.id)) {
            return {
              ...channel,
              templates: channel.templates.map(template =>
                template.id === editingTemplate.id
                  ? {
                      ...template,
                      name: formData.templateLabel,
                      label: formData.templateLabel, // 同时更新 label 字段
                      theme: formData.theme,
                      type: formData.templateType,
                      templateType: formData.templateType, // 同时更新 templateType 字段
                      tenant: formData.channelName || template.tenant,
                      mappings: formData.templateDataDetails?.length 
                        ? `${formData.templateDataDetails.length} mappings` 
                        : (template.mappings || '0 mappings'),
                      file: formData.fileName || template.file || '-',
                      fileName: formData.fileName || template.fileName || '-',
                      description: formData.description || template.description || '-',
                      templateDataDetails: formData.templateDataDetails || [],
                    }
                  : template
              ),
            };
          }
          return channel;
        })
      );
      setSnackbar({
        open: true,
        message: `Template "${formData.templateLabel}" has been updated successfully.`,
        severity: 'success',
      });
    } else {
      // 新增模式：添加新 template
      const channel = data.find(item => item.id === currentChannelId);
      if (channel) {
        const newTemplateId = Math.max(
          ...channel.templates?.map(t => t.id) || [0],
          ...data.flatMap(c => c.templates?.map(t => t.id) || [0]),
          0
        ) + 1;
        
        const newTemplate = {
          id: newTemplateId,
          name: formData.templateLabel,
          label: formData.templateLabel,
          theme: formData.theme,
          type: formData.templateType,
          templateType: formData.templateType,
          tenant: formData.channelName || '-',
          mappings: formData.templateDataDetails?.length 
            ? `${formData.templateDataDetails.length} mappings` 
            : '0 mappings',
          file: formData.fileName || '-',
          fileName: formData.fileName || '-',
          description: formData.description || '-',
          templateDataDetails: formData.templateDataDetails || [],
        };

        setData(prevData =>
          prevData.map(item =>
            item.id === currentChannelId
              ? {
                  ...item,
                  templates: [...(item.templates || []), newTemplate],
                }
              : item
          )
        );
        setSnackbar({
          open: true,
          message: `Template "${formData.templateLabel}" has been created successfully.`,
          severity: 'success',
        });
      }
    }
    handleCloseAddTemplateDialog();
  };

  const handleEdit = (id) => {
    // 先查找是否是 channel
    const channel = data.find(item => item.id === id && item.isChannel);
    if (channel) {
      setEditingChannel(channel);
      setAddChannelDialogOpen(true);
      return;
    }
    
    // 如果不是 channel，查找是否是 template
    for (const channelItem of data) {
      if (channelItem.templates) {
        const template = channelItem.templates.find(t => t.id === id);
        if (template) {
          setEditingTemplate({
            ...template,
            channelId: channelItem.id,
            channelName: channelItem.name,
          });
          setCurrentChannelId(channelItem.id);
          setAddTemplateDialogOpen(true);
          return;
        }
      }
    }
  };

  const handleCopy = (id) => {
    // 先查找是否是 channel
    const channel = data.find(item => item.id === id && item.isChannel);
    if (channel) {
      setCopyingChannel(channel);
      setEditingChannel(null);
      setAddChannelDialogOpen(true);
      return;
    }
    
    // 如果不是 channel，查找是否是 template
    for (const channelItem of data) {
      if (channelItem.templates) {
        const template = channelItem.templates.find(t => t.id === id);
        if (template) {
          setCopyingTemplate({
            ...template,
            channelId: channelItem.id,
            channelName: channelItem.name,
            // 确保 templateDataDetails 被包含在复制数据中
            templateDataDetails: template.templateDataDetails || [],
          });
          setEditingTemplate(null);
          setCurrentChannelId(channelItem.id);
          setAddTemplateDialogOpen(true);
          return;
        }
      }
    }
  };

  const handleDelete = (id) => {
    // 先查找是否是 channel
    const channel = data.find(item => item.id === id && item.isChannel);
    if (channel) {
      // 检查是否有 templates
      if (channel.templates && channel.templates.length > 0) {
        // 有 templates，显示错误提示
        setSnackbar({
          open: true,
          message: `Channel "${channel.name}" is being used and cannot be deleted.`,
          severity: 'error',
        });
      } else {
        // 没有 templates，可以删除
        setData(prevData => prevData.filter(item => item.id !== id));
        setSnackbar({
          open: true,
          message: `Channel "${channel.name}" has been deleted successfully.`,
          severity: 'success',
        });
      }
      return;
    }
    
    // 如果不是 channel，查找是否是 template
    for (const channelItem of data) {
      if (channelItem.templates) {
        const template = channelItem.templates.find(t => t.id === id);
        if (template) {
          // 删除 template
          setData(prevData =>
            prevData.map(item =>
              item.id === channelItem.id
                ? {
                    ...item,
                    templates: item.templates.filter(t => t.id !== id),
                  }
                : item
            )
          );
          setSnackbar({
            open: true,
            message: `Template "${template.name}" has been deleted successfully.`,
            severity: 'success',
          });
          return;
        }
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDownload = (id) => {
    // 查找 template
    for (const channelItem of data) {
      if (channelItem.templates) {
        const template = channelItem.templates.find(t => t.id === id);
        if (template) {
          // 如果有文件，创建下载链接
          if (template.file && template.file !== '-') {
            // 使用 mock 数据，实际应该从 API 获取文件
            // 这里创建一个临时的下载链接
            const link = document.createElement('a');
            link.href = template.file.startsWith('http') 
              ? template.file 
              : `/excel/template/templateFile/${template.id}`;
            link.download = template.file;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setSnackbar({
              open: true,
              message: `Downloading template file: ${template.file}`,
              severity: 'success',
            });
          } else {
            setSnackbar({
              open: true,
              message: `Template "${template.name}" has no file to download.`,
              severity: 'error',
            });
          }
          return;
        }
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: 'grey.200', height: '85vh', paddingTop: 6, paddingLeft: 5, paddingRight: 5, paddingBottom: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ backgroundColor: 'background.paper', padding: 3, boxShadow: 'none', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <HeaderContainer>
          <Title>Channel & Template Managment</Title>
          <AddChannelButton onClick={handleAddChannel}>
            ADD CHANNEL
          </AddChannelButton>
        </HeaderContainer>

        <TableWrapper>
          <MainTableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableHeader sx={{ width: '310px', minWidth: '310px' }}>
                    Channel Name/ Template Label
                  </TableHeader>
                  <TableHeader sx={{ width: '184px', minWidth: '184px' }}>
                    Theme
                  </TableHeader>
                  <TableHeader sx={{ width: '169px', minWidth: '169px' }}>
                    Type
                  </TableHeader>
                  <TableHeader sx={{ width: '160px', minWidth: '160px' }}>
                    Tenant
                  </TableHeader>
                  <TableHeader sx={{ width: '198px', minWidth: '198px' }}>
                    Mappings
                  </TableHeader>
                  <TableHeader sx={{ width: '310px', minWidth: '310px' }}>
                    File
                  </TableHeader>
                  <TableHeader sx={{ width: '200px', minWidth: '200px' }}>
                    Description
                  </TableHeader>
                  <OperationHeader sx={{ width: '357px', minWidth: '357px' }}>
                    Operation
                  </OperationHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, rowIndex) => {
                  let currentIndex = rowIndex;
                  return (
                    <React.Fragment key={row.id}>
                      <TableRowStyled 
                        sx={{ 
                          backgroundColor: currentIndex % 2 === 0 ? '#ffffff' : '#fafafa' 
                        }}
                      >
                        <ChannelNameCell sx={{ width: '310px' }}>
                          <ChannelNameContainer>
                            <ExpandIcon onClick={() => handleToggleExpand(row.id)}>
                              {row.expanded ? '-' : '+'}
                            </ExpandIcon>
                            {row.icon && (
                              <IconContainer>
                                <img src={row.icon} alt={row.name} />
                              </IconContainer>
                            )}
                            <ChannelNameText>{row.name}</ChannelNameText>
                          </ChannelNameContainer>
                        </ChannelNameCell>
                        <TableCellStyled sx={{ width: '184px' }}>
                          {row.theme}
                        </TableCellStyled>
                        <TableCellStyled sx={{ width: '169px' }}>
                          {row.type}
                        </TableCellStyled>
                        <TableCellStyled sx={{ width: '160px' }}>
                          {row.tenant}
                        </TableCellStyled>
                        <TableCellStyled sx={{ width: '198px' }}>
                          {row.mappings}
                        </TableCellStyled>
                        <TableCellStyled sx={{ width: '310px' }}>
                          {row.file || '-'}
                        </TableCellStyled>
                        <TableCellStyled sx={{ width: '200px' }}>
                          {row.description || '-'}
                        </TableCellStyled>
                        <OperationCell 
                          sx={{ 
                            backgroundColor: currentIndex % 2 === 0 ? '#ffffff' : '#fafafa' 
                          }}
                        >
                          <OperationContent>
                            <IconGroup>
                              <StyledIconButton onClick={() => handleEdit(row.id)}>
                                <Box
                                  component="img"
                                  src="/assets/EditOutlined.png"
                                  alt="Edit"
                                  sx={{
                                    width: '24px',
                                    height: '24px',
                                    objectFit: 'contain',
                                  }}
                                />
                              </StyledIconButton>
                              <StyledIconButton onClick={() => handleCopy(row.id)}>
                                <Box
                                  component="img"
                                  src="/assets/copy.png"
                                  alt="Copy"
                                  sx={{
                                    width: '24px',
                                    height: '24px',
                                    objectFit: 'contain',
                                  }}
                                />
                              </StyledIconButton>
                              <StyledIconButton onClick={() => handleDelete(row.id)}>
                                <Box
                                  component="img"
                                  src="/assets/Frame.png"
                                  alt="Delete"
                                  sx={{
                                    width: '24px',
                                    height: '24px',
                                    objectFit: 'contain',
                                  }}
                                />
                              </StyledIconButton>
                            </IconGroup>
                            <ActionButton onClick={() => handleAddTemplate(row.id)}>
                              ADD TEMPLATE
                            </ActionButton>
                          </OperationContent>
                        </OperationCell>
                      </TableRowStyled>
                      {row.expanded && row.templates && row.templates.map((template) => {
                        currentIndex++;
                        return (
                          <TableRowStyled 
                            key={template.id} 
                            sx={{ 
                              backgroundColor: currentIndex % 2 === 0 ? '#ffffff' : '#fafafa' 
                            }}
                          >
                            <TableCellStyled sx={{ width: '310px', paddingLeft: '96px' }}>
                              <FileNameText>{template.name}</FileNameText>
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '184px' }}>
                              {template.theme}
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '169px' }}>
                              {template.type}
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '160px' }}>
                              {template.tenant}
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '198px' }}>
                              {template.mappings}
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '310px' }}>
                              <FileNameText>{template.file}</FileNameText>
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '200px' }}>
                              <FileNameText>{template.description || '-'}</FileNameText>
                            </TableCellStyled>
                            <OperationCell 
                              sx={{ 
                                backgroundColor: currentIndex % 2 === 0 ? '#ffffff' : '#fafafa' 
                              }}
                            >
                              <OperationContent>
                                <IconGroup>
                                  <StyledIconButton onClick={() => handleEdit(template.id)}>
                                    <Box
                                      component="img"
                                      src="/assets/EditOutlined.png"
                                      alt="Edit"
                                      sx={{
                                        width: '24px',
                                        height: '24px',
                                        objectFit: 'contain',
                                      }}
                                    />
                                  </StyledIconButton>
                                  <StyledIconButton onClick={() => handleCopy(template.id)}>
                                    <Box
                                      component="img"
                                      src="/assets/copy.png"
                                      alt="Copy"
                                      sx={{
                                        width: '24px',
                                        height: '24px',
                                        objectFit: 'contain',
                                      }}
                                    />
                                  </StyledIconButton>
                                  <StyledIconButton onClick={() => handleDownload(template.id)}>
                                    <Box
                                      component="img"
                                      src="/assets/downloadOutline.png"
                                      alt="Download"
                                      sx={{
                                        width: '24px',
                                        height: '24px',
                                        objectFit: 'contain',
                                      }}
                                    />
                                  </StyledIconButton>
                                  <StyledIconButton onClick={() => handleDelete(template.id)}>
                                    <Box
                                      component="img"
                                      src="/assets/Frame.png"
                                      alt="Delete"
                                      sx={{
                                        width: '24px',
                                        height: '24px',
                                        objectFit: 'contain',
                                      }}
                                    />
                                  </StyledIconButton>
                                </IconGroup>
                              </OperationContent>
                            </OperationCell>
                          </TableRowStyled>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </MainTableContainer>
        </TableWrapper>
      </Paper>

      {/* Add Template Dialog */}
      <AddTemplateDialog
        open={addTemplateDialogOpen}
        onClose={handleCloseAddTemplateDialog}
        onSave={handleSaveTemplate}
        channelId={currentChannelId}
        editData={editingTemplate}
        copyData={copyingTemplate}
        channels={data.filter(item => item.isChannel)}
      />

      {/* Add Channel Dialog */}
      <AddChannelDialog
        open={addChannelDialogOpen}
        onClose={handleCloseAddChannelDialog}
        onSave={handleSaveChannel}
        editData={editingChannel}
        copyData={copyingChannel}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={(theme) => ({
            backgroundColor: snackbar.severity === 'success' 
              ? theme.palette.primary.main 
              : undefined,
            '&.MuiAlert-filledSuccess': {
              backgroundColor: theme.palette.primary.main,
            },
            '&.MuiAlert-filledError': {
              backgroundColor: theme.palette.error.main,
            }
          })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ChannelManagement;

