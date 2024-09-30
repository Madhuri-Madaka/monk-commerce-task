import './AddProduct.css';
import { useProductStore } from '../../store/useProductStore';

export const AddProduct = () => {
    const addProduct = useProductStore((state) => state.addProduct);

    return (
        <div className="button-container">
            <button className="add-btn" onClick={addProduct}>
                Add Product
            </button>
        </div>
    );
}

export default AddProduct;
