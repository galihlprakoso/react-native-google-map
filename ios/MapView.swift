//
//  MapView.swift
//  GoogleMapSDK
//
//  Created by Galih Laras Prakoso on 10/3/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit
import GoogleMaps



class MapView: UIView {
  
  private var marker: GMSMarker? = GMSMarker()
  @objc private var defaultLatitude: NSNumber = -6.285986
  @objc private var defaultLongitude: NSNumber = 106.825675
  @objc private var zoomLevel: NSNumber = 20.0
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    self.addSubview(map)
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  lazy var locationManager: CLLocationManager = {
    let mLocationManager = CLLocationManager()
    mLocationManager.desiredAccuracy = kCLLocationAccuracyBest
    mLocationManager.requestAlwaysAuthorization()
    mLocationManager.distanceFilter = 50
    mLocationManager.startUpdatingLocation()
    mLocationManager.delegate = self
    return mLocationManager
  }()
  
  lazy var map: GMSMapView = {
    var selectedLatitude = defaultLatitude.doubleValue
    var selectedLongitude = defaultLongitude.doubleValue
    if locationManager.location != nil {
      selectedLatitude = locationManager.location!.coordinate.latitude
      selectedLongitude = locationManager.location!.coordinate.longitude
    }
    let camera = GMSCameraPosition.camera(withLatitude: selectedLatitude, longitude: selectedLongitude, zoom: zoomLevel.floatValue)
    let mapView = GMSMapView.map(withFrame: CGRect.zero, camera: camera)
//    mapView.isMyLocationEnabled = true
//    mapView.settings.myLocationButton = true
    
    mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    mapView.delegate = self
    return mapView
  }()
  
  func updateCurrentLocation(latitude: NSNumber, longitude: NSNumber) {
    let camera = GMSCameraPosition.camera(withLatitude: latitude.doubleValue,
                                          longitude: longitude.doubleValue,
                                          zoom: zoomLevel.floatValue)
    if map.isHidden {
      map.isHidden = false
      map.camera = camera
    } else { map.animate(to: camera) }
  }
  
  @objc var onLocationUpdated: RCTDirectEventBlock?
  @objc var onUserAllowed: RCTDirectEventBlock?
  @objc var onUserDenied: RCTDirectEventBlock?
  @objc var onError: RCTDirectEventBlock?
}

extension MapView: GMSMapViewDelegate {
  func mapView(_ mapView: GMSMapView, didChange position: GMSCameraPosition) {
    marker?.map = nil
    marker = nil
    let changedPosition = CLLocationCoordinate2DMake(position.target.latitude, position.target.longitude)
//    let markerImage = UIImage(named: "sbox_pin")!.withRenderingMode(.alwaysTemplate)
//    let markerView = UIImageView(image: markerImage)
    marker = GMSMarker(position: changedPosition)
//    marker?.iconView = markerView
//    marker?.iconView?.sizeToFit()
    marker?.title = "Sayurbox"
    marker?.snippet = "Selected position"
    marker?.map = mapView
  }
  
  func mapView(_ mapView: GMSMapView, idleAt position: GMSCameraPosition) {
    if onLocationUpdated != nil {
      onLocationUpdated!([
        "latitude": position.target.latitude,
        "longitude": position.target.longitude
      ])
    }
  }
  
}

extension MapView: CLLocationManagerDelegate {
  
  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    switch status {
    case .restricted:
      if onUserDenied != nil { onUserDenied!(nil) }
      print("Location access was restricted.")
    case .denied:
      if onUserDenied != nil { onUserDenied!(nil) }
      print("User denied access to location.")
      // Display the map using the default location.
      map.isHidden = false
    case .notDetermined:
      print("Location status not determined.")
    case .authorizedAlways: fallthrough
    case .authorizedWhenInUse:
      if onUserAllowed != nil { onUserAllowed!(nil) }
      print("Location status is OK.")
    }
  }
  
  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    locationManager.stopUpdatingLocation()
    if onError != nil { onError!(["message": error]) }
    print("Error: \(error)")
  }
}
