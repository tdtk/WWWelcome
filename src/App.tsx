import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import GoogleMap from './components/GoogleMap/GoogleMap';
import { fetchHotPepper, HotPepperResult } from './logic/hotpepper';
import Toasts, {ToastProps} from './components/Toasts/Toasts';
import { Row, Col } from 'react-bootstrap';

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
      <Row style={{ margin: 0 }}>
        <Col md={4} style={{ padding: 0 }}>
          <Toasts toasts={toasts} group={'付近の飲食店'} credit={(<> Powered by <a href="http://webservice.recruit.co.jp/">ホットペッパー Webサービス</a> </>)}/>
        </Col>
        <Col md={8} style={{ padding: 0 }}>
          <GoogleMap />
        </Col>
      </Row>
    </div>
  );
}

export default App;
