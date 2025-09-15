import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import ViewIcon from '../assets/icon/pdp_view.png';
import downloadIcon from '../assets/icon/download.png';
import { useTheme } from '../hooks/useTheme';

const MediaListTable = ({ 
  data = [],
  columns = ['Video Photo', 'Name', 'Language', 'Type', 'Format', 'Duration', 'Operation'],
  onViewClick,
  onDownloadClick
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
      alignSelf: 'stretch',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden'
    },
    // 表头行
    headerRow: {
      background: `${primaryColor}15`,
      borderStyle: 'solid',
      borderColor: 'rgba(0, 0, 0, 0.12)',
      borderWidth: '0px 0px 0.87px 0px',
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
      width: '100%',
      position: 'relative'
    },
    // 表头单元格
    headerCell: {
      padding: '13.87px',
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
      position: 'relative'
    },
    // 表头文本
    headerText: {
      color: primaryColor,
      textAlign: 'left',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '12.14px',
      lineHeight: '143%',
      letterSpacing: '0.15px',
      fontWeight: 600,
      position: 'relative'
    },
    // 数据行
    dataRow: {
      borderStyle: 'solid',
      borderColor: 'rgba(0, 0, 0, 0.12)',
      borderWidth: '0px 0px 0.87px 0px',
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      alignItems: 'center',
      justifyContent: 'flex-start',
      alignSelf: 'stretch',
      flexShrink: 0,
      position: 'relative'
    },
    // 图片单元格
    imageCell: {
      padding: '6.94px',
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
      width: '120.47px',
      height: '129.42px',
      position: 'relative'
    },
    // 图片容器
    imageContainer: {
      background: 'linear-gradient(to left, #000000, #000000)',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      flexShrink: 0,
      width: '107.08px',
      height: '115.04px',
      position: 'relative',
      overflow: 'hidden',
      objectFit: 'cover'
    },
    // 数据单元格
    dataCell: {
      background: 'rgba(255, 255, 255, 0)',
      padding: '13.87px',
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
      position: 'relative'
    },
    // 单元格容器
    cellBox: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexShrink: 0,
      position: 'relative'
    },
    // 名称单元格容器
    nameCellBox: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexShrink: 0,
      width: '167.32px',
      position: 'relative'
    },
    // 数据文本
    dataText: {
      color: '#4d4d4d',
      textAlign: 'left',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '10.41px',
      lineHeight: '13.87px',
      letterSpacing: '0.35px',
      fontWeight: 400,
      position: 'relative'
    },
    // 名称文本
    nameText: {
      color: '#4d4d4d',
      textAlign: 'left',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '10.41px',
      lineHeight: '13.87px',
      letterSpacing: '0.35px',
      fontWeight: 400,
      position: 'relative',
      width: '167.32px'
    },
    // 操作单元格
    operationCell: {
      padding: '8px 13.87px',
      display: 'flex',
      flexDirection: 'row',
      gap: '13.87px',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexShrink: 0,
      width: '112.1px',
      height: '43.14px',
      position: 'relative'
    },
    // 操作图标
    operationIcon: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: '26.72px',
      marginTop: '-4px',
      position: 'relative',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.7
      }
    },
    // 图标文本
    iconText: {
      color: primaryColor,
      textAlign: 'center',
      fontFamily: '"Material Icons", sans-serif',
      fontSize: '26.72px',
      fontWeight: 400,
      position: 'relative',
      alignSelf: 'stretch'
    }
  };

  // 列宽度配置 - 响应式
  const getColumnWidths = () => ({
    0: { xs: '100px', sm: '120.47px', md: '140px', lg: '160px' }, // Video Photo
    1: { xs: '150px', sm: '194.09px', md: '250px', lg: '300px' }, // Name
    2: { xs: '70px', sm: '83.66px', md: '100px', lg: '120px' },   // Language
    3: { xs: '80px', sm: '100.39px', md: '120px', lg: '140px' },  // Type
    4: { xs: '60px', sm: '75.29px', md: '90px', lg: '100px' },    // Format
    5: { xs: '60px', sm: '75.29px', md: '90px', lg: '100px' },    // Duration
    6: { xs: '80px', sm: '105.41px', md: '120px', lg: '140px' }   // Operation
  });

  const columnWidths = getColumnWidths();

  // 渲染操作图标
  const OperationIcon = ({ src, onClick }) => (
    <Box sx={commonStyles.operationIcon} onClick={onClick}>
      <Box
        sx={{
          width: '26.72px',
          height: '26.72px',
          backgroundColor: primaryColor,
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskSize: 'contain',
          WebkitMaskSize: 'contain'
        }}
      />
    </Box>
  );

  return (
    <Box sx={commonStyles.tableContainer}>
      {/* 表头行 */}
      <Box sx={commonStyles.headerRow}>
        {columns.map((column, index) => (
          <Box
            key={index}
            sx={{
              ...commonStyles.headerCell,
              width: columnWidths[index] || 'auto'
            }}
          >
            <Typography sx={commonStyles.headerText}>
              {column}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 数据行 */}
      {data.map((item, rowIndex) => (
        <Box key={rowIndex} sx={commonStyles.dataRow}>
          {/* 图片单元格 */}
          <Box sx={{ ...commonStyles.imageCell, width: columnWidths[0] }}>
            <Box
              component="img"
              src={item.image}
              alt={item.name}
              sx={commonStyles.imageContainer}
            />
          </Box>

          {/* 名称单元格 */}
          <Box sx={{ ...commonStyles.dataCell, width: columnWidths[1], height: '43.14px' }}>
            <Box sx={commonStyles.nameCellBox}>
              <Typography sx={commonStyles.nameText}>
                {item.name}
              </Typography>
            </Box>
          </Box>

          {/* 语言单元格 */}
          <Box sx={{ ...commonStyles.dataCell, width: columnWidths[2] }}>
            <Box sx={commonStyles.cellBox}>
              <Typography sx={commonStyles.dataText}>
                {item.language}
              </Typography>
            </Box>
          </Box>

          {/* 类型单元格 */}
          <Box sx={{ ...commonStyles.dataCell, width: columnWidths[3] }}>
            <Box sx={commonStyles.cellBox}>
              <Typography sx={commonStyles.dataText}>
                {item.type}
              </Typography>
            </Box>
          </Box>

          {/* 格式单元格 */}
          <Box sx={{ ...commonStyles.dataCell, width: columnWidths[4] }}>
            <Typography sx={commonStyles.dataText}>
              {item.format}
            </Typography>
          </Box>

          {/* 时长单元格 */}
          <Box sx={{ ...commonStyles.dataCell, width: columnWidths[5] }}>
            <Typography sx={commonStyles.dataText}>
              {item.duration}
            </Typography>
          </Box>

          {/* 操作单元格 */}
          <Box sx={{ ...commonStyles.operationCell, width: columnWidths[6] }}>
            <OperationIcon 
              src={ViewIcon}
              onClick={() => onViewClick && onViewClick(item, rowIndex)} 
            />
            <OperationIcon 
              src={downloadIcon}
              onClick={() => onDownloadClick && onDownloadClick(item, rowIndex)} 
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

MediaListTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      format: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      downloadUrl: PropTypes.string,
      videoUrl: PropTypes.string
    })
  ),
  columns: PropTypes.arrayOf(PropTypes.string),
  onViewClick: PropTypes.func,
  onDownloadClick: PropTypes.func
};

export default memo(MediaListTable);
