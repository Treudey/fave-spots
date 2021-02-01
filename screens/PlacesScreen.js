import React, { useEffect, useState, useCallback } from 'react';
import { 
  Platform, 
  FlatList, 
  Alert, 
  View, 
  Text, 
  StyleSheet,
  Button, 
  ActivityIndicator 
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../components/HeaderButton';
import PlaceItem from '../components/PlaceItem';
import { loadPlaces, removePlace } from '../store/placesActions';
import Colors from '../constants/colors';

const PlacesScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const places = useSelector(state => state.places.places);
  const dispatch = useDispatch();

  const fetchPlaces = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      dispatch(loadPlaces());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch]); 

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', fetchPlaces);

    return () => unsubscribe();
  }, [fetchPlaces]);

  useEffect(() => {
    setIsLoading(true);
    fetchPlaces().then(() => setIsLoading(false));
  }, [fetchPlaces, dispatch]);

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

  if (error) {
    return <View style={styles.centered}>
      <Text>An error occured!</Text>
      <Button title="Try Again" onPress={fetchPlaces} color={Colors.primary} />
    </View>
  }

  if (isLoading) {
    return <View style={styles.centered}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  }

  if (!isLoading && places.length === 0) {
    return <View style={styles.centered}>
      <Text>No spots found. Start adding some!</Text>
    </View>
  }

  return <FlatList 
    data={places} 
    keyExtractor={item => item.id} 
    onRefresh={fetchPlaces}
    refreshing={isRefreshing}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  },
  list: {
    width: '100%'
  },
  centered: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
});

export default PlacesScreen;