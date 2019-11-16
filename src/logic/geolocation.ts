

export const getPosition = (setFunc: (crd: Coordinates) => void) => {
  const success: PositionCallback = (pos: Position) => {
    setFunc(pos.coords);
  };
  const error: PositionErrorCallback = (e: PositionError) => {
    console.log(e);
  };
  navigator.geolocation.getCurrentPosition(success, error);
};

export const watchPosition = (setFunc: (crd: Coordinates) => void) => {
  const success: PositionCallback = (pos: Position) => {
    setFunc(pos.coords);
  };
  const error: PositionErrorCallback = (e: PositionError) => {
    console.log(e);
  };
  navigator.geolocation.watchPosition(success, error);
};
