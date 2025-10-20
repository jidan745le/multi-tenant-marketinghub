import CancelIcon from '@mui/icons-material/Cancel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useBrand } from '../hooks/useBrand';
import DerivateManagementApiService from '../services/derivateManagementApi';
import { selectBrands } from '../store/slices/themesSlice';
import CookieService from '../utils/cookieService';

// Styled components
const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
  padding: '0 24px',
}));

const TableHeader = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  fontWeight: 600,
  fontSize: '14px',
  borderBottom: `2px solid ${theme.palette.divider}`,
  whiteSpace: 'nowrap',
  padding: '12px 8px',
}));

const StickyTableHeader = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  fontWeight: 600,
  fontSize: '14px',
  borderBottom: `2px solid ${theme.palette.divider}`,
  whiteSpace: 'nowrap',
  padding: '12px 8px',
  position: 'sticky',
  right: 0,
  zIndex: 1,
  borderLeft: `1px solid ${theme.palette.divider}`,
}));

const StickyTableCell = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  right: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1,
  borderLeft: `1px solid ${theme.palette.divider}`,
  padding: '12px 8px',
}));

const ActionButton = styled(IconButton)(({ theme, variant = 'default' }) => ({
  padding: 6,
  margin: '0 2px',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.short,
  }),
  ...(variant === 'primary' && {
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.light + '20', // 20% opacity
      color: theme.palette.primary.dark,
    },
  }),
  ...(variant === 'success' && {
    color: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.light + '20',
      color: theme.palette.success.dark,
    },
  }),
  ...(variant === 'error' && {
    color: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.light + '20',
      color: theme.palette.error.dark,
    },
  }),
  ...(variant === 'default' && {
    color: theme.palette.action.active,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.primary,
    },
  }),
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabled,
    color: theme.palette.action.disabled,
  },
}));

const CustomTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50], // 默认灰色背景
  '&:hover': {
    backgroundColor: theme.palette.background.paper, // hover时变为白色
  },
  '&:hover .MuiTableCell-root': {
    backgroundColor: 'inherit', // 确保cells继承行的背景色
  },
}));

