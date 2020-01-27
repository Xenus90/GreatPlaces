import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import Colors from '../constans/Colors';

const MapScreen = props => {
    const initialLocation = props.navigation.getParam('initialLocation');
    const readonly = props.navigation.getParam('readonly');
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);

    const mapRegion = {
        latitude: initialLocation ? initialLocation.lat : 37.7,
        longitude: initialLocation ? initialLocation.lng : -122.43,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    };

    const selectLocationHandler = (event) => {
        if (readonly) {
            return;
        }

        setSelectedLocation({
            lat: event.nativeEvent.coordinate.latitude,
            lng: event.nativeEvent.coordinate.longitude
        });
    };

    const savePickedLocationHandler = useCallback(() => {
        if (!selectedLocation) {
            return;
        }
        
        props.navigation.navigate('NewPlace', { pickedLocation: selectedLocation });
    }, [selectedLocation]);

    useEffect(() => {
        props.navigation.setParams({ saveLocationHandler: savePickedLocationHandler });
    }, [savePickedLocationHandler]);

    let markerCoodrinates;

    if (selectedLocation) {
        markerCoodrinates = {
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng
        };
    }

    return (
        <MapView style={styles.map} region={mapRegion} onPress={selectLocationHandler}>
            {markerCoodrinates && <Marker title='Picked Location' coordinate={markerCoodrinates} />}
        </MapView>
    );
};

MapScreen.navigationOptions = navData => {
    const saveLocationHandler = navData.navigation.getParam('saveLocationHandler');
    const readonly = navData.navigation.getParam('readonly');

    return {
        headerRight: () => {!readonly && <TouchableOpacity style={styles.headerButton} onPress={saveLocationHandler}>
            <Text style={styles.headerButtonText}>Save</Text>
        </TouchableOpacity>}
    };
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
        color: Platform.OS === 'android' ? 'white' : Colors.primary
    }
});

export default MapScreen;