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
import { useBrand } from '../hooks/useBrand';
import fileApi from '../services/fileApi';

const ProductCardContainer = styled(Box)(() => ({
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
    overflow: 'hidden',
}));

const PreviewContainer = styled(Box)(() => ({
    background: '#ffffff',
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

const MediaPreview = styled('img')(({ aspectRatio }) => {
    const isLandscape = aspectRatio > 1;
    
    return {
        width: isLandscape ? '100%' : 'auto',
        height: isLandscape ? 'auto' : '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        position: 'relative',
        margin: 'auto',
        display: 'block',
        objectPosition: 'center center',
    };
});

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
    return <span className="material-symbols-outlined">
        {type}
    </span>
}

const ProductGridCard = ({
    product,
    isSelected = false,
    onSelect,
    onProductClick,
    onDownload,
    cardActionsConfig = {
        show_eyebrow: true,
        show_open_pdf: true,
        show_open_product_page: true,
        show_preview_media: true,
    }
}) => {
    const { fallbackImage } = useTheme();
    const { toggleAsset, isAssetSelected } = useSelectedAssets();
    const { currentBrand } = useBrand();
    
    const [imageError, setImageError] = useState(false);
    const [aspectRatio, setAspectRatio] = useState(1);
    
    const handleCheckboxChange = (event) => {
        const checked = event.target.checked;
        toggleAsset(product, checked);
        
        if (onSelect) {
            onSelect(product, checked);
        }
    };

    const handleProductClick = () => {
        onProductClick?.(product, false); // false 表示这不是资产类型
    };

    const handleDownloadClick = () => {
        onDownload?.(product);
    };

    const handlePdfClick = async () => {
        try {
            // 获取产品编号
            const productNumber = product.modelNumber || product.VirtualProductID || product.id;
            
            if (!productNumber) {
                console.error('Product number not available');
                return;
            }

            const dataSheetId = currentBrand?.strapiData?.mainDataSheet?.dataSheetId;
            
            if (!dataSheetId) {
                console.error('DataSheet ID not available in strapiData');
                return;
            }

            console.log('Creating PDF:', { productNumber, dataSheetId });

            const result = await fileApi.createPdfFile({
                productNumber: productNumber,
                templateId: dataSheetId.toString()
            });

            console.log('PDF created successfully:', result);
        } catch (error) {
            console.error('Error creating PDF:', error);
        }
    };

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

    const handleImageError = () => {
        if (!imageError && product.image) {
            setImageError(true);
        }
    };
    
    const handleImageLoad = (event) => {
        const img = event.target;
        if (img.naturalWidth && img.naturalHeight) {
            const ratio = img.naturalWidth / img.naturalHeight;
            setAspectRatio(ratio);
        }
    };

    return (
        <ProductCardContainer>
            {/* Card Actions */}
            <CardActionsSection>
                <CheckboxContainer>
                    <StateLayer>
                        <IconContainer>
                            <Checkbox
                                checked={isAssetSelected(product.id)}
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
                </CheckboxContainer>

                <QuickActions>
                    {cardActionsConfig.show_open_product_page && (
                        <ActionButton onClick={handleProductClick}>
                            <Icon type="build" />
                        </ActionButton>
                    )}
                    {cardActionsConfig.show_open_pdf && (
                        <ActionButton onClick={handlePdfClick}>
                            <Icon type="picture_as_pdf" />
                        </ActionButton>
                    )}
                    {cardActionsConfig.show_preview_media && (
                        <ActionButton onClick={handleProductClick}>
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
                        alt={product.modelName || product.name}
                        loading="lazy"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        aspectRatio={aspectRatio}
                    />
                </PreviewContainer>
            </PreviewSection>

            {/* Content */}
            <ContentSection>
                {cardActionsConfig.show_eyebrow && (
                    <Eyebrow>
                        {/* 如果有多个子SKU，显示 "ModelNumber - (X SKUs)"，否则显示原有格式 */}
                        {product.showSkuBadge && product.skuCount > 1 ?
                            `${product.modelNumber} - (${product.skuCount} SKUs)` :
                            `${product.modelNumber} · ${product.productType || product.category}`
                        }
                    </Eyebrow>
                )}
                <TitleContainer>
                    <Title>
                        {product.modelName || product.name}
                    </Title>
                </TitleContainer>
            </ContentSection>
        </ProductCardContainer>
    );
};

export default ProductGridCard;

