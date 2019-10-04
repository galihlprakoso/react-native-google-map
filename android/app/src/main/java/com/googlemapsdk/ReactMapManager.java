package com.googlemapsdk;

import android.app.Activity;
import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;


public class ReactMapManager extends SimpleViewManager<MapView> implements OnMapReadyCallback {

    MapView mapView;
    Marker marker;
    Activity activity;
    private double defaultLatitude = -6.285986;
    private double defaultLongitude = 106.825675;
    private float zoomLevel = 20.0f;

    @NonNull
    @Override
    public String getName() {
        return "MapView";
    }

    @NonNull
    @Override
    protected MapView createViewInstance(@NonNull ThemedReactContext reactContext) {
      activity = reactContext.getCurrentActivity();
      mapView = new MapView(reactContext);
      mapView.onCreate(null);
      mapView.getMapAsync(this);

      reactContext.addLifecycleEventListener(new LifecycleEventListener() {
          @Override
          public void onHostResume() {
              mapView.onResume();
          }

          @Override
          public void onHostPause() {
              mapView.onPause();
          }

          @Override
          public void onHostDestroy() {
              mapView.onDestroy();
          }
      });
      return mapView;
    }

    @Override
    public void onMapReady(GoogleMap map) {
        if(map != null) {
            map.getUiSettings().setMyLocationButtonEnabled(true);
            map.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(defaultLatitude, defaultLongitude), zoomLevel));
            MarkerOptions markerOptions = new MarkerOptions().position(map.getCameraPosition().target);
            marker = map.addMarker(markerOptions);

            map.setOnCameraMoveListener(() -> {
                LatLng position = map.getCameraPosition().target;
                marker.setPosition(position);
            });

            map.setOnCameraIdleListener(() -> {
                WritableMap payload = Arguments.createMap();
                LatLng position = map.getCameraPosition().target;
                payload.putDouble("latitude", position.latitude);
                payload.putDouble("longitude", position.longitude);
                ReactContext reactContext = (ReactContext) mapView.getContext();
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onLocationUpdated", payload);
            });
        }
    }
}
