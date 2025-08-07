import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// 通用设置页面的样式化组件

// 大标题组件
export const SectionTitle = styled(Typography)(() => ({
  fontSize: '1.2rem',
  fontWeight: 500,
  marginBottom: 16,
}));

// 小标题组件
export const SubTitle = styled(Typography)(() => ({
  overflow: 'hidden',
  color: '#4D4D4D',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontFamily: 'Roboto',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '20px',
  fontVariant: 'all-small-caps',
  letterSpacing: '0.1px',
  marginBottom: '8px',
}));

// 卡片容器组件
export const SectionCard = styled(Paper)(() => ({
  padding: 24,
  marginBottom: 24,
  borderRadius: 0,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
}));
