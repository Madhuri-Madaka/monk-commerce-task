import './App.css';
import JsonView from '@uiw/react-json-view';
import { nordTheme } from '@uiw/react-json-view/nord';
import ProductList from './components/ProductList/ProductList';
import AddProduct from './components/AddProduct/AddProduct';
import favIcon from '/favIcon.svg';
import { useProductStore } from './store/useProductStore';
import Scrollbars from 'react-custom-scrollbars-2';

function App() {
  const { productList } = useProductStore();
  return (
    <div >
      <div className="header-title">
        <img src={favIcon} className="logo" alt="monkCommerce" />
        <div>Monk Upsell & Cross-sell</div>
      </div>
      <div className="main-container">
        <Scrollbars autoHide style={{ width: '38vw', height: '75vh', marginRight: 14 }} className="content">
          <ProductList />
          <AddProduct />
        </Scrollbars>
        <Scrollbars autoHide style={{ width: '35vw', height: '75vh'}} className="preview">
          <JsonView value={productList} style={nordTheme} displayDataTypes={false} enableClipboard={false} />
        </Scrollbars>
      </div>
      
    </div>
  );
}

export default App;
