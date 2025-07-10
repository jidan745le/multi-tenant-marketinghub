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
import React from 'react';

const DigitalAssetCard = styled(Box)(() => ({
    background: '#ffffff',
    borderStyle: 'solid',
    borderColor: '#cccccc',
    borderWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '240px',
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
    overflow: 'hidden',
}));

const PreviewContainer = styled(Box)(() => ({
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
    position: 'relative',
}));

const MediaPreview = styled('img')(() => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'relative',
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

const Eyebrow = styled(Typography)(() => ({
    color: '#eb6100',
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

const ProductCard = ({
    product,
    isSelected = false,
    onSelect,
    onProductClick,
    onDownload,
    cardActionsConfig = {
        show_file_type: false,
        show_eyebrow: true,
        show_open_pdf: true,
        show_open_product_page: true,
        show_preview_media: true,
    }
}) => {
    const handleCheckboxChange = (event) => {
        onSelect(product, event.target.checked);
    };

    const handleProductClick = () => {
        onProductClick?.(product);
    };

    const handleDownloadClick = () => {
        onDownload?.(product);
    };

    return (
        <DigitalAssetCard>
            {/* Card Actions */}
            <CardActionsSection>
                <CheckboxContainer>
                    <StateLayer>
                        <IconContainer>
                            <Checkbox
                                checked={isSelected}
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
                        <ActionButton onClick={handleProductClick}>
                            <Icon type="picture_as_pdf" />
                        </ActionButton>
                    )}
                    {cardActionsConfig.show_preview_media && (
                        <ActionButton>
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
                        src={product.image || `https://infoportal.chervon.com.cn/api/previewImage/${product.thumbnail}`}
                        alt={product.modelName || product.name}
                        loading="lazy"
                    />
                </PreviewContainer>
            </PreviewSection>

            {/* Content */}
            <ContentSection>
                {cardActionsConfig.show_eyebrow && (
                    <Eyebrow>
                        {product.modelNumber} · {product.productType || product.category}
                    </Eyebrow>
                )}
                <TitleContainer>
                    <Title>
                        {product.modelName || product.name}
                    </Title>
                </TitleContainer>
            </ContentSection>
        </DigitalAssetCard>
    );
};

export default ProductCard; 