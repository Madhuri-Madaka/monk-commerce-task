import * as React from 'react';
import './ProductPicker.css';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export const ProductSelector = ({ product, selectedProducts, onSelectionChange }) => {
  // Check if the current product or any of its variants are selected from props
  const selectedProduct = selectedProducts.find((p) => p.id === product.id);
  const checkedParent = !!selectedProduct;
  const checkedVariants = product.variants.map(
    (variant) =>
      selectedProduct?.variants.some((selectedVariant) => selectedVariant.id === variant.id) || false
  );

  // Handle parent checkbox (select/deselect all variants)
  const handleParentChange = (event) => {
    const checked = event.target.checked;

    if (checked) {
      // Select all variants if parent is checked
      onSelectionChange({
        ...product,
        variants: product.variants,
      });
    } else {
      // Remove the entire product if parent is unchecked
      onSelectionChange({
        ...product,
        variants: [],
      });
    }
  };

  // Handle individual variant checkbox change
  const handleVariantChange = (index) => (event) => {
    const newCheckedVariants = [...checkedVariants];
    newCheckedVariants[index] = event.target.checked;

    const selectedVariants = product.variants.filter((_, i) => newCheckedVariants[i]);

    // If no variants are selected, remove the parent (product) entirely
    if (selectedVariants.length === 0) {
      onSelectionChange({
        ...product,
        variants: [],
      });
    } else {
      // Update only selected variants
      onSelectionChange({
        ...product,
        variants: selectedVariants,
      });
    }
  };

  // Parent checkbox should be indeterminate if some but not all children are selected
  const isIndeterminate =
    checkedVariants.some((checked) => checked) &&
    !checkedVariants.every((checked) => checked);

  // Render variants (children checkboxes)
  const variants = product.variants.map((variant, index) => (
    <div className='product-variant' key={variant.id}>
      <FormControlLabel
        key={variant.id}
        label={
          <div className="variant-label">
              <div>{variant.title}</div>
              <div className='price'>${variant.price}</div>
          </div>
        }
        control={
          <Checkbox
            checked={checkedVariants[index]}
            onChange={handleVariantChange(index)}
          />
        }
      />
    </div>
  ));

  return (
    <div key={product.id} className='product-info'>
      <FormControlLabel
        label={
          <div className="product-label">
            <img src={product?.image?.src} width={30} alt={''} />
            <div>{product.title}</div>
          </div>
        }
        control={
          <Checkbox
            checked={checkedParent}
            indeterminate={isIndeterminate}
            onChange={handleParentChange}
          />
        }
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
        {variants}
      </Box>
    </div>
  );
};

export default ProductSelector;
