import {
    CheckBox,
    CheckBoxOutlineBlank
} from '@mui/icons-material';
import {
    Box,
    Checkbox,
    IconButton,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { useSelectedAssets } from '../context/SelectedAssetsContext';
import useTheme from '../hooks/useTheme';

const AssetCardContainer = styled(Box)(() => ({
    background: '#ffffff',
    borderStyle: 'solid',
    borderColor: '#cccccc',
    borderWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '270px',
    height: '300px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
}));

const CardActionsSection = styled(Box)(() => ({
    padding: '0px 4px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '48px',
    position: 'relative',
}));

const CheckboxContainer = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    position: 'relative',
}));

const StateLayer = styled(Box)(() => ({
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
}));

const IconContainer = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    '& .MuiCheckbox-root': {
        color: '#999999',
    },

}));

const QuickActions = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
}));

const ActionButton = styled(IconButton)(({theme}) => ({
    width: '40px',
    height: '40px',
    borderRadius: '24px',
    '& .MuiSvgIcon-root': {
        fontSize: '20px',
        // color: '#666666',
    },
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  
    "& .material-symbols-outlined:hover":{
        color: theme.palette.primary.main,
    }
}));

const PreviewSection = styled(Box)(() => ({
    padding: '0px 16px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
    position: 'relative',
    overflow: 'hidden', // 确保溢出的部分被隐藏
}));

const PreviewContainer = styled(Box)(() => ({
    background: '#f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
    minHeight: '120px',
    padding: '8px',
}));

// 创建一个自适应的图片容器
const MediaPreview = styled('img')(({ aspectRatio }) => {
    // 根据图片的宽高比决定如何显示
    // aspectRatio > 1 表示宽度大于高度（横向图片）
    // aspectRatio < 1 表示高度大于宽度（纵向图片）
    const isLandscape = aspectRatio > 1;
    
    return {
        width: isLandscape ? '100%' : 'auto',
        height: isLandscape ? 'auto' : '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        position: 'relative',
        margin: 'auto',
        display: 'block', // 使margin: auto生效
        // 条形码的优化
        objectPosition: 'center center',
    };
});

// 文件格式徽章容器
const BadgeContainer = styled(Box)(() => ({
    padding: '0px 12px 16px 0px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: '100%',
    position: 'absolute',
    left: 0,
    bottom: 0,
}));

// 文件类型徽章
const FileTypeBadge = styled(Box)(() => ({
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '4px',
    padding: '4px 6px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
}));

// 文件类型文本
const FileType = styled(Typography)(() => ({
    color: '#ffffff',
    textAlign: 'center',
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '0.5px',
    fontWeight: 500,
    fontFamily: '"Roboto-Medium", sans-serif',
    position: 'relative',
    maxWidth: '31px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
}));

const ContentSection = styled(Box)(() => ({
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    position: 'relative',
}));

const Eyebrow = styled(Typography)(({theme}) => ({
    color: theme.palette.primary.main,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.25px',
    fontWeight: 400,
    fontFamily: '"Roboto-Regular", sans-serif',
    width: '100%',
}));

const TitleContainer = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    height: '40px',
    position: 'relative',
}));

const Title = styled(Typography)(() => ({
    color: '#000000',
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.1px',
    fontWeight: 500,
    fontFamily: '"Roboto-Medium", sans-serif',
    flex: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
}));


const Icon = ({ type }) => {
    return <span   className="material-symbols-outlined">
        {type}
    </span>
}

