import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../hooks/useTheme';

const PackagingTable = ({ 
  data = [],
  columns = ['ITEM', 'INNER BOX', 'MASTER CARTON']
}) => {
  const { primaryColor } = useTheme();

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
      position: 'relative'
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
    // 单元格容器
    cellContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      alignItems: 'flex-start',
      justifyContent: 'center',
      alignSelf: 'stretch',
      flexShrink: 0,
      width: { xs: '20%', sm: '20%', md: '20%', lg: '20%' },
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
      textAlign: 'center',
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
      textAlign: 'center',
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
        {/* 主标题单元格 */}
        <Box sx={{
          ...commonStyles.cellContainer,
          background: `${primaryColor}15`,
          borderStyle: 'solid',
          borderColor: `${primaryColor}15`,
          borderWidth: '0.79px 0px 0.79px 0px'
        }}>
          <Box sx={commonStyles.textContainer}>
            <Typography sx={commonStyles.headerText}>
              DIMENSIONS
            </Typography>
          </Box>
        </Box>

        {/* 列标题单元格 */}
        {columns.map((column, index) => (
          <Box
            key={index}
            sx={{
              ...commonStyles.cellContainer,
              background: `${primaryColor}15`,
              borderStyle: 'solid',
              borderColor: `${primaryColor}15`,
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
          {/* 行标题单元格 */}
          <Box sx={{
            ...commonStyles.cellContainer,
            background: '#fafafa',
            borderStyle: 'solid',
            borderColor: '#e6e6e6',
            borderWidth: '0.79px 0px 0.79px 0px'
          }}>
            <Box sx={commonStyles.textContainer}>
              <Typography sx={commonStyles.rowHeaderText}>
                {row.label}
              </Typography>
            </Box>
          </Box>

          {/* 数据单元格 */}
          {columns.map((column, cellIndex) => {
            const value = row.values[cellIndex] || ''; // 如果数据不存在，使用空字符串
            return (
              <Box
                key={cellIndex}
                sx={{
                  ...commonStyles.cellContainer,
                  background: '#ffffff',
                  borderStyle: 'solid',
                  borderColor: '#e6e6e6',
                  borderWidth: '0.79px 0px 0.79px 0px'
                }}
              >
                <Box sx={commonStyles.dataTextContainer}>
                  <Typography sx={commonStyles.dataText}>
                    {value}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

PackagingTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ),
  columns: PropTypes.arrayOf(PropTypes.string)
};

export default memo(PackagingTable);
