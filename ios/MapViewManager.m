//
//  MapViewManager.m
//  GoogleMapSDK
//
//  Created by Galih Laras Prakoso on 10/3/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <React/RCTViewManager.h>

@interface
  RCT_EXTERN_MODULE(MapViewManager, RCTViewManager)
  RCT_EXPORT_VIEW_PROPERTY(defaultLatitude, NSNumber)
  RCT_EXPORT_VIEW_PROPERTY(defaultLongitude, NSNumber)
  RCT_EXPORT_VIEW_PROPERTY(zoomLevel, NSNumber)
  RCT_EXPORT_VIEW_PROPERTY(onLocationUpdated, RCTDirectEventBlock)
  RCT_EXPORT_VIEW_PROPERTY(onUserAllowed, RCTDirectEventBlock)
  RCT_EXPORT_VIEW_PROPERTY(onUserDenied, RCTDirectEventBlock)
  RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock)
  RCT_EXTERN_METHOD(
    updateCurrentLocation: (nonnull NSNumber *)node
    latitude: (nonnull NSNumber *)count
    longitude: (nonnull NSNumber *)count
  )
@end
