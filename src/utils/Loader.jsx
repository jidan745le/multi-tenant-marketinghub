import { CircularProgress, Box } from '@mui/material';
import React, { Suspense } from 'react';

// 避免使用变量名Component，因为eslint认为这是未使用的定义
// 使用内联形式，直接引用参数
const Loader = (LazyComponent) => (props) => (
  <Suspense fallback={
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  }>
    <LazyComponent {...props} />
  </Suspense>
);

export default Loader; 