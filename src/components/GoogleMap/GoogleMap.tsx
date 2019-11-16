import React, { useState, useEffect } from 'react';
import { PlaceList, Pos } from '../../App';

const maps = google.maps;

type GoogleMapProps = {
  placelist: PlaceList | null,
  userCrd: Pos | null,
  crd: Pos | null,
  setCrd: (crd: Pos | null) => void
};


const GoogleMap: React.FC<GoogleMapProps> = (props) => {
  const [map, setMap] = useState(null as google.maps.Map | null);
  const [markers, setMarkers] = useState([] as google.maps.Marker[]);
  const [userMarker, setUserMarker] = useState(null as google.maps.Marker | null);
  const [distMarker, setDistMarker] = useState(null as google.maps.Marker | null);
  const [distMarkerClickedListener, setDistMarkerClickedListener] = useState(null as null | google.maps.MapsEventListener);

  useEffect(() => {
    const _map = new maps.Map(document.getElementById('map')!, { zoom: 17, center: { lat: -25.344, lng: 131.036 } });
    setMap(_map);
  }, []);

  useEffect(() => {
    if(map){
      if(distMarkerClickedListener){
        maps.event.removeListener(distMarkerClickedListener);
      }
      setDistMarkerClickedListener(map.addListener('click', (handler: { latLng: google.maps.LatLng, event: google.maps.MouseEvent, pixel: { x: number, y: number } }, qa: { x: number, y: number }) => {
        if (distMarker) {
          distMarker.setMap(null);
        }
        const _distMarker = new maps.Marker({
          position: handler.latLng,
          animation: google.maps.Animation.DROP,
          map: map
        });
        const distInfo = new google.maps.InfoWindow({content: ''});
        const btn = document.createElement("button");
        btn.className = 'btn btn-primary';
        btn.innerText = 'この周辺を探す';
        const _pos = { lat: handler.latLng.lat(), lng: handler.latLng.lng() };
        google.maps.event.addDomListener(btn, "click", () => {
          props.setCrd(_pos);
        });
        distInfo.setContent(btn);
        distInfo.open(map, _distMarker);
        setDistMarker(_distMarker);
      }));
    }
  // eslint-disable-next-line
  }, [map, distMarker]);

  useEffect(() => {
    if(map && props.crd){
      map.panTo(props.crd);
    }
  }, [map, props.crd]);

  useEffect(() => {
    if(map){
      const crd = props.userCrd ? { lat: props.userCrd.lat, lng: props.userCrd.lng } : { lat: -25.344, lng: 131.036 };
      if(!userMarker){
        const _userMarker = new maps.Marker({
          position: new maps.LatLng(crd),
          animation: google.maps.Animation.BOUNCE,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'blue',
            strokeColor: 'blue',
            scale: 8,
          },
          map: map
        });
        var uminfo = new google.maps.InfoWindow({
          content: `
        <div>現在地</div>
        `
        });
        _userMarker.addListener('mouseover', () => { uminfo.open(map, _userMarker); });
        _userMarker.addListener('mouseout', () => { uminfo.close(); });
        _userMarker.addListener('mouseup', () => { uminfo.open(map, _userMarker); });
        _userMarker.addListener('mousedown', () => { uminfo.open(map, _userMarker); });
        setUserMarker(_userMarker);
      }else{
        if(props.userCrd){
          userMarker.setPosition(new maps.LatLng(props.userCrd.lat, props.userCrd.lng));
        }
        
      }
    }
  }, [props.userCrd, userMarker, map])
  useEffect(() => {
    if (map && props.placelist){
      console.log(props.placelist)
      markers.map((marker) => marker.setMap(null));
      setMarkers(props.placelist.places.map((place) => new maps.Marker({
        position: new maps.LatLng(place.crd),
        label: place.name,
        animation: google.maps.Animation.DROP,
        map: map})))
    }
  // eslint-disable-next-line
  }, [props.placelist, map]);
  return (
    <div id='map' style={{ height: '80vh', width: '100%'}}></div>
  );
};

export default GoogleMap;