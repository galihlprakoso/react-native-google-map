//
//  MapViewManager.swift
//  GoogleMapSDK
//
//  Created by Galih Laras Prakoso on 10/3/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import GoogleMaps

@objc(MapViewManager)
class MapViewManager: RCTViewManager {
  override func view() -> UIView! {
    return MapView()
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc func updateCurrentLocation(_ node: NSNumber, longitude: NSNumber, latitude: NSNumber) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(
        forReactTag: node
        ) as! MapView
      component.updateCurrentLocation(latitude: latitude, longitude: longitude)
    }
  }
}
