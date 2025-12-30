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
import { useLanguage } from '../hooks/useLanguage';
import downloadApi from '../services/downloadApi';
import setUpSheetApi from '../services/setUpSheetApi';
import templateApi from '../services/templateApi';
import derivateManagementApi from '../services/derivateManagementApi';
import CookieService from '../utils/cookieService';
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
 * 
 * @param {string[]} selectedProductIds - Array of product IDs (modelNumber/VirtualProductID)
 */
const ProductMassDownloadDialog = ({
  open,
  onClose,
  selectedProductIds = [],
  onDownload
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { currentBrand, currentBrandCode } = useBrand();
  const { supportedLanguages, currentLanguage, getCurrentLanguageInfo } = useLanguage();

  // 暂时隐藏 Setup Sheet (Channel) 选项
  const SHOW_SETUP_SHEET_CHANNEL = false;

  // Dialog states
  const [currentStep, setCurrentStep] = useState('formats'); // 'formats' | 'regions' | 'channels' | 'derivates' | 'options'
  const [loading, setLoading] = useState(false);

  // Language selection - 使用语言代码存储
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  // Available languages from Redux - 默认显示前5个，点击展开显示全部
  const displayedLanguages = showAllLanguages ? supportedLanguages : supportedLanguages.slice(0, 5);

  // File format选择（非 publication 类格式的开关：Setup Sheet / Mass Media）
  const [selectedFormats, setSelectedFormats] = useState({
    setupSheetGeneral: false,
    setupSheetChannel: false,
    massMediaDownload: false
  });

  // Sub-selections
  const [selectedRegions, setSelectedRegions] = useState([]); // For Shelf Card 1on1
  const [selectedChannels, setSelectedChannels] = useState([]); // For Shelf Card Multiple / Setup Sheet Channel
  const [selectedDerivates, setSelectedDerivates] = useState([]); // For Mass Media Download

  // Channel data (fetched from API)
  const [availableChannels, setAvailableChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(false);

  // Derivate loading state
  const [derivatesLoading, setDerivatesLoading] = useState(false);

  // Region data
  const [availableRegions, setAvailableRegions] = useState([
    { id: 1, name: 'Europe' },
    { id: 2, name: 'UK' },
    { id: 3, name: 'Austria' },
    { id: 4, name: 'Belgium' }
  ]);

  // Derivate data (for media downloads)
  const [availableDerivates, setAvailableDerivates] = useState([
  ]);

  // Quantity/Quality selection
  const [outputQuality, setOutputQuality] = useState('web'); // 'web' | 'print'

  // Download options
  const [downloadOption, setDownloadOption] = useState('email'); // 'email' | 'direct' | 'other'
  const [emails, setEmails] = useState([]);

  const [publicationTemplates, setPublicationTemplates] = useState([]);

  const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);

  // Track which step opened a sub-dialog
  const [returnToStep, setReturnToStep] = useState('formats');

  // Initialize default language based on current language from Redux
  useEffect(() => {
    if (open && currentLanguage) {
      // 默认选中当前语言
      setSelectedLanguages([currentLanguage]);
    }
  }, [open, currentLanguage]);

  useEffect(() => {
    if (!open) return;

    const fetchPublicationTemplates = async () => {
      try {
        const templates = await templateApi.getTemplates();

        const specificTemplates = (templates || []).filter(
          (t) => (t.templateTypeName || '').toLowerCase() === 'specific'
        );

        const allTemplates = [];

        specificTemplates.forEach((t) => {
          const name = (t?.name || '').trim();
          if (!name) return;

          const lowerName = name.toLowerCase();
          const typeName = (t.typeName || '').toLowerCase();

          let type = 'normal';
          if (
            typeName === 'shelfcard' ||
            lowerName.includes('shelf card') ||
            lowerName.includes('shelfcard') ||
            lowerName === 'shelf'
          ) {
            type = 'shelfCard';
          }

          allTemplates.push({ id: t.id, name, type });
        });

        const seen = new Set();
        const uniqueTemplates = allTemplates.filter((t) => {
          if (!t.name) return false;
          const key = `${t.type}:${t.name}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setPublicationTemplates(uniqueTemplates);
      } catch (e) {
        console.error('Failed to fetch publication templates:', e);
        // 避免闪烁
        setPublicationTemplates((prev) => prev);
      }
    };

    fetchPublicationTemplates();
  }, [open]);

  const handleClose = () => {
    // Reset all states
    setCurrentStep('formats');
    setSelectedLanguages(currentLanguage ? [currentLanguage] : []);
    setShowAllLanguages(false);
    setOutputQuality('web');
    setSelectedFormats({
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

  const handleLanguageToggle = (languageCode) => {
    setSelectedLanguages(prev => {
      if (prev.includes(languageCode)) {
        return prev.filter(l => l !== languageCode);
      } else {
        return [...prev, languageCode];
      }
    });
  };

  const handleFormatToggle = async (format) => {
    setSelectedFormats(prev => {
      const newValue = !prev[format];
      
      if (format === 'massMediaDownload' && !newValue) {
        setSelectedDerivates([]);
      }
      return {
        ...prev,
        [format]: newValue
      };
    });
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

  // 切换 publication 模板的选中状态
  const toggleTemplateSelection = (templateId) => {
    setSelectedTemplateIds((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
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
      const newDerivates = prev.includes(derivateId)
        ? prev.filter(id => id !== derivateId)
        : [...prev, derivateId];
      
      if (newDerivates.length === 0) {
        setSelectedFormats(prevFormats => ({ ...prevFormats, massMediaDownload: false }));
      } else {
        setSelectedFormats(prevFormats => ({ ...prevFormats, massMediaDownload: true }));
      }
      
      return newDerivates;
    });
  };

  const handleOpenRegionSelection = () => {
    setReturnToStep('formats');
    setCurrentStep('regions');
  };

  const fetchChannelsForSelection = async () => {
    try {
      setChannelsLoading(true);

      const allChannels = await setUpSheetApi.getChannels();

      const channels = (allChannels || []).filter(
        (ch) => (ch.templateType || '').toLowerCase() === 'specific'
      );

      const channelsWithTemplates = await Promise.all(
        channels.map(async (ch) => {
          const channelId = ch.id ?? ch.channelId;
          const channelName = ch.name ?? ch.channelName ?? '';

          let templates = [];
          try {
            const rawTemplates = Array.isArray(ch.templates) ? ch.templates : [];
            // 保存模板的完整信息（包括 id 和 name）
            templates = rawTemplates
              .map((t) => ({
                id: t.id,
                name: t.name || ''
              }))
              .filter(t => t.name);
          } catch (e) {
            console.error('Failed to extract templates for channel', channelId, e);
          }

          return {
            id: channelId,
            name: channelName,
            templates
          };
        })
      );

      setAvailableChannels(
        channelsWithTemplates.filter((ch) => Array.isArray(ch.templates) && ch.templates.length > 0)
      );
    } catch (error) {
      console.error('Failed to fetch channels for selection dialog:', error);
    } finally {
      setChannelsLoading(false);
    }
  };

  const handleOpenChannelSelection = () => {
    setReturnToStep('formats');
    setSelectedChannels([]);
    setCurrentStep('channels');
    fetchChannelsForSelection();
  };

  const fetchDerivatesForSelection = async () => {
    try {
      setDerivatesLoading(true);
      
      // 获取 tenant 和 theme
      const tenantName = setUpSheetApi.getTenantName();
      const theme = setUpSheetApi.getThemeFromUrl();
      
      console.log('Fetching derivates with params:', { tenant: tenantName, theme });
      
      // 调用 derivatelist?tenant 接口
      const response = await derivateManagementApi.getDerivates(0, 100, '', tenantName, theme);
      
      // 设置可用的 derivates
      setAvailableDerivates(response.derivates || []);
    } catch (error) {
      console.error('Failed to fetch derivates for selection:', error);
      setAvailableDerivates([]);
    } finally {
      setDerivatesLoading(false);
    }
  };

  const handleOpenDerivateSelection = () => {
    setReturnToStep('formats');
    setCurrentStep('derivates');
    fetchDerivatesForSelection();
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

      // 获取用户信息
      const userInfo = CookieService.getUserInfo();
      const userEmail = userInfo?.email || '';

      const publicationTemplateIds = (selectedTemplateIds || []).join(',');

      let setupsheetTemplateIds = '';
      const templateIds = [];
      
      // 选中了 Setup Sheet (General)，直接传 6
      if (selectedFormats.setupSheetGeneral) {
        templateIds.push('6');
      }
      
      if (selectedFormats.setupSheetChannel) {
        const setupSheetTemplateIds = selectedChannels
          .map(channelId => {
            const channel = availableChannels.find(ch => ch.id === channelId);
            if (channel && Array.isArray(channel.templates)) {
              // 提取所有模板的 ID
              return channel.templates
                .map(tpl => typeof tpl === 'object' && tpl.id ? tpl.id : null)
                .filter(Boolean);
            }
            return [];
          })
          .flat()
          .filter((id, index, self) => self.indexOf(id) === index); // 去重
        
        templateIds.push(...setupSheetTemplateIds.map(id => id.toString()));
      }
      
      if (templateIds.length > 0) {
        setupsheetTemplateIds = [...new Set(templateIds)].join(',');
      }

      const derivateIds = selectedDerivates
        .map(id => id.toString())
        .filter(Boolean)
        .join(',');

      const languageCode = selectedLanguages.length > 0
        ? selectedLanguages[0]
        : '';

      // 使用传入的产品 IDs
      const modelNumbers = selectedProductIds
        .filter(Boolean)
        .join(',');

      const params = {
        modelNumber: modelNumbers,
        publicationTemplates: publicationTemplateIds,
        setupsheetTemplates: setupsheetTemplateIds,
        derivateList: derivateIds,
        language: languageCode,
        outputQuality: outputQuality,
        tomail: downloadOption === 'other' ? emails.join(',') : (downloadOption === 'email' ? userEmail : ''),
        ccemail: downloadOption === 'other' ? userEmail : '',
        async: downloadOption !== 'direct' // direct = false (sync), email/other = true (async)
      };

      console.log('📦 Calling Product Mass Download API with params:', params);

      // 调用 API
      const result = await downloadApi.productMassDownload(params);

      if (result.success) {
        // Async download - email sent
      } else if (result.blob) {
        // Direct download - trigger file download
        downloadApi.triggerDownload(result.blob, result.filename);
      }

      handleClose();
    } catch (error) {
      alert(`Download failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const hasSelectedLanguage = selectedLanguages.length > 0;

  const hasSelectedPublicationTemplate = selectedTemplateIds.length > 0;
  const hasOtherFormats =
    selectedFormats.setupSheetGeneral ||
    selectedFormats.setupSheetChannel ||
    selectedFormats.massMediaDownload;
  const hasSelectedFormat = hasSelectedPublicationTemplate || hasOtherFormats;
  const massMediaValid = !selectedFormats.massMediaDownload || selectedDerivates.length > 0;
  const canProceed = hasSelectedLanguage && hasSelectedFormat && massMediaValid;
  const canFinalDownload = downloadOption !== 'other' || emails.length > 0;

  // Main format selection dialog
  const formatSelectionContent = () => {
    const getPublicationRank = (tpl) => {
      const name = (tpl.name || '').toLowerCase();
      if (name.includes('datasheet')) return 0;
      if (name.includes('catalog')) return 1;
      if (name.includes('shelf card') || name.includes('shelfcard') || name === 'shelf') return 2;
      return 3;
    };
    const orderedPublicationTemplates = [...publicationTemplates].sort(
      (a, b) => getPublicationRank(a) - getPublicationRank(b)
    );

    return (
    <>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#333' }}>
              download
            </span>
            <Typography
              sx={{
                fontSize: '21px',
                fontWeight: 500,
                fontFamily: '"Roboto-Medium", sans-serif'
              }}
            >
              Download
            </Typography>
          </Box>
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

      <DialogContent sx={{ padding: '0 24px 14px 24px' }}>
        {/* Language Selection */}
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 500,
            mb: 2,
            color: '#333',
            fontFamily: '"Roboto-Medium", sans-serif'
          }}
        >
          Select Language
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {displayedLanguages.map((language) => (
            <FormControlLabel
              key={language.code}
              control={
                <Checkbox
                  size="small"
                  checked={selectedLanguages.includes(language.code)}
                  onChange={() => handleLanguageToggle(language.code)}
                  sx={{
                    '&.Mui-checked': {
                      color: theme.palette.primary.main
                    }
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '14px', color: '#4d4d4d' }}>{language.name}</Typography>}
              sx={{ minWidth: '120px' }}
            />
          ))}
        </Box>
        <Typography
          onClick={() => setShowAllLanguages(!showAllLanguages)}
          sx={{
            fontSize: '12px',
            color: theme.palette.primary.main,
            cursor: 'pointer',
            mb: 2,
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {showAllLanguages ? 'Less Language...' : 'More Language...'}
        </Typography>

        <Divider sx={{ my: 2, backgroundColor: '#E6E6E6' }} />

        {/* Quantity Selection */}
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 500,
            mb: 2,
            color: '#333',
            fontFamily: '"Roboto-Medium", sans-serif'
          }}
        >
          Quality
        </Typography>
        <RadioGroup
          value={outputQuality}
          onChange={(e) => setOutputQuality(e.target.value)}
          row
          sx={{ 
            mb: 2,
            gap: 5, 
            '& .MuiFormControlLabel-root': {
              marginRight: 0 // 移除默认的右边距
            }
          }}
        >
          <FormControlLabel
            value="web"
            control={
              <Radio
                sx={{
                  color: '#cccccc',
                  '&.Mui-checked': {
                    color: theme.palette.primary.main
                  }
                }}
              />
            }
            label={<Typography sx={{ fontSize: '14px', color: '#4d4d4d' }}>Web PDF</Typography>}
          />
          <FormControlLabel
            value="print"
            control={
              <Radio
                sx={{
                  color: '#cccccc',
                  '&.Mui-checked': {
                    color: theme.palette.primary.main
                  }
                }}
              />
            }
            label={<Typography sx={{ fontSize: '14px', color: '#4d4d4d' }}>HighRes Print</Typography>}
          />
        </RadioGroup>

        <Divider sx={{ my: 2, backgroundColor: '#E6E6E6' }} />

        {/* File Format Selection */}
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 500,
            mb: 2,
            color: '#333',
            fontFamily: '"Roboto-Medium", sans-serif'
          }}
        >
          Select File Format
        </Typography>

        {/* Publications */}
        <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1, color: '#4d4d4d' }}>
          Publications
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, ml: 2 }}>
          {/* Publications 模板 */}
          <Box sx={{ display: 'flex', gap: 2, rowGap: 0.5, width: '100%', flexWrap: 'wrap' }}>
            {orderedPublicationTemplates.map((tpl, idx) => {
              const checked = selectedTemplateIds.includes(tpl.id);

              return (
                <Box
                  key={`pub-${tpl.id}-${idx}`}
                  sx={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: 0.25 }}
                >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                        checked={checked}
                        onChange={() => toggleTemplateSelection(tpl.id)}
                    sx={{ '&.Mui-checked': { color: theme.palette.primary.main } }}
                  />
                }
                    label={
                      <Typography sx={{ fontSize: '14px', color: '#4f4f4f' }}>
                        {tpl.name}
                  </Typography>
                    }
                  />
            </Box>
              );
            })}
          </Box>
        </Box>

        {/* Setup Sheets (Excel) */}
        <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1, color: '#4d4d4d' }}>
          Setup Sheets (Excel)
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, ml: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Box sx={{ flex: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={selectedFormats.setupSheetGeneral}
                    onChange={() => handleFormatToggle('setupSheetGeneral')}
                    sx={{ '&.Mui-checked': { color: theme.palette.primary.main } }}
                  />
                }
                label={<Typography sx={{ fontSize: '14px', color: '#4f4f4f' }}>Setup Sheet (General)</Typography>}
              />
            </Box>
            {SHOW_SETUP_SHEET_CHANNEL && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedFormats.setupSheetChannel}
                      onChange={() => handleFormatToggle('setupSheetChannel')}
                      sx={{ '&.Mui-checked': { color: theme.palette.primary.main } }}
                    />
                  }
                  label={<Typography sx={{ fontSize: '14px', color: '#4f4f4f' }}>Setup Sheet (Channel)</Typography>}
                />
                {selectedFormats.setupSheetChannel && (
                  <Box sx={{ ml: 4, mt: 0.25 }}>
                    <Typography sx={{ fontSize: '12px', color: '#808080' }}>
                      Select the Channels{' '}
                      <span
                        onClick={handleOpenChannelSelection}
                        style={{ color: theme.palette.primary.main, fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        HERE
                      </span>
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Mass Downloads (Media) */}
        <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1, color: '#4d4d4d' }}>
          Mass Downloads (Media)
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2, mb: 0 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={selectedFormats.massMediaDownload}
                onChange={() => handleFormatToggle('massMediaDownload')}
                sx={{ '&.Mui-checked': { color: theme.palette.primary.main } }}
              />
            }
            label={<Typography sx={{ fontSize: '14px', color: '#4f4f4f' }}>Mass Media Download</Typography>}
          />

          {/* 与 Setup Sheet (Channel) 一致：仅在勾选后显示链接，颜色使用主题色 */}
          {selectedFormats.massMediaDownload && (
            <Box sx={{ ml: 4, mt: 0.25 }}>
              <Typography sx={{ fontSize: '12px', color: '#808080' }}>
                Select the Derivates{' '}
                <span
                  onClick={handleOpenDerivateSelection}
                  style={{ color: theme.palette.primary.main, fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  HERE
                </span>
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: '12px 24px', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{ 
            color: '#4d4d4d', 
            border: '1px solid #E6E6E6', 
            textTransform: 'uppercase',
            '&:hover': {
              borderColor: theme.palette.primary.main
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleProceedToDownload}
          disabled={!canProceed || loading}
          sx={{
            backgroundColor: canProceed ? theme.palette.primary.main : '#cccccc',
            color: '#fff',
            textTransform: 'uppercase',
            '&:hover': {
              backgroundColor: canProceed ? theme.palette.primary.dark : '#cccccc'
            }
          }}
        >
          Download
        </Button>
      </DialogActions>
    </>
  );
  };

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
                  sx={{ '&.Mui-checked': { color: theme.palette.primary.main } }}
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
          sx={{ 
            color: '#4d4d4d', 
            border: '1px solid #E6E6E6', 
            textTransform: 'uppercase',
            '&:hover': {
              borderColor: theme.palette.primary.main
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleBackFromSubDialog}
          disabled={selectedChannels.length === 0}
          sx={{
            backgroundColor:
              selectedChannels.length === 0 ? '#cccccc' : theme.palette.primary.main,
            color: '#fff',
            textTransform: 'uppercase',
            '&:hover': {
              backgroundColor:
                selectedChannels.length === 0 ? '#cccccc' : theme.palette.primary.dark
            }
          }}
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
        <Typography
          sx={{
            fontSize: '21px',
            fontWeight: 500,
            mt: 2,
            mb: 2,
            fontFamily: '"Roboto-Medium", sans-serif'
          }}
        >
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
        {channelsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={32} sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : (
          <List sx={{ paddingTop: 0 }}>
            {availableChannels.map((channel) => {
              const checked = selectedChannels.includes(channel.id);
              return (
                <Box
              key={channel.id}
                  sx={{ display: 'flex', flexDirection: 'column', mb: 1.5 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  size="small"
                      checked={checked}
                  onChange={() => handleChannelToggle(channel.id)}
                  sx={{ '&.Mui-checked': { color: theme.palette.primary.main } }}
                />
                    <Typography
                      sx={{ fontSize: '14px', color: '#333', ml: 0.5, cursor: 'pointer' }}
                      onClick={() => handleChannelToggle(channel.id)}
                    >
                      {channel.name}
                    </Typography>
                  </Box>
                  {Array.isArray(channel.templates) && channel.templates.length > 0 && (
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#808080',
                        ml: 4.5,
                        mt: 0.1,
                        pointerEvents: 'none'
                      }}
                    >
                      {channel.templates.length} template(s):
                      {' '}
                      {channel.templates.map((tpl, idx) => (
                        <Box
                          // 每个 template 名称单独一个 span，使用 nowrap 保证名称不会被折断
                          key={tpl.id || tpl.name || idx}
                          component="span"
                          sx={{ whiteSpace: 'nowrap' }}
                        >
                          {typeof tpl === 'string' ? tpl : tpl.name}
                          {idx < channel.templates.length - 1 && ', '}
                        </Box>
                      ))}
                    </Typography>
                  )}
                </Box>
              );
            })}
        </List>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '12px 24px', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleBackFromSubDialog}
          sx={{ 
            color: '#4d4d4d', 
            border: '1px solid #E6E6E6', 
            textTransform: 'uppercase',
            '&:hover': {
              borderColor: theme.palette.primary.main
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleBackFromSubDialog}
          disabled={selectedChannels.length === 0}
          sx={{
            backgroundColor:
              selectedChannels.length === 0 ? '#cccccc' : theme.palette.primary.main,
            color: '#fff',
            textTransform: 'uppercase',
            '&:hover': {
              backgroundColor:
                selectedChannels.length === 0 ? '#cccccc' : theme.palette.primary.dark
            }
          }}
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
        <Typography
          sx={{
            fontSize: '21px',
            fontWeight: 500,
            mt: 2,
            mb: 2,
            fontFamily: '"Roboto-Medium", sans-serif'
          }}
        >
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
        {derivatesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={32} sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : (
          <List sx={{ paddingTop: 0 }}>
            {availableDerivates.map((derivate) => {
              const derivateId = derivate.id || derivate.identifier;
              const checked = selectedDerivates.includes(derivateId);
              return (
                <Box
                  key={derivateId}
                  sx={{ display: 'flex', flexDirection: 'column', mb: -0.5 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      size="small"
                      checked={checked}
                      onChange={() => handleDerivateToggle(derivateId)}
                      sx={{ '&.Mui-checked': { color: theme.palette.primary.main } }}
                    />
                    <Typography
                      sx={{ fontSize: '14px', color: '#333', ml: 0.5, cursor: 'pointer' }}
                      onClick={() => handleDerivateToggle(derivateId)}
                    >
                      {derivate.label || derivateId}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '12px 24px', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleBackFromSubDialog}
          sx={{ 
            color: '#4d4d4d', 
            border: '1px solid #E6E6E6', 
            textTransform: 'uppercase',
            '&:hover': {
              borderColor: theme.palette.primary.main
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleBackFromSubDialog}
          disabled={selectedDerivates.length === 0}
          sx={{
            backgroundColor:
              selectedDerivates.length === 0 ? '#cccccc' : theme.palette.primary.main,
            color: '#fff',
            textTransform: 'uppercase',
            '&:hover': {
              backgroundColor:
                selectedDerivates.length === 0 ? '#cccccc' : theme.palette.primary.dark
            }
          }}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#333' }}>
            download
          </span>
          <Typography
            sx={{
              fontSize: '21px',
              fontWeight: 500,
              fontFamily: '"Roboto-Medium", sans-serif'
            }}
          >
            Download
          </Typography>
        </Box>
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
            sx={{ color: '#cccccc', '&.Mui-checked': { color: theme.palette.primary.main } }}
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
            sx={{ color: '#cccccc', '&.Mui-checked': { color: theme.palette.primary.main } }}
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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Radio
              value="other"
              sx={{ color: '#cccccc', '&.Mui-checked': { color: theme.palette.primary.main } }}
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
            <Box sx={{ ml: 4, mt: 0.25 }}>
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
          sx={{ 
            color: '#4d4d4d', 
            border: '1px solid #E6E6E6', 
            textTransform: 'uppercase',
            '&:hover': {
              borderColor: theme.palette.primary.main
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleFinalDownload}
          disabled={!canFinalDownload || loading}
          sx={{
            backgroundColor: canFinalDownload ? theme.palette.primary.main : '#cccccc',
            color: '#fff',
            textTransform: 'uppercase',
            '&:hover': {
              backgroundColor: canFinalDownload ? theme.palette.primary.dark : '#cccccc'
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
      return '720px'; // Increased to accommodate Quantity section
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

