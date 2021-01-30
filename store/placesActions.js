import * as FileSystem from 'expo-file-system';


import { insertPlace, fetchPlaces, deletePlace, updatePlace } from '../helpers/db'; 
import ENV from '../env';

export const ADD_PLACE = 'ADD_PLACE';
export const SET_PLACES = 'SET_PLACES';
export const DELETE_PLACE = 'DELETE_PLACE';
export const UPDATE_PLACE = 'UPDATE_PLACE';

export const addPlace = (title, image, location) => {
  return async dispatch => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${ENV.googleApiKey}`);

    if (!response.ok) {
      console.log(response);
      throw new Error('something went wrong!');
    }

    const resData = await response.json();
    if (!resData.results) {
      throw new Error('something went wrong!');
    }

    const address = resData.results[0].formatted_address;
    const fileName = image.split('/').pop();
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.moveAsync({ 
        from: image,
        to: newPath
      });
      const dbResult = await insertPlace(title, newPath, address, location.lat, location.lng);
      console.log(dbResult);
      dispatch({ type: ADD_PLACE, placeData: { 
        id: dbResult.insertId, 
        title, 
        image: newPath,
        address,
        coords: location
      }});
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async dispatch => {
    try {
      const dbResult = await fetchPlaces();
      dispatch({ type: SET_PLACES, places: dbResult.rows._array });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const removePlace = (placeId) => {

  return async dispatch => {
    try {
      const dbResult = await deletePlace(placeId);
      console.log(dbResult);
      dispatch({ type: DELETE_PLACE, pid: placeId });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const editPlace = (id, title, imageTaken, image, location) => {
  return async dispatch => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${ENV.googleApiKey}`);

    if (!response.ok) {
      console.log(response);
      throw new Error('something went wrong!');
    }

    const resData = await response.json();
    if (!resData.results) {
      throw new Error('something went wrong!');
    }

    const address = resData.results[0].formatted_address;
    const fileName = image.split('/').pop();
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      if (imageTaken) {
        await FileSystem.moveAsync({ 
          from: image,
          to: newPath
        });
      }
      const dbResult = await updatePlace(id, title, newPath, address, location.lat, location.lng);
      console.log(dbResult);
      dispatch({ type: UPDATE_PLACE, placeData: { 
        id, 
        title, 
        image: newPath,
        address,
        coords: location
      }});
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};