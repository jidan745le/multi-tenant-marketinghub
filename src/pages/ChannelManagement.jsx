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

const DividerLine = styled(Box)(() => ({
  height: '0px',
  borderTop: '1px solid transparent',
  width: '100%',
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

  const handleToggleExpand = (id) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const handleAddChannel = () => {
    setAddChannelDialogOpen(true);
  };

  const handleCloseAddChannelDialog = () => {
    setAddChannelDialogOpen(false);
  };

  const handleSaveChannel = (formData) => {
    // TODO: 实现保存频道功能
    console.log('Save channel:', formData);
    // 可以在这里调用 API 保存频道
    handleCloseAddChannelDialog();
  };

  const handleAddTemplate = (channelId) => {
    setCurrentChannelId(channelId);
    setAddTemplateDialogOpen(true);
  };

  const handleCloseAddTemplateDialog = () => {
    setAddTemplateDialogOpen(false);
    setCurrentChannelId(null);
  };

  const handleSaveTemplate = (formData) => {
    // TODO: 实现保存模板功能
    console.log('Save template:', formData);
    // 可以在这里调用 API 保存模板
    handleCloseAddTemplateDialog();
  };

  const handleEdit = (id) => {
    // TODO: 实现编辑功能
    console.log('Edit clicked for:', id);
  };

  const handleCopy = (id) => {
    // TODO: 实现复制功能
    console.log('Copy clicked for:', id);
  };

  const handleDelete = (id) => {
    // TODO: 实现删除功能
    console.log('Delete clicked for:', id);
  };

  const handleDownload = (id) => {
    // TODO: 实现下载功能
    console.log('Download clicked for:', id);
  };

  return (
    <Box sx={{ backgroundColor: 'grey.200', height: '85vh', paddingTop: 6, paddingLeft: 5, paddingRight: 5, paddingBottom: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ backgroundColor: 'background.paper', padding: 3, boxShadow: 'none', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <HeaderContainer>
          <Title>Channel and Templete Managment</Title>
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
                              Add Templete
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
      />

      {/* Add Channel Dialog */}
      <AddChannelDialog
        open={addChannelDialogOpen}
        onClose={handleCloseAddChannelDialog}
        onSave={handleSaveChannel}
      />
    </Box>
  );
}

export default ChannelManagement;

