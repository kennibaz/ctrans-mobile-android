import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import uuid from 'react-uuid';
let RNFS = require('react-native-fs');

export default function PhotoInspectionScreen() {
  const [pickedImageUri, setPickedImageUri] = useState([]);
  const [damagesScreenButtonEnabled, setDamagesScreenButtonEnabled] = useState(false);
  useEffect(() => {
    StatusBar.setHidden(true);
  });

  const takePicture = async () => {
    if (this.camera) {
      const newId = uuid();
      let path = RNFS.DocumentDirectoryPath + newId + '.jpg';
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      await RNFS.writeFile(path, data.base64, 'base64');
      const correctedPath = 'file://' + path;
      setPickedImageUri((previousImages) => [...previousImages, correctedPath]);
      setDamagesScreenButtonEnabled(true);
    }
  };
  return (
    <View style={styles.screen}>
      <View style={styles.middlePanel}>
          <RNCamera
            ref={(ref) => {
              this.camera = ref;
            }}
            style={styles.preview}
            ratio={'16:9'}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
           >
          </RNCamera>
      </View>
      <View style={styles.upperPanel}>
        <View
          style={{
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={[
              styles.button,
              {
                transform: [{rotate: '90deg'}],
              },
            ]}>
            <Button title="Cancel" />
          </View>

          <View
            style={[
              styles.button,
              {
                transform: [{rotate: '90deg'}],
              },
            ]}>
            <Button title="Snap" onPress={takePicture} />
          </View>
          <View
            style={[
              styles.button,
              {
                transform: [{rotate: '90deg'}],
              },
            ]}>
            <Button
              title="Damages"
              disabled={!damagesScreenButtonEnabled}
              onPress={() => {
                navigation.navigate('EditImage', {
                  pickedImageUri: pickedImageUri,
                  order_id: route.params.order_id,
                });
              }}
            />
          </View>
        </View>
      </View>
      <View style={styles.lowerPanel}>
        <ScrollView horizontal>
          <View
            style={{
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            {pickedImageUri.map((image) => (
              <TouchableOpacity
                key={image}
                onPress={() => {
                  navigation.navigate('EditImage', {
                    uri: image,
                    pickedImageUri: pickedImageUri,
                    order_id: route.params.order_id,
                  });
                }}>
                <Image style={styles.image} source={{uri: image}} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    screen: {
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      },
    upperPanel: {
      height: '15%',
      width: '100%',
      backgroundColor: 'black',
      justifyContent: 'center',
    },
    middlePanel: {
      flex: 1,
      height: '70%',
      width: '100%',
      backgroundColor: 'black',
      justifyContent: 'center',
    },
    lowerPanel: {
      height: '15%',
      width: '100%',
      backgroundColor: 'black',
      justifyContent: 'center',
    },
  
    box: {
      flexDirection: 'column',
      height: '100%',
      width: '100%',
    },
    box2: {
      opacity: 0.5,
      top: 220,
      left: -225,
      width: Dimensions.get('window').height * 0.7,
      backgroundColor: 'black',
    },
    button: {},
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    },
   
    image: {
      width: 80,
      height: '80%',
      margin: 2,
    },
  });
  