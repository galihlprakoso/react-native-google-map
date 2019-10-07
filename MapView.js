import React from 'react'
import { 
  StyleSheet, 
  Platform,
  requireNativeComponent
} from 'react-native'
import PropTypes from 'prop-types'
import useMapViewAndroidHook from './useMapViewAndroidHook'
import useMapViewIOSHook from './useMapViewIOSHook'

const RNMapView = requireNativeComponent('MapView')

const MapView = (props) => {

  const { updateCurrentLocation, setMapRef } = 
    Platform.OS === 'android' ? 
      useMapViewAndroidHook(props) : 
      useMapViewIOSHook()
  
  this.updateCurrentLocation = updateCurrentLocation

  return (
    <RNMapView
      ref={e => setMapRef(e)}
      style={[styles.container, props.style]}
      defaultLatitude={props.defaultLatitude}
      defaultLongitude={props.defaultLongitude}
      zoomLevel={props.zoomLevel}          
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
  onProviderStatusChanged: () => {}
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
  onProviderStatusChanged: PropTypes.func,
}

export default MapView

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})