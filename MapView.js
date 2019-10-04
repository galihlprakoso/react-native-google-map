import React from 'react'
import { StyleSheet, Text, View, requireNativeComponent } from 'react-native'
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