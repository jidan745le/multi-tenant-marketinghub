import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { useTheme } from '../hooks/useTheme';
// import questionMark from '../assets/icon/question-mark.png';
import addIcon from '/assets/add.png';
import disturbIcon from '/assets/disturb.png';

const SpecificationTable = ({ 
  data = [],
  columns = ['Feature Name', 'Value', 'Unit']
}) => {
  const { primaryColor } = useTheme();
  
  // 控制每个分组的展开/折叠
  const [expandedGroups, setExpandedGroups] = useState(
    data.reduce((acc, _, index) => {
      acc[index] = true; // 默认展开所有分组
      return acc;
    }, {})
  );

  // 切换分组展开/折叠状态
  const toggleGroup = (groupIndex) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupIndex]: !prev[groupIndex]
    }));
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
      overflow: 'hidden'
    },
    // 表头行
    headerRow: {
      background: `${primaryColor}05`,
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
      padding: '13.26px',
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
      color: '#212121',
      textAlign: 'left',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '13px',
      lineHeight: '143%',
      letterSpacing: '0.14px',
      fontWeight: 600,
      position: 'relative'
    },
    // 分组标题行
    groupHeaderRow: {
      background: `${primaryColor}15`,
      borderStyle: 'solid',
      borderColor: `${primaryColor}20`,
      borderWidth: '0.83px 0px 0.83px 0px',
      display: 'flex',
      flexDirection: 'row',
      // gap: { xs: '200px', sm: '455.73px', md: '500px', lg: '600px' },
      gap: 0,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
      width: '100%',
      position: 'relative'
    },
    // 分组标题单元格
    groupHeaderCell: {
      padding: '13.26px',
      display: 'flex',
      flexDirection: 'row',
      gap: '7.73px',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
      // width: '265.15px',
      width: 1200,
      position: 'relative'
    },
    // 分组图标按钮
    groupIconButton: {
      width: '20px',
      height: '20px',
      minWidth: '20px',
      padding: 0,
      borderRadius: '50%',
      // backgroundColor: primaryColor,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      // '&:hover': {
      //   // backgroundColor: `${primaryColor}dd`,
      //   transform: 'scale(0.5)'
      // }
    },
    // 分组图标
    groupIcon: {
      fontSize: '13px',
      fontWeight: 'bold',
      lineHeight: 1
    },
    // 分组标题文本
    groupHeaderText: {
      color: primaryColor,
      textAlign: 'left',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '14px',
      lineHeight: '143%',
      letterSpacing: '0.14px',
      fontWeight: 600,
      textTransform: 'uppercase',
      position: 'relative'
    },
    // 数据行
    dataRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      flexShrink: 0,
      width: '100%',
      position: 'relative'
    },
    // 带边框的数据行
    borderedDataRow: {
      borderStyle: 'solid',
      borderColor: 'rgba(0, 0, 0, 0.12)',
      borderWidth: '0px 0px 0.83px 0px',
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      flexShrink: 0,
      width: '100%',
      position: 'relative'
    },
    // 特征名称单元格
    featureCell: {
      background: '#fafafa',
      padding: '13.26px',
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
      width: { xs: 'calc(100% / 3)', sm: '265.15px', md: '250px', lg: '250px' },
      minHeight: '100%',
      position: 'relative'
    },
    // 值单元格
    valueCell: {
      background: 'rgba(255, 255, 255, 0)',
      padding: '13.26px',
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
      flex: 1,
      position: 'relative'
    },
    // 特征名称容器
    featureContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '3.31px',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
      position: 'relative'
    },
    // 特征名称文本
    featureText: {
      color: 'rgba(0, 0, 0, 0.87)',
      textAlign: 'left',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '13px',
      lineHeight: '143%',
      letterSpacing: '0.14px',
      fontWeight: 400,
      position: 'relative'
    },
    // 值文本
    valueText: {
      color: 'rgba(0, 0, 0, 0.87)',
      textAlign: 'left',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '13px',
      lineHeight: '143%',
      letterSpacing: '0.14px',
      fontWeight: 400,
      position: 'relative'
    },
    // 问号图标
    questionIcon: {
      flexShrink: 0,
      width: '11.6px',
      height: '11.6px',
      position: 'relative',
      overflow: 'visible'
    },
    // 状态指示器
    statusIndicator: {
      display: 'flex',
      flexDirection: 'row',
      gap: '6.63px',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
      height: '16.57px',
      position: 'relative'
    }
  };

  // 渲染问号图标
  const QuestionIcon = () => (
    <Box
      component="img"
      src="/assets/questionmark.png"
      alt="?"
      sx={{
        ...commonStyles.questionIcon,
        width: '11.6px',
        height: '11.6px'
      }}
    />
  );

  // 渲染状态指示器
  const StatusIndicator = ({ status }) => (
    <Box sx={commonStyles.statusIndicator}>
      {status === 'yes' && (
        <Box
          sx={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4caf50'
          }}
        />
      )}
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
              width: index === 0
                ? { xs: 'calc(100% / 3)', sm: '265.15px', md: '250px', lg: '250px' }
                : index === 1
                ? { xs: 'calc(100% / 3)', sm: '168.16px', md: '200px', lg: '250px' }
                : { xs: 'calc(100% / 3)', sm: '165.72px', md: '200px', lg: '250px' }
            }}
          >
            <Typography sx={commonStyles.headerText}>
              {column}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 数据分组 */}
      {data.map((group, groupIndex) => (
        <Box key={groupIndex}>
          {/* 分组标题 */}
          <Box sx={commonStyles.groupHeaderRow}>
            <Box sx={commonStyles.groupHeaderCell}>
              <IconButton
                sx={commonStyles.groupIconButton}
                onClick={() => toggleGroup(groupIndex)}
                aria-label={expandedGroups[groupIndex] ? 'collapse' : 'expand'}
              >
                <Box
                  component="img"
                  src={expandedGroups[groupIndex] ? disturbIcon : addIcon}
                  alt={expandedGroups[groupIndex] ? 'collapse' : 'expand'}
                  sx={{
                    width: '16px',
                    height: '16px',
                    objectFit: 'contain'
                  }}
                />
              </IconButton>
              <Typography sx={commonStyles.groupHeaderText}>
                {group.title}
              </Typography>
            </Box>
          </Box>

          {/* 分组数据行 - 使用Collapse组件实现折叠动画 */}
          <Collapse in={expandedGroups[groupIndex]} timeout="auto" unmountOnExit>
            {group.items.map((item, itemIndex) => (
              <Box
                key={itemIndex}
                sx={groupIndex === data.length - 1 ? commonStyles.borderedDataRow : commonStyles.dataRow}
              >
                {/* 特征名称单元格 */}
                <Box sx={commonStyles.featureCell}>
                  <Box sx={commonStyles.cellBox}>
                    <Box sx={commonStyles.featureContainer}>
                      <Typography sx={commonStyles.featureText}>
                        {item.feature}
                      </Typography>
                      {item.showQuestion && <QuestionIcon />}
                    </Box>
                  </Box>
                </Box>

                {/* 值单元格 */}
                <Box sx={{ ...commonStyles.valueCell, width: { xs: 'calc(100% / 3)', sm: '168.16px', md: '200px', lg: '250px' } }}>
                  <Box sx={commonStyles.cellBox}>
                    <Typography sx={commonStyles.valueText}>
                      {item.value || ''}
                    </Typography>
                  </Box>
                </Box>

                {/* 单位单元格 */}
                <Box sx={{ ...commonStyles.valueCell, width: { xs: 'calc(100% / 3)', sm: '165.72px', md: '200px', lg: '250px' } }}>
                  <Box sx={commonStyles.cellBox}>
                    {item.status === 'yes' ? (
                      <StatusIndicator status="yes" />
                    ) : (
                      <Typography sx={commonStyles.valueText}>
                        {item.unit || ''}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

SpecificationTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          feature: PropTypes.string.isRequired,
          value: PropTypes.string,
          unit: PropTypes.string,
          status: PropTypes.oneOf(['yes']),
          showQuestion: PropTypes.bool
        })
      ).isRequired
    })
  ),
  columns: PropTypes.arrayOf(PropTypes.string)
};

export default memo(SpecificationTable);


