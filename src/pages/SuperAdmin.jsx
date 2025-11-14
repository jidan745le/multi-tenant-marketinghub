import {
    Box,
    Button,
    Chip,
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
    Typography
  } from '@mui/material';
  import { styled } from '@mui/material/styles';
  import CloseIcon from '@mui/icons-material/Close';
  import React, { useState } from 'react';
  
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
  }));
  
  const TableHeader = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.grey[200], 
    fontWeight: 700,
    fontSize: '14px',
    borderTop: `2px solid ${theme.palette.grey[300]}`,
    borderBottom: `2px solid ${theme.palette.grey[300]}`, 
    padding: '10px 12px',
    height: '75px', 
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
  
  // Mock data
  const mockData = [
    {
      id: 1,
      name: 'Template 01',
      description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features...',
      image: null,
      pdfExample: 'https://via.placeholder.com/60x75?text=PDF',
      tenant: 'Saame',
      theme: 'KENDO',
      label: '-',
      type: 'Catalog',
      usage: ['Internal', 'External'],
      templateType: 'Global',
      created: '2025/11/3',
      createdBy: 'Admin',
      lastUpdate: '2025/11/3',
      lastUpdatedBy: 'Admin',
      css: '-',
      html: '-',
    },
    {
      id: 2,
      name: 'Template 02',
      description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features...',
      image: null,
      pdfExample: 'https://via.placeholder.com/60x75?text=PDF',
      tenant: 'Saame',
      theme: 'KENDO',
      label: '-',
      type: 'Catalog',
      usage: ['Internal', 'External'],
      templateType: 'Global',
      created: '2025/11/3',
      createdBy: 'Admin',
      lastUpdate: '2025/11/3',
      lastUpdatedBy: 'Admin',
      css: '-',
      html: '-',
    },
    {
      id: 3,
      name: 'Template 03',
      description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features...',
      image: null,
      pdfExample: 'https://via.placeholder.com/60x75?text=PDF',
      tenant: 'Saame',
      theme: 'KENDO',
      label: '-',
      type: 'Catalog',
      usage: ['Internal', 'External'],
      templateType: 'Global',
      created: '2025/11/3',
      createdBy: 'Admin',
      lastUpdate: '2025/11/3',
      lastUpdatedBy: 'Admin',
      css: '-',
      html: '-',
    },
    {
      id: 4,
      name: 'Template 04',
      description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features...',
      image: null,
      pdfExample: 'https://via.placeholder.com/60x75?text=PDF',
      tenant: 'Saame',
      theme: 'KENDO',
      label: '-',
      type: 'Catalog',
      usage: ['Internal', 'External'],
      templateType: 'Global',
      created: '2025/11/3',
      createdBy: 'Admin',
      lastUpdate: '2025/11/3',
      lastUpdatedBy: 'Admin',
      css: '-',
      html: '-',
    },
    {
      id: 5,
      name: 'Template 05',
      description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features...',
      image: null,
      pdfExample: 'https://via.placeholder.com/60x75?text=PDF',
      tenant: 'Saame',
      theme: 'KENDO',
      label: '-',
      type: 'Catalog',
      usage: ['Internal', 'External'],
      templateType: 'Global',
      created: '2025/11/4',
      createdBy: 'Admin',
      lastUpdate: '2025/11/4',
      lastUpdatedBy: 'Admin',
      css: '-',
      html: '-',
    },
    {
      id: 6,
      name: 'Template 06',
      description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features...',
      image: null,
      pdfExample: 'https://via.placeholder.com/60x75?text=PDF',
      tenant: 'Saame',
      theme: 'KENDO',
      label: '-',
      type: 'Catalog',
      usage: ['Internal', 'External'],
      templateType: 'Global',
      created: '2025/11/4',
      createdBy: 'Admin',
      lastUpdate: '2025/11/4',
      lastUpdatedBy: 'Admin',
      css: '-',
      html: '-',
    },
    {
      id: 7,
      name: 'Template 07',
      description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features...',
      image: null,
      pdfExample: 'https://via.placeholder.com/60x75?text=PDF',
      tenant: 'Saame',
      theme: 'KENDO',
      label: '-',
      type: 'Catalog',
      usage: ['Internal', 'External'],
      templateType: 'Global',
      created: '2025/11/5',
      createdBy: 'Admin',
      lastUpdate: '2025/11/5',
      lastUpdatedBy: 'Admin',
      css: '-',
      html: '-',
    },
    {
      id: 8,
      name: 'Template 08',
      description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features...',
      image: null,
      pdfExample: 'https://via.placeholder.com/60x75?text=PDF',
      tenant: 'Saame',
      theme: 'KENDO',
      label: '-',
      type: 'Catalog',
      usage: ['Internal', 'External'],
      templateType: 'Global',
      created: '2025/11/5',
      createdBy: 'Admin',
      lastUpdate: '2025/11/5',
      lastUpdatedBy: 'Admin',
      css: '-',
      html: '-',
    },
    {
      id: 9,
      name: 'Template 09',
      description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features...',
      image: null,
      pdfExample: 'https://via.placeholder.com/60x75?text=PDF',
      tenant: 'Saame',
      theme: 'KENDO',
      label: '-',
      type: 'Catalog',
      usage: ['Internal', 'External'],
      templateType: 'Global',
      created: '2025/11/6',
      createdBy: 'Admin',
      lastUpdate: '2025/11/6',
      lastUpdatedBy: 'Admin',
      css: '-',
      html: '-',
    },
    {
      id: 10,
      name: 'Template 10',
      description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features...',
      image: null,
      pdfExample: 'https://via.placeholder.com/60x75?text=PDF',
      tenant: 'Saame',
      theme: 'KENDO',
      label: '-',
      type: 'Catalog',
      usage: ['Internal', 'External'],
      templateType: 'Global',
      created: '2025/11/6',
      createdBy: 'Admin',
      lastUpdate: '2025/11/6',
      lastUpdatedBy: 'Admin',
      css: '-',
      html: '-',
    }
  ];
  
  function SuperAdmin() {
    const [selectedTenant, setSelectedTenant] = useState('global');
    const [data, setData] = useState(mockData);
    
    // 调试：确认数据数量
    console.log('Total data rows:', data.length);
  
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
                      <TableHeader sx={{ minWidth: 135, textAlign: 'center', fontWeight: 'bold'}}>Name</TableHeader>
                      <TableHeader sx={{ minWidth: 500, fontWeight: 'bold' }}>Description</TableHeader>
                      <TableHeader sx={{ minWidth: 140, textAlign: 'center', fontWeight: 'bold' }}>Image</TableHeader>
                      <TableHeader sx={{ minWidth: 220, textAlign: 'center', fontWeight: 'bold' }}>PDF Example</TableHeader>
                      <TableHeader sx={{ minWidth: 140, fontWeight: 'bold' }}>Tenant</TableHeader>
                      <TableHeader sx={{ minWidth: 140, fontWeight: 'bold' }}>Theme</TableHeader>
                      <TableHeader sx={{ minWidth: 200, fontWeight: 'bold' }}>Label</TableHeader>
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
                    {data.map((row) => (
                      <TableRowStyled key={row.id} hover>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {row.name}
                          </Typography>
                        </TableCellStyled>
                        <TableCellStyled>
                          <DescriptionText>{row.description}</DescriptionText>
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
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
                                margin: '0 auto',
                                display: 'block',
                              }}
                            />
                          ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <ImagePlaceholder />
                            </Box>
                          )}
                        </TableCellStyled>
                        <TableCellStyled sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <PdfThumbnailContainer>
                              <PdfThumbnail>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>
                                  PDF
                                </Typography>
                              </PdfThumbnail>
                              <UploadIconButton size="small">
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
                        <TableCellStyled>
                          <Typography variant="body2">{row.label}</Typography>
                        </TableCellStyled>
                        <TableCellStyled >
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <FormControl size="small" sx={{ minWidth: 110 }}>
                              <Select
                                value={row.type}
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
          </Box>
        </Paper>
      </Box>
    );
  }
  
  export default SuperAdmin;
  
  