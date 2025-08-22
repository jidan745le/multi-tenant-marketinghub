import {
  Box,
  styled
} from '@mui/material';

const renderScrollWrapper = () => {
    return `
      overflow: auto!important;
      scrollbar-gutter: stable both;
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        border-radius: 8px;
        background-color: #e7e7e7;
        border: 1px solid #cacaca;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 8px;
        background-color: gray;
      }
      &::-webkit-scrollbar-thumb:hover {
        background-color: #555;
      }
  `
  }


/**
 * @param {string} type
 * @returns {string}
 */
export const ScrollBarWrapperBox = styled(Box)(renderScrollWrapper);
