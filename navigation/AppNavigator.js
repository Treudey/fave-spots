import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PlacesScreen, { placesScreenOptions } from '../screens/PlacesScreen';
import EditPlaceScreen, { editPlaceScreenOptions } from '../screens/EditPlaceScreen';
import PlaceDetailsScreen, { placeDetailsScreenOptions } from '../screens/PlaceDetailsScreen';
import MapScreen from '../screens/MapScreen';
import COLORS from '../constants/colors';

const defaultStackOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? COLORS.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'ios' ? COLORS.primary : 'white' 

};

const PlacesStackNavigator = createStackNavigator();

const PlacesNavigator = () => {
  return <PlacesStackNavigator.Navigator screenOptions={defaultStackOptions}>
    <PlacesStackNavigator.Screen 
      name="Places"
      component={PlacesScreen}
      options={placesScreenOptions}
    />
    <PlacesStackNavigator.Screen 
      name="Edit"
      component={EditPlaceScreen}
      options={editPlaceScreenOptions}
    />
    <PlacesStackNavigator.Screen 
      name="Details"
      component={PlaceDetailsScreen}
      options={placeDetailsScreenOptions}
    />
    <PlacesStackNavigator.Screen 
      name="Map"
      component={MapScreen}
    />
  </PlacesStackNavigator.Navigator>;
};

const AppNavigator = props => {
  return <NavigationContainer>
    <PlacesNavigator />
  </NavigationContainer>;
};

export default AppNavigator;