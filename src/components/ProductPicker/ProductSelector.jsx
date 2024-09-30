import * as React from 'react';
import { useEffect } from 'react';
import './ProductPicker.css';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export const ProductSelector = React.memo(({ product, selectedProducts, onSelectionChange }) => {
  const selectedProduct = selectedProducts.find((p) => p.id === product.id);
  const checkedParent = !!selectedProduct;
  const checkedVariants = product.variants.map(
    (variant) =>
      selectedProduct?.variants.some((selectedVariant) => selectedVariant.id === variant.id) || false
  );

  const handleParentChange = (event) => {
    const checked = event.target.checked;

    if (checked) {
      onSelectionChange({
        ...product,
        variants: product.variants,
      });
    } else {
      onSelectionChange({
        ...product,
        variants: [],
      });
    }
  };

  const handleVariantChange = (index) => (event) => {
    const newCheckedVariants = [...checkedVariants];
    newCheckedVariants[index] = event.target.checked;

    const selectedVariants = product.variants.filter((_, i) => newCheckedVariants[i]);

    if (selectedVariants.length === 0) {
      onSelectionChange({
        ...product,
        variants: [],
      });
    } else {
      onSelectionChange({
        ...product,
        variants: selectedVariants,
      });
    }
  };

  const isIndeterminate =
    checkedVariants.some((checked) => checked) &&
    !checkedVariants.every((checked) => checked);

  const variants = product.variants.map((variant, index) => (
    <div className='product-variant' key={variant.id}>
      <FormControlLabel
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

  // Preload the main product image
  useEffect(() => {
    if (product.image?.src) {
      const img = new Image();
      img.src = product.image.src; // Preload main product image
    }
  }, [product]);

  return (
    <div key={product.id} className='product-info'>
      <FormControlLabel
        label={
          <div className="product-label" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '30px', height: '30px' }}>
              {product.image?.src ? (
                <img
                  src={product.image.src}
                  width={30}
                  alt={product.title}
                  style={{ display: 'block', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: 30, height: 30, backgroundColor: '#f0f0f0' }} /> // Placeholder
              )}
            </div>
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
});

export default ProductSelector;
