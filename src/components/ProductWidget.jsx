import {
    Box,
    Pagination,
    Skeleton,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import ProductCard from './DigitalAssetCard';

const Section = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  alignSelf: 'stretch',
  flexShrink: 0,
  position: 'relative'
}));

const CardView = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '24px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  alignContent: 'flex-start',
  alignSelf: 'stretch',
  flexShrink: 0,
  position: 'relative',
  minHeight: '400px'
}));

const SkeletonCard = styled(Box)(() => ({
  width: '240px',
  height: '300px',
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
}));

const PaginationContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  padding: '24px 0'
}));

const EmptyState = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  width: '100%',
  textAlign: 'center'
}));

const SkeletonCardComponent = () => (
  <SkeletonCard>
    <Skeleton variant="rectangular" width="100%" height="48px" />
    <Skeleton variant="rectangular" width="100%" height="140px" />
    <Skeleton variant="text" width="60%" height="20px" />
    <Skeleton variant="text" width="80%" height="20px" />
    <Skeleton variant="text" width="70%" height="20px" />
  </SkeletonCard>
);

const ProductWidget = ({
  loading = false,
  products = [],
  totalPages = 0,
  currentPage = 1,
  checkedItems = [],
  onDownloadSingle,
  onItemSelect,
  onProductClick,
  onPageChange,
}) => {
  const isProductSelected = (product) => {
    return checkedItems.some(item => item.id === product.id);
  };

  const handleProductClick = (product) => {
    onProductClick?.(product);
  };

  const handleProductDownload = (product) => {
    onDownloadSingle?.(product);
  };

  return (
    <Section>
      <CardView>
        {loading ? (
          // Show skeleton loading cards
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCardComponent key={index} />
          ))
        ) : products.length === 0 ? (
          <EmptyState>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </EmptyState>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={isProductSelected(product)}
              onSelect={onItemSelect}
              onProductClick={handleProductClick}
              onDownload={handleProductDownload}
            />
          ))
        )}
      </CardView>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <PaginationContainer>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => onPageChange(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </PaginationContainer>
      )}
    </Section>
  );
};

export default ProductWidget; 