import { useMemo } from 'react';
import { usePdpPage } from './usePdpPage';

/**
 * 根据 Strapi 返回的 pages 数据判断应该使用哪个 layout
 * 
 * 规则：
 * - 如果只有 "Marketing (Partner)"，返回 'externalPDPBasic'
 * - 如果有 "Marketing" 和 "Marketing (Partner)"，返回 'internalPDPBasic'
 * - 默认返回 'internalPDPBasic'（向后兼容）
 * 
 * @param {string} brandCode - 品牌代码，用于过滤特定品牌的页面
 * @returns {string} layout 类型：'internalPDPBasic' 或 'externalPDPBasic'
 */
export const useLayoutType = (brandCode = null) => {
  // 获取 PDP 页面数据
  const pdpPageData = usePdpPage(brandCode);
  
  // 根据 pages 的 name 判断应该使用哪个 layout
  const layoutType = useMemo(() => {
    const pages = pdpPageData?.pages || [];
    const hasMarketing = pages.some(page => page.name === 'Marketing');
    const hasMarketingPartner = pages.some(page => page.name === 'Marketing (Partner)');
    
    // 如果只有 "Marketing (Partner)"，则使用 externalPDPBasic
    if (hasMarketingPartner && !hasMarketing) {
      return 'externalPDPBasic';
    }
    
    // 如果有 "Marketing" 和 "Marketing (Partner)"，则使用 internalPDPBasic
    if (hasMarketing && hasMarketingPartner) {
      return 'internalPDPBasic';
    }
    
    // 默认返回 internalPDPBasic（向后兼容）
    return 'internalPDPBasic';
  }, [pdpPageData]);
  
  return layoutType;
};

export default useLayoutType;

