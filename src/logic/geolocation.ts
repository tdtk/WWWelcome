import { Pos } from '../App';


export const getPosition = (setFunc: (_pos: Pos) => void) => {
  const success: PositionCallback = (pos: Position) => {
    setFunc({ lat: pos.coords.latitude, lng: pos.coords.longitude});
  };
  const error: PositionErrorCallback = (e: PositionError) => {
    console.log(e);
  };
  navigator.geolocation.getCurrentPosition(success, error);
};

export const watchPosition = (setFunc: (_pos: Pos) => void) => {
  const success: PositionCallback = (pos: Position) => {
    setFunc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
  };
  const error: PositionErrorCallback = (e: PositionError) => {
    console.log(e);
  };
  navigator.geolocation.watchPosition(success, error);
};
