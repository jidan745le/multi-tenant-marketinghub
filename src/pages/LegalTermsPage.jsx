import React from 'react';
import { Box, Paper, Typography, Grid, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useBrand } from '../hooks/useBrand';
import legalTermsIllustration from '../assets/icon/legalTerms.png';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0),
  height: '100%',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1200px',
  margin: '0 auto',
}));

const Hero = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Illustration = styled(Box)( ({
  width: '100%',
  maxWidth: 420,
  height: 'auto',
  background: 'transparent',
  borderRadius: 0,
  border: 'none',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  overflow: 'visible',
}));



const LegalTermsPage = () => {
  const { t } = useTranslation();
  const { currentBrand } = useBrand();

  const legal = currentBrand?.legal || {};
  const termsOfUseHtml = legal.termsCondition;


  console.log('legal', legal);
  console.log('termsCondition', legal.termsCondition);
  console.log('terms', legal.terms);
  console.log('termsOfUseHtml', termsOfUseHtml);

  return (
    <PageContainer>
      <Hero>
        <ContentContainer sx={{ height: '560px'}}>
          <Grid container spacing={4} alignItems="stretch" mt={27}>
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                sx={{ 
                  color: 'primary.main', 
                  mb: 4, 
                  fontSize: { xs: '4rem', md: '4.5rem' },
                  width: { xs: '100%', md: '660px' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {t('legal.terms.title', 'Terms & Conditions')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680, mb: 1, fontSize: { xs: '0.7rem', md: '1rem' } }}>
              {t('legal.terms.intro1', `Welcome to [Your Company Name]. Please read these Terms and Conditions carefully before using our website, products, or services.By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access our services.`)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-end', md: 'flex-end' }, alignItems: 'flex-end' }}>
              <Illustration>
                {/* 插图 */}
                <Box
                  component="img"
                  src={legalTermsIllustration}
                  alt="Terms Illustration"
                  sx={{ width: 620, height: 'auto', objectFit: 'contain', mt: -16, transform: { xs: 'translateX(100px)', md: 'translateX(160px)' } }}
                />
              </Illustration>
            </Grid>
          </Grid>
        </ContentContainer>
      </Hero>

      {/* 正文内容 */}
      <Box sx={{ backgroundColor: '#fff', minHeight: '100vh', marginTop: 0, width: '100%' }}>
        <ContentContainer>
          {termsOfUseHtml && (
            <Box sx={{ mt: 13 }}>
              <Box
                sx={{
                  '& h2': {
                    fontSize: { xs: '2rem', md: '2.2rem' },
                    fontWeight: 700,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontSynthesis: 'weight',
                    marginBottom: 1.5,
                  },
                  '& li': {
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    lineHeight: 1.8,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontSynthesis: 'weight',
                  },
                  '& p': { color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.8 },
                  '& ul': { paddingLeft: 3 },
                }}
                dangerouslySetInnerHTML={{ __html: termsOfUseHtml }}
              />
            </Box>
          )}


          <Box sx={{ mt: 30 }}>
              <Typography variant="h6" color='text.secondary' sx={{ mb: 8, fontSize: '0.875rem', textAlign: 'center' }}>
              {t('legal.privacyPolicy.copyright', '© [Year] [Your Company Name]. All rights reserved.')}
              </Typography>
          </Box>
        </ContentContainer>
      </Box>
    </PageContainer>
  );
};

export default LegalTermsPage;


