import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import GoogleMap from './components/GoogleMap/GoogleMap';
import { fetchHotPepper, HotPepperResult } from './logic/hotpepper';
import { getPosition } from './logic/geolocation';
import { calcDistance } from './logic/distance';
import Toasts, {ToastData} from './components/Toasts/Toasts';
import { Container, Row, Col } from 'react-bootstrap';

const HotpepperCredit = <> Powered by <a href="http://webservice.recruit.co.jp/">ホットペッパー Webサービス</a> </>;

export type PageType = 'list' | 'detail';

type PlaceList = {
  group: string,
  toasts: ToastData[],
  credit: JSX.Element
}

type ListProps = {
  placelists: PlaceList[],
  setPagetype: (ty: PageType) => void
}

const List: React.FC<ListProps> = (props) => {
  return(
    <Row style={{ margin: 0 }}>
      {props.placelists.map((placelist, key) => (
        <Col key={key} md={6} lg={3}>
          <Toasts toasts={placelist.toasts} group={placelist.group} credit={placelist.credit} onClick={() => props.setPagetype('detail')} />
        </Col>
      ))}
    </Row>
  );
};

const Detail: React.FC = () => {
  return (
    <Row style={{ margin: 0 }}>
      <Col sm={12} md={8} style={{ padding: 0 }}>
        <GoogleMap />
      </Col>
    </Row>
  )
};

const App: React.FC = () => {
  const [placelists, setPlacelists] = useState([] as PlaceList[]);
  const [pagetype, setPagetype] = useState('list' as PageType);
  const [crd, setCrd] = useState(null as Coordinates | null);
  getPosition(setCrd);

  useEffect(() => {
    setPlacelists([]);
    if(crd){
      fetchHotPepper({ lat: crd.latitude, lng: crd.longitude, range: 5, order: 4 }, (json: HotPepperResult) => {
        console.log(json);
        const shop_info: ToastData[] = json.results.shop.map((shop) => {
          return { title: shop.name, dist: calcDistance({ lat: crd.latitude, lng: crd.longitude }, { lat: shop.lat, lng: shop.lng }), body: shop.catch }
        });
        shop_info.sort((a, b) => {
          if (a.dist < b.dist) {
            return -1;
          } else if (a.dist > b.dist) {
            return 1;
          } else {
            return 0;
          }
        });
        setPlacelists(p => p.concat([{ group: '付近の飲食店', toasts: shop_info, credit: HotpepperCredit }]))
      });
      fetchHotPepper({ lat: crd.latitude, lng: crd.longitude, range: 5, order: 4 }, (json: HotPepperResult) => {
        console.log(json);
        const shop_info: ToastData[] = json.results.shop.map((shop) => {
          return { title: shop.name, dist: calcDistance({ lat: crd.latitude, lng: crd.longitude }, { lat: shop.lat, lng: shop.lng }), body: shop.catch }
        });
        shop_info.sort((a, b) => {
          if(a.dist < b.dist){
            return -1;
          }else if(a.dist > b.dist){
            return 1;
          }else{
            return 0;
          }
        });
        setPlacelists(p => p.concat([{ group: '付近の飲食店', toasts: shop_info, credit: HotpepperCredit }]))
      });
    }
    
  }, [crd]);

  return (
    <div className="App">
      <Header/>
      <div style={{marginTop: '56px'}}>
        <Container fluid={true} style={{ visibility: pagetype === 'list' ? 'visible' : 'hidden', position: 'absolute'}} >
          <List placelists={placelists} setPagetype={setPagetype}/>
        </Container>
        <Container fluid={true} style={{ visibility: pagetype === 'detail' ? 'visible' : 'hidden', position: 'absolute', width: '100%', height: '100%'}} >
          <Detail />
        </Container>
      </div>
    </div>
  );
}

export default App;
