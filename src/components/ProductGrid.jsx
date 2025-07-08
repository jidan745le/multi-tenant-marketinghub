import React from 'react';
import ProductWidgetContainer from './ProductWidgetContainer';

function ProductGrid() {
  const handleProductClick = (product) => {
    console.log('Open product page for:', product.name);
    // Navigate to product detail page
  };

  const handleProductDownload = (product) => {
    console.log('Download product:', product.name);
    // Handle product download
  };

  return (
    <ProductWidgetContainer
      title="Product Catalog"
      page_size={12}
      onProductClick={handleProductClick}
      onProductDownload={handleProductDownload}
      showDownloadAll={true}
    />
  );
}

export default ProductGrid; 