import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Image, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import Colors from '../constans/Colors';

const ImgPicker = props => {
    const [pickedImage, setPickedImage] = useState();

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

        if (result.status !== "granted") {
            Alert.alert('Insufficient permissions!', 'You need to grand camera permissions', [{ text: 'Ok' }]);
            return false;
        }

        return true;
    };

    const takeImageHandler = async () => {
        const hasPersmission = await verifyPermissions();

        if (!hasPersmission) {
            return;
        }

        const image = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [16, 9], quality: 0.5 });
        setPickedImage(image.uri);
        props.onImageTaken(image.uri);
    };

    return (
        <View style={styles.imagePicker}>
            <View style={styles.imagePreview}>
                {!pickedImage ? <Text>No image picked yet.</Text> : <Image style={styles.image} source={{ uri: pickedImage }} />}
                <Button title='Take image' color={Colors.primary} onPress={takeImageHandler} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    imagePicker: {
        alignItems: 'center',
        marginBottom: 15
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1
    },
    image: {
        width: '100%',
        height: '100%'
    }
});

export default ImgPicker;