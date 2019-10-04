import React from 'react'
import { StyleSheet, Text, View, requireNativeComponent } from 'react-native'

const MapView = requireNativeComponent('MapView')

export default () => {
  return (
    <MapView
      style={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})