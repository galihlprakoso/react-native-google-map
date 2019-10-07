import { useEffect } from 'react'
import { DeviceEventEmitter, PermissionsAndroid, NativeModules } from 'react-native'

const useMapViewAndroidHook = ({
  onLocationUpdated,
  onUserAllowed,
  onUserDenied,
  onError,
  onProviderStatusChanged //Also implement it on iOS
}) => {
  let mapRef

  const updateCurrentLocation = (latitude, longitude) => {
    if(mapRef) {
      //Implement update location on android
    }
  }

  const setMapRef = (newMapRef) => {
    mapRef = newMapRef
  }

  DeviceEventEmitter.addListener('onLocationUpdated', (data) => {
    onLocationUpdated(data)
  })

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Izin akses lokasi',
          message:
            'Izinkan Sayurbox untuk mengakses lokasi anda.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        onUserAllowed()
      } else {
        onUserDenied()
      }
    } catch (err) {
      onError(err)
    }
  }  

  useEffect(() => {
    requestLocationPermission()
  },[])  

  return {
    updateCurrentLocation,
    setMapRef
  }
}

export default useMapViewAndroidHook