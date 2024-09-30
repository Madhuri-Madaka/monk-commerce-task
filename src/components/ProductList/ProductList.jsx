import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Product from '../Product/Product';
import './ProductList.css';
import { useProductStore } from '../../store/useProductStore';

export const ProductList = () => {
    // Accessing the product list and setter from the Zustand store
    const products = useProductStore((state) => state.productList);
    const updateProductList = useProductStore((state) => state.setProductList);

    /**
     * Handles the reordering of the product list when an item is dragged and dropped.
     * 
     * @param {Object} result - The result of the drag-and-drop operation.
     */
    const handleProductReorder = (result) => {
        if (!result.destination) return; // Exit if dropped outside the list

        // Create a new list by copying the current product list
        const reorderedProducts = Array.from(products);
        
        // Remove the dragged product from its original position
        const [draggedProduct] = reorderedProducts.splice(result.source.index, 1);
        
        // Insert the dragged product at the new position
        reorderedProducts.splice(result.destination.index, 0, draggedProduct);

        // Update the Zustand store with the new product order
        updateProductList(reorderedProducts);
    };

    return (
        <div className="product-list-wrapper">
            <div className="list-title">Add Products</div>
            
            {/* List Headers for Product and Discount Columns */}
            <div className="list-headers">
                <div className="header">Product</div>
                <div className="header">Discount</div>
            </div>

            {/* Drag-and-drop context to allow reordering of the product list */}
            <DragDropContext onDragEnd={handleProductReorder}>
                <Droppable droppableId="product-droppable">
                    {(provided) => (
                        <div
                            className="list-content"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {products.map((product, index) => (
                                <Draggable key={product.id} draggableId={String(product.id)} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            {/* Each Product component gets its product details and drag handle */}
                                            <Product
                                                product={product}
                                                index={index}
                                                dragHandleProps={provided.dragHandleProps}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder} {/* Placeholder for maintaining layout when dragging */}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default ProductList;
