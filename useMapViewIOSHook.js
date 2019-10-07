const useMapViewIOSHook = () => {
  let mapRef

  const updateCurrentLocation = (latitude, longitude) => {
    if(mapRef) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(mapRef),
        UIManager["MapView"].Commands.updateCurrentLocation,
        [latitude, longitude]
      )   
    }
  }

  const setMapRef = (newMapRef) => {
    mapRef = newMapRef
  }

  return {
    updateCurrentLocation,
    setMapRef
  }
}

export default useMapViewIOSHook