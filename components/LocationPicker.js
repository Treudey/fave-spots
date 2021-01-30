import React, { useState, useEffect } from 'react';
import { View, Button, Text, ActivityIndicator, Alert, StyleSheet} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import COLORS from '../constants/colors';
import MapPreview from './MapPreview';

const LocationPicker = props => {
  const [pickedLocation, setPickedLocation] = useState(props.pickedLocation);
  const [isFetching, setIsFetching] = useState(false);

  const mapPickedLocation = props.route.params ? props.route.params.pickedLocation : null;

  const { onLocationPicked } = props;

  useEffect(() => {
    if(mapPickedLocation) {
      setPickedLocation(mapPickedLocation);
      onLocationPicked(mapPickedLocation);
    }
  }, [mapPickedLocation, onLocationPicked]);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!', 
        'You need to grant location permissions to use this app',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };
  
  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({ timeout: 5000 });
      const locationCoords = { lat: location.coords. latitude, lng: location.coords.longitude };
      setPickedLocation(locationCoords);
      onLocationPicked(locationCoords);
    } catch (err) {
      Alert.alert(
        'Could not fetch location!', 
        'Please try again later or pick a location on the map',
        [{ text: 'Okay' }]  
      );
    }
    setIsFetching(false);
  };

  const pickOnMapHandler = () => {
    if (pickedLocation) {
      props.navigation.navigate('Map', { initialLocation: pickedLocation });
    } else {
      props.navigation.navigate('Map');
    }
  };

  return (
    <View style={styles.container}>
      <MapPreview style={styles.mapPreview} location={pickedLocation} onPress={pickOnMapHandler}>
        {isFetching ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <Text>No location picked yet!</Text>
        )}
      </MapPreview>
      <View style={styles.actions}>
        <Button 
          title="Get User Location"
          color={COLORS.primary}
          onPress={getLocationHandler}
        />
        <Button 
          title="Pick On Map"
          color={COLORS.primary}
          onPress={pickOnMapHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15
  },
  mapPreview: {
    marginBottom: 10,
    width: '100%',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  }
});

export default LocationPicker;