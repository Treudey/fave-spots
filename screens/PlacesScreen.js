import React, { useEffect } from 'react';
import { Platform, FlatList, Alert } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../components/HeaderButton';
import PlaceItem from '../components/PlaceItem';
import { loadPlaces, removePlace } from '../store/placesActions';

const PlacesScreen = props => {
  let places = useSelector(state => state.places.places);
  const dispatch = useDispatch();

  const fetchPlaces = () => {
    dispatch(loadPlaces());
  }; 

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', fetchPlaces);

    return () => unsubscribe();
  }, [fetchPlaces]);

  useEffect(() => fetchPlaces(), [fetchPlaces, dispatch]);

  const deleteHandler = id => {
    Alert.alert('Are you sure?', 'Do you really want to delete this spot?', [
      { text: 'No', style: 'default' },
      { 
        text: 'Yes',
        style: 'destructive', 
        onPress: () => dispatch(removePlace(id))
      }
    ]);
  };

  const editHandler = id => {
    props.navigation.navigate('Edit', { placeId: id });
  };

  return <FlatList 
    data={places} 
    keyExtractor={item => item.id} 
    renderItem={itemData => (
      <PlaceItem 
        image={itemData.item.imageURI} 
        title={itemData.item.title} 
        address={itemData.item.address} 
        onEdit={editHandler.bind(this, itemData.item.id)}
        onDelete={deleteHandler.bind(this, itemData.item.id)}
        onSelect={() => {
          props.navigation.navigate('Details', { 
            placeTitle: itemData.item.title, 
            placeId: itemData.item.id 
          });
        }}
      />
    )}
  />;
};

export const placesScreenOptions = navData => {
  return {
    headerTitle: 'Fave Spots',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title="Add" 
          iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'} 
          onPress={() => {
            navData.navigation.navigate('Edit');
          }} 
        />
      </HeaderButtons>
    )
  };
};

export default PlacesScreen;