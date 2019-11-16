import React, { useState, useEffect } from 'react';
import { PlaceList } from '../../App';

const maps = google.maps;

type GoogleMapProps = {
  placelist: PlaceList | null,
  crd: Coordinates | null,
  setCrd: (crd: Coordinates | null) => void
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
        google.maps.event.addDomListener(btn, "click", function () {
          alert('clicked me!');
        });
        distInfo.setContent(btn);
        distInfo.open(map, _distMarker);
        setDistMarker(_distMarker);
      }));
    }
  // eslint-disable-next-line
  }, [map, distMarker]);

  useEffect(() => {
    if(map){
      const crd = props.crd ? { lat: props.crd.latitude, lng: props.crd.longitude } : { lat: -25.344, lng: 131.036 };
      map.panTo(crd);
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
        if(props.crd){
          userMarker.setPosition(new maps.LatLng(props.crd.latitude, props.crd.longitude));
        }
        
      }
    }
  }, [props.crd, userMarker, map])
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