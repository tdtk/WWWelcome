import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import GoogleMap from './components/GoogleMap/GoogleMap';
import { fetchHotPepper, HotPepperResult } from './logic/hotpepper';
import Toasts, {ToastProps} from './components/Toasts/Toasts';

const App: React.FC = () => {
  const [toasts, setToasts] = useState([] as ToastProps[]);
  useEffect(() => {
    fetchHotPepper({ lat: 34.67, lng: 135.52, range: 5, order: 4 }, (json: HotPepperResult) => {
      console.log(json);
      const shop_info: ToastProps[] = json.results.shop.map((shop) => {
        return {title: shop.name, info: '500m', body: shop.catch}
      });
      setToasts(shop_info);
    });
  }, []);
  return (
    <div className="App">
      <Header/>
      <Toasts toasts={toasts}/>
      <GoogleMap/>
    </div>
  );
}

export default App;
