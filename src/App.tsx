import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import GoogleMap from './components/GoogleMap/GoogleMap';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header/>
      <GoogleMap/>
    </div>
  );
}

export default App;
