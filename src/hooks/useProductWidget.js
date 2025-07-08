import { useCallback, useRef, useState } from 'react';

let _search_timer = null;

const useGetState = (initVal) => {
    const [state, setState] = useState(initVal);
    const ref = useRef(initVal);
    const setStateCopy = (newVal) => {
        ref.current = newVal;
        setState(newVal);
    };
    const getState = () => ref.current;
    return [state, setStateCopy, getState];
};

export const useProductWidget = ({
    page_size = 12,
    initialProducts = []
}) => {
    const [loading, setLoading] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [data, setData] = useState({ list: initialProducts, total: 0 });

    const [searchParams, _setSearchParams, getSearchParams] = useGetState({
        offset: 0,
        searchValue: '',
        category: '',
        sortBy: 'name'
    });

    const getProducts = useCallback(async () => {
        const { searchValue, category, offset, sortBy } = getSearchParams();
        setLoading(true);

        try {
            // Mock API call - in real app, this would be an actual API call
            let filteredProducts = [...initialProducts];

            // Apply search filter
            if (searchValue) {
                filteredProducts = filteredProducts.filter(product =>
                    product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                    product.modelNumber.toLowerCase().includes(searchValue.toLowerCase())
                );
            }

            // Apply category filter
            if (category && category !== 'All') {
                filteredProducts = filteredProducts.filter(product =>
                    product.category === category
                );
            }

            // Apply sorting
            filteredProducts.sort((a, b) => {
                switch (sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'modelNumber':
                        return a.modelNumber.localeCompare(b.modelNumber);
                    case 'category':
                        return a.category.localeCompare(b.category);
                    default:
                        return 0;
                }
            });

            // Apply pagination
            const startIndex = offset;
            const endIndex = startIndex + page_size;
            const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

            setData({
                list: paginatedProducts,
                total: Math.ceil(filteredProducts.length / page_size)
            });
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, [initialProducts, page_size]);

    const setSearchParams = (state) => {
        _setSearchParams({
            ...searchParams,
            ...state
        });
        clearTimeout(_search_timer);
        _search_timer = setTimeout(() => {
            getProducts();
        }, 500);
    };

    const handleDownloadAll = () => {
        if (checkedItems.length === 0) return;
        console.log('Downloading all selected products:', checkedItems);
        // In real app, this would trigger bulk download
    };

    const handleDownloadSingle = (product) => {
        console.log('Downloading single product:', product);
        // In real app, this would trigger single download
    };

    const handleItemSelect = (item, checked) => {
        setCheckedItems(prev =>
            checked
                ? [...prev, item]
                : prev.filter(i => i.id !== item.id)
        );
    };

    return {
        data,
        loading,
        searchParams,
        checkedItems,
        setSearchParams,
        handleDownloadAll,
        handleDownloadSingle,
        handleItemSelect,
        getProducts
    };
}; 