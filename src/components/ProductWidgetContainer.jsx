import React, { useEffect } from 'react';
import { useProductWidget } from '../hooks/useProductWidget';
import ProductWidget from './ProductWidget';

// Sample products data
const sampleProducts = [
  {
    id: 1,
    modelNumber: '11707',
    category: 'Electrical',
    name: 'Heavy Duty Crimping Pliers',
    image: 'https://via.placeholder.com/200x150/f5f5f5/666666?text=Product+Image',
  },
  {
    id: 2,
    modelNumber: '11708',
    category: 'Tools',
    name: 'Professional Drill Set',
    image: 'https://via.placeholder.com/200x150/f5f5f5/666666?text=Drill+Set',
  },
  {
    id: 3,
    modelNumber: '11709',
    category: 'Safety',
    name: 'Safety Goggles Pro',
    image: 'https://via.placeholder.com/200x150/f5f5f5/666666?text=Safety+Goggles',
  },
  {
    id: 4,
    modelNumber: '11710',
    category: 'Electronics',
    name: 'Industrial Flashlight',
    image: 'https://via.placeholder.com/200x150/f5f5f5/666666?text=Flashlight',
  },
  {
    id: 5,
    modelNumber: '11711',
    category: 'Tools',
    name: 'Measuring Tape 25ft',
    image: 'https://via.placeholder.com/200x150/f5f5f5/666666?text=Measuring+Tape',
  },
  {
    id: 6,
    modelNumber: '11712',
    category: 'Electronics',
    name: 'LED Work Light',
    image: 'https://via.placeholder.com/200x150/f5f5f5/666666?text=LED+Light',
  },
  {
    id: 7,
    modelNumber: '11713',
    category: 'Safety',
    name: 'Heavy Duty Gloves',
    image: 'https://via.placeholder.com/200x150/f5f5f5/666666?text=Gloves',
  },
  {
    id: 8,
    modelNumber: '11714',
    category: 'Tools',
    name: 'Socket Wrench Set',
    image: 'https://via.placeholder.com/200x150/f5f5f5/666666?text=Wrench+Set',
  },
];

const ProductWidgetContainer = ({
  title = 'Product Catalog',
  page_size = 12,
  products = sampleProducts,
  onProductClick,
  onProductDownload,
  showDownloadAll = true
}) => {
  const {
    data,
    loading,
    searchParams,
    checkedItems,
    setSearchParams,
    handleDownloadAll,
    handleDownloadSingle,
    handleItemSelect,
    getProducts
  } = useProductWidget({
    page_size,
    initialProducts: products
  });

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Get unique categories for filtering
  const categories = [...new Set(products.map(product => product.category))];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'modelNumber', label: 'Model Number' },
    { value: 'category', label: 'Category' }
  ];

  const handleSearch = (value) => {
    setSearchParams({ searchValue: value, offset: 0 });
  };

  const handleCategoryChange = (value) => {
    setSearchParams({ category: value, offset: 0 });
  };

  const handleSortChange = (value) => {
    setSearchParams({ sortBy: value, offset: 0 });
  };

  const handlePageChange = (page) => {
    setSearchParams({ 
      offset: (page - 1) * page_size 
    });
  };

  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    onProductClick?.(product);
  };

  const handleProductDownload = (product) => {
    console.log('Product download:', product);
    onProductDownload?.(product);
    handleDownloadSingle(product);
  };

  return (
    <ProductWidget
      title={title}
      loading={loading}
      products={data.list}
      totalPages={data.total}
      currentPage={Math.floor(searchParams.offset / page_size) + 1}
      searchValue={searchParams.searchValue}
      selectedCategory={searchParams.category}
      selectedSort={searchParams.sortBy}
      categories={categories}
      sortOptions={sortOptions}
      checkedItems={checkedItems}
      onSearch={handleSearch}
      onCategoryChange={handleCategoryChange}
      onSortChange={handleSortChange}
      onDownloadAll={handleDownloadAll}
      onDownloadSingle={handleProductDownload}
      onItemSelect={handleItemSelect}
      onProductClick={handleProductClick}
      onPageChange={handlePageChange}
      showDownloadAll={showDownloadAll}
    />
  );
};

export default ProductWidgetContainer; 