import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

import ENV from '../env';

const MapPreview = props => {
    let imagePreviewUrl;

    if (props.location) {
        imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${props.location.lat},${props.location.lng}&zoom=15&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C${props.location.lat},${props.location.lng}&key=${ENV.googleApiKey}`;
    }

    return (
        <TouchableOpacity style={styles.mapPreview} onPress={props.onPress}>
            {props.location ? <Image style={styles.mapImage} source={{ uri: imagePreviewUrl }} /> : props.children}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    mapPreview: {
        marginBottom: 10,
        width: '100%',
        height: 150,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapImage: {
        height: '100%',
        width: '100%'
    }
});

export default MapPreview;