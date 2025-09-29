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
  useTheme
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBrand } from '../hooks/useBrand';
import derivateManagementApi from '../services/derivateManagementApi';
import downloadApi from '../services/downloadApi';
import CookieService from '../utils/cookieService';
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
  selectedMedia = [], // Changed to array to support multiple media
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
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
  
  // Custom configuration states
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [ratio, setRatio] = useState('Fill');
  const [colorSpace, setColorSpace] = useState('');
  const [format, setFormat] = useState('');
  const [dpi, setDpi] = useState('');
  const [compression, setCompression] = useState('');

  // Fetch derivate data when dialog opens
  useEffect(() => {
    if (open) {
      fetchDerivateData();
    }
  }, [open, currentBrandCode]);

  const fetchDerivateData = async () => {
    try {
      setLoading(true);
      
      // Get tenant info from CookieService
      const userInfo = CookieService.getUserInfo();
      const tenantId = userInfo?.tenant?.name || userInfo?.tenantName || 'Kendo';
      const theme = currentBrandCode || 'kendo';
      
      // Use the first selected media's model number to get adhoc derivates
      let adhocFormats = [];
      let shouldSkipDerivateSelection = false;
      
      // Use selected media's model numbers to get adhoc derivates
      if (selectedMedia && selectedMedia.length > 0) {
        const mediaArray = Array.isArray(selectedMedia) ? selectedMedia : [selectedMedia];
        
        // Collect all model numbers from selected media
        const modelNumbers = mediaArray
          .map(media => media.id || media.mediaId || media.modelNumber)
          .filter(Boolean); // Remove empty values
        
        if (modelNumbers.length > 0) {
          try {
            console.log('Fetching derivates by model numbers:', modelNumbers);
            const derivates = await derivateManagementApi.getDerivatesByModelNumber(tenantId, theme, modelNumbers);
            
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
    setColorSpace('');
    setFormat('');
    setDpi('');
    setCompression('');
    onClose();
  };

  const handleDerivateConfirm = () => {
    if (selectedDerivates.length > 0 || isCustomConfiguration === 'yes') {
      setCurrentStep('options');
    }
  };

  const handleFinalDownload = async () => {
    try {
      setLoading(true);
      
      // Prepare media IDs
      const mediaIds = Array.isArray(selectedMedia) 
        ? selectedMedia.map(media => media.id || media.mediaId || 0)
        : [selectedMedia?.id || selectedMedia?.mediaId || 0];

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
        // You might want to show a success message to the user here
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

  const derivatesContent = () => (
    <>
      <DialogTitle>
        <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
          {t('Download')}
        </Typography>
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
      
      <DialogContent style={{ padding: '24px' }}>
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
            <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
              Select File Format
            </Typography>
        
        <List component="div" sx={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
          {derivateData.map((item, index) => (
            <Box key={`${item.label}-${index}`} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                sx={{
                  height: '20px',
                  borderLeft: `2px solid ${theme.palette.primary.main}`,
                  paddingLeft: '12px',
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
                />
              ))}
            </Box>
          ))}
        </List>

        <Typography
          sx={{
            height: '20px',
            borderLeft: `2px solid ${theme.palette.primary.main}`,
            paddingLeft: '12px',
            margin: '10px 0',
          }}
        >
          Custom Configuration
        </Typography>
        
        <RadioGroup 
          value={isCustomConfiguration} 
          onChange={e => setIsCustomConfiguration(e.target.value)}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>

        {isCustomConfiguration === 'yes' && (
          <Box sx={{ mt: 2 }}>
       
       
            
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <FormControl sx={{ width: '45%' }} variant="outlined">
                <FormHelperText>Height</FormHelperText>
                <OutlinedInput
                  sx={{ height: '32px' }}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  endAdornment={<InputAdornment position="end">px</InputAdornment>}
                />
              </FormControl>

              <FormControl sx={{ width: '45%' }} variant="outlined">
                <FormHelperText>Width</FormHelperText>
                <OutlinedInput
                  sx={{ height: '32px' }}
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  endAdornment={<InputAdornment position="end">px</InputAdornment>}
                />
              </FormControl>

              <FormControl sx={{ width: '45%' }} variant="outlined">
                <FormHelperText>Ratio</FormHelperText>
                <Select
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value)}
                  sx={{ height: '32px' }}
                >
                  <MenuItem value="Original">Original</MenuItem>
                  <MenuItem value="Adjust - Transparent">Adjust - Transparent</MenuItem>
                  <MenuItem value="Fill">Fill</MenuItem>
                  <MenuItem value="Crop">Crop</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ width: '45%' }} variant="outlined">
                <FormHelperText>Color Space</FormHelperText>
                <Select
                  value={colorSpace}
                  onChange={(e) => setColorSpace(e.target.value)}
                  sx={{ height: '32px' }}
                >
                  <MenuItem value="cmyk">CMYK - Print</MenuItem>
                  <MenuItem value="rgb">RGB - Web</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ width: '45%' }} variant="outlined">
                <FormHelperText>Format</FormHelperText>
                <Select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  sx={{ height: '32px' }}
                >
                  <MenuItem value="png">png</MenuItem>
                  <MenuItem value="tiff">tiff</MenuItem>
                  <MenuItem value="jpeg">jpeg</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ width: '45%' }} variant="outlined">
                <FormHelperText>DPI</FormHelperText>
                <Select
                  value={dpi}
                  onChange={(e) => setDpi(e.target.value)}
                  sx={{ height: '32px' }}
                >
                  <MenuItem value="72">72 - Web</MenuItem>
                  <MenuItem value="300">300 - Print</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ width: '45%' }} variant="outlined">
                <FormHelperText>Compression</FormHelperText>
                <Select
                  value={compression}
                  onChange={(e) => setCompression(e.target.value)}
                  sx={{ height: '32px' }}
                >
                  <MenuItem value="">No Compression</MenuItem>
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
          sx={{ color: '#333', border: 'solid 1px #E5E5E5' }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDerivateConfirm}
          variant="contained"
          disabled={loading || !canProceedFromDerivates || !isCustomConfigValid}
          sx={{
            color: '#fff',
            backgroundColor: !loading && canProceedFromDerivates && isCustomConfigValid ? '' : 'gray',
            cursor: !loading && canProceedFromDerivates && isCustomConfigValid ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? 'Loading...' : 'Download'}
        </Button>
      </DialogActions>
    </>
  );

  const optionsContent = () => (
    <>
      <DialogTitle>
        The file you're trying to download is large, and it will take a while. You have three choices.
        <br />
        Please select your preference:
      </DialogTitle>
      
      <DialogContent>
        <RadioGroup
          value={downloadOption}
          onChange={(e) => setDownloadOption(e.target.value)}
        >
          <FormControlLabel
            value="wait"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Wait for Download
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Begin the download immediately.
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="email"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Send to Email
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  We'll email you a download link for later access.
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="other"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Send to Others
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Send download link to other users and CC you Email to
                </Typography>
              </Box>
            }
          />
        </RadioGroup>

        {downloadOption === 'other' && (
          <Box sx={{ mt: 2, pl: 4 }}>
            <Typography sx={{ mb: 1 }}>
              Send to:
            </Typography>
            <MultiEmailInput
              emails={emails}
              onChange={setEmails}
              placeholder="Enter email addresses..."
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                border: `1px solid ${focused ? theme.palette.primary.main : '#E5E5E5'}`,
                borderRadius: '4px',
                padding: '8px',
                transition: 'border-color 0.2s ease'
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ padding: '0 24px 24px', display: 'flex', gap: '8px' }}>
        <Button
          onClick={handleClose}
          sx={{ color: '#333', border: 'solid 1px #E5E5E5' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleFinalDownload}
          variant="contained"
          disabled={!canFinalDownload || loading}
          sx={{ color: '#fff' }}
        >
          {loading ? 'Downloading...' : 'FINISH'}
        </Button>
      </DialogActions>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: { boxShadow: 'none' }
      }}
      sx={{
        '& .MuiDialog-paper': {
          width: '480px',
          minHeight: '400px',
          overflow: 'auto'
        }
      }}
    >
      {currentStep === 'derivates' ? derivatesContent() : optionsContent()}
    </Dialog>
  );
};

export default MediaDownloadDialog;
