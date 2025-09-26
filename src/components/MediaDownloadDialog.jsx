import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Checkbox,
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
      
      const response = await derivateManagementApi.getDerivates(0, 100, '', tenantId, theme);
      const adhocFormats = response.derivates?.map(derivate => derivate.label) || [];
      setDerivateData(getInitialDerivateData(adhocFormats));
    } catch (error) {
      console.error('Error fetching derivate data:', error);
      // Use default data if API fails
      setDerivateData(getInitialDerivateData());
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset states
    setCurrentStep('derivates');
    setSelectedDerivates([]);
    setIsCustomConfiguration('no');
    setDownloadOption('email');
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

      // Prepare derivates string
      const derivatesString = selectedDerivates.join(',');

      // Prepare custom configuration if needed
      const customConfig = isCustomConfiguration === 'yes' ? {
        prefix: '',
        postfix: '',
        width,
        height,
        dpi,
        crop: ratio === 'Crop' ? 'true' : '',
        background: '',
        preserveAlpha: 'true',
        format,
        colorSpace: colorSpace === 'cmyk' ? 'CMYK' : 'RGB',
        gravity: 'Center',
        ratio,
        compression
      } : null;

      // Call download API
      const { blob, filename } = await downloadApi.massDownload(mediaIds, derivatesString, customConfig);
      
      // Trigger download based on selected option
      if (downloadOption === 'wait') {
        downloadApi.triggerDownload(blob, filename);
      } else if (downloadOption === 'email') {
        // TODO: Implement email functionality when available
        console.log('Email download not yet implemented');
        downloadApi.triggerDownload(blob, filename); // Fallback to direct download
      } else if (downloadOption === 'other') {
        // TODO: Implement send to others functionality when available
        console.log('Send to others not yet implemented');
        downloadApi.triggerDownload(blob, filename); // Fallback to direct download
      }

      handleClose();
    } catch (error) {
      console.error('Download failed:', error);
      // You might want to show an error message to the user here
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
          {t('Download')} {Array.isArray(selectedMedia) ? `(${selectedMedia.length} items)` : '(1 item)'}
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
            <Typography sx={{ mb: 2 }}>
              Please adjust the main parameters to download a personalized derivate
            </Typography>
            <Box sx={{ 
              padding: '12px 20px', 
              background: '#FAFAFA', 
              borderRadius: '4px',
              mb: 2
            }}>
              Please adjust the main parameters to download a personalized derivate
            </Box>
            
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
      </DialogContent>

      <DialogActions sx={{ padding: '12px 24px', display: 'flex', gap: '8px' }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{ color: '#333', border: 'solid 1px #E5E5E5' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDerivateConfirm}
          variant="contained"
          disabled={!canProceedFromDerivates || !isCustomConfigValid || loading}
          sx={{
            color: '#fff',
            backgroundColor: canProceedFromDerivates && isCustomConfigValid && !loading ? '' : 'gray',
            cursor: canProceedFromDerivates && isCustomConfigValid && !loading ? 'pointer' : 'not-allowed'
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
          onClick={() => setCurrentStep('derivates')}
          sx={{ color: '#333', border: 'solid 1px #E5E5E5' }}
        >
          Back
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