// Main component
function DerivateManagement() {
  // State management
  const [derivates, setDerivates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingRow, setEditingRow] = useState({});

  // Get themes from Redux store and current brand
  const brands = useSelector(selectBrands);
  const themes = brands.map(brand => brand.name);
  const { currentBrandCode } = useBrand();
  
  // Get tenant ID from user info
  const getTenantId = () => {
    const userInfo = CookieService.getUserInfo();
    return  userInfo?.tenant?.name || 'default';
  };
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load derivates data
  const loadDerivates = useCallback(async () => {
    try {
      setLoading(true);
      const tenantId = getTenantId();
      const theme = currentBrandCode || 'default';
      
      console.log('Loading derivates with params:', { tenantId, theme, searchText });
      
      const response = await DerivateManagementApiService.getDerivates(0, 100, searchText, tenantId, theme);
      setDerivates(response.derivates || []);
    } catch (err) {
      setError(err.message);
      showSnackbar('Failed to load derivates', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchText, currentBrandCode]);

  // Initialize data
  useEffect(() => {
    loadDerivates();
  }, [loadDerivates]);

  // Utility functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Derivate operations
  const handleEdit = (derivate) => {
    setEditingId(derivate.id);
    setEditingRow({ ...derivate });
  };

  const handleSave = async () => {
    try {
      // Ensure themeId is set for validation (could be from theme or themeId field)
      const dataToValidate = {
        ...editingRow,
        themeId: editingRow.themeId || editingRow.theme || currentBrandCode
      };
      
      // Use API service validation
      DerivateManagementApiService.validateDerivateData(dataToValidate);

      if (editingRow.id && !String(editingRow.id).startsWith('NEW_')) {
        // Update existing derivate - use identifier for API calls
        const updateId = editingRow.identifier || editingRow.id;
        await DerivateManagementApiService.updateDerivate(updateId, dataToValidate);
        showSnackbar('Derivate updated successfully');
      } else {
        // Create new derivate
        await DerivateManagementApiService.createDerivate(dataToValidate);
        showSnackbar('Derivate created successfully');
      }
      
      setEditingId(null);
      setEditingRow({});
      loadDerivates(); // Reload data
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingRow({});
  };

  const handleCopy = async (derivate) => {
    try {
      const copyId = derivate.identifier || derivate.id;
      await DerivateManagementApiService.copyDerivate(copyId);
      showSnackbar('Derivate copied successfully');
      loadDerivates(); // Reload data
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  const handleDelete = async (derivate) => {
    try {
      const deleteId = derivate.identifier || derivate.id;
      await DerivateManagementApiService.deleteDerivate(deleteId);
      showSnackbar('Derivate deleted successfully');
      loadDerivates(); // Reload data
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  const handleAddNew = () => {
    const newDerivate = {
      id: `NEW_${Date.now()}`,
      ...DerivateManagementApiService.getDefaultDerivateData(),
      themeId: currentBrandCode, // Set current theme
      theme: currentBrandCode // Also set theme field for consistency
    };
    setDerivates([...derivates, newDerivate]);
    setEditingId(newDerivate.id);
    setEditingRow(newDerivate);
  };

  // Filter derivates based on search
  const filteredDerivates = derivates.filter(derivate =>
    derivate.label?.toLowerCase().includes(searchText.toLowerCase()) ||
    derivate.themeId?.toLowerCase().includes(searchText.toLowerCase()) ||
    derivate.theme?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Render cell content
  const renderCell = (derivate, field, content) => {
    if (editingId === derivate.id) {
      switch (field) {
        case 'themeId':
          return (
            <Select
              value={editingRow.themeId || ''}
              onChange={(e) => setEditingRow({ ...editingRow, themeId: e.target.value })}
              size="small"
              fullWidth
            >
              {themes.map(theme => (
                <MenuItem key={theme} value={theme}>{theme}</MenuItem>
              ))}
            </Select>
          );
        case 'derivateGroup':
          return (
            <Select
              value={editingRow.derivateGroup || ''}
              onChange={(e) => setEditingRow({ ...editingRow, derivateGroup: e.target.value })}
              size="small"
              fullWidth
            >
              {DerivateManagementApiService.getGroupOptions().map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          );
        case 'dpi':
          return (
            <Select
              value={editingRow.dpi || ''}
              onChange={(e) => setEditingRow({ ...editingRow, dpi: e.target.value })}
              size="small"
              fullWidth
            >
              {DerivateManagementApiService.getDpiOptions().map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          );
        case 'ratio':
          // Handle null value for Original ratio
          const ratioValue = editingRow.ratio === null || editingRow.ratio === undefined ? '' : editingRow.ratio;
          return (
            <Select
              value={ratioValue}
              onChange={(e) => {
                const newValue = e.target.value === '' ? null : e.target.value;
                setEditingRow({ ...editingRow, ratio: newValue });
              }}
              size="small"
              fullWidth
              displayEmpty
            >
              {DerivateManagementApiService.getRatioOptions().map(option => (
                <MenuItem key={option.value || 'original'} value={option.value || ''}>{option.label}</MenuItem>
              ))}
            </Select>
          );
        case 'compression':
          // 标准化compression值用于显示
          let displayValue = editingRow.compression;
          if (displayValue === null || displayValue === undefined) {
            displayValue = '';
          }
          
          return (
            <Select
              value={displayValue}
              onChange={(e) => {
                const newValue = e.target.value === '' ? null : e.target.value;
                setEditingRow({ ...editingRow, compression: newValue });
              }}
              size="small"
              fullWidth
              displayEmpty
            >
              <MenuItem value="">No Compression</MenuItem>
              <MenuItem value="lzw">LZW Compression</MenuItem>
            </Select>
          );
        case 'targetFormat':
          return (
            <Select
              value={editingRow.targetFormat || ''}
              onChange={(e) => setEditingRow({ ...editingRow, targetFormat: e.target.value })}
              size="small"
              fullWidth
            >
              {DerivateManagementApiService.getTargetFormatOptions().map(option => (
                <MenuItem key={option} value={option}>{option.toUpperCase()}</MenuItem>
              ))}
            </Select>
          );
        case 'targetColorSpace':
          return (
            <Select
              value={editingRow.targetColorSpace || ''}
              onChange={(e) => setEditingRow({ ...editingRow, targetColorSpace: e.target.value })}
              size="small"
              fullWidth
            >
              {DerivateManagementApiService.getTargetColorSpaceOptions().map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          );
        case 'gravity':
          return (
            <Select
              value={editingRow.gravity || ''}
              onChange={(e) => setEditingRow({ ...editingRow, gravity: e.target.value })}
              size="small"
              fullWidth
            >
              {DerivateManagementApiService.getGravityOptions().map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          );
        case 'allowedFileType':
          // Ensure value is always an array for multiple select
          const allowedFileTypeValue = editingRow.allowedFileType 
            ? (Array.isArray(editingRow.allowedFileType) 
                ? editingRow.allowedFileType 
                : editingRow.allowedFileType.split(',').map(item => item.trim()))
            : [];
          return (
            <Select
              value={allowedFileTypeValue}
              onChange={(e) => setEditingRow({ ...editingRow, allowedFileType: e.target.value })}
              size="small"
              fullWidth
              multiple
              renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : selected}
            >
              {DerivateManagementApiService.getAllowedFileTypeOptions().map(option => (
                <MenuItem key={option} value={option}>{option.toUpperCase()}</MenuItem>
              ))}
            </Select>
          );
        case 'mediaType':
          // Ensure value is always an array for multiple select
          const mediaTypeValue = editingRow.mediaType 
            ? (Array.isArray(editingRow.mediaType) 
                ? editingRow.mediaType 
                : editingRow.mediaType.split(',').map(item => item.trim()))
            : [];
          return (
            <Select
              value={mediaTypeValue}
              onChange={(e) => setEditingRow({ ...editingRow, mediaType: e.target.value })}
              size="small"
              fullWidth
              multiple
              renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : selected}
            >
              {DerivateManagementApiService.getMediaTypeOptions().map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          );
        case 'publicLink':
        case 'preserveAlpha':
          return (
            <Checkbox
              checked={editingRow[field] || false}
              onChange={(e) => setEditingRow({ ...editingRow, [field]: e.target.checked })}
            />
          );
        default:
          return (
            <TextField
              value={editingRow[field] || ''}
              onChange={(e) => setEditingRow({ ...editingRow, [field]: e.target.value })}
              size="small"
              fullWidth
            />
          );
      }
    }
    
    // Display mode
    switch (field) {
      case 'ratio':
        return content === 'crop' ? 'Crop' : 
               content === 'fill' ? 'Fill' : 
               content === 'adjust-transparent' ? 'Adjust - Transparent' : 'Original';
      case 'compression':
        if (content === 'lzw') return 'LZW Compression';
        if (content === null || content === '' || content === undefined) return 'No Compression';
        return content || 'No Compression';
      case 'publicLink':
      case 'preserveAlpha':
        return content ? 'Yes' : 'No';
      case 'allowedFileType':
      case 'mediaType':
        return content?.split(',').map(item => item.trim()).join(', ');
      default:
        return content;
    }
  };

  // Render loading state
  if (loading && derivates.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <HeaderContainer>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Derivate Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage image derivation configurations and settings
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <PrimaryButton
            variant="contained"
            onClick={handleAddNew}
          >
            ADD DERIVATE
          </PrimaryButton>
        </Box>
      </HeaderContainer>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Search */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search by Theme or Label"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          onClick={() => setSearchText('')}
          variant="outlined"
        >
          RESET
        </Button>
      </Box>

      {/* Derivates Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 1, overflowX: 'auto', maxWidth: '100%' }}>
        <Table sx={{ tableLayout: 'fixed', minWidth: 2120 }}>
          <TableHead>
            <TableRow>
              <TableHeader sx={{ width: 120 }}>Derivate ID</TableHeader>
              <TableHeader sx={{ width: 120 }}>Theme</TableHeader>
              <TableHeader sx={{ width: 200 }}>Label</TableHeader>
              <TableHeader sx={{ width: 100 }}>Group</TableHeader>
              <TableHeader sx={{ width: 100 }}>Prefix</TableHeader>
              <TableHeader sx={{ width: 100 }}>Postfix</TableHeader>
              <TableHeader sx={{ width: 80 }}>Width</TableHeader>
              <TableHeader sx={{ width: 80 }}>Height</TableHeader>
              <TableHeader sx={{ width: 80 }}>DPI</TableHeader>
              <TableHeader sx={{ width: 120 }}>Ratio</TableHeader>
              <TableHeader sx={{ width: 130 }}>Compression</TableHeader>
              <TableHeader sx={{ width: 100 }}>Public Link</TableHeader>
              <TableHeader sx={{ width: 120 }}>Target Format</TableHeader>
              <TableHeader sx={{ width: 140 }}>Target Colorspace</TableHeader>
              <TableHeader sx={{ width: 100 }}>Gravity</TableHeader>
              <TableHeader sx={{ width: 120 }}>Allowed Filetypes</TableHeader>
              <TableHeader sx={{ width: 150 }}>Allowed Media Types</TableHeader>
              <TableHeader sx={{ width: 100 }}>Preserve Alpha</TableHeader>
              <StickyTableHeader sx={{ width: 150 }}>Operations</StickyTableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDerivates.map((derivate) => (
              <CustomTableRow key={derivate.id}>
                <TableCell sx={{ width: 120, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{derivate.id}</TableCell>
                <TableCell sx={{ width: 120, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'themeId', derivate.themeId)}</TableCell>
                <TableCell sx={{ width: 200, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'label', derivate.label)}</TableCell>
                <TableCell sx={{ width: 100, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'derivateGroup', derivate.derivateGroup)}</TableCell>
                <TableCell sx={{ width: 100, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'prefix', derivate.prefix)}</TableCell>
                <TableCell sx={{ width: 100, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'postfix', derivate.postfix)}</TableCell>
                <TableCell sx={{ width: 80, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'width', derivate.width)}</TableCell>
                <TableCell sx={{ width: 80, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'height', derivate.height)}</TableCell>
                <TableCell sx={{ width: 80, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'dpi', derivate.dpi)}</TableCell>
                <TableCell sx={{ width: 120, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'ratio', derivate.ratio)}</TableCell>
                <TableCell sx={{ width: 130, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'compression', derivate.compression)}</TableCell>
                <TableCell sx={{ width: 100, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'publicLink', derivate.publicLink)}</TableCell>
                <TableCell sx={{ width: 120, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'targetFormat', derivate.targetFormat)}</TableCell>
                <TableCell sx={{ width: 140, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'targetColorSpace', derivate.targetColorSpace)}</TableCell>
                <TableCell sx={{ width: 100, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'gravity', derivate.gravity)}</TableCell>
                <TableCell sx={{ width: 120, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'allowedFileType', derivate.allowedFileType)}</TableCell>
                <TableCell sx={{ width: 120, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'mediaType', derivate.mediaType)}</TableCell>
                <TableCell sx={{ width: 100, padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(derivate, 'preserveAlpha', derivate.preserveAlpha)}</TableCell>
                <StickyTableCell sx={{ width: 150 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {editingId === derivate.id ? (
                      <>
                        <Tooltip title="Save">
                          <ActionButton onClick={handleSave} variant="primary">
                            <SaveIcon />
                          </ActionButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <ActionButton onClick={handleCancel} variant="primary">
                            <CancelIcon />
                          </ActionButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <ActionButton
                            onClick={() => handleEdit(derivate)}
                            variant="primary"
                          >
                            <EditIcon />
                          </ActionButton>
                        </Tooltip>
                        <Tooltip title="Copy">
                          <ActionButton
                            onClick={() => handleCopy(derivate)}
                            variant="primary"
                          >
                            <ContentCopyIcon />
                          </ActionButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <ActionButton
                            onClick={() => handleDelete(derivate)}
                            variant="primary"
                          >
                            <DeleteIcon />
                          </ActionButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </StickyTableCell>
              </CustomTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DerivateManagement;
