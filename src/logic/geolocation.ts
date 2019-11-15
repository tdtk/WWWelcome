

export const getPosition = (setFunc: (crd: Coordinates) => void) => {
  const success: PositionCallback = (pos: Position) => {
    setFunc(pos.coords)
  };
  navigator.geolocation.getCurrentPosition(success);
};
