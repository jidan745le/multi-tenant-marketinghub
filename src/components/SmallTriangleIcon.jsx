import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

// 共享的三角形角标组件
const SmallTriangleIcon = React.memo(({ expanded, color = '#ffffff' }) => (
  <Box
    component="span"
    sx={{
      width: 0,
      height: 0,
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: expanded ? 'none' : `6px solid ${color}`,
      borderBottom: expanded ? `6px solid ${color}` : 'none',
      transition: 'all 0.15s ease-in-out',
      display: 'inline-block',
      ml: 0.5
    }}
  />
));

SmallTriangleIcon.displayName = 'SmallTriangleIcon';

SmallTriangleIcon.propTypes = {
  expanded: PropTypes.bool.isRequired,
  color: PropTypes.string
};

export default SmallTriangleIcon;
