import React, { useEffect } from 'react'
import { StyleSheet, Text, View, requireNativeComponent, Platform, DeviceEventEmitter, PermissionsAndroid } from 'react-native'
import PropTypes from 'prop-types'

const RNMapView = requireNativeComponent('MapView')

const MapView = ({
  style,
  defaultLatitude,
  defaultLongitude,
  zoomLevel,
  onLocationUpdated,
  onUserAllowed,
  onUserDenied,
  onError,
}) => {
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

  //IOS
  if(Platform.OS === 'ios') {
    return (
      <RNMapView
        ref={e => mapRef = e}
        style={[styles.container, style]}
        defaultLatitude={defaultLatitude}
        defaultLongitude={defaultLongitude}
        zoomLevel={zoomLevel}
        onLocationUpdated={onLocationUpdated}
        onUserAllowed={onUserAllowed}
        onUserDenied={onUserDenied}
        onError={onError}
      />
    )
  }

  //Android
  DeviceEventEmitter.addListener('onLocationUpdated', (data) => {
    onLocationUpdated(data)
  })

  //Request permissions
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
      onError()
    }
  }

  useEffect(() => {
    requestLocationPermission()
  },[])

  return (
    <RNMapView
      ref={e => mapRef = e}
      style={[styles.container, style]}
      defaultLatitude={defaultLatitude}
      defaultLongitude={defaultLongitude}
      zoomLevel={zoomLevel}
    />
  )
}

MapView.defaultProps = {
  style: {},
  defaultLatitude: -6.285986,
  defaultLongitude: 106.825675,
  zoomLevel: 20.0,
  onLocationUpdated: () => {},
  onUserAllowed: () => {},
  onUserDenied: () => {},
  onError: () => {},
}

MapView.propTypes = {
  style: PropTypes.object,
  defaultLatitude: PropTypes.number,
  defaultLongitude: PropTypes.number,
  zoomLevel: PropTypes.number,
  onLocationUpdated: PropTypes.func,
  onUserAllowed: PropTypes.func,
  onUserDenied: PropTypes.func,
  onError: PropTypes.func,
}

export default MapView

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})