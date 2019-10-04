import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView from './MapView'


export default () => {
  return (
    <MapView />
    // <Text>TEST</Text>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})