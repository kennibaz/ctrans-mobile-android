import React, {useEffect, useState, useRef} from 'react';
import uuid from 'react-uuid';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import {captureRef} from 'react-native-view-shot';
import sc_icon from '../assets/overlayIcons/sc.png';
import c_icon from '../assets/overlayIcons/c.png';
import p_icon from '../assets/overlayIcons/p.png';
import InspectionDataScreen from './InspectionDataScreen';
var RNFS = require('react-native-fs');

const sc_icon_uri = Image.resolveAssetSource(sc_icon).uri;
const c_icon_uri = Image.resolveAssetSource(c_icon).uri;
const p_icon_uri = Image.resolveAssetSource(p_icon).uri;

export default function DamagesInspectionScreen({route, navigation}) {
  const viewShotRef = useRef(null);
  const [imageSet, setImageSet] = useState([]);
  const [overlay, setOverlay] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState('sc');

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);
  useEffect(() => {
    let imageRawArray = route.params.pickedImageUri;
    imageRawArray.forEach((image) => {
      const imageSet = {
        backGroundImageUri: image,
        overlay: [],
      };
      setImageSet((currentState) => [...currentState, imageSet]);
    });
  }, []);

  const setCoordinates = (ev, index) => {
    let selected_icon = sc_icon_uri;

    if (selectedIcon === 'c') {
      selected_icon = c_icon_uri;
    } else if (selectedIcon === 'sc') {
      selected_icon = sc_icon_uri;
    } else if (selectedIcon === 'p') {
      selected_icon = p_icon_uri;
    }

    let newImageCoordinates = {
      y: ev.nativeEvent.locationX - 22,
      x: ev.nativeEvent.locationY - 22,
      uri: selected_icon,
    };

    currentArray = imageSet;
    currentArray[index].overlay.push(newImageCoordinates);
    captureRef(viewShotRef, {
      format: 'jpg',
      quality: 0.8,
    }).then((mergedImageRaw) => {
      currentArray[index].mergedImage = mergedImageRaw;
    });
    setImageSet(currentArray);
    setOverlay((currentOverlay) => [...currentOverlay, newImageCoordinates]);
  };

  const deleteMarkHandler = (index, indexBackImage) => {
    const updatedOverlay = [...imageSet];
    updatedOverlay[indexBackImage].overlay.splice(index, 1);
    setImageSet(updatedOverlay);
  };

  const selectedIconHandler = (icon) => {
    setSelectedIcon(icon);
  };

  const InspectionDataScreenHandler = () => {
    navigation.navigate('InspectionData', {
      imageSet: imageSet,
      order_id: route.params.order_id,
    });

  };


  if (!imageSet) {
    return;
    <View>
      <Text>Loading</Text>
    </View>;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.lowerPanel}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              selectedIconHandler('sc');
            }}>
            <Image
              style={{
                width: '10%',
                height: '50%',
              }}
              source={
                selectedIcon === 'sc'
                  ? require('../assets/overlayIcons/sc_green.png')
                  : require('../assets/overlayIcons/sc.png')
              }
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              selectedIconHandler('c');
            }}>
            <Image
              style={{
                width: '10%',
                height: '50%',
              }}
              source={
                selectedIcon === 'c'
                  ? require('../assets/overlayIcons/c_green.png')
                  : require('../assets/overlayIcons/c.png')
              }
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              selectedIconHandler('p');
            }}>
            <Image
              style={{
                width: '10%',
                height: '50%',
              }}
              source={
                selectedIcon === 'p'
                  ? require('../assets/overlayIcons/p_green.png')
                  : require('../assets/overlayIcons/p.png')
              }
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
      <ViewShot ref={viewShotRef} options={{format: 'jpg', quality: 0.9}}>
        <ScrollView horizontal pagingEnabled>
          {imageSet.map((back, indexBackImage) => (
            <View style={styles.middlePanel} key={indexBackImage}>
              <View
                style={{
                  flex: 1,
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height * 0.7,
                }}>
                <TouchableWithoutFeedback
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                  onPress={(ev) => {
                    setCoordinates(ev, indexBackImage);
                  }}>
                  <ImageBackground
                    source={{uri: back.backGroundImageUri}}
                    style={{width: '100%', height: '100%'}}>
                    {back.overlay.map((image, index) => (
                      <TouchableWithoutFeedback
                        key={index}
                        onPress={() => {
                          deleteMarkHandler(index, indexBackImage);
                        }}>
                        <Image
                          style={{
                            width: '10%',
                            height: '10%',
                            margin: 2,
                            position: 'absolute',
                            top: image.x,
                            left: image.y,
                          }}
                          source={{uri: image.uri}}
                        />
                      </TouchableWithoutFeedback>
                    ))}
                  </ImageBackground>
                </TouchableWithoutFeedback>
              </View>
            </View>
          ))}
        </ScrollView>
      </ViewShot>
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
            <Button title="Photo" onPress={() => navigation.goBack()} />
          </View>

          <View
            style={[
              styles.button,
              {
                transform: [{rotate: '90deg'}],
              },
            ]}>
            <Button title="Done" onPress={InspectionDataScreenHandler} />
          </View>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
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
      flexDirection: 'row',
    },
    lowerPanel: {
      height: '15%',
      width: '100%',
      backgroundColor: 'black',
      justifyContent: 'center',
    },
  
    screen: {
      flexDirection: 'column',
      height: '100%',
      width: '100%',
    },

  
  
  });
  
