import {
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import NumberInputField from './NumberInputField';

// Styled components
const DialogContainer = styled(Box)(() => ({
  background: '#ffffff',
  minHeight: '750px',
  position: 'relative',
  overflow: 'visible',
  padding: '24px',
  boxSizing: 'border-box',
}));

const Title = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '21px',
  lineHeight: '140%',
  fontWeight: 700,
  marginBottom: '40px',
}));

const Label = styled(Typography)(() => ({
  color: '#666666',
  textAlign: 'left',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 400,
  marginBottom: '10px',
}));

const LabelBold = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 700,
  marginBottom: '10px',
}));

const InputContainer = styled(Box)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#b3b3b3',
  borderWidth: '1px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '40px',
  width: '100%',
  boxSizing: 'border-box',
}));

const InputText = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 400,
  flex: 1,
}));

const SectionContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flex: 1,
  marginBottom: '20px',
}));

const SectionTitle = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 700,
  marginBottom: '4px',
  flex: 1,
}));

const SectionHeader = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '4px',
}));

const Subtitle = styled(Typography)(() => ({
  color: '#666666',
  textAlign: 'left',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '12px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 400,
}));

const WorksheetHeader = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '20px',
  marginBottom: '10px',
}));

const WorksheetTitle = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

const WorksheetActions = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
}));

const IconButtonStyled = styled(IconButton)(() => ({
  padding: '4px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const DividerLine = styled(Box)(() => ({
  borderStyle: 'solid',
  borderColor: '#cccccc',
  borderWidth: '1px 0 0 0',
  width: '100%',
  marginBottom: '20px',
}));

const ValueContainer = styled(Box)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#b3b3b3',
  borderWidth: '1px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '40px',
  width: '100%',
  boxSizing: 'border-box',
}));

const ValueText = styled(Typography)(() => ({
  color: '#666666',
  textAlign: 'left',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 400,
}));


const ExcelUploadArea = styled(Box)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#999999',
  borderWidth: '1px',
  width: '426px',
  height: '343px',
  marginTop: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fafafa',
}));

const CancelButton = styled(Button)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#e6e6e6',
  borderWidth: '1px',
  padding: '8px 16px',
  color: '#4d4d4d',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '16px',
  fontWeight: 400,
  textTransform: 'none',
  background: '#ffffff',
  boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const UploadButton = styled(Button)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#e6e6e6',
  borderWidth: '1px',
  padding: '8px 16px',
  color: '#4d4d4d',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '16px',
  fontWeight: 400,
  textTransform: 'none',
  background: '#ffffff',
  boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const AddSheetButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main || '#f16508',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#f16508',
  borderWidth: '1px',
  padding: '0px 12px',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '32px',
  color: '#ffffff',
  fontFamily: 'var(--label-large-font-family, "Roboto-Medium", sans-serif)',
  fontSize: 'var(--label-large-font-size, 14px)',
  lineHeight: 'var(--label-large-line-height, 20px)',
  letterSpacing: 'var(--label-large-letter-spacing, 0.1px)',
  fontWeight: 'var(--label-large-font-weight, 500)',
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark || '#d5570a',
    borderColor: theme.palette.primary.dark || '#d5570a',
  },
}));

const AddSheetLinkButton = styled(Button)(() => ({
  background: 'transparent',
  border: 'none',
  padding: '0px',
  color: '#1890ff',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 400,
  textTransform: 'none',
  textDecoration: 'none',
  boxShadow: 'none',
  '&:hover': {
    background: 'transparent',
    color: '#40a9ff',
    textDecoration: 'underline',
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main || '#f16508',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#f16508',
  borderWidth: '1px',
  padding: '0px 12px',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'center',
  width: '85px',
  height: '32px',
  color: '#ffffff',
  fontFamily: 'var(--label-large-font-family, "Roboto-Medium", sans-serif)',
  fontSize: 'var(--label-large-font-size, 14px)',
  lineHeight: 'var(--label-large-line-height, 20px)',
  letterSpacing: 'var(--label-large-letter-spacing, 0.1px)',
  fontWeight: 'var(--label-large-font-weight, 500)',
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark || '#d5570a',
    borderColor: theme.palette.primary.dark || '#d5570a',
  },
}));

const DropdownContainer = styled(Box)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#b3b3b3',
  borderWidth: '1px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '40px',
  width: '100%',
  boxSizing: 'border-box',
  cursor: 'pointer',
}));

const DropdownLabel = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 400,
  flex: 1,
}));

const StyledTextField = styled(TextField)(() => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    borderColor: '#b3b3b3',
    height: '40px',
    fontFamily: '"Lato-Regular", sans-serif',
    fontSize: '14px',
    '& fieldset': {
      borderColor: '#b3b3b3',
    },
    '&:hover fieldset': {
      borderColor: '#999999',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#b3b3b3',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Lato-Regular", sans-serif',
    fontSize: '14px',
    color: '#666666',
  },
}));

const StyledSelect = styled(Select)(() => ({
  borderRadius: '4px',
  height: '40px',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#b3b3b3',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#999999',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#b3b3b3',
  },
}));

const FormRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '28px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  marginBottom: '20px',
}));

const FormField = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flex: 1,
}));

const ButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginTop: '20px',
  paddingTop: '20px',
}));

// eslint-disable-next-line no-unused-vars
const AddTemplateDialog = ({ open, onClose, onSave, channelId }) => {
  const [templateLabel, setTemplateLabel] = useState('');
  const [channelName, setChannelName] = useState('SAAME');
  const [theme, setTheme] = useState('KENDO');
  const [templateType, setTemplateType] = useState('Line');
  const [sheets, setSheets] = useState([]);
  const fileInputRef = useRef(null);

  const handleCancel = () => {
    // 重置表单
    setTemplateLabel('');
    setSheets([]);
    if (onClose) {
      onClose();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        templateLabel,
        channelName,
        theme,
        templateType,
        templateDataDetails: sheets,
      });
    }
    handleCancel();
  };

  const handleUploadExcel = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: 处理文件上传
      console.log('Excel file selected:', file);
    }
  };

  const addSheet = () => {
    const newSheet = {
      id: `sheet_${Date.now()}`,
      worksheet: sheets.length,
      firstDataColumn: 0,
      firstDataRow: 3,
      lastDataColumn: 0,
      expanded: false,
    };
    const newSheets = [...sheets, newSheet];
    setSheets(newSheets);
    syncToParent(newSheets);
  };

  const syncToParent = (newSheets) => {
    // 如果需要同步到父组件，可以在这里实现
    // 目前直接更新本地状态
    setSheets(newSheets);
  };

  const handleDeleteSheet = (sheetId) => {
    const newSheets = sheets
      .filter(sheet => sheet.id !== sheetId)
      .map((sheet, index) => ({
        ...sheet,
        worksheet: index,
      }));
    setSheets(newSheets);
    syncToParent(newSheets);
  };

  const handleCopySheet = (sheetId) => {
    const sheetToCopy = sheets.find(sheet => sheet.id === sheetId);
    if (sheetToCopy) {
      const newSheet = {
        ...sheetToCopy,
        id: `sheet_${Date.now()}`,
        worksheet: sheets.length,
      };
      const newSheets = [...sheets, newSheet];
      setSheets(newSheets);
      syncToParent(newSheets);
    }
  };

  const handleUpdateSheetField = (sheetId, field, value) => {
    const newSheets = sheets.map(sheet =>
      sheet.id === sheetId ? { ...sheet, [field]: value } : sheet
    );
    setSheets(newSheets);
    syncToParent(newSheets);
  };

  const handleToggleSheetExpand = (sheetId) => {
    setSheets(prevSheets =>
      prevSheets.map(sheet =>
        sheet.id === sheetId ? { ...sheet, expanded: !sheet.expanded } : sheet
      )
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '2px',
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
          width: '1100px',
          maxWidth: '90vw',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', overflow: 'hidden', maxHeight: '90vh' }}>
        <DialogContainer>
          <Title>Add template</Title>

          {/* Template Basic Information - Two Column Layout */}
          <FormRow>
            {/* Left Column */}
            <SectionContainer>
              <Label>Template Label*</Label>
              <StyledTextField
                placeholder="Enter template label"
                value={templateLabel}
                onChange={(e) => setTemplateLabel(e.target.value)}
                variant="outlined"
              />
              <Box sx={{ marginTop: '20px', width: '100%' }}>
                <LabelBold>Theme</LabelBold>
                <FormControl fullWidth>
                  <StyledSelect
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    IconComponent={ArrowDropDownIcon}
                  >
                    <MenuItem value="KENDO">KENDO</MenuItem>
                    {/* 可以添加更多主题选项 */}
                  </StyledSelect>
                </FormControl>
              </Box>
            </SectionContainer>

            {/* Right Column */}
            <SectionContainer>
              <LabelBold>Channel Name*</LabelBold>
              <FormControl fullWidth>
                <StyledSelect
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  IconComponent={ArrowDropDownIcon}
                >
                  <MenuItem value="SAAME">SAAME</MenuItem>
                  {/* 可以添加更多频道选项 */}
                </StyledSelect>
              </FormControl>
              <Box sx={{ marginTop: '20px', width: '100%' }}>
                <LabelBold>Template Type</LabelBold>
                <FormControl fullWidth>
                  <StyledSelect
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                    IconComponent={ArrowDropDownIcon}
                  >
                    <MenuItem value="Line">Line</MenuItem>
                    <MenuItem value="Setup">Setup</MenuItem>
                    {/* 可以添加更多类型选项 */}
                  </StyledSelect>
                </FormControl>
              </Box>
            </SectionContainer>
          </FormRow>


          {/* Template Data Details Configuration */}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '28px', alignItems: 'flex-start', marginTop: '40px', marginBottom: '20px' }}>
            {/* Left Panel - Configuration */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0px', width: '550px', flexShrink: 0 }}>
              {/* Header with Title and Add Sheet Button */}
              <SectionHeader>
                <SectionTitle>Template Data Details Configuration</SectionTitle>
                {sheets.length === 0 ? (
                  <AddSheetLinkButton onClick={addSheet}>
                    Add your first sheet
                  </AddSheetLinkButton>
                ) : (
                  <AddSheetButton onClick={addSheet} sx={{ width: 'fit-content', flexShrink: 0 }}>
                    <AddIcon sx={{ fontSize: '16px' }} />
                    Add Sheet
                  </AddSheetButton>
                )}
              </SectionHeader>
              <Subtitle>Configure Excel sheet data extraction settings</Subtitle>
              <DividerLine sx={{ marginTop: '4px', marginBottom: '0px' }} />
              
              {/* Worksheet Configuration */}
              {sheets.length === 0 ? (
                <Box sx={{ marginTop: '20px', padding: '20px', textAlign: 'center', color: '#999999' }}>
                  <Typography sx={{ fontFamily: '"Lato-Regular", sans-serif', fontSize: '14px' }}>
                    No worksheets configured. Click "Add your first sheet" to get started.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  marginTop: '20px', 
                  maxHeight: '315px', // 约 4.5 个 worksheet 的高度（每个约 70px）
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none', // IE and Edge
                  '&::-webkit-scrollbar': {
                    display: 'none', // Chrome, Safari, Opera
                  },
                }}>
                  {sheets.map((sheet) => (
                    <Box key={sheet.id} sx={{ marginBottom: '20px' }}>
                      <WorksheetHeader>
                        <WorksheetTitle>
                          <IconButtonStyled 
                            size="small"
                            onClick={() => handleToggleSheetExpand(sheet.id)}
                            sx={{ padding: '2px', marginRight: '4px' }}
                          >
                            {sheet.expanded ? (
                              <ExpandMoreIcon sx={{ fontSize: '20px' }} />
                            ) : (
                              <ExpandLessIcon sx={{ fontSize: '20px' }} />
                            )}
                          </IconButtonStyled>
                          Worksheet {sheet.worksheet}
                          <Typography
                            component="span"
                            sx={{
                              color: '#666666',
                              fontFamily: '"Lato-Regular", sans-serif',
                              fontSize: '14px',
                              lineHeight: '140%',
                              letterSpacing: '0.2px',
                              fontWeight: 400,
                              marginLeft: '8px',
                            }}
                          >
                            ID: {sheet.id}
                          </Typography>
                        </WorksheetTitle>
                        <WorksheetActions>
                          <IconButtonStyled 
                            size="small"
                            onClick={() => handleCopySheet(sheet.id)}
                          >
                            <ContentCopyIcon sx={{ fontSize: '18px' }} />
                          </IconButtonStyled>
                          <IconButtonStyled 
                            size="small"
                            onClick={() => handleDeleteSheet(sheet.id)}
                          >
                            <DeleteIcon sx={{ fontSize: '18px' }} />
                          </IconButtonStyled>
                        </WorksheetActions>
                      </WorksheetHeader>
                      
                      {/* 横线始终显示，无论展开还是闭合 */}
                      <DividerLine sx={{ marginTop: '10px', marginBottom: '20px' }} />
                      
                      {sheet.expanded && (
                        <>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                              <Box sx={{ flex: 1 }}>
                                <LabelBold>Worksheet Index</LabelBold>
                                <NumberInputField
                                  value={sheet.worksheet}
                                  onChange={(value) => handleUpdateSheetField(sheet.id, 'worksheet', value)}
                                  min={0}
                                />
                              </Box>

                              <Box sx={{ flex: 1 }}>
                                <LabelBold>First Data Column</LabelBold>
                                <NumberInputField
                                  value={sheet.firstDataColumn}
                                  onChange={(value) => handleUpdateSheetField(sheet.id, 'firstDataColumn', value)}
                                  min={0}
                                />
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                              <Box sx={{ flex: 1 }}>
                                <LabelBold>First Data Row</LabelBold>
                                <NumberInputField
                                  value={sheet.firstDataRow}
                                  onChange={(value) => handleUpdateSheetField(sheet.id, 'firstDataRow', value)}
                                  min={0}
                                />
                              </Box>

                              <Box sx={{ flex: 1 }}>
                                <LabelBold>Last Data Column</LabelBold>
                                <NumberInputField
                                  value={sheet.lastDataColumn}
                                  onChange={(value) => handleUpdateSheetField(sheet.id, 'lastDataColumn', value)}
                                  min={0}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Right Panel - JSON Preview */}
            <Box sx={{ flex: 1, maxWidth: '475px', alignSelf: 'flex-start' }}>
              <Box sx={{
                p: 2,
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                height: '400px',
                overflow: 'auto'
              }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#000000', fontFamily: '"Lato-Bold", sans-serif', fontSize: '14px', lineHeight: '140%', letterSpacing: '0.2px' }}>
                  JSON Preview
                </Typography>
                <pre style={{
                  margin: 0,
                  fontSize: '12px',
                  lineHeight: '1.4',
                  color: '#333',
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                }}>
                  {JSON.stringify(sheets.map((sheet) => ({
                    worksheet: sheet.worksheet,
                    firstDataColumn: sheet.firstDataColumn,
                    firstDataRow: sheet.firstDataRow,
                    lastDataColumn: sheet.lastDataColumn,
                  })), null, 2)}
                </pre>
              </Box>
            </Box>
          </Box>

          {/* Buttons */}
          <ButtonContainer>
            <UploadButton onClick={handleUploadExcel}>
              Upload Excel File
            </UploadButton>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Box sx={{ flex: 1 }} />
            <CancelButton onClick={handleCancel}>
              CANCEL
            </CancelButton>
            <SaveButton onClick={handleSave}>
              SAVE
            </SaveButton>
          </ButtonContainer>
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AddTemplateDialog;

