import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import COLORS from '../constants/colors';
import { addPlace, editPlace } from '../store/placesActions';
import ImagePicker from '../components/ImagePicker';
import LocationPicker from '../components/LocationPicker';

const EditPlaceScreen = props => {
  const placeId = props.route.params ? props.route.params.placeId : null;
  let location, title, image;
  if (placeId) {
    const place = useSelector(state => state.places.places.find(p => p.id === placeId));
    title = place.title;
    image = place.imageURI;
    location = { lat: place.lat, lng: place.lng };
  }
  
  const dispatch = useDispatch();

  const [titleValue, setTitleValue] = useState(title);
  const [selectedImage, setSelectedImage] = useState(image);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [newImageTaken, setNewImageTaken] = useState(false);

  const titleChangeHandler = text => {
    setTitleValue(text);
  };

  const imageTakenHandler = image => {
    setSelectedImage(image);
    setNewImageTaken(true);
  };

  const locationPickedHandler = useCallback(coords => {
    setSelectedLocation(coords);
  }, []);

  const savePlaceHandler = useCallback(() => {
    if (placeId) {
      dispatch(editPlace(placeId, titleValue, newImageTaken, selectedImage, selectedLocation));
    } else {
      dispatch(addPlace(titleValue, selectedImage, selectedLocation));
    }
    props.navigation.navigate('Places');
  });

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput 
          style={styles.textInput} 
          onChangeText={titleChangeHandler} 
          value={titleValue} 
        />
        <ImagePicker initialImage={image} onImageTaken={imageTakenHandler} />
        <LocationPicker 
          navigation={props.navigation} 
          route={props.route} 
          pickedLocation={placeId ? selectedLocation : null}
          onLocationPicked={locationPickedHandler} 
        />
        <Button 
          title={placeId ? 'Update Fave Spot' : 'Save Fave Spot'} 
          color={COLORS.primary} 
          onPress={savePlaceHandler} 
        />
      </View>
    </ScrollView>
  );
};

export const editPlaceScreenOptions = navData => {
  return {
    headerTitle: 'Add New Spot'
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2
  }
});

export default EditPlaceScreen;