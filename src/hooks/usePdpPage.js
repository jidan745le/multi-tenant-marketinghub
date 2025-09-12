import { useSelector } from 'react-redux';
import { useMemo } from 'react';

/**
 * 从 Redux store 中获取 page_template === 'pdp_page' 的页面数据
 * 
 * @param {string} brandCode - 品牌代码，用于过滤特定品牌的页面
 * @returns {Object} PDP 页面数据
 */
export const usePdpPage = (brandCode = null) => {
  // 从 Redux 获取 PDP 页面数据
  const pdpPages = useSelector(state => {
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    const pages = currentLangData?.pages || [];
    return pages.filter(page => 
      page.page_template === 'pdp_page' && 
      (!brandCode || page.brandCode === brandCode)
    );
  });

  // 获取当前语言和品牌信息
  const currentLanguage = useSelector(state => state.themes.currentLanguage);
  const currentBrand = useSelector(state => state.themes.currentBrand);

  // 处理 PDP 页面数据
  const pdpPageData = useMemo(() => {
    if (!pdpPages || pdpPages.length === 0) {
      return {
        pages: [],
        hasData: false,
        count: 0
      };
    }

    // 提取页面内容区域数据
    const processedPages = pdpPages.map(page => ({
      id: page.id,
      name: page.name || '',
      locale: page.locale || 'en',
      publishedAt: page.publishedAt || null,
      createdAt: page.createdAt || null,
      updatedAt: page.updatedAt || null,
      brandCode: page.brandCode || '',
      contentArea: page.content_area || null,
      pageTemplate: page.page_template || 'pdp_page'
    }));

    return {
      pages: processedPages,
      hasData: true,
      count: processedPages.length,
      currentLanguage,
    };
  }, [pdpPages, currentLanguage]);

  // 调试信息
  console.log('🔍 usePdpPage Hook 数据:', {
    brandCode,
    currentLanguage,
    currentBrand,
    pdpPagesCount: pdpPages.length,
    pdpPageData: pdpPageData
  });

  return pdpPageData;
};

export default usePdpPage;
