import React, { useState, useCallback, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  Button, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import COLORS from '../constants/colors';
import { addPlace, editPlace } from '../store/placesActions';
import ImagePicker from '../components/ImagePicker';
import LocationPicker from '../components/LocationPicker';

const EditPlaceScreen = props => {
  const placeId = props.route.params ? props.route.params.placeId : null;
  const editedPlace = useSelector(state => {
    return state.places.places.find(p => p.id === placeId)
  });
  const title = editedPlace ? editedPlace.title : '';
  const image = editedPlace ? editedPlace.imageURI : '';
  const location = editedPlace ? { lat: editedPlace.lat, lng: editedPlace.lng } : '';
  const titleValid = editedPlace ? true : false;
  
  const [titleValue, setTitleValue] = useState(title);
  const [selectedImage, setSelectedImage] = useState(image);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [titleInputIsValid, setTitleInputIsValid] = useState(titleValid);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [newImageTaken, setNewImageTaken] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const titleChangeHandler = text => {
    let isValid = true;
    if (text.trim().length === 0) {
      isValid = false;
    }
    if (text.length < 2) {
      isValid = false;
    }
    if (text.length > 40) {
      isValid = false;
    }
    setTitleValue(text);
    setTitleInputIsValid(isValid);
  };

  const imageTakenHandler = image => {
    setSelectedImage(image);
    setNewImageTaken(true);
  };

  const locationPickedHandler = useCallback(coords => {
    setSelectedLocation(coords);
  }, []);

  const savePlaceHandler = useCallback(async () => {
    if (!titleInputIsValid || !selectedLocation || !selectedImage) {
      Alert.alert(
        'Invalid Input', 
        'Please check for errors in your input', 
        [{ text: 'Okay' }]
      );
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      if (editedPlace) {
        await dispatch(editPlace(
          placeId, titleValue, newImageTaken, selectedImage, selectedLocation
        ));
      } else {
        await dispatch(addPlace(titleValue, selectedImage, selectedLocation));
      }
      props.navigation.navigate('Places');
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, placeId, titleValue, newImageTaken, selectedImage, selectedLocation]);

  if (isLoading) {
    return <View style={styles.centered}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
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
    </KeyboardAvoidingView>
  );
};

export const editPlaceScreenOptions = navData => {
  const routeParams = navData.route.params ? navData.route.params : {};
  
  return {
    headerTitle: routeParams.placeId ? 'Edit Fave Spot' : 'Add New Spot'
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
  },
  centered: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
});

export default EditPlaceScreen;