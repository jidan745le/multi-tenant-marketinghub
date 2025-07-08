# Marketing Hub

一个基于React和Material UI的现代产品目录展示平台。

## 🚀 技术栈

- **React 19** - 最新版本的React框架
- **Vite** - 快速的现代前端构建工具
- **Material UI (MUI)** - Google Material Design UI组件库
- **Emotion** - CSS-in-JS样式库

## 📁 项目结构

```
src/
├── components/
│   ├── TopBar.jsx           # 顶部导航栏
│   ├── ProductCatalogue.jsx # 产品目录主页面
│   ├── FilterSidebar.jsx    # 左侧筛选器
│   └── ProductGrid.jsx      # 产品网格展示
├── App.jsx                  # 主应用组件
└── main.jsx                 # 应用入口
```

## 🎨 设计布局

- **TopBar** - 包含品牌标识、导航菜单、搜索框和用户账户
- **主内容区域**:
  - **左侧 (25%)** - 筛选器侧边栏，包含价格、分类、品牌等筛选选项
  - **右侧 (75%)** - 产品展示网格，响应式布局

## 🛠️ 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

## ✨ 特性

- 📱 响应式设计，支持各种设备
- 🎯 现代化的Material Design界面
- 🔍 产品搜索功能
- 🏷️ 多维度筛选（价格、分类、品牌）
- ❤️ 收藏功能
- ⭐ 产品评分系统
- 🛒 购物车集成准备

## 📝 开发说明

项目使用最新的前端技术栈，所有组件都采用函数式组件和React Hooks。Material UI提供了完整的设计系统支持，确保界面的一致性和可访问性。

可以根据具体的Figma设计稿进一步定制样式和布局。
