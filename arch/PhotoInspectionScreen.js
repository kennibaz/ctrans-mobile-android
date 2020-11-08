import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  Text
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Orientation from 'react-native-orientation-locker';
import uuid from 'react-uuid';
let RNFS = require('react-native-fs');

export default function PhotoInspectionScreen({route, navigation}) {
  const [pickedImageUri, setPickedImageUri] = useState([]);
  const [damagesScreenButtonEnabled, setDamagesScreenButtonEnabled] = useState(
    false,
  );
  const [currentOrientationStatus, setCurrentOrientationStatus] = useState("")
  useEffect(() => {
    StatusBar.setHidden(true);
    Orientation.lockToLandscapeLeft();
    Orientation.getOrientation((orientation)=> {
      console.log("Current UI Orientation: ", orientation);
      setCurrentOrientationStatus(orientation)
    });
  });

  const takePicture = async () => {
    if (this.camera) {
      const newId = uuid();
      let path = RNFS.DocumentDirectoryPath + newId + '.jpg';
      const options = {
        quality: 0.5,
        base64: true,
        orientation: 'landscapeLeft',
      };
      const data = await this.camera.takePictureAsync(options);
      await RNFS.writeFile(path, data.base64, 'base64');
      const correctedPath = 'file://' + path;
      setPickedImageUri((previousImages) => [...previousImages, correctedPath]);
      setDamagesScreenButtonEnabled(true);
    }
  };
  if (currentOrientationStatus !=="LANDSCAPE-LEFT" )
  {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    )
  }
  
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
            }}></RNCamera>
        </View>
        <View style={styles.upperPanel}>
          <View
            style={{
              justifyContent: 'space-around',
              alignItems: 'stretch',
              flexDirection: 'column',
              height:"100%"
            }}>
            <View style={styles.button}>
              <Button title="Cancel" />
            </View>
  
            <View style={styles.button}>
              <Button title="Snap" onPress={takePicture} />
            </View>
            <View style={styles.button}>
              <Button
                title="Damages"
                disabled={!damagesScreenButtonEnabled}
                onPress={() => {
                  navigation.navigate('DamageInspection', {
                    pickedImageUri: pickedImageUri,
                    order_id: route.params.order_id,
                  });
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.lowerPanel}>
          {/* <ScrollView > */}
            <View
              style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'column',
              }}>
              {pickedImageUri.map((image) => (
                <TouchableOpacity
                  key={image}
                  onPress={() => {
                    navigation.navigate('DamageInspection', {
                      uri: image,
                      pickedImageUri: pickedImageUri,
                      order_id: route.params.order_id,
                    });
                  }}>
                  <Image style={styles.image} source={{uri: image}} />
                </TouchableOpacity>
              ))}
            </View>
          {/* </ScrollView> */}
        </View>
      </View>
    );
  
  
}

const styles = StyleSheet.create({
  screen: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  upperPanel: {
    flex: 1,
    // height: '15%',
    // width: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  middlePanel: {
    flex: 6,
    // height: '70%',
    // width: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  lowerPanel: {
    flex: 1,
    // height: '15%',
    // width: '100%',
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
    height: '40%',
    margin: 2,
    borderColor:"blue",
    borderRadius: 10,
    borderWidth: 2
  },
});
