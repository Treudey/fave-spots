import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import colors from '../constants/colors';

const MapScreen = props => {
  const initialLocation = props.route.params ? props.route.params.initialLocation : null;
  const readonly = props.route.params ? props.route.params.readonly : null;

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const intialRegion = {
    latitude: selectedLocation ? selectedLocation.lat : 43.67,
    longitude: selectedLocation ? selectedLocation.lng : -79.38,
    latitudeDelta: selectedLocation ? 0.0128 : 0.0928,
    longitudeDelta: selectedLocation ? 0.01421 : 0.09421
  };
  const [mapRegion, setMapRegion] = useState(intialRegion);

  const selectLocationHandler = event => {
    if (readonly) {
      return;
    }
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude
    });
  };

  const regionChangeHandler = region => {
    setMapRegion(region);
  };

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      // could show alert
      return;
    }
    props.navigation.navigate('Edit', { pickedLocation: selectedLocation });
  }, [selectedLocation]);

  useEffect(() => {
    if (!readonly) {
      props.navigation.setOptions({ 
        headerRight: () => (
          <TouchableOpacity style={styles.headerButton} onPress={savePickedLocationHandler}>
            <Text style={styles.headerButtonText}>Save</Text>
          </TouchableOpacity>
        )
      });
    }
  }, [savePickedLocationHandler]);

  let markerCoords;

  if (selectedLocation) {
    markerCoords = { 
      latitude: selectedLocation.lat, 
      longitude: selectedLocation.lng 
    };
  }

  return <MapView 
    style={styles.map} 
    region={mapRegion} 
    onRegionChangeComplete={regionChangeHandler}
    onPress={selectLocationHandler}
  >
    {markerCoords && <Marker title='Picked Location' coordinate={markerCoords}></Marker>}
  </MapView>;
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  headerButton: {
    marginHorizontal: 20
  },
  headerButtonText: {
    fontSize: 16,
    color: Platform.OS === 'android' ? 'white' : colors.primary
  }
});

export default MapScreen;