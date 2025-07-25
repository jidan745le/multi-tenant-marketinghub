// 路径解析调试工具
export const debugCurrentPath = () => {
    const path = window.location.pathname;
    const segments = path.split('/');
    const segmentsFiltered = path.split('/').filter(Boolean);

    console.group('🗺️ 路径解析调试');
    console.log('完整路径:', path);
    console.log('原始分割 (split("/")):', segments);
    console.log('过滤分割 (filter(Boolean)):', segmentsFiltered);
    console.log('');
    console.log('解析结果:');
    console.log('  segments[1] (语言):', segments[1]);
    console.log('  segments[2] (品牌):', segments[2]);
    console.log('  segments[3] (页面):', segments[3]);
    console.log('');
    console.log('  segmentsFiltered[0] (语言):', segmentsFiltered[0]);
    console.log('  segmentsFiltered[1] (品牌):', segmentsFiltered[1]);
    console.log('  segmentsFiltered[2] (页面):', segmentsFiltered[2]);
    console.groupEnd();

    return {
        path,
        segments,
        segmentsFiltered,
        language: segments[1],
        brand: segments[2],
        page: segments[3]
    };
};

// 注册到全局
if (typeof window !== 'undefined') {
    window.debugCurrentPath = debugCurrentPath;
    console.log('🔧 已注册全局调试函数: window.debugCurrentPath()');
} 