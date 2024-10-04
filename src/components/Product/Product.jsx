import './Product.css';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import handleIcon from '/handle.svg'; // Renamed variable for clarity
import editIcon from '/edit.svg'; // Renamed variable for clarity
import ProductPicker from '../ProductPicker/ProductPicker';
import { useProductStore } from '../../store/useProductStore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const Product = ({ product, dragHandleProps }) => {
    // Local state for managing visibility of the product picker and variants section
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [showVariants, setShowVariants] = useState(false);
    const [showDiscountInputs, setShowDiscountInputs] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(''); // State for the discount amount
    const [discountType, setDiscountType] = useState('flat'); // State for the discount type (flat or percentage)

    const { replaceProduct, removeVariant, removeProduct, productList } = useProductStore(); // Zustand store actions

    /**
     * Handles product selection from the ProductPicker.
     * Replaces the current product with the selected one and adds additional products to the list.
     * @param {Array} selectedProducts - The array of selected products.
     */
    const handleProductSelect = (selectedProducts) => {
        if (selectedProducts.length > 0) {
            const firstSelectedProduct = selectedProducts[0];
    
            // Replace current product with the selected products
            replaceProduct(product.id, selectedProducts); // Pass the entire selectedProducts array
    
            // Optionally, you can handle logic for more than one product if needed
        }
    
        setIsPickerOpen(false); // Close the product picker dialog
    };
    

    /**
     * Handles sorting of product variants using drag-and-drop.
     * Updates the product variants order in Zustand.
     * @param {Object} result - The result of the drag-and-drop operation.
     */
    const handleVariantSort = (result) => {
        const { destination, source } = result;
        if (!destination) return; // Exit if no destination

        const reorderedVariants = Array.from(product.variants);
        const [movedVariant] = reorderedVariants.splice(source.index, 1);
        reorderedVariants.splice(destination.index, 0, movedVariant);

        replaceProduct(product.id, [{ ...product, variants: reorderedVariants }]);
    };

    /**
     * Updates the discount information for the product in Zustand whenever discount state changes.
     */
    const updateDiscounts = () => {
        replaceProduct(product.id, [{ ...product, discount: discountAmount, discountType }]);
    };  

    // Use effect to call updateDiscounts whenever the discount amount or type changes
    useEffect(() => {
        updateDiscounts();
    }, [discountAmount, discountType]);

    // Function to update the discount amount for a variant
    const onVariantDiscountAmountChange = (value, variantIndex) => {
        const updatedVariants = [...product.variants];
        const discountType = updatedVariants[variantIndex]?.discountType || "flat";
        // Update the discount value for the specific variant
        updatedVariants[variantIndex] = {
            ...updatedVariants[variantIndex],
            discount: value,
            discountType
        };

        // Replace the product with the updated variant array in the Zustand store
        replaceProduct(product.id, [{ ...product, variants: updatedVariants }]);
    };
    
    // Function to update the discount type for a variant
    const onVariantDiscountTypeChange = (value, variantIndex) => {
        const updatedVariants = [...product.variants];
    
        // Update the discountType value for the specific variant
        updatedVariants[variantIndex] = {
            ...updatedVariants[variantIndex],
            discountType: value, // Set the discount type value (flat or percentage)
        };
    
        // Replace the product with the updated variant array in the Zustand store
        replaceProduct(product.id, [{ ...product, variants: updatedVariants }]);
    };

    return (
        <>
            <div key={product.id} className="product-container">
                {/* Drag handle for sorting products */}
                <div style={{ minWidth: 24 }}></div>
                <img src={handleIcon} className='drag-handle' alt="" {...dragHandleProps} />
                {/* <div style={{ minWidth: 24 }}>{product.id}.</div> */}


                {/* Product title input and edit button */}
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={product.title || "Select Product"}
                        disabled
                        className="product-input"
                    />
                    <img
                        src={editIcon}
                        alt="Edit product"
                        className="edit-icon"
                        onClick={() => setIsPickerOpen(true)} // Open product picker dialog on click
                    />
                </div>

                {/* Discount inputs and toggle button */}
                {showDiscountInputs ? (
                    <div className="discount-inputs">
                        <input
                            type="number"
                            placeholder="Amount"
                            className="small-input"
                            min={0}
                            value={discountAmount}
                            onChange={(e) => setDiscountAmount(e.target.value)}
                        />
                        <select
                            className="small-input"
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value)}
                        >
                            <option value="flat">Flat Off</option>
                            <option value="percent">% Off</option>
                        </select>
                    </div>
                ) : (
                    <button
                        className="discount-btn"
                        onClick={() => setShowDiscountInputs(true)} // Show discount inputs on click
                    >
                        Add Discount
                    </button>
                )}

                {/* Remove product button (only visible if more than 1 product is present) */}
                <CloseIcon
                    style={{ visibility: productList.length > 1 ? 'visible' : 'hidden' }}
                    className='close-icon'
                    onClick={() => removeProduct(product.id)}
                />
            </div>

            {/* Toggle for showing/hiding variants */}
            {product.variants.length > 0 ? (
                <div
                    className="product-variants-toggle"
                    onClick={() => setShowVariants(!showVariants)}
                    style={{ cursor: 'pointer' }}
                >
                    Show Variants
                    {showVariants ? <KeyboardArrowUpIcon className="toggle-icon" /> : <KeyboardArrowDownIcon className="toggle-icon" />}
                </div>
            ) : (
                <div className='product-variants-toggle' />
            )}

            {/* Variant list displayed if showVariants is true */}
            {showVariants && (
                <div className="variants-list">
                    <DragDropContext onDragEnd={handleVariantSort}>
                        <Droppable droppableId={`variants-${product.id}`}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {product.variants.map((variant, index) => (
                                        <Draggable key={variant.id} draggableId={String(variant.id)} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className="product-variant-container"
                                                >
                                                    {/* Drag handle for sorting variants */}
                                                    <img
                                                        src={handleIcon}
                                                        alt="drag handle"
                                                        className="drag-handle"
                                                        {...provided.dragHandleProps}
                                                    />
                                                    <div className="product-variant-text">
                                                        <div>{variant.title}</div> 
                                                        <div>${variant.price}</div>
                                                    </div>
                                                    <div className="discount-inputs">
                                                        <input
                                                            type="number"
                                                            placeholder="Amount"
                                                            className="variant-input"
                                                            min={0}
                                                            value={variant.discount || ""}
                                                            onChange={(e) => onVariantDiscountAmountChange(e.target.value, index)}
                                                        />
                                                        <select
                                                            className="variant-input"
                                                            value={variant.discountType || 'flat'}
                                                            onChange={(e) => onVariantDiscountTypeChange(e.target.value, index)}
                                                        >
                                                            <option value="flat">Flat Off</option>
                                                            <option value="percent">% Off</option>
                                                        </select>
                                                    </div>
                                                    {/* Remove variant button */}
                                                    <CloseIcon
                                                        className='close-icon'
                                                        onClick={() => {
                                                            if (product.variants.length > 1) {
                                                                removeVariant(product.id, variant.id)
                                                            } else {
                                                                removeProduct(product.id)
                                                            }
                                                            
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            )}

            {/* Product Picker dialog for selecting products */}
            {isPickerOpen && <ProductPicker
                open={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onProductAdd={handleProductSelect}
            />}
        </>
    );
};

export default Product;
