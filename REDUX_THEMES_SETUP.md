# Redux Themes 动态品牌系统

## 🎯 系统概述

这个系统将原本硬编码的品牌配置替换为从Strapi API动态获取的数据，并通过Redux进行状态管理。

## 🏗️ 系统架构

### 核心文件
- `src/store/index.js` - Redux store配置
- `src/store/slices/themesSlice.js` - 主题数据的Redux slice
- `src/hooks/useBrand.js` - 品牌数据hook (已更新为使用Redux)
- `src/App.jsx` - 应用入口，配置Redux Provider和API请求
- `src/components/TopBar.jsx` - 顶部导航栏 (已更新API接口)

### 环境变量
```bash
# Strapi CMS Configuration
VITE_STRAPI_BASE_URL=https://strapi-test.rg-experience.com
VITE_STRAPI_TOKEN=6670d224d250b1aef6826753cf4dec1085dceedabc1a45896d12a25b1
```

## 🔄 数据流程

1. **应用启动** → App.jsx 自动请求 `/api/themes`
2. **API响应** → 数据转换并存储到Redux
3. **组件使用** → useBrand hook 从Redux获取品牌数据
4. **UI更新** → TopBar等组件自动更新显示

## 📊 API数据格式

### Strapi返回格式
```json
{
  "data": [
    {
      "id": 9,
      "theme_key": "bosch",
      "theme_name": "BOSCH"
    },
    {
      "id": 11,
      "theme_key": "kendo", 
      "theme_name": "KENDO"
    }
  ]
}
```

### Redux中的格式
```javascript
[
  {
    code: "bosch",
    name: "BOSCH",
    displayName: "BOSCH", 
    description: "BOSCH Portal",
    strapiData: { /* 原始API数据 */ }
  }
]
```

## 🎛️ useBrand Hook API

### 返回值
```javascript
const {
  brands,           // 品牌数组
  currentBrand,     // 当前品牌对象
  currentBrandCode, // 当前品牌代码
  switchBrand,      // 切换品牌函数
  isValidBrand,     // 验证品牌函数
  themesLoading,    // 加载状态
  isFromAPI,        // 数据来源标识
  debug            // 调试信息
} = useBrand();
```

### 主要变更
- ✅ `supportedBrands` → `brands`
- ✅ `changeBrand()` → `switchBrand()`
- ✅ `getCurrentBrandInfo()` → `currentBrand` (直接对象)
- ✅ 新增 `debug` 信息和加载状态

## 🧪 测试和调试

### 浏览器控制台
```javascript
// 测试Redux状态
window.testReduxThemes()

// 手动查看store状态
console.log(window.__REDUX_STORE__.getState())
```

### 日志输出
- ✅ Strapi API 请求状态
- ✅ Redux数据存储确认
- ✅ 品牌切换调试信息
- ✅ 数据来源标识（静态 vs API）

## 🔧 故障排除

### 常见问题
1. **品牌显示为"Loading..."** → 检查环境变量和网络连接
2. **切换品牌无效** → 检查控制台错误和路由配置
3. **显示默认品牌** → API失败，使用回退配置

### 调试步骤
1. 打开浏览器开发者工具
2. 查看Network标签，确认 `/api/themes` 请求
3. 运行 `window.testReduxThemes()` 检查状态
4. 检查TopBar组件的debug输出

## ✨ 特性

- 🔄 **动态加载**: 从Strapi API获取品牌数据
- 💾 **状态管理**: Redux统一管理品牌状态  
- 🎯 **智能回退**: API失败时使用默认配置
- 📱 **实时更新**: 品牌切换即时生效
- 🐛 **调试友好**: 丰富的日志和测试工具
- 📡 **API标识**: UI中显示数据来源标识

## 🚀 部署要求

1. 确保生产环境配置正确的Strapi API地址和Token
2. Strapi `/api/themes` 端点返回正确格式的数据
3. 网络连接稳定，支持跨域请求 