import * as FileSystem from 'expo-file-system';

import { ADD_PLACE, DELETE_PLACE, SET_PLACES, UPDATE_PLACE } from "./placesActions";
import Place from '../models/Place';

const initialState = {
  places: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PLACES:
      return { 
        places: action.places.map(
          pl => new Place(
            pl.id.toString(), 
            pl.title, 
            pl.imageURI,
            pl.address,
            pl.lat,
            pl.lng
          )
        ) 
      };
    case ADD_PLACE:
      const newPlace = new Place(
        action.placeData.id.toString(),
        action.placeData.title,
        action.placeData.image,
        action.placeData.address,
        action.placeData.coords.lat,
        action.placeData.coords.lng
      );
      return { places: state.places.concat(newPlace) };
    case DELETE_PLACE:
      const removalIndex = state.places.findIndex(p => p.id === action.pid);
      FileSystem.deleteAsync(state.places[removalIndex].imageURI)
        .catch(err => {
          console.log(err);
        });
      return { places: state.places.filter(p => p.id !== action.pid) };
    case UPDATE_PLACE:
      const updatedPlaces = state.places;
      const updateIndex = updatedPlaces.findIndex(p => p.id === action.placeData.id);
      if (action.placeData.image !== updatedPlaces[updateIndex].imageURI) {
        FileSystem.deleteAsync(updatedPlaces[updateIndex].imageURI)
        .catch(err => {
          console.log(err);
        });
        updatedPlaces[updateIndex].imageURI = action.placeData.image;
      }
      updatedPlaces[updateIndex].title = action.placeData.title;
      updatedPlaces[updateIndex].address = action.placeData.address;
      updatedPlaces[updateIndex].lat = action.placeData.coords.lat;
      updatedPlaces[updateIndex].lng = action.placeData.coords.lng;
      return { places: updatedPlaces };
    default:
      return state;
  }
};