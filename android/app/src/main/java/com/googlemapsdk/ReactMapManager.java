package com.googlemapsdk;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.telecom.Call;
import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;


public class ReactMapManager extends SimpleViewManager<MapView> implements OnMapReadyCallback {

    private MapView mapView;
    private Marker marker;
    private Activity activity;
    private GoogleMap mMap;
    private float zoomLevel = 20.0f;

    private LifecycleEventListener lifecycleEventListener = new LifecycleEventListener() {
        @Override
        public void onHostResume() { mapView.onResume(); }
        @Override
        public void onHostPause() { mapView.onPause(); }
        @Override
        public void onHostDestroy() {
            mapView.onDestroy();
        }
    };

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
      reactContext.addLifecycleEventListener(lifecycleEventListener);
      return mapView;
    }

    @Override
    public void onMapReady(GoogleMap map) {
        if(map != null) {
            mMap = map;
            map.getUiSettings().setMyLocationButtonEnabled(true);
            double defaultLatitude = -6.285986;
            double defaultLongitude = 106.825675;
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

            this.getLocation(args -> {}, args -> {});
        }
    }

    @SuppressLint("MissingPermission")
    private void getLocation(Callback errorCallback, Callback onProviderStatusChange) {
        try {
            LocationManager mLocationManager = (LocationManager)activity.getSystemService(Context.LOCATION_SERVICE);
            boolean gpsEnabled = mLocationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);

            if (!gpsEnabled) {
                Intent settingsIntent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                activity.startActivity(settingsIntent);
            } else {
                mLocationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 10,
                    new LocationListener() {
                        @Override
                        public void onLocationChanged(Location location) {}
                        @Override
                        public void onStatusChanged(String provider, int status, Bundle extras) {}
                        @Override
                        public void onProviderEnabled(String provider) {
                            onProviderStatusChange.invoke("ENABLED");
                        }
                        @Override
                        public void onProviderDisabled(String provider) {
                            onProviderStatusChange.invoke("DISABLED");
                        }
                    });
                Location lastLocation = mLocationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                if(lastLocation != null) {
                    updateMapLocation(lastLocation.getLatitude(), lastLocation.getLongitude());
                }
            }
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    private void updateMapLocation(double latitude, double longitude) {
        if(mMap != null) {
            LatLng newLocation = new LatLng(latitude, longitude);
            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(newLocation, zoomLevel));
            marker.setPosition(newLocation);
        }
    }

}
