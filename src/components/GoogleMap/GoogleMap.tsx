import React from 'react';
import GoogleMapReact from 'google-map-react';

const TestMap = ({text}: {lat: number, lng: number, text: string}) => <div>{text}</div>;

const GoogleMap: React.FC = () => {
  return (
    <div style={{ height: '80vh', width: '100%'}}>
      <GoogleMapReact bootstrapURLKeys={{key: process.env['REACT_APP_GOOGLEMAPS_API_KEY']!}} defaultCenter={{lat: 59.95, lng: 30.33}} defaultZoom={11}>
        <TestMap lat={59.955413} lng={30.337844} text="My Marker"/>
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMap;