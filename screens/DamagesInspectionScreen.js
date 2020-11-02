import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
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

import sc_icon from '../assets/overlayIcons/sc.png';
import c_icon from '../assets/overlayIcons/c.png';
import p_icon from '../assets/overlayIcons/p.png';
import InspectionDataScreen from './InspectionDataScreen';
var RNFS = require('react-native-fs');

const sc_icon_uri = Image.resolveAssetSource(sc_icon).uri;
const c_icon_uri = Image.resolveAssetSource(c_icon).uri;
const p_icon_uri = Image.resolveAssetSource(p_icon).uri;

export default function DamagesInspectionScreen({route, navigation}) {
  const pickupOrders = useSelector((state) => state.order.pickupOrders);
  let currentDate = new Date(); //use your date here
  let newDate = currentDate.toLocaleDateString('en-US'); // "en-US" gives date in US Format - mm/dd/yy
  const viewShotRef = useRef(null);
  const [imageSet, setImageSet] = useState([]);
  const [overlay, setOverlay] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState('sc');
  const [currentIndex, setCurrentIndex] = useState('');
  const [readyForShot, setReadyForShot] = useState('');
  const [foundOrder, setFoundOrder] = useState('');

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);
  useEffect(() => {
    if (route.params.is_edit_mode) {
      const foundOrder = pickupOrders.filter((order) => {
        return order.key === route.params.order_id;
      });
      console.log(foundOrder);
      setImageSet(foundOrder[0].imageSet);
      setFoundOrder(foundOrder);
    } else {
      let imageRawArray = route.params.pickedImageUri;
      imageRawArray.forEach((image) => {
        const imageSet = {
          backGroundImageUri: image,
          overlay: [],
        };
        setImageSet((currentState) => [...currentState, imageSet]);
      });
    }
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

    setCurrentIndex(index);
    setReadyForShot(!readyForShot);
    setImageSet(currentArray);

    setOverlay((currentOverlay) => [...currentOverlay, newImageCoordinates]);
  };

  useEffect(() => {
    const result = async () => {
      let currentArray = imageSet;
      let index = currentIndex;
      const newId = uuid();
      let path = RNFS.DocumentDirectoryPath + newId + '.jpg';
      const options = {quality: 0.5, base64: true};
      const dataUri = await viewShotRef.current.capture();
      const dataFile = await RNFS.readFile(dataUri, 'base64');

      await RNFS.writeFile(path, dataFile, 'base64');
      const correctedPath = 'file://' + path;
      currentArray[index].mergedImage = correctedPath;
    };
    result();
  }, [readyForShot]);

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
      odometer: foundOrder ? foundOrder[0].odometer : '',
      driver_pickup_notes: foundOrder ? foundOrder[0].driver_pickup_notes : '',
    });
  };

  if (!imageSet) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
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

                    <View
                      style={[
                        styles.transparentBox,
                        {
                          transform: [{rotate: '90deg'}],
                        },
                      ]}>
                      <Text style={styles.transparentText}>
                        Pickup conditions {newDate} on @ Pinellas Park, FL 33781
                      </Text>
                    </View>
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
  transparentBox: {
    left: -190,
    top: 225,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  transparentText: {
    fontSize: 15,
    color: 'white',
  },
});
