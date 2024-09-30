import { create } from 'zustand';

// Zustand store to manage the product list and its actions
export const useProductStore = create((set) => ({
  // Initial state with an empty product list
  productList: [
    {
      id: "1", // Unique identifier for the product
      title: '', // Title of the product (empty by default)
      variants: [], // List of variants (empty by default)
    },
  ],

  // Function to set or replace the entire product list
  setProductList: (newList) => set({ productList: newList }),

  // Function to add a new product with a unique id
  addProduct: () =>
    set((state) => ({
      productList: [
        ...state.productList,
        { id: String(state.productList.length + 1), title: '', variants: [] }, // New product with auto-incremented id
      ],
    })),

  // Function to remove a product by its unique id
  removeProduct: (productId) =>
    set((state) => ({
      productList: state.productList.filter((product) => product.id !== productId), // Remove product by id
    })),

  // Function to replace an existing product by its id with a new product
  replaceProduct: (productId, newProducts) => 
    set((state) => {
        const productIndexToReplace = state.productList.findIndex(product => product.id === productId); // Find the index of the product to replace
        
        if (productIndexToReplace === -1) {
            return state; // If the product is not found, return the current state
        }

        // Create a new product list
        const updatedProductList = [
            ...state.productList.slice(0, productIndexToReplace), // Products before the index
            ...newProducts, // New products to insert
            ...state.productList.slice(productIndexToReplace + 1) // Products after the index
        ];

        return { productList: updatedProductList }; // Return the updated product list
    }),


  // Function to remove a variant from a specific product by variant id
  removeVariant: (productId, variantId) =>
    set((state) => ({
      productList: state.productList.map((product) =>
        product.id === productId
          ? {
              ...product,
              variants: product.variants.filter((variant) => variant.id !== variantId), // Remove variant by id
            }
          : product // Keep other products unchanged
      ),
    })),
}));
