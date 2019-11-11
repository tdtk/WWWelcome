import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import GoogleMap from './components/GoogleMap/GoogleMap';
import { fetchHotPepper, HotPepperResult } from './logic/hotpepper';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header/>
      <GoogleMap/>
    </div>
  );
}

fetchHotPepper({lat: 34.67, lng: 135.52, range: 5, order: 4}, (json: HotPepperResult) => {
  console.log(json);
});

export default App;
