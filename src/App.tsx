import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import GoogleMap from './components/GoogleMap/GoogleMap';
import Detail from './components/Detail/Detail';
import { fetchHotPepper, HotPepperResult } from './logic/hotpepper';
import { getPosition } from './logic/geolocation';
import { calcDistance } from './logic/distance';
import Toasts from './components/Toasts/Toasts';
import { Container, Row, Col } from 'react-bootstrap';
import { Map } from 'immutable'; 

const HotpepperCredit = <> Powered by <a href="http://webservice.recruit.co.jp/">ホットペッパー Webサービス</a> </>;

export type PageType = 'list' | 'map';

export type PlaceData = {
  name: string,
  detail: string,
  dist: number,
  crd: {lat: number, lng: number}
};

export type PlaceList = {
  group: string,
  places: PlaceData[],
  credit: JSX.Element
}

type ListViewProps = {
  placelists: Map<string, PlaceList>,
  onClick: (group: string) => (idx: number) => void
}

const ListView: React.FC<ListViewProps> = (props) => {
  return(
    <Row style={{ margin: 0 }}>
      {Object.keys(props.placelists.toObject()).map((pl_key: string, key) => (
        <Col key={key} md={6} lg={3}>
          <Toasts toasts={props.placelists.get(pl_key)!.places.map((pd) => ({ title: pd.name, dist: pd.dist, body: pd.detail }))} group={props.placelists.get(pl_key)!.group} credit={props.placelists.get(pl_key)!.credit} onClick={props.onClick(props.placelists.get(pl_key)!.group)} />
        </Col>
      ))}
    </Row>
  );
};

type MapViewProps = {
  placelist: PlaceList | null,
  crd: Coordinates | null,
  selectedIndex: number | null,
  setCrd: (crd: Coordinates | null) => void
};

const MapView: React.FC<MapViewProps> = (props) => {
  return (
    <Row>
      <Col sm={12} md={8}>
        <GoogleMap {...props}/>
      </Col>
      <Col sm={12} md={4}>
        {((props.selectedIndex !== null) && props.placelist) ? <Detail place={props.placelist.places[props.selectedIndex]}/> : null}
      </Col>
    </Row>
  )
};

const App: React.FC = () => {
  const [placelists, setPlacelists] = useState(Map({}) as Map<string, PlaceList>);
  const [pagetype, setPagetype] = useState('list' as PageType);
  const [crd, setCrd] = useState(null as Coordinates | null);
  const [selectedGroup, setSelectedGroup] = useState(null as null | string);
  const [selectedIndex, setSelectedIndex] = useState(null as null | number);

  useEffect(() => {
    getPosition(setCrd);
    const getSometimes = (msec: number) => {
      setTimeout(() => {
        getPosition(setCrd);
        getSometimes(msec);
      }, msec);
    };
    getSometimes(30000);
  }, []);

  useEffect(() => {
    if(crd){
      fetchHotPepper({ lat: crd.latitude, lng: crd.longitude, range: 5, order: 4 }, (json: HotPepperResult) => {
        console.log(json);
        const shop_info: PlaceData[] = json.results.shop.map((shop) => {
          return { name: shop.name, dist: calcDistance({ lat: crd.latitude, lng: crd.longitude }, { lat: Number(shop.lat), lng: Number(shop.lng) }), detail: shop.catch, crd: { lat: Number(shop.lat), lng: Number(shop.lng) } }
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
        setPlacelists(p => p.set('付近の飲食店', { group: '付近の飲食店', places: shop_info, credit: HotpepperCredit }))
      });
    }
    
  }, [crd]);

  const onListClick = (group: string) => (idx: number) => {
    setPagetype('map');
    setSelectedGroup(group);
    setSelectedIndex(idx);
  };

  return (
    <div className="App">
      <Header pagetype={pagetype} setPagetype={setPagetype}/>
      <div style={{marginTop: '56px'}}>
        <Container fluid={true} style={{ visibility: pagetype === 'list' ? 'visible' : 'hidden', position: 'absolute'}} >
          <ListView placelists={placelists} onClick={onListClick}/>
        </Container>
        <Container fluid={true} style={{ visibility: pagetype === 'map' ? 'visible' : 'hidden', position: 'absolute', width: '100%', height: '100%'}} >
          <MapView placelist={selectedGroup ? placelists.get(selectedGroup)! : null} selectedIndex={selectedIndex} crd={crd} setCrd={setCrd} />
        </Container>
      </div>
    </div>
  );
}

export default App;
