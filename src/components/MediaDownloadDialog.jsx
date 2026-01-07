import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  List,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBrand } from '../hooks/useBrand';
import { useTheme } from '../hooks/useTheme';
import derivateManagementApi from '../services/derivateManagementApi';
import downloadApi from '../services/downloadApi';
import { fetchKendoAssets } from '../services/kendoAssetsApi';
import CookieService from '../utils/cookieService';
import { canDownloadDirectly } from '../utils/downloadFormatClassifier';
import MultiEmailInput from './MultiEmailInput';

// Initial derivate data structure
const getInitialDerivateData = (adhocFormats = []) => [
  {
    label: 'Original/Raw',
    children: ['Original File Format']
  },
  {
    label: 'Adhoc formats',
    children: adhocFormats
  }
];

const MediaDownloadDialog = ({
  open,
  onClose,
  selectedMediaIds = [], // Array of media IDs (numbers or strings)
}) => {
  const { t } = useTranslation();
  const { primaryColor } = useTheme();
  const { currentBrandCode } = useBrand();
  
  // Dialog states
  const [currentStep, setCurrentStep] = useState('derivates'); // 'derivates' | 'options'
  const [selectedDerivates, setSelectedDerivates] = useState([]);
  const [isCustomConfiguration, setIsCustomConfiguration] = useState('no');
  const [downloadOption, setDownloadOption] = useState('wait'); // Default to wait instead of email
  const [emails, setEmails] = useState([]);
  const [focused, setFocused] = useState(false);
  const [derivateData, setDerivateData] = useState(getInitialDerivateData());
  const [loading, setLoading] = useState(false);
  const [cameFromDerivateSelection, setCameFromDerivateSelection] = useState(false); // Track dialog source
  const [shouldShowDialog, setShouldShowDialog] = useState(false); // Control whether to actually show the dialog
  const [canOnlySendEmail, setCanOnlySendEmail] = useState(false); // Force email sending for large files
  
  // Custom configuration states
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [ratio, setRatio] = useState('Fill');
  const [colorSpace, setColorSpace] = useState('rgb');
  const [format, setFormat] = useState('png');
  const [dpi, setDpi] = useState('72');
  const [compression, setCompression] = useState('none');

  // Check and handle download when dialog opens
  useEffect(() => {
    if (open && selectedMediaIds.length > 0) {
      setShouldShowDialog(false); // Reset dialog visibility
      checkAndHandleDownload();
    } else if (!open) {
      setShouldShowDialog(false); // Reset when closing
    }
  }, [open, selectedMediaIds]);

  // Check if media can be downloaded directly without showing dialog
  const checkAndHandleDownload = async () => {
    try {
      const mediaIdsArray = Array.isArray(selectedMediaIds) ? selectedMediaIds : [selectedMediaIds];
      
      console.log('🔍 MediaDownloadDialog: Processing IDs:', mediaIdsArray);
      
      // Only check for direct download if it's a single asset
      if (mediaIdsArray.length === 1) {
        console.log('📡 Fetching asset details for direct download check...');
        
        // Fetch asset details using kendoAssetsApi
        const assetData = await fetchKendoAssets({ ids: mediaIdsArray });
        
        // Extract asset from response
        const asset = assetData?.data?.getAssetListing?.edges?.[0]?.node;
        
        if (asset) {
          console.log('✅ Asset details retrieved:', {
            id: asset.id,
            filename: asset.filename,
            mimetype: asset.mimetype,
            type: asset.type
          });
          
          // Check if can download directly (non-restricted format like PDF)
          if (canDownloadDirectly([asset])) {
            console.log('✅ Direct download - no dialog shown');
            // Directly download without showing dialog
            await handleDirectDownload(mediaIdsArray);
            return; // Exit without showing dialog
          } else {
            console.log('🔒 Restricted format - showing dialog');
          }
        } else {
          console.warn('⚠️ No asset data returned, showing dialog');
        }
      } else {
        console.log('📋 Multiple assets - showing dialog');
      }
      
      // Show dialog for derivate selection
      setShouldShowDialog(true);
      fetchDerivateData();
    } catch (error) {
      console.error('Error in checkAndHandleDownload:', error);
      // On error, show dialog as fallback
      setShouldShowDialog(true);
      fetchDerivateData();
    }
  };

  // Handle direct download without dialog
  const handleDirectDownload = async (mediaIdsArray) => {
    try {
      setLoading(true);
      
      const result = await downloadApi.massDownload(
        mediaIdsArray,
        'originalimage', // Download original format
        null, // No custom config
        false, // async=false for direct download
        '', // No email
        '' // No CC
      );
      
      // Trigger download if blob is returned
      if (result.blob && result.filename) {
        downloadApi.triggerDownload(result.blob, result.filename);
      }
      
      // Close without showing dialog
      onClose();
    } catch (error) {
      console.error('Direct download failed:', error);
      alert(`Download failed: ${error.message}`);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const fetchDerivateData = async () => {
    try {
      setLoading(true);
      
      // Get tenant info from CookieService
      const userInfo = CookieService.getUserInfo();
      const tenantId = userInfo?.tenant?.name || userInfo?.tenantName || 'Kendo';
      const theme = currentBrandCode || 'kendo';
      
      // Use selected media IDs to get adhoc derivates
      let adhocFormats = [];
      let shouldSkipDerivateSelection = false;
      
      // Use selected media IDs (they are model numbers in this context)
      if (selectedMediaIds && selectedMediaIds.length > 0) {
        const mediaIdsArray = Array.isArray(selectedMediaIds) ? selectedMediaIds : [selectedMediaIds];
        
        if (mediaIdsArray.length > 0) {
          try {
            console.log('Fetching derivates by model numbers (IDs):', mediaIdsArray);
            const derivates = await derivateManagementApi.getDerivatesByModelNumber(tenantId, theme, mediaIdsArray);
            
            // Filter for Adhoc derivates only and remove duplicates
            adhocFormats = [...new Set(derivates
              .filter(derivate => derivate.derivateGroup === 'Adhoc')
              .map(derivate => derivate.label))];
            
            console.log('Successfully fetched derivates:', adhocFormats);
            
            // If derivate-by-model-number returns empty array, skip derivate selection
            if (adhocFormats.length === 0) {
              console.log('No Adhoc derivates found, skipping to options dialog');
              shouldSkipDerivateSelection = true;
              // Set original file format as default selection
              setSelectedDerivates(['Original File Format']);
            }
          } catch (error) {
            console.warn('Failed to fetch derivates by model numbers:', error);
            // When API fails, skip derivate selection and use original format
            shouldSkipDerivateSelection = true;
            setSelectedDerivates(['Original File Format']);
          }
        }
      }
      
      setDerivateData(getInitialDerivateData(adhocFormats));
      
      // If should skip derivate selection, automatically go to options step
      if (shouldSkipDerivateSelection) {
        setCurrentStep('options');
        setCameFromDerivateSelection(false); // Direct to options, didn't come from derivate selection
      } else {
        setCameFromDerivateSelection(false); // Starting from derivate selection
      }
    } catch (error) {
      console.error('Error fetching derivate data:', error);
      // Use default data and skip to options if API fails
      setDerivateData(getInitialDerivateData());
      setSelectedDerivates(['Original File Format']);
      setCurrentStep('options');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset states
    setCurrentStep('derivates');
    setSelectedDerivates([]);
    setIsCustomConfiguration('no');
    setDownloadOption('wait');
    setEmails([]);
    setWidth('');
    setHeight('');
    setRatio('Fill');
    setColorSpace('rgb');
    setFormat('png');
    setDpi('72');
    setCompression('none');
    setCameFromDerivateSelection(false);
    setCanOnlySendEmail(false);
    onClose();
  };

  // Check download restrictions based on derivates and media count
  useEffect(() => {
    // Force email sending based on:
    // - If original image or TIFF is selected
    // - If more than 5 images are in the mass download
    const hasOriginalImage = selectedDerivates.includes('Original File Format') || 
                             selectedDerivates.some(d => d.toLowerCase().includes('originalimage'));
    const hasTiff = selectedDerivates.some(d => d.toLowerCase().includes('tiff'));
    const hasMultipleMedia = selectedMediaIds.length > 5;
    
    // For single media download, allow both options
    const isSingleMedia = selectedMediaIds.length === 1;
    
    if (isSingleMedia) {
      // Single media can choose between wait and email
      setCanOnlySendEmail(false);
      setDownloadOption('wait');
    } else if (hasOriginalImage || hasTiff || hasMultipleMedia) {
      // Force email for large files or many files
      setCanOnlySendEmail(true);
      setDownloadOption('email');
    } else {
      // Allow user to choose
      setCanOnlySendEmail(false);
    }
  }, [selectedDerivates, selectedMediaIds.length]);

  // Clear emails when not sending to others
  useEffect(() => {
    if (downloadOption !== 'other') {
      setEmails([]);
    }
  }, [downloadOption]);

  const handleDerivateConfirm = () => {
    if (selectedDerivates.length > 0 || isCustomConfiguration === 'yes') {
      setCurrentStep('options');
      setCameFromDerivateSelection(true); // Mark that we came from derivate selection
    }
  };

  const handleOptionsCancel = () => {
    if (cameFromDerivateSelection) {
      // Go back to derivate selection step
      setCurrentStep('derivates');
      setCameFromDerivateSelection(false);
    } else {
      // Close the entire dialog
      handleClose();
    }
  };

  const handleFinalDownload = async () => {
    // Validate email input when sending to others
    if (downloadOption === 'other' && emails.length === 0) {
      alert('Please enter at least one email address');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare media IDs (they are already IDs)
      const mediaIds = Array.isArray(selectedMediaIds) 
        ? selectedMediaIds
        : [selectedMediaIds];

      // Prepare derivates string - map display names to API values
      const derivatesString = selectedDerivates
        .map(derivate => derivate === 'Original File Format' ? 'originalimage' : derivate)
        .join(',');

      // Prepare custom configuration if needed
      const customConfig = isCustomConfiguration === 'yes' ? {
        width,
        height,
        dpi,
        format,
        colorSpace: colorSpace === 'cmyk' ? 'CMYK' : 'RGB',
        ratio,
        compression
      } : null;

      // Determine if this should be async (email) or direct download
      const isAsync = downloadOption === 'email' || downloadOption === 'other';
      
      // Get user email for async downloads
      const userInfo = CookieService.getUserInfo();
      const userEmail = userInfo?.email || '';
      
      // Prepare email parameters
      let toEmail = '';
      let ccEmail = '';
      
      if (downloadOption === 'email') {
        toEmail = userEmail;
      } else if (downloadOption === 'other') {
        toEmail = emails.join(',');
        ccEmail = userEmail; // CC the current user
      }

      // Call download API with new parameters
      const result = await downloadApi.massDownload(
        mediaIds, 
        derivatesString, 
        customConfig, 
        isAsync, 
        toEmail, 
        ccEmail
      );
      
      // Handle the response based on download type
      if (isAsync) {
        // For async downloads, show success message
        console.log('Async download initiated:', result.message);
        alert('Download link will be sent to your email shortly.');
      } else {
        // For direct downloads, trigger the download
        if (result.blob && result.filename) {
          downloadApi.triggerDownload(result.blob, result.filename);
        }
      }

      handleClose();
    } catch (error) {
      console.error('Download failed:', error);
      // Show error message to user
      alert(`Download failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const canProceedFromDerivates = selectedDerivates.length > 0 || isCustomConfiguration === 'yes';
  const canFinalDownload = downloadOption !== 'other' || emails.length > 0;

  // Check for CMYK PNG combination
  const isCMYKPNGCombination = colorSpace === 'cmyk' && format === 'png';
  const isCustomConfigValid = isCustomConfiguration === 'no' || 
    (isCustomConfiguration === 'yes' && !isCMYKPNGCombination);

  // 公共样式常量
  const commonFormStyles = {
    formControl: {
      width: '45%'
    },
    formHelperText: {
      ml: 0.05
    },
    inputText: {
      fontSize: '14px',
      color: '#4d4d4d',
      fontFamily: '"Roboto-Regular", sans-serif'
    },
    outlinedInput: {
      height: '32px',
      '& .MuiOutlinedInput-input': {
        fontSize: '14px',
        color: '#4d4d4d',
        fontFamily: '"Roboto-Regular", sans-serif'
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: primaryColor
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: primaryColor
      }
    },
    select: {
      height: '32px',
      '& .MuiSelect-select': {
        fontSize: '14px',
        color: '#4d4d4d',
        fontFamily: '"Roboto-Regular", sans-serif'
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: primaryColor
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: primaryColor
      }
    },
    menuProps: {
      PaperProps: {
        sx: {
          '& .MuiMenuItem-root': {
            fontSize: '14px',
            color: '#4d4d4d',
            fontFamily: '"Roboto-Regular", sans-serif',
            '&:hover': {
              backgroundColor: `${primaryColor}15`
            },
            '&.Mui-selected': {
              backgroundColor: `${primaryColor}25`,
              '&:hover': {
                backgroundColor: `${primaryColor}35`
              }
            }
          }
        }
      }
    }
  };

  const derivatesContent = () => (
    <>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 2 }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#333' }}>
            download
          </span>
          <Typography sx={{ 
            fontSize: '21px',
            fontWeight: 500,
            fontFamily: '"Roboto-Medium", sans-serif'
          }}>
            {t('Download')}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme?.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent style={{ padding: '0px 24px 24px 24px' }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              gap: 2
            }}
          >
            <CircularProgress />
            <Typography variant="body1" color="text.secondary">
              Loading derivate formats...
            </Typography>
          </Box>
        ) : (
          <>
            <Typography sx={{
              fontSize: '16px',
              fontWeight: 500,
              mb: 2,
              color: '#333',
              fontFamily: '"Roboto-Medium", sans-serif'
            }}>
              Select File Format
            </Typography>
        
        <List component="div" sx={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
          {derivateData.map((item, index) => (
            <Box key={`${item.label}-${index}`} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                sx={{
                  height: '20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#4d4d4d',
                  margin: '10px 0',              
                }}
              >
                {item.label}
              </Typography>
              {item.children?.map((derivate, idx) => (
                <FormControlLabel
                  key={`${derivate}-${idx}`}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedDerivates.includes(derivate)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDerivates([...selectedDerivates, derivate]);
                        } else {
                          setSelectedDerivates(selectedDerivates.filter(d => d !== derivate));
                        }
                      }}
                    />
                  }
                  label={derivate}
                  sx={{
                    color:'#4f4f4f',
                    '.MuiTypography-root': {
                      fontSize: '14px',
                    }
                  }}
                />
              ))}
            </Box>
          ))}
        </List>

        <Typography
          sx={{
            height: '20px',
            fontSize: '14px',
            fontWeight: 600,
            margin: '10px 0',
            color:'#4f4f4f',
          }}
        >
          Custom Configuration
        </Typography>
        
        <RadioGroup 
          value={isCustomConfiguration} 
          onChange={e => setIsCustomConfiguration(e.target.value)}
        >
          <FormControlLabel 
            value="yes" 
            control={<Radio />} 
            label="Yes" 
            sx={{
              color:'#4f4f4f',
              '.MuiTypography-root': {
                fontSize: '14px',
              }
            }}
          />
          <FormControlLabel 
            value="no" 
            control={<Radio />} 
            label="No" 
            sx={{
              color:'#4f4f4f',
              '.MuiTypography-root': {
                fontSize: '14px',
              }
            }}
          />
        </RadioGroup>

        {isCustomConfiguration === 'yes' && (
          <Box sx={{ mt: 2 }}>
       
       
            
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <FormControl sx={commonFormStyles.formControl} variant="outlined">
                <FormHelperText sx={commonFormStyles.formHelperText}>Height</FormHelperText>
                <OutlinedInput
                  sx={commonFormStyles.outlinedInput}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  endAdornment={<InputAdornment position="end">px</InputAdornment>}
                />
              </FormControl>

              <FormControl sx={commonFormStyles.formControl} variant="outlined">
                <FormHelperText sx={commonFormStyles.formHelperText}>Width</FormHelperText>
                <OutlinedInput
                  sx={commonFormStyles.outlinedInput}
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  endAdornment={<InputAdornment position="end">px</InputAdornment>}
                />
              </FormControl>

              <FormControl sx={commonFormStyles.formControl} variant="outlined">
                <FormHelperText sx={commonFormStyles.formHelperText}>Ratio</FormHelperText>
                <Select
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value)}
                  sx={commonFormStyles.select}
                  MenuProps={commonFormStyles.menuProps}
                >
                  <MenuItem value="Original">Original</MenuItem>
                  <MenuItem value="Adjust - Transparent">Adjust - Transparent</MenuItem>
                  <MenuItem value="Fill">Fill</MenuItem>
                  <MenuItem value="Crop">Crop</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={commonFormStyles.formControl} variant="outlined">
                <FormHelperText sx={commonFormStyles.formHelperText}>Color Space</FormHelperText>
                <Select
                  value={colorSpace}
                  onChange={(e) => setColorSpace(e.target.value)}
                  sx={commonFormStyles.select}
                  MenuProps={commonFormStyles.menuProps}
                >
                  <MenuItem value="cmyk">CMYK - Print</MenuItem>
                  <MenuItem value="rgb">RGB - Web</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={commonFormStyles.formControl} variant="outlined">
                <FormHelperText sx={commonFormStyles.formHelperText}>Format</FormHelperText>
                <Select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  sx={commonFormStyles.select}
                  MenuProps={commonFormStyles.menuProps}
                >
                  <MenuItem value="png">png</MenuItem>
                  <MenuItem value="tiff">tiff</MenuItem>
                  <MenuItem value="jpeg">jpeg</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={commonFormStyles.formControl} variant="outlined">
                <FormHelperText sx={commonFormStyles.formHelperText}>DPI</FormHelperText>
                <Select
                  value={dpi}
                  onChange={(e) => setDpi(e.target.value)}
                  sx={commonFormStyles.select}
                  MenuProps={commonFormStyles.menuProps}
                >
                  <MenuItem value="72">72 - Web</MenuItem>
                  <MenuItem value="300">300 - Print</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={commonFormStyles.formControl} variant="outlined">
                <FormHelperText sx={commonFormStyles.formHelperText}>Compression</FormHelperText>
                <Select
                  value={compression}
                  onChange={(e) => setCompression(e.target.value)}
                  sx={commonFormStyles.select}
                  MenuProps={commonFormStyles.menuProps}
                >
                  <MenuItem value="none">No Compression</MenuItem>
                  <MenuItem value="lzw">LZW Compression</MenuItem>
                </Select>
              </FormControl>
            </Box>

             {isCMYKPNGCombination && (
               <Typography sx={{ color: 'error.main', mt: 1 }}>
                 CMYK PNG is not supported
               </Typography>
             )}
           </Box>
         )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ padding: '12px 24px', display: 'flex', gap: '8px' }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{ 
            color: primaryColor,
            borderColor: primaryColor,
            backgroundColor: '#fff',
            borderRadius: '4px',
            textTransform: 'uppercase',
            fontWeight: '500',
            minWidth: 'auto',
            '&:hover': {
              borderColor: primaryColor,
              backgroundColor: `${primaryColor}12`
            }
          }}
          disabled={loading}
        >
          CANCEL
        </Button>
        <Button
          onClick={handleDerivateConfirm}
          variant="contained"
          disabled={loading || !canProceedFromDerivates || !isCustomConfigValid}
          sx={{
            backgroundColor: (!loading && canProceedFromDerivates && isCustomConfigValid) ? primaryColor : '#cccccc',
            color: '#fff',
            textTransform: 'uppercase',
            '&:hover': {
              backgroundColor: (!loading && canProceedFromDerivates && isCustomConfigValid) ? primaryColor : '#cccccc',
              opacity: (!loading && canProceedFromDerivates && isCustomConfigValid) ? 0.9 : 1
            },
            '&:disabled': {
              backgroundColor: '#cccccc',
              color: '#ffffff'
            }
          }}
        >
          {loading ? 'Loading...' : 'DOWNLOAD'}
        </Button>
      </DialogActions>
    </>
  );

  const optionsContent = () => {
    // Get download restriction reason
    const getRestrictionReason = () => {
      const hasOriginalImage = selectedDerivates.includes('Original File Format') || 
                               selectedDerivates.some(d => d.toLowerCase().includes('originalimage'));
      const hasTiff = selectedDerivates.some(d => d.toLowerCase().includes('tiff'));
      const hasMultipleMedia = selectedMediaIds.length > 5;
      
      if (hasOriginalImage) return 'original format';
      if (hasTiff) return 'TIFF format';
      if (hasMultipleMedia) return `${selectedMediaIds.length} files`;
      return '';
    };

    return (
      <Box className="download-options-dialog" sx={{ 
        backgroundColor: '#ffffff',
        borderRadius: '2px',
        padding: '24px',
        minHeight: 'auto',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Dialog Header */}
        <Box className="dialog-header" sx={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          mb: 2
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#333' }}>
            download
          </span>
          <Typography className="dialog-title" sx={{
            color: '#000000',
            textAlign: 'left',
            fontFamily: '"Roboto-Medium", sans-serif',
            fontSize: '21px',
            lineHeight: '140%',
            fontWeight: 500
          }}>
            Download ({selectedMediaIds.length} {selectedMediaIds.length === 1 ? 'file' : 'files'})
          </Typography>
        </Box>

        {/* Dialog Message */}
        <Typography className="download-message" sx={{
          color: '#333',
          textAlign: 'left',
          fontSize: '16px',
          lineHeight: 1.4,
          width: '100%',
          mb: 2
        }}>
          {canOnlySendEmail ? (
            <>
              The file you're trying to download is large ({getRestrictionReason()}).
              <br />
              For large downloads, we'll send you an email with a download link.
              <br />
              Please select your preference:
            </>
          ) : (
            <>
              The file you're trying to download is large, and it will take a while.
              You have three choices.
              <br />
              Please select your preference:
            </>
          )}
        </Typography>

      {/* Download Options */}
      <Box className="download-options-container" sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        mt: 2, // 为标题和描述留出空间
        mb: 2
      }}>
        <RadioGroup
          value={downloadOption}
          onChange={(e) => setDownloadOption(e.target.value)}
          sx={{ width: '100%', mt: 0 }}
        >
          {/* Wait for Download Option */}
          <Box className="download-option-item" sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '7px',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            mb: 2,
            opacity: canOnlySendEmail ? 0.5 : 1,
            cursor: canOnlySendEmail ? 'not-allowed' : 'pointer'
          }}>
            <Radio 
              value="wait"
              disabled={canOnlySendEmail}
              sx={{
                color: '#cccccc',
                width: '25px',
                height: '24px',
                '&.Mui-checked': {
                  color: primaryColor
                },
                '&.Mui-disabled': {
                  color: '#e0e0e0'
                }
              }}
            />
            <Box className="option-content" sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: '242px'
            }}>
              <Typography className="option-title" sx={{
                color: canOnlySendEmail ? '#999999' : '#212121',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: '"Roboto-Medium", "Roboto", sans-serif',
                width: '100%'
              }}>
                Wait for Download
              </Typography>
              <Typography className="option-description" sx={{
                color: canOnlySendEmail ? '#999999' : '#4f4f4f',
                textAlign: 'left',
                fontSize: '12px',
                width: '242px'
              }}>
                Begin the download immediately.              
              </Typography>
            </Box>
          </Box>

          {/* Send to Email Option */}
          <Box className="download-option-item" sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '7px',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            mb: 2
          }}>
            <Radio 
              value="email"
              sx={{
                color: '#cccccc',
                width: '25px',
                height: '24px',
                '&.Mui-checked': {
                  color: primaryColor
                }
              }}
            />
            <Box className="option-content" sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: '281px'
            }}>
              <Typography className="option-title" sx={{
                color: '#212121',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: '"Roboto-Medium", "Roboto", sans-serif',
                width: '100%'
              }}>
                Send to Email
              </Typography>
              <Typography className="option-description" sx={{
                color: '#4f4f4f',
                textAlign: 'left',
                fontSize: '12px',
                width: '100%'
              }}>
                We'll email you a download link for later access.
              </Typography>
            </Box>
          </Box>

          {/* Send to Others Option */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            mb: 2
          }}>
            <Box className="download-option-item" sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '7px',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%'
            }}>
              <Radio 
                value="other"
                sx={{
                  color: '#cccccc',
                  width: '25px',
                  height: '24px',
                  '&.Mui-checked': {
                    color: primaryColor
                  }
                }}
              />
              <Box className="option-content" sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '336px'
              }}>
                <Typography className="option-title" sx={{
                  color: '#212121',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: '"Roboto-Medium", "Roboto", sans-serif',
                  width: '100%'
                }}>
                  Send to Others
                </Typography>
                <Typography className="option-description" sx={{
                  color: '#4f4f4f',
                  textAlign: 'left',
                  fontSize: '12px',
                  width: '100%'
                }}>
                  Send download link to other users and CC you Email to
                </Typography>
              </Box>
            </Box>

            {/* Email Input for Send to Others */}
            {downloadOption === 'other' && (
              <Box className="email-input-section" sx={{ 
                mt: 0.5, 
                pl: 4, 
                width: '100%',
                mb: -2,
                position: 'relative',
                zIndex: 1
              }}>
                <Typography sx={{ 
                  mb: 1,
                  color: '#4f4f4f',
                  fontFamily: 'OpenSans-Regular, sans-serif',
                  fontSize: '14px'
                }}>
                  Send to:
                </Typography>
                <MultiEmailInput
                  emails={emails}
                  onChange={setEmails}
                  placeholder="Enter email addresses and press Enter..."
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{
                    border: `1px solid ${focused ? '#f16508' : '#E5E5E5'}`,
                    borderRadius: '4px',
                    padding: '12px',
                    transition: 'border-color 0.2s ease',
                    width: '100%',
                    minHeight: '60px'
                  }}
                />
              </Box>
            )}
          </Box>
        </RadioGroup>
      </Box>

      {/* Dialog Actions */}
      <Box className="dialog-actions" sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'flex-end',
        mt: 2,
        width: '100%'
      }}>
        <Button
          className="cancel-button"
          variant="outlined"
          onClick={handleOptionsCancel}
          sx={{
            color: primaryColor,
            borderColor: primaryColor,
            backgroundColor: '#fff',
            borderRadius: '4px',
            textTransform: 'uppercase',
            fontWeight: '500',
            minWidth: 'auto',
            '&:hover': {
              borderColor: primaryColor,
              backgroundColor: `${primaryColor}12`
            }
          }}
        >
          {cameFromDerivateSelection ? 'BACK' : 'CANCEL'}
        </Button>
        <Button
          className="finish-button"
          onClick={handleFinalDownload}
          variant="contained"
          disabled={!canFinalDownload || loading}
          sx={{
            backgroundColor: canFinalDownload ? primaryColor : '#cccccc',
            color: '#fff',
            textTransform: 'uppercase',
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: canFinalDownload ? primaryColor : '#cccccc',
              opacity: canFinalDownload ? 0.9 : 1
            },
            '&:disabled': {
              backgroundColor: '#cccccc',
              color: '#ffffff'
            }
          }}
        >
          {loading ? 'Downloading...' : 'FINISH'}
        </Button>
      </Box>
    </Box>
    );
  };

  return (
    <Dialog
      open={open && shouldShowDialog} // Only show dialog when both conditions are true
      onClose={handleClose}
      PaperProps={{
        style: { boxShadow: 'none' }
      }}
      sx={{
        '& .MuiDialog-paper': {
          width: '520px',
          height: 'auto',
          maxHeight: '90vh',
          overflow: 'auto'
        }
      }}
    >
      {currentStep === 'derivates' ? derivatesContent() : optionsContent()}
    </Dialog>
  );
};

export default MediaDownloadDialog;
