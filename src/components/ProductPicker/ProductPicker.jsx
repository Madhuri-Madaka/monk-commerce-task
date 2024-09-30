import './ProductPicker.css';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { TextField, DialogActions, DialogContent, CircularProgress } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import ProductSelector from './ProductSelector';
import CustomButton from '../../common-components/CustomButton';
import Scrollbars from 'react-custom-scrollbars';
import axios from 'axios';
import { debounce } from 'lodash'; // Import debounce from lodash
import { useProductStore } from '../../store/useProductStore';

const BASE_API_URL = 'https://thingproxy.freeboard.io/fetch/http://stageapi.monkcommerce.app/task/products/search'; // Adjust proxy

export const ProductPicker = ({ onClose, open, onProductAdd }) => {
    const [products, setProducts] = useState([]); // Product list
    const [selectedProducts, setSelectedProducts] = useState([]); // Selected products
    const [searchTerm, setSearchTerm] = useState(''); // Search term
    const [page, setPage] = useState(1); // Current page for pagination
    const [isLoading, setIsLoading] = useState(false); // Loading state for pagination
    const [searchLoading, setSearchLoading] = useState(false); // Loading state for search
    const [hasMoreProducts, setHasMoreProducts] = useState(true); // Tracks if more products are available
    const [noResults, setNoResults] = useState(false); // Tracks if no results are found
    const { productList } = useProductStore();
    const scrollbarsRef = useRef(null);

    // Function to set products in state while filtering out duplicates
    const setProductsInState = (newFetchedProducts, reset) => {
        const existingProductIds = productList.map(product => product.id); // Get existing product IDs
        const uniqueFetchedProducts = newFetchedProducts.filter(product => 
            !existingProductIds.includes(product.id) // Filter out existing products
        );

        if (reset) {
            setProducts(uniqueFetchedProducts); // Reset product list on new search
        } else {
            setProducts((prevProducts) => [
                ...prevProducts,
                ...uniqueFetchedProducts // Append unique products for pagination
            ]);
        }
    };

    // Fetch products from API
    const fetchProducts = async (reset = false) => {
        if (isLoading || !hasMoreProducts) return; // Stop if already loading or no more products

        if (reset) {
            setSearchLoading(true); // Start search loading state for a new search
        } else {
            setIsLoading(true); // Start pagination loading state
        }
        setNoResults(false); // Reset "No Results" flag

        try {
            const limit = 10; // Fetch 10 products at a time
            const response = await axios.get(BASE_API_URL, {
                headers: {
                    'x-api-key': '72njgfa948d9aS7gs5',
                },
                params: {
                    search: searchTerm || '',
                    page,
                    limit,
                },
            });

            const fetchedProducts = response.data || [];

            // If there are no products returned on page 1, show "No Results"
            if (reset && fetchedProducts.length === 0) {
                setNoResults(true); // Display "No Results" if page 1 has no data
            }

            // If there are no products returned in general, stop making further calls
            if (fetchedProducts.length === 0) {
                setHasMoreProducts(false); // No more products to fetch
            } else {
                setProductsInState(fetchedProducts, reset); // Use the new function to set products
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            if (reset) {
                setSearchLoading(false); // End search loading state
            } else {
                setIsLoading(false); // End pagination loading state
            }
        }
    };

    // Debounced search handler
    const handleSearchDebounced = debounce((value) => {
        setSearchTerm(value);
        setPage(1); // Reset to page 1 on new search
        setHasMoreProducts(true); // Allow fetching again for new search
    }, 500); // 500ms debounce

    // Fetch products on searchTerm or page change
    useEffect(() => {
        if (page === 1) {
            setHasMoreProducts(true); // Reset this flag for a new search
        }
        fetchProducts(page === 1); // Reset only when page is 1 (i.e., new search)
    }, [searchTerm, page]);

    // Handle scroll and detect when user has reached the bottom
    const handleScrollFrame = (values) => {
        const { scrollTop, scrollHeight, clientHeight } = values;

        // If the user has scrolled near the bottom, fetch the next page
        if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading && hasMoreProducts) {
            setPage((prevPage) => prevPage + 1); // Load the next page
        }
    };

    // Handle product selection
    const handleProductSelectionChange = (updatedProduct) => {
        setSelectedProducts((prevSelectedProducts) => {
            if (updatedProduct.variants.length === 0) {
                return prevSelectedProducts.filter((p) => p.id !== updatedProduct.id);
            }

            const existingIndex = prevSelectedProducts.findIndex((p) => p.id === updatedProduct.id);
            if (existingIndex !== -1) {
                const updatedProducts = [...prevSelectedProducts];
                updatedProducts[existingIndex] = updatedProduct;
                return updatedProducts;
            }

            return [...prevSelectedProducts, updatedProduct];
        });
    };

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle className='dialog-title'>
                <div>Select Products</div>
                <CloseIcon className='close-icon' onClick={onClose} />
            </DialogTitle>

            <DialogContent className='dialog-content'>
                {/* Search input */}
                <div className='search-container'>
                    <TextField
                        placeholder="Search"
                        size="small"
                        fullWidth
                        onChange={(e) => handleSearchDebounced(e.target.value)} // Use debounced search handler
                    />
                </div>

                {/* Scrollable product list */}
                <Scrollbars ref={scrollbarsRef} style={{ height: '60vh' }} onScrollFrame={handleScrollFrame}>
                    {/* Show loader while searching */}
                    {searchLoading ? (
                        <div className='loader'><CircularProgress /></div>
                    ) : noResults ? (
                        <div className='loader'>No Results Found</div> // Show "No Results" message if no products found on page 1
                    ) : (
                        products.map((product) => (
                            <ProductSelector
                                key={product.id}
                                product={product}
                                selectedProducts={selectedProducts}
                                onSelectionChange={handleProductSelectionChange}
                            />
                        ))
                    )}

                    {/* Display loading indicator for pagination */}
                    {isLoading && !searchLoading && <div className='loader'>Loading more products...</div>}
                    {!hasMoreProducts && !noResults && !searchLoading && (
                        <div className='loader'>No more products to load</div>
                    )} {/* Show message when no more products */}
                </Scrollbars>
            </DialogContent>

            {/* Footer with action buttons */}
            <DialogActions className='footer'>
                <div>{selectedProducts.length} products selected</div>
                <div className='action-buttons'>
                    <CustomButton variant="normal" size="small" onClick={onClose}>Cancel</CustomButton>
                    <CustomButton
                        disabled={selectedProducts.length === 0}
                        variant="contained"
                        size="small"
                        onClick={() => onProductAdd(selectedProducts)}
                    >
                        Add
                    </CustomButton>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default ProductPicker;
