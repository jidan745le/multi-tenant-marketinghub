import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, CircularProgress, Snackbar, Alert, Portal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useTranslationLoader } from '../hooks/useTranslationLoader';
import { useBrand } from '../hooks/useBrand';
import EmailApiService from '../services/emailApi';
import CookieService from '../utils/cookieService';

const ReportDataIssueDialog = ({ 
  open, 
  onClose, 
  // onSubmit,//暂时不用这个参数
  initialComment = '', 
  initialUser = '',
  mailTo = 'sophia.huang@rg-experience.com',
  mailCc = '', 
  onSuccess, // 成功
  onError // 错误
}) => {
  const { t } = useTranslation();
  const { primaryColor } = useTheme();
  useTranslationLoader();
  const { currentBrand } = useBrand();
  const [comment, setComment] = React.useState(initialComment);
  const [reportedUser, setReportedUser] = React.useState(initialUser);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState({ open: false, message: '', severity: 'success' });

  const [effectiveMailTo, setEffectiveMailTo] = React.useState(mailTo);
  
  React.useEffect(() => {
    if (currentBrand?.strapiData?.feedback_address) {
      const feedbackAddress = currentBrand.strapiData.feedback_address;
      setEffectiveMailTo(feedbackAddress);
      console.log('Feedback Address:', feedbackAddress);
    } else if (mailTo) {
      setEffectiveMailTo('notification@rg-experience.com');
    }
  }, [currentBrand, mailTo]);

  React.useEffect(() => {
    if (open) {
      setComment(initialComment);
      if (initialUser) {
        setReportedUser(initialUser);
      } else {
        const userInfo = CookieService.getUserInfo();
        const userName = userInfo?.name;
        setReportedUser(userName);
      }
    }
  }, [open, initialComment, initialUser]);

  const handleSubmit = async () => {
    const trimmedComment = comment?.trim();
    const trimmedUser = reportedUser?.trim();

    // 基本验证
    if (!trimmedComment) {
      setNotification({
        open: true,
        message: t('pdp.commentRequired') || 'Comment is required',
        severity: 'warning'
      });
      return;
    }
    
    if (!trimmedUser) {
      setNotification({
        open: true,
        message: t('pdp.reporterRequired') || 'Reporter is required',
        severity: 'warning'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await EmailApiService.sendFeedback({
        comment: trimmedComment,
        reporter: trimmedUser,
        mailTo: effectiveMailTo,
        mailCc: mailCc,
        attachments: [] 
      });
      
      if (onSuccess) {
        onSuccess({ comment: trimmedComment, reportedUser: trimmedUser });
      } else {
        setNotification({
          open: true,
          message: t('pdp.feedbackSubmitted') || 'Feedback submitted successfully',
          severity: 'success'
        });
      }
      
      // 延迟关闭 Dialog，让通知先显示
      setTimeout(() => {
        onClose();
      }, 100);
      
    } catch (error) {
      console.error('Failed to send feedback:', error);
      
      // 错误处理
      if (onError) {
        onError(error);
      } else {
        setNotification({
          open: true,
          message: t('pdp.feedbackError') || 'Failed to submit feedback!',
          severity: 'error'
        });
        // 错误时不关闭 Dialog，让用户看到错误信息
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src="/assets/report_24px.svg"
            alt="report"
            sx={{
              width: '22px',
              height: '22px',
              display: 'block',
              // color: '#333333'
            }}
          />
          <Typography sx={{ fontSize: '20px', fontWeight: 600, color: '#333333', fontFamily: '"Open Sans", sans-serif' }}>{t('pdp.reportDataIssue')}</Typography>
        </Box>
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
      <DialogActions sx={{ padding: '12px 24px', display: 'flex', gap: '8px' }}>
        <Button
          variant="outlined"
          onClick={onClose}
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
          disabled={isSubmitting}
        >
          CANCEL
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            backgroundColor: !isSubmitting ? primaryColor : '#cccccc',
            color: '#fff',
            textTransform: 'uppercase',
            '&:hover': {
              backgroundColor: !isSubmitting ? primaryColor : '#cccccc',
              opacity: !isSubmitting ? 0.9 : 1
            },
            '&:disabled': {
              backgroundColor: '#cccccc',
              color: '#666666'
            },
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {isSubmitting && <CircularProgress size={16} color="inherit" />}
          {isSubmitting ? (t('common.submitting') || 'Submitting...') : t('common.submit')}
        </Button>
      </DialogActions>
      </Dialog>
      
      {/* 通知消息 */}
      <Portal>
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            variant="filled"
            sx={(theme) => ({
              backgroundColor: notification.severity === 'success'
                ? theme.palette.primary.main
                : undefined,
              '&.MuiAlert-filledSuccess': {
                backgroundColor: theme.palette.primary.main,
              },
              '&.MuiAlert-filledError': {
                backgroundColor: theme.palette.error.main,
              },
              '&.MuiAlert-filledWarning': {
                backgroundColor: theme.palette.warning.main,
              }
            })}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
};

ReportDataIssueDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func, 
  initialComment: PropTypes.string,
  initialUser: PropTypes.string,
  mailTo: PropTypes.string,
  mailCc: PropTypes.string, 
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default ReportDataIssueDialog;


