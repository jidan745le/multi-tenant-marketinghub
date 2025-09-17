import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../hooks/useTheme';

const PackagingTable = ({ 
  data = [],
  columns = ['ITEM', 'INNER BOX', 'MASTER CARTON']
}) => {
  const { primaryColor } = useTheme();
  const mixWithWhite = (hexColor, amount = 0.15) => {
    try {
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const mix = (c) => Math.round((1 - amount) * 255 + amount * c);
      const toHex = (n) => n.toString(16).padStart(2, '0');
      return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
    } catch {
      return hexColor;
    }
  };

  // 公共样式定义
  const commonStyles = {
    // 表格容器
    tableContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexShrink: 0,
      position: 'relative',
      width: '100%'
    },
    // 表格行
    tableRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      alignSelf: 'stretch',
      flexShrink: 0,
      height: 'auto',
      minHeight: '39px',
      position: 'relative',
      width: '100%'
    },
    // 单元格容器 - 第一列
    firstCellContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      alignItems: 'flex-start',
      justifyContent: 'center',
      alignSelf: 'stretch',
      flexShrink: 0,
      width: '23.5%',
      position: 'relative'
    },
    // 单元格容器 - 其他列
    cellContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      alignItems: 'flex-start',
      justifyContent: 'center',
      alignSelf: 'stretch',
      flexShrink: 1,
      width: 'calc(76.5% / 3)',
      position: 'relative'
    },
    // 文本容器
    textContainer: {
      padding: '12.67px',
      display: 'flex',
      flexDirection: 'row',
      gap: '6.34px',
      alignItems: 'center',
      justifyContent: 'flex-start',
      alignSelf: 'stretch',
      flexShrink: 0,
      position: 'relative'
    },
    // 数据文本容器
    dataTextContainer: {
      padding: '12.67px 6.34px',
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      alignItems: 'center',
      justifyContent: 'flex-start',
      alignSelf: 'stretch',
      flexShrink: 0,
      position: 'relative'
    },
    // 表头文本样式
    headerText: {
      color: primaryColor,
      textAlign: 'left',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '13px',
      lineHeight: '140%',
      letterSpacing: '0.4px',
      fontWeight: 600,
      position: 'relative',
      flex: 1,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'normal',
      wordBreak: 'break-word'
    },
    // 列标题文本样式
    columnHeaderText: {
      color: primaryColor,
      textAlign: 'left',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '13px',
      lineHeight: '140%',
      letterSpacing: '0.32px',
      fontWeight: 600,
      position: 'relative',
      flex: 1,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'normal',
      wordBreak: 'break-word'
    },
    // 数据文本样式
    dataText: {
      color: '#4d4d4d',
      textAlign: 'left',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '12.5px',
      lineHeight: '140%',
      letterSpacing: '0.32px',
      fontWeight: 400,
      position: 'relative',
      flex: 1,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'normal',
      wordBreak: 'break-word'
    },
    // 行标题文本样式
    rowHeaderText: {
      color: '#333333',
      textAlign: 'left',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '12.5px',
      lineHeight: '140%',
      letterSpacing: '0.4px',
      fontWeight: 400,
      position: 'relative',
      flex: 1,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'normal',
      wordBreak: 'break-word'
    }
  };

  return (
    <Box sx={commonStyles.tableContainer}>
      {/* 表头行 */}
      <Box sx={commonStyles.tableRow}>
        {/* 列标题单元格 */}
        {columns.map((column, index) => (
          <Box
            key={index}
            sx={{
              ...(index === 0 ? commonStyles.firstCellContainer : commonStyles.cellContainer),
              background: mixWithWhite(primaryColor, 0.15),
              borderStyle: 'solid',
              borderColor: mixWithWhite(primaryColor, 0.25),
              borderWidth: '0.79px 0px 0.79px 0px'
            }}
          >
            <Box sx={commonStyles.dataTextContainer}>
              <Typography sx={commonStyles.columnHeaderText}>
                {column}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* 数据行 */}
      {data.map((row, rowIndex) => (
        <Box key={rowIndex} sx={commonStyles.tableRow}>
          {/* 数据单元格 - 现在包含所有列，包括第一列 */}
          {row.values.map((value, cellIndex) => (
            <Box
              key={cellIndex}
              sx={{
                ...(cellIndex === 0 ? commonStyles.firstCellContainer : commonStyles.cellContainer),
                background: cellIndex === 0 ? '#fafafa' : '#ffffff', // 第一列作为行标题
                borderStyle: 'solid',
                borderColor: '#e6e6e6',
                borderWidth: '0.79px 0px 0.79px 0px'
              }}
            >
              <Box sx={cellIndex === 0 ? commonStyles.textContainer : commonStyles.dataTextContainer}>
                <Typography sx={cellIndex === 0 ? commonStyles.rowHeaderText : commonStyles.dataText}>
                  {value || ''}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

PackagingTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      values: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ),
  columns: PropTypes.arrayOf(PropTypes.string)
};

export default memo(PackagingTable);
