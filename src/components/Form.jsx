import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const commonStyles = {
  // Typography样式
  headerText: {
    color: '#4d4d4d',
    fontFamily: 'Roboto, sans-serif',
    fontSize: 13,
    lineHeight: '18px',
    letterSpacing: '0.5px',
    fontWeight: 600,
    flex: 1,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  valueText: {
    color: '#4d4d4d',
    fontFamily: 'Roboto, sans-serif',
    fontSize: 12.5,
    lineHeight: '18px',
    letterSpacing: '0.4px',
    fontWeight: 400,
    flex: 1,
    whiteSpace: 'normal',
    wordBreak: 'break-word'
  },
  statusText: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 12.5,
    lineHeight: '18px',
    letterSpacing: '0.4px',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 0.5
  },
  // Box容器样式
  cellContainer: {
    p: '7.73px',
    display: 'flex',
    alignItems: 'flex-start',
    minHeight: 30.93,
  },
  statusContainer: {
    p: '5.8px 7.73px',
    display: 'flex',
    alignItems: 'center',
    width: 189.42,
    height: 15.46
  },
  // 布局样式
  formContainer: {
    borderStyle: 'solid',
    borderColor: '#e6e6e6',
    borderWidth: '0.97px 0 0.97px 0',
    display: 'flex',
    flexDirection: 'column',
  },
  formRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  formPair: {
    display: 'flex',
    flexDirection: 'row',
  }
};

const HeaderCell = ({ text }) => (
  <Box sx={{ ...commonStyles.cellContainer, background: '#fafafa', width: 220 }}>
    <Typography sx={commonStyles.headerText}>
      {text}
    </Typography>
  </Box>
);

const ValueCell = ({ children, flexible = false }) => (
  <Box sx={{ 
    ...commonStyles.cellContainer,
    ...(flexible ? { flex: 1, minWidth: 0 } : { width: 260 })
  }}>
    <Typography sx={commonStyles.valueText}>
      {children}
    </Typography>
  </Box>
);

/** 富文本单元格 */
const RichTextCell = ({ html, flexible = false }) => (
  <Box
    sx={{
      ...commonStyles.cellContainer,
      ...(flexible ? { flex: 1, minWidth: 0 } : { width: 260 })
    }}
  >
    <Box
      component="div"
      sx={{
        ...commonStyles.valueText,
        '& p': { margin: '0.25em 0', '&:first-of-type': { marginTop: 0 }, '&:last-of-type': { marginBottom: 0 } },
        '& ul, & ol': { paddingLeft: 20, margin: '0.25em 0' }
      }}
      dangerouslySetInnerHTML={{ __html: html || '' }}
    />
  </Box>
);

const StatusValue = ({ statusText }) => (
  <Box sx={commonStyles.statusContainer}>
    <Typography sx={commonStyles.statusText}>
      <Box component="span" sx={{ color: '#6eb82a' }}>●</Box>
      <Box component="span" sx={{ color: '#4d4d4d' }}>{statusText}</Box>
    </Typography>
  </Box>
);

const Form = ({ items, columns = 'double' }) => {
  const pairsPerRow = columns === 'single' ? 1 : 2;
  const rows = [];
  for (let i = 0; i < items.length; i += pairsPerRow) {
    rows.push(items.slice(i, i + pairsPerRow));
  }

  const isSinglePairPerRow = columns === 'single'; // 单列则不分配固定宽度

  return (
    <Box sx={commonStyles.formContainer}>
      {rows.map((row, rowIdx) => (
        <Box key={rowIdx} sx={commonStyles.formRow}>
          {row.map(({ label, value, type }, idx) => (
            <Box key={idx} sx={commonStyles.formPair}>
              <HeaderCell text={label} />
              {type === 'status' ? (
                <Box sx={commonStyles.formPair}>
                  <StatusValue statusText={value} />
                </Box>
              ) : type === 'html' ? (
                <RichTextCell flexible={isSinglePairPerRow} html={typeof value === 'string' ? value : (value ?? '-')} />
              ) : (
                <ValueCell flexible={isSinglePairPerRow}>{value ?? '-'}</ValueCell>
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

Form.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.oneOf(['text', 'status', 'html'])
    })
  ).isRequired,
  columns: PropTypes.oneOf(['single', 'double'])
};

export default memo(Form);


