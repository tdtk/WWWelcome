import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import GoogleMap from './components/GoogleMap/GoogleMap';
import Detail from './components/Detail/Detail';
import { fetchHotPepper, HotPepperResult } from './logic/hotpepper';
import { yahoo } from './logic/yahoo';
import { getPosition } from './logic/geolocation';
import { calcDistance } from './logic/distance';
import Toasts from './components/Toasts/Toasts';
import { Container, Row, Col } from 'react-bootstrap';
import { Map } from 'immutable'; 

const HotpepperCredit = <> Powered by <a href="http://webservice.recruit.co.jp/">ホットペッパー Webサービス</a> </>;
const YahooCredit = <><a href="https://developer.yahoo.co.jp/about">Webサービス by Yahoo! JAPAN</a></>;

export type Pos = {lat: number, lng: number};

export type PageType = 'list' | 'map';

type Fet = {
  Geometry:{
    Coordinates: string,
    Type: string
  }
  Gid: string,
  Id: string,
  Name: string,
  CatchCopy: string,
  Property: {
    Address: string,
    Genre: {Code: string, Name: string}[],
    Tel1: string
  }
};

type YahooResponce = {
  Feature: Fet[]
};

export type PlaceData = {
  name: string,
  address: string,
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
  crd: Pos | null,
  userCrd: Pos | null,
  selectedIndex: number | null,
  setCrd: (crd: Pos | null) => void
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
  const [crd, setCrd] = useState(null as Pos | null);
  const [userCrd, setUserCrd] = useState(null as Pos | null);
  const [selectedGroup, setSelectedGroup] = useState(null as null | string);
  const [selectedIndex, setSelectedIndex] = useState(null as null | number);

  useEffect(() => {
    getPosition(setCrd);
    getPosition(setUserCrd);
    const getSometimes = (msec: number) => {
      setTimeout(() => {
        getPosition(setUserCrd);
        getSometimes(msec);
      }, msec);
    };
    getSometimes(30000);
  }, []);

  useEffect(() => {
    if(crd){
      fetchHotPepper({ lat: crd.lat, lng: crd.lng, range: 5, order: 4 }, (json: HotPepperResult) => {
        console.log(json);
        const shop_info: PlaceData[] = json.results.shop.map((shop) => {
          return { name: shop.name, dist: calcDistance({ lat: crd.lat, lng: crd.lng }, { lat: Number(shop.lat), lng: Number(shop.lng) }), detail: shop.catch, crd: { lat: Number(shop.lat), lng: Number(shop.lng) }, address: shop.address }
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
        setPlacelists(p => p.set('付近の飲食店', { group: '付近の飲食店', places: shop_info, credit: HotpepperCredit }));
      });
      yahoo(crd.lat, crd.lng, 500, 10, 'cafe', (json: YahooResponce) => {
        if(!json.Feature){
          console.log(json);
          return 
        }
        const places: PlaceData[] = json.Feature.map((fet: Fet) => {
          const [lng, lat] = fet.Geometry.Coordinates.split(',').map((s) => Number(s));
          const detail = fet.Property.Genre.map((g) => g.Name).reduce((pre, cur) => `${pre}, ${cur}`);
          return { name: fet.Name, dist: calcDistance({ lat: crd.lat, lng: crd.lng }, { lat: lat, lng: lng }), detail: detail, crd: { lat: lat, lng: lng }, address: fet.Property.Address};
        });
        places.sort((a, b) => {
          if (a.dist < b.dist) {
            return -1;
          } else if (a.dist > b.dist) {
            return 1;
          } else {
            return 0;
          }
        });
        setPlacelists(p => p.set('付近のカフェ', { group: '付近のカフェ', places: places, credit: YahooCredit }));
      });
      yahoo(crd.lat, crd.lng, 500, 10, 'fashion', (json: YahooResponce) => {
        if (!json.Feature) {
          console.log(json);
          return
        }
        console.log(json);
        const places: PlaceData[] = json.Feature.map((fet: Fet) => {
          const [lng, lat] = fet.Geometry.Coordinates.split(',').map((s) => Number(s));
          const detail = fet.Property.Genre.map((g) => g.Name).reduce((pre, cur) => `${pre}, ${cur}`);
          return { name: fet.Name, dist: calcDistance({ lat: crd.lat, lng: crd.lng }, { lat: lat, lng: lng }), detail: detail, crd: { lat: lat, lng: lng }, address: fet.Property.Address };
        });
        places.sort((a, b) => {
          if (a.dist < b.dist) {
            return -1;
          } else if (a.dist > b.dist) {
            return 1;
          } else {
            return 0;
          }
        });
        setPlacelists(p => p.set('付近の洋服屋', { group: '付近の洋服屋', places: places, credit: YahooCredit }));
        yahoo(crd.lat, crd.lng, 500, 10, 'transportation', (json: YahooResponce) => {
          if (!json.Feature) {
            console.log(json);
            return
          }
          const places: PlaceData[] = json.Feature.map((fet: Fet) => {
            const [lng, lat] = fet.Geometry.Coordinates.split(',').map((s) => Number(s));
            const detail = fet.Property.Genre.map((g) => g.Name).reduce((pre, cur) => `${pre}, ${cur}`);
            return { name: fet.Name, dist: calcDistance({ lat: crd.lat, lng: crd.lng }, { lat: lat, lng: lng }), detail: detail, crd: { lat: lat, lng: lng }, address: fet.Property.Address };
          });
          places.sort((a, b) => {
            if (a.dist < b.dist) {
              return -1;
            } else if (a.dist > b.dist) {
              return 1;
            } else {
              return 0;
            }
          });
          setPlacelists(p => p.set('付近の交通機関', { group: '付近の交通機関', places: places, credit: YahooCredit }));
        });
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
          <MapView placelist={selectedGroup ? placelists.get(selectedGroup)! : null} selectedIndex={selectedIndex} crd={crd} userCrd={userCrd} setCrd={setCrd} />
        </Container>
      </div>
    </div>
  );
}

export default App;