const DigitalAssetCard = ({
    product,
    onSelect,
    onProductClick,
    onDownload,
    showCheckbox = true,
    cardActionsConfig = {
        show_file_type: true,
        show_eyebrow: true,
        show_open_pdf: false,
        show_open_product_page: false,
        show_preview_media: true,
    },
    isAssetSelected,
    toggleAsset
}) => {
    const { fallbackImage } = useTheme();
    
    // 兼容性处理：如果没有传入选中状态函数，则使用全局context
    const globalSelectedAssets = useSelectedAssets();
    const finalIsAssetSelected = isAssetSelected || globalSelectedAssets.isAssetSelected;
    const finalToggleAsset = toggleAsset || globalSelectedAssets.toggleAsset;
    
    const [imageError, setImageError] = useState(false);
    const [aspectRatio, setAspectRatio] = useState(1);
    // const { data: assetInfo } = useAssetInfo(product.id);
    
    // console.log("assetInfo", assetInfo);

    // 获取文件类型
    const getFileType = () => {
        // 优先从原始文件名中提取扩展名
        if (product.filename) {
            const match = product.filename.match(/\.([a-zA-Z0-9]+)$/);
            if (match && match[1]) {
                return match[1].toUpperCase();
            }
        }
        
        // 如果没有原始文件名或无法提取，尝试从文件名属性中获取
        if (product.name) {
            const match = product.name.match(/\.([a-zA-Z0-9]+)$/);
            if (match && match[1]) {
                return match[1].toUpperCase();
            }
        }
        
        // 如果仍然无法获取，尝试从mediaType中提取
        if (product.mediaType) {
            const mediaTypeParts = product.mediaType.split('/');
            if (mediaTypeParts.length > 1) {
                return mediaTypeParts[1].toUpperCase();
            }
            return product.mediaType.toUpperCase();
        }
        
        // 最后尝试从图片URL中提取
        if (product.image) {
            const match = product.image.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
            if (match && match[1]) {
                return match[1].toUpperCase();
            }
        }
        
        return 'FILE';
    };
    
    const handleCheckboxChange = (event) => {
        const checked = event.target.checked;
        finalToggleAsset(product, checked);
        
        if (onSelect) {
            onSelect(product, checked);
        }
    };

    const handleAssetClick = () => {
        onProductClick?.(product, true); // true 表示这是资产类型
    };

    const handleDownloadClick = () => {
        onDownload?.(product);
    };

    // 获取图片URL，如果没有资产图片或加载失败则使用fallback图片
    const getImageSrc = () => {
        if (imageError || !product.image) {
            if (fallbackImage) {
                const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL || '';
                return fallbackImage.startsWith('http') ? fallbackImage : `${baseUrl}${fallbackImage}`;
            }
            return product.image;
        }
        
        return product.image;
    };

    // 处理图片加载失败
    const handleImageError = () => {
        if (!imageError && product.image) {
            setImageError(true);
        }
    };
    
    // 处理图片加载完成，计算宽高比
    const handleImageLoad = (event) => {
        const img = event.target;
        if (img.naturalWidth && img.naturalHeight) {
            const ratio = img.naturalWidth / img.naturalHeight;
            setAspectRatio(ratio);
        }
    };

    return (
        <AssetCardContainer>
            {/* Card Actions */}
            <CardActionsSection>
                <CheckboxContainer>
                    {showCheckbox && (
                        <StateLayer>
                            <IconContainer>
                                <Checkbox
                                    checked={finalIsAssetSelected(product.id)}
                                    onChange={handleCheckboxChange}
                                    icon={<CheckBoxOutlineBlank />}
                                    checkedIcon={<CheckBox />}
                                    sx={{
                                        padding: 0,
                                        '& .MuiSvgIcon-root': {
                                            fontSize: '24px',
                                            '& path': {
                                                strokeWidth: '0.1',
                                                stroke: 'currentColor',
                                            },
                                        },
                                    }}
                                />
                            </IconContainer>
                        </StateLayer>
                    )}
                </CheckboxContainer>

                <QuickActions>
                    {cardActionsConfig.show_open_product_page && (
                        <ActionButton onClick={handleAssetClick}>
                            <Icon type="build" />
                        </ActionButton>
                    )}
                    {cardActionsConfig.show_open_pdf && (
                        <ActionButton onClick={() => {
                            // 暂时注释掉PDF图标的AssetDetailDialog链接
                            console.log('PDF icon clicked - AssetDetailDialog link temporarily disabled');
                            // handleAssetClick();
                        }}>
                            <Icon type="picture_as_pdf" />
                        </ActionButton>
                    )}
                    {cardActionsConfig.show_preview_media && (
                        <ActionButton onClick={handleAssetClick}>
                            <Icon type="preview" />
                        </ActionButton>
                    )}
                    <ActionButton onClick={handleDownloadClick}>
                        <Icon type="download" />
                    </ActionButton>
                </QuickActions>
            </CardActionsSection>

            {/* Preview */}
            <PreviewSection>
                <PreviewContainer>
                    <MediaPreview
                        src={getImageSrc()}
                        alt={product.name || 'Asset'}
                        loading="lazy"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        aspectRatio={aspectRatio}
                    />
                    
                    {/* 文件类型徽章 */}
                    {cardActionsConfig.show_file_type && (
                        <BadgeContainer>
                            <FileTypeBadge>
                                <FileType>{getFileType()}</FileType>
                            </FileTypeBadge>
                        </BadgeContainer>
                    )}
                </PreviewContainer>
            </PreviewSection>

            {/* Content */}
            <ContentSection>
                {cardActionsConfig.show_eyebrow && (
                    <Eyebrow>
                        {(product.mediaCategory  || '-').replace(',', ' ')}
                    </Eyebrow>
                )}
                <TitleContainer>
                    <Title>
                        {product.name || product.filename || 'Untitled'}
                    </Title>
                </TitleContainer>
            </ContentSection>
        </AssetCardContainer>
    );
};

export default DigitalAssetCard; 