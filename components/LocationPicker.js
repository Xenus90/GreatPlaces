import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import Colors from '../constans/Colors';
import MapPreview from '../components/MapPreview';

const LocationPicker = props => {
    const [pickedLocation, setPickedLocation] = useState();
    const [isFetching, setIsFetching] = useState(false);
    const { onLocationPicked } = props;

    const mapPickedLocation = props.navigation.getParam('pickedLocation');

    useEffect(() => {
        if (mapPickedLocation) {
            setPickedLocation(mapPickedLocation);
            onLocationPicked(mapPickedLocation);
        }
    }, [mapPickedLocation, onLocationPicked]);

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);

        if (result.status !== "granted") {
            Alert.alert('Insufficient permissions!', 'You need to grand location permissions', [{ text: 'Ok' }]);
            return false;
        }

        return true;
    };

    const getLocationHandler = async () => {
        const hasPersmission = await verifyPermissions();

        if (!hasPersmission) {
            return;
        }

        try {
            setIsFetching(true);
            const location = await Location.getCurrentPositionAsync({ timeInterval: 5000 });
            setPickedLocation({ lat: location.coords.latitude, lng: location.coords.longitude });
            props.onLocationPicked({ lat: location.coords.latitude, lng: location.coords.longitude });
        } catch (error) {
            Alert.alert('Could not fetch location', 'Please, try again later', [{ text: 'Ok' }]);
        }

        setIsFetching(false);
    };

    const pickOnMapHandler = () => {
        props.navigation.navigate('Map');
    };

    return (
        <View style={styles.locationPicker}>
            <MapPreview style={styles.mapPreview} location={pickedLocation} onPress={pickOnMapHandler}>
                {isFetching ? <ActivityIndicator size='large' color={Colors.primary} /> : <Text>No location chosen yet.</Text>}
            </MapPreview>
            <View style={styles.actions}>
                <Button title='Get location' color={Colors.primary} onPress={getLocationHandler} />
                <Button title='Pick on map' color={Colors.primary} onPress={pickOnMapHandler} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    locationPicker: {
        marginBottom: 15
    },
    mapPreview: {

    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    }
});

export default LocationPicker;