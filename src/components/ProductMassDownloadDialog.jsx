import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    IconButton,
    List,
    Radio,
    RadioGroup,
    Typography,
    useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBrand } from '../hooks/useBrand';
import MultiEmailInput from './MultiEmailInput';

/**
 * Product Mass Download Dialog Component
 * 
 * Features:
 * - Language selection (with "More Language" expand)
 * - File format selection:
 *   - Publications (Catalog, Datasheet, Shelf Card)
 *   - Setup Sheets (Excel)
 *   - Mass Downloads (Media)
 * - Region selection for Shelf Cards
 * - Channel selection for Setup Sheets
 * - Derivate selection for Media downloads
 * - Download options (Email, Direct, Send to Others)
 */
const ProductMassDownloadDialog = ({
  open,
  onClose,
  selectedProducts = [],
  onDownload
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { currentBrand, currentBrandCode } = useBrand();

  // Dialog states
  const [currentStep, setCurrentStep] = useState('formats'); // 'formats' | 'regions' | 'channels' | 'derivates' | 'options'
  const [loading, setLoading] = useState(false);

  // Language selection
  const [selectedLanguages, setSelectedLanguages] = useState(['English']);
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  // Available languages (top 5 + expand for more)
  const availableLanguages = ['English', 'French', 'German', 'Italian', 'Chinese', 'Spanish', 'Portuguese', 'Japanese'];
  const displayedLanguages = showAllLanguages ? availableLanguages : availableLanguages.slice(0, 5);

  // File format selection
  const [selectedFormats, setSelectedFormats] = useState({
    catalog: false,
    datasheet: false,
    shelfCard1on1: false,
    shelfCardMultiple: false,
    setupSheetGeneral: false,
    setupSheetChannel: false,
    massMediaDownload: false
  });

  // Sub-selections
  const [selectedRegions, setSelectedRegions] = useState([]); // For Shelf Card 1on1
  const [selectedChannels, setSelectedChannels] = useState([]); // For Shelf Card Multiple / Setup Sheet Channel
  const [selectedDerivates, setSelectedDerivates] = useState([]); // For Mass Media Download

  // Channel data (fetched from API)
  const [availableChannels, setAvailableChannels] = useState([
    { id: 1, name: 'Standard PNG RGB WEB' },
    { id: 2, name: 'Standard TIFF RGB' },
    { id: 3, name: 'Standard PNG RGB HIGH RES' }
  ]);

  // Region data
  const [availableRegions, setAvailableRegions] = useState([
    { id: 1, name: 'Europe' },
    { id: 2, name: 'UK' },
    { id: 3, name: 'Austria' },
    { id: 4, name: 'Belgium' }
  ]);

  // Derivate data (for media downloads)
  const [availableDerivates, setAvailableDerivates] = useState([
    { id: 1, name: 'All Core Images' },
    { id: 2, name: 'All Images' }
  ]);

  // Download options
  const [downloadOption, setDownloadOption] = useState('email'); // 'email' | 'direct' | 'other'
  const [emails, setEmails] = useState([]);

  // Track which step opened a sub-dialog
  const [returnToStep, setReturnToStep] = useState('formats');

  // Initialize default language based on current i18n language
  useEffect(() => {
    if (open) {
      const currentLang = i18n.language;
      // Map language codes to display names
      const langMap = {
        'en': 'English',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'zh': 'Chinese',
        'es': 'Spanish',
        'pt': 'Portuguese',
        'ja': 'Japanese'
      };
      const defaultLang = langMap[currentLang] || 'English';
      setSelectedLanguages([defaultLang]);
    }
  }, [open, i18n.language]);

  const handleClose = () => {
    // Reset all states
    setCurrentStep('formats');
    setSelectedLanguages(['English']);
    setShowAllLanguages(false);
    setSelectedFormats({
      catalog: false,
      datasheet: false,
      shelfCard1on1: false,
      shelfCardMultiple: false,
      setupSheetGeneral: false,
      setupSheetChannel: false,
      massMediaDownload: false
    });
    setSelectedRegions([]);
    setSelectedChannels([]);
    setSelectedDerivates([]);
    setDownloadOption('email');
    setEmails([]);
    onClose();
  };

  const handleLanguageToggle = (language) => {
    setSelectedLanguages(prev => {
      if (prev.includes(language)) {
        return prev.filter(l => l !== language);
      } else {
        return [...prev, language];
      }
    });
  };

  const handleFormatToggle = (format) => {
    setSelectedFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const handleRegionToggle = (regionId) => {
    setSelectedRegions(prev => {
      if (prev.includes(regionId)) {
        return prev.filter(id => id !== regionId);
      } else {
        return [...prev, regionId];
      }
    });
  };

  const handleChannelToggle = (channelId) => {
    setSelectedChannels(prev => {
      if (prev.includes(channelId)) {
        return prev.filter(id => id !== channelId);
      } else {
        return [...prev, channelId];
      }
    });
  };

  const handleDerivateToggle = (derivateId) => {
    setSelectedDerivates(prev => {
      if (prev.includes(derivateId)) {
        return prev.filter(id => id !== derivateId);
      } else {
        return [...prev, derivateId];
      }
    });
  };

  const handleOpenRegionSelection = () => {
    setReturnToStep('formats');
    setCurrentStep('regions');
  };

  const handleOpenChannelSelection = () => {
    setReturnToStep('formats');
    setCurrentStep('channels');
  };

  const handleOpenDerivateSelection = () => {
    setReturnToStep('formats');
    setCurrentStep('derivates');
  };

  const handleProceedToDownload = () => {
    setCurrentStep('options');
  };

  const handleBackFromSubDialog = () => {
    setCurrentStep(returnToStep);
  };

  const handleFinalDownload = async () => {
    try {
      setLoading(true);

      // Prepare download data
      const downloadData = {
        products: selectedProducts,
        languages: selectedLanguages,
        formats: selectedFormats,
        regions: selectedRegions,
        channels: selectedChannels,
        derivates: selectedDerivates,
        downloadOption,
        emails: downloadOption === 'other' ? emails : []
      };

      // Call the download handler
      await onDownload?.(downloadData);

      handleClose();
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const hasSelectedLanguage = selectedLanguages.length > 0;
  const hasSelectedFormat = Object.values(selectedFormats).some(v => v);
  const canProceed = hasSelectedLanguage && hasSelectedFormat;
  const canFinalDownload = downloadOption !== 'other' || emails.length > 0;

  // Main format selection dialog
  const formatSelectionContent = () => (
    <>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, mb: 2 }}>
          <Typography sx={{ fontSize: '21px', fontWeight: 600, fontFamily: 'OpenSans-SemiBold' }}>
            Download
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme?.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: '0 24px 24px 24px' }}>
        {/* Language Selection */}
        <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 2, color: '#333', fontFamily: 'OpenSans-SemiBold' }}>
          Select Language
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {displayedLanguages.map((language) => (
            <FormControlLabel
              key={language}
              control={
                <Checkbox
                  size="small"
                  checked={selectedLanguages.includes(language)}
                  onChange={() => handleLanguageToggle(language)}
                  sx={{
                    '&.Mui-checked': {
                      color: '#F16508'
                    }
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '14px', color: '#4d4d4d' }}>{language}</Typography>}
              sx={{ minWidth: '80px' }}
            />
          ))}
        </Box>
        <Typography
          onClick={() => setShowAllLanguages(!showAllLanguages)}
          sx={{
            fontSize: '12px',
            color: '#F16508',
            cursor: 'pointer',
            mb: 2,
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {showAllLanguages ? 'Less Language...' : 'More Language...'}
        </Typography>

        <Divider sx={{ my: 2, backgroundColor: '#E6E6E6' }} />

        {/* File Format Selection */}
        <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 2, color: '#333', fontFamily: 'OpenSans-SemiBold' }}>
          Select File Format
        </Typography>

        {/* Publications */}
        <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1, color: '#4d4d4d', fontFamily: 'OpenSans-SemiBold' }}>
          Publications
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, ml: 2 }}>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={selectedFormats.catalog}
                  onChange={() => handleFormatToggle('catalog')}
                  sx={{ '&.Mui-checked': { color: '#F16508' } }}
                />
              }
              label={<Typography sx={{ fontSize: '14px', color: '#4f4f4f' }}>Catalog</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={selectedFormats.datasheet}
                  onChange={() => handleFormatToggle('datasheet')}
                  sx={{ '&.Mui-checked': { color: '#F16508' } }}
                />
              }
              label={<Typography sx={{ fontSize: '14px', color: '#4f4f4f' }}>Datasheet</Typography>}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={selectedFormats.shelfCard1on1}
                    onChange={() => handleFormatToggle('shelfCard1on1')}
                    sx={{ '&.Mui-checked': { color: '#F16508' } }}
                  />
                }
                label={<Typography sx={{ fontSize: '14px', color: '#4f4f4f' }}>Shelf Card (1on1)</Typography>}
              />
            </Box>
            {selectedFormats.shelfCard1on1 && (
              <Box sx={{ ml: 4, p: 1, backgroundColor: '#F5F5F5', borderRadius: '3px' }}>
                <Typography sx={{ fontSize: '12px', color: '#808080', mb: 0.5 }}>
                  Select the Regions{' '}
                  <span
                    onClick={handleOpenRegionSelection}
                    style={{ color: '#F16508', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    HERE
                  </span>
                </Typography>
                {selectedRegions.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: '9.6px', color: '#F16508' }}>
                      {selectedRegions.length} selected
                    </Typography>
                    <Typography sx={{ fontSize: '9.6px', color: '#4d4d4d' }}>
                      {selectedRegions.map(id => availableRegions.find(r => r.id === id)?.name).join(' | ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={selectedFormats.shelfCardMultiple}
                    onChange={() => handleFormatToggle('shelfCardMultiple')}
                    sx={{ '&.Mui-checked': { color: '#F16508' } }}
                  />
                }
                label={<Typography sx={{ fontSize: '14px', color: '#4f4f4f' }}>Shelf Card (Multiple)</Typography>}
              />
            </Box>
            {selectedFormats.shelfCardMultiple && (
              <Box sx={{ ml: 4, p: 1, backgroundColor: '#F5F5F5', borderRadius: '3px' }}>
                <Typography sx={{ fontSize: '12px', color: '#808080', mb: 0.5 }}>
                  Select the Channels{' '}
                  <span
                    onClick={handleOpenChannelSelection}
                    style={{ color: '#F16508', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    HERE
                  </span>
                </Typography>
                {selectedChannels.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: '9.6px', color: '#F16508' }}>
                      {selectedChannels.length} selected
                    </Typography>
                    <ul style={{ margin: '4px 0', paddingLeft: '16px', fontSize: '9.6px', color: '#4d4d4d' }}>
                      {selectedChannels.map(id => (
                        <li key={id}>{availableChannels.find(c => c.id === id)?.name}</li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Setup Sheets (Excel) */}
        <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1, color: '#4d4d4d', fontFamily: 'OpenSans-SemiBold' }}>
          Setup Sheets (Excel)
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, ml: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={selectedFormats.setupSheetGeneral}
                onChange={() => handleFormatToggle('setupSheetGeneral')}
                sx={{ '&.Mui-checked': { color: '#F16508' } }}
              />
            }
            label={<Typography sx={{ fontSize: '14px', color: '#4f4f4f' }}>Setup Sheet (General)</Typography>}
          />
        </Box>

        {/* Mass Downloads (Media) */}
        <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1, color: '#4d4d4d', fontFamily: 'OpenSans-SemiBold' }}>
          Mass Downloads (Media)
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={selectedFormats.massMediaDownload}
                  onChange={() => handleFormatToggle('massMediaDownload')}
                  sx={{ '&.Mui-checked': { color: '#F16508' } }}
                />
              }
              label={<Typography sx={{ fontSize: '14px', color: '#4f4f4f' }}>All Core Images</Typography>}
            />
            {selectedFormats.massMediaDownload && (
              <Box sx={{ ml: 4, p: 1, backgroundColor: '#F5F5F5', borderRadius: '3px', mt: 1 }}>
                <Typography sx={{ fontSize: '12px', color: '#808080', mb: 0.5 }}>
                  Select the Derivates{' '}
                  <span
                    onClick={handleOpenDerivateSelection}
                    style={{ color: '#F16508', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    HERE
                  </span>
                </Typography>
                {selectedDerivates.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: '9.6px', color: '#F16508' }}>
                      {selectedDerivates.length} selected
                    </Typography>
                    <ul style={{ margin: '4px 0', paddingLeft: '16px', fontSize: '9.6px', color: '#4d4d4d' }}>
                      {selectedDerivates.map(id => (
                        <li key={id}>{availableDerivates.find(d => d.id === id)?.name}</li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: '12px 24px', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{ color: '#4d4d4d', border: '1px solid #E6E6E6', textTransform: 'uppercase' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleProceedToDownload}
          disabled={!canProceed || loading}
          sx={{
            backgroundColor: canProceed ? '#F16508' : '#cccccc',
            color: '#fff',
            textTransform: 'uppercase',
            '&:hover': {
              backgroundColor: canProceed ? '#d5570a' : '#cccccc'
            }
          }}
        >
          Download
        </Button>
      </DialogActions>
    </>
  );

  // Region selection sub-dialog
  const regionSelectionContent = () => (
    <>
      <DialogTitle>
        <Typography sx={{ fontSize: '21px', fontWeight: 600, mt: 2, mb: 2 }}>
          Select Regions
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleBackFromSubDialog}
          sx={{ position: 'absolute', right: 8, top: 8, color: theme?.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '0 24px 24px 24px' }}>
        <List>
          {availableRegions.map((region) => (
            <FormControlLabel
              key={region.id}
              control={
                <Checkbox
                  size="small"
                  checked={selectedRegions.includes(region.id)}
                  onChange={() => handleRegionToggle(region.id)}
                  sx={{ '&.Mui-checked': { color: '#F16508' } }}
                />
              }
              label={<Typography sx={{ fontSize: '14px', color: '#333' }}>{region.name}</Typography>}
            />
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ padding: '12px 24px', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleBackFromSubDialog}
          sx={{ color: '#4d4d4d', border: '1px solid #E6E6E6', textTransform: 'uppercase' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleBackFromSubDialog}
          sx={{ backgroundColor: '#F16508', color: '#fff', textTransform: 'uppercase' }}
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  );

  // Channel selection sub-dialog
  const channelSelectionContent = () => (
    <>
      <DialogTitle>
        <Typography sx={{ fontSize: '21px', fontWeight: 600, mt: 2, mb: 2 }}>
          Select Channels
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleBackFromSubDialog}
          sx={{ position: 'absolute', right: 8, top: 8, color: theme?.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '0 24px 24px 24px' }}>
        <List>
          {availableChannels.map((channel) => (
            <FormControlLabel
              key={channel.id}
              control={
                <Checkbox
                  size="small"
                  checked={selectedChannels.includes(channel.id)}
                  onChange={() => handleChannelToggle(channel.id)}
                  sx={{ '&.Mui-checked': { color: '#F16508' } }}
                />
              }
              label={<Typography sx={{ fontSize: '14px', color: '#333' }}>{channel.name}</Typography>}
            />
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ padding: '12px 24px', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleBackFromSubDialog}
          sx={{ color: '#4d4d4d', border: '1px solid #E6E6E6', textTransform: 'uppercase' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleBackFromSubDialog}
          sx={{ backgroundColor: '#F16508', color: '#fff', textTransform: 'uppercase' }}
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  );

  // Derivate selection sub-dialog
  const derivateSelectionContent = () => (
    <>
      <DialogTitle>
        <Typography sx={{ fontSize: '21px', fontWeight: 600, mt: 2, mb: 2 }}>
          Select Derivates
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleBackFromSubDialog}
          sx={{ position: 'absolute', right: 8, top: 8, color: theme?.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '0 24px 24px 24px' }}>
        <List>
          {availableDerivates.map((derivate) => (
            <FormControlLabel
              key={derivate.id}
              control={
                <Checkbox
                  size="small"
                  checked={selectedDerivates.includes(derivate.id)}
                  onChange={() => handleDerivateToggle(derivate.id)}
                  sx={{ '&.Mui-checked': { color: '#F16508' } }}
                />
              }
              label={<Typography sx={{ fontSize: '14px', color: '#333' }}>{derivate.name}</Typography>}
            />
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ padding: '12px 24px', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleBackFromSubDialog}
          sx={{ color: '#4d4d4d', border: '1px solid #E6E6E6', textTransform: 'uppercase' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleBackFromSubDialog}
          sx={{ backgroundColor: '#F16508', color: '#fff', textTransform: 'uppercase' }}
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  );

  // Download options dialog
  const downloadOptionsContent = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography sx={{ fontSize: '21px', fontWeight: 600, fontFamily: 'OpenSans-SemiBold' }}>
          Download
        </Typography>
      </Box>

      <Typography sx={{ fontSize: '16px', color: '#333', mb: 3, lineHeight: 1.4 }}>
        The file you're trying to download is large, and it will take a while.
        You have three choices.
        <br />
        Please select your preference:
      </Typography>

      <RadioGroup value={downloadOption} onChange={(e) => setDownloadOption(e.target.value)} sx={{ gap: 2 }}>
        {/* Wait for Download */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Radio
            value="direct"
            sx={{ color: '#cccccc', '&.Mui-checked': { color: '#F16508' } }}
          />
          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>
              Wait for Download
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#4f4f4f' }}>
              Begin the download immediately.
            </Typography>
          </Box>
        </Box>

        {/* Send to Email */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Radio
            value="email"
            sx={{ color: '#cccccc', '&.Mui-checked': { color: '#F16508' } }}
          />
          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>
              Send to Email
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#4f4f4f' }}>
              We'll email you a download link for later access.
            </Typography>
          </Box>
        </Box>

        {/* Send to Others */}
        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Radio
              value="other"
              sx={{ color: '#cccccc', '&.Mui-checked': { color: '#F16508' } }}
            />
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>
                Send to Others
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#4f4f4f' }}>
                Send download link to other users and CC you
              </Typography>
            </Box>
          </Box>

          {downloadOption === 'other' && (
            <Box sx={{ ml: 4, mt: 1 }}>
              <Typography sx={{ fontSize: '14px', color: '#4f4f4f', mb: 1 }}>
                Send to:
              </Typography>
              <MultiEmailInput
                emails={emails}
                onChange={setEmails}
                placeholder="Enter email addresses..."
                style={{
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                  padding: '8px',
                  width: '100%',
                  minHeight: '50px'
                }}
              />
            </Box>
          )}
        </Box>
      </RadioGroup>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => setCurrentStep('formats')}
          sx={{ color: '#4d4d4d', border: '1px solid #E6E6E6', textTransform: 'uppercase' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleFinalDownload}
          disabled={!canFinalDownload || loading}
          sx={{
            backgroundColor: canFinalDownload ? '#F16508' : '#cccccc',
            color: '#fff',
            textTransform: 'uppercase',
            '&:hover': {
              backgroundColor: canFinalDownload ? '#d5570a' : '#cccccc'
            }
          }}
        >
          {loading ? 'Downloading...' : 'Finish'}
        </Button>
      </Box>
    </Box>
  );

  // Determine dialog height based on current step
  const getDialogHeight = () => {
    if (currentStep === 'options' && downloadOption === 'other') {
      return '530px';
    }
    if (currentStep === 'formats') {
      return '652px';
    }
    return '400px';
  };

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
          minHeight: getDialogHeight(),
          overflow: 'hidden',
          borderRadius: '2px'
        }
      }}
    >
      {currentStep === 'formats' && formatSelectionContent()}
      {currentStep === 'regions' && regionSelectionContent()}
      {currentStep === 'channels' && channelSelectionContent()}
      {currentStep === 'derivates' && derivateSelectionContent()}
      {currentStep === 'options' && downloadOptionsContent()}
    </Dialog>
  );
};

export default ProductMassDownloadDialog;

