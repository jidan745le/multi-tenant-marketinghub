import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, Grid, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useBrand } from '../hooks/useBrand';
import legalPrivacyIllustration from '../assets/icon/legalPrivacy.png';
import LegalToc from '../components/LegalToc';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0),
  height: '100%',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1400px',
  margin: '0 auto',
}));

const Hero = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Illustration = styled(Box)(({
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


const LegalPrivacyPage = () => {
  const { t } = useTranslation();
  const { currentBrand } = useBrand();

  const legal = currentBrand?.legal || {};

  console.log('legal', legal);
  console.log('legal.privacyPolicy', legal.privayPolicy);
  const privacyPolicyHtml = legal.privayPolicy || '';

  const [activeSection, setActiveSection] = useState('information-collect');

  // 从HTML中提取所有 h2
  const { processedHtml, tocItems } = useMemo(() => {
    if (!privacyPolicyHtml || typeof privacyPolicyHtml !== 'string') {
      return { processedHtml: privacyPolicyHtml || '', tocItems: [] };
    }

    const items = [];
    let index = 0;

    const slugify = (str) => {
      return String(str)
        .replace(/<[^>]*>/g, '')
        .trim()
        .toLowerCase()
        .replace(/&[^;]+;/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    const replaced = privacyPolicyHtml.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, text) => {
      const baseId = slugify(text) || 'section';
      const id = `${baseId}-${index++}`;
      items.push({ id, title: text.replace(/<[^>]*>/g, '') });
      const attrStr = attrs && String(attrs).trim() ? ` ${String(attrs).trim()}` : '';
      return `<h2 id="${id}"${attrStr}>${text}</h2>`;
    });

    return { processedHtml: replaced, tocItems: items };
  }, [privacyPolicyHtml]);
  

  return (
    <PageContainer>
      <Hero>
        <ContentContainer sx={{ height: '560px'}}>
          <Grid container spacing={4} wrap="nowrap" alignItems="stretch" mt={26}>
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                sx={{ 
                  color: 'primary.main', 
                  mb: 4, 
                  fontSize: { xs: '4rem', md: '4.5rem' },
                  width: { xs: '100%', md: '750px' },
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {t('legal.privacyPolicy.title', 'Privacy Policy')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760, mb: 1, fontSize: { xs: '0.7rem', md: '1rem' } }}>
                {t('legal.privacyPolicy.intro1', 'Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website, products, or services.')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760, fontSize: { xs: '0.7rem', md: '1rem' } }}>
                {t('legal.privacyPolicy.intro2', 'By using our services, you agree to the collection and use of information in accordance with this policy.')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-end', md: 'flex-end' }, alignItems: 'flex-end' }}>
              <Illustration>
                {/* 插图 */}
                <Box
                  component="img"
                  src={legalPrivacyIllustration}
                  alt="Privacy Illustration"
                  sx={{ width: { xs: '100%', md: 880 }, height: 'auto', objectFit: 'contain', mt: 0, transform: { xs: 'none', md: 'translateX(280px) translateY(-155px)' } }}
                />
              </Illustration>
            </Grid>
          </Grid>
        </ContentContainer>
      </Hero>

      {/* 正文内容 */}
      <Box sx={{ backgroundColor: '#fff', minHeight: '100vh', marginTop: 0, width: '100%' }}>
        <ContentContainer>
          {processedHtml && (
            <Box sx={{ mt: 10 }}>
              <Grid container spacing={4} wrap="nowrap" alignItems="flex-start">
                {/* 左侧目录导航 */}
                <Grid item xs={4} md={3}>
                  <Box sx={{ position: 'sticky', top: 24 }}>
                    <LegalToc 
                      activeSection={activeSection}
                      onSectionClick={setActiveSection}
                      tocItems={tocItems}
                    />
                  </Box>
                </Grid>

                {/* 右侧内容区域 */}
                <Grid item xs={8} md={9} sx={{ pl: { xs: 2, md: 9 } }}>
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
                    dangerouslySetInnerHTML={{ __html: processedHtml }}
                  />
                </Grid>
              </Grid>
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

export default LegalPrivacyPage;


