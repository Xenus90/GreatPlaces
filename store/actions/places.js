import * as FileSystem from 'expo-file-system';

import { insertPlace, fetchPlaces } from '../../helpers/db';
import ENV from '../../env';

export const ADD_PLACE = 'ADD_PLACE';
export const LOAD_PLACES = 'LOAD_PLACES';

export const addPlace = (title, image, location) => {
    return async dispatch => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${ENV.googleApiKey}`);

        if (!response.ok) {
            throw new Error('Something went wrong with getting the address from Google API');
        };

        const responseData = await response.json();

        if (!responseData.results) {
            throw new Error('Something went wrong with getting the address from Google API');
        }

        const address = responseData.results[0].formatted_address;
        const fileName = image.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;

        try {
            await FileSystem.moveAsync({ from: image, to: newPath });
            const dbResult = await insertPlace(title, newPath, address, location.lat, location.lng);
            dispatch({ type: ADD_PLACE, placeData: { id: dbResult.insertId, title: title, image: newPath, address: address, coords: { lat: location.lat, lng: location.lng } } });
        } catch (error) {
            throw error;
        }
    };
};

export const loadPlaces = () => {
    return async dispatch => {
        try {
            const dbResult = await fetchPlaces();
            dispatch({ type: LOAD_PLACES, places: dbResult.rows._array });
        } catch (error) {
            throw error;
        }
    };
};