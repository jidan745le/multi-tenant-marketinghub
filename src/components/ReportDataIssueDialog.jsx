import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useTranslationLoader } from '../hooks/useTranslationLoader';

const ReportDataIssueDialog = ({ open, onClose, onSubmit, initialComment = '', initialUser = '' }) => {
  const { t } = useTranslation();
  const { primaryColor } = useTheme();
  useTranslationLoader();
  const [comment, setComment] = React.useState(initialComment);
  const [reportedUser, setReportedUser] = React.useState(initialUser);

  React.useEffect(() => {
    if (open) {
      setComment(initialComment);
      setReportedUser(initialUser);
    }
  }, [open, initialComment, initialUser]);

  const handleSubmit = () => {
    if (onSubmit) onSubmit({ comment: comment?.trim(), reportedUser: reportedUser?.trim() });
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      disableBackdropClick
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '4px',
          boxShadow: '0px 10px 25px rgba(0,0,0,0.25)',
          width: '600px',
          maxWidth: '90vw'
        }
      }}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: '20px', fontWeight: 600, color: '#333333', fontFamily: '"Open Sans", sans-serif' }}>{t('pdp.reportDataIssue')}</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography sx={{ mt: 1.5, mb: 2, color: '#4d4d4d', fontSize: '16px', fontWeight: 500, fontFamily: '"Open Sans", sans-serif' }}>{t('common.comment')}</Typography>
            <TextField
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              placeholder=""
              InputProps={{ 
                sx: { 
                  backgroundColor: '#fff', 
                  fontFamily: '"Open Sans", sans-serif',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: primaryColor
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: primaryColor
                  }
                } 
              }}
            />
          </Box>
          <Box>
            <TextField
              value={reportedUser}
              onChange={(e) => setReportedUser(e.target.value)}
              fullWidth
              placeholder={t('pdp.reportedUser')}
              InputProps={{ 
                sx: { 
                  backgroundColor: '#fff', 
                  fontFamily: '"Open Sans", sans-serif',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: primaryColor
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: primaryColor
                  }
                } 
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            bgcolor: '#ffffff',
            borderColor: primaryColor,
            color: '#4d4d4d',
            textTransform: 'uppercase',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.25px',
            fontFamily: '"Open Sans", sans-serif',
            fontWeight: 600,
            height: '33px',
            px: 2.5,
            '&:hover': { bgcolor: '#fafafa', borderColor: primaryColor, color: '#4d4d4d' }
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: primaryColor,
            '&:hover': { bgcolor: primaryColor, opacity: 0.8 },
            color: '#ffffff',
            textTransform: 'uppercase',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.25px',
            fontFamily: '"Open Sans", sans-serif',
            fontWeight: 600,
            height: '33px',
            px: 2.5
          }}
        >
          {t('common.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReportDataIssueDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  initialComment: PropTypes.string,
  initialUser: PropTypes.string,
};

export default ReportDataIssueDialog;


