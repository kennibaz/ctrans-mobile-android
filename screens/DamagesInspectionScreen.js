import React, {useEffect, useState, useRef} from 'react';
import Orientation from 'react-native-orientation-locker';
import uuid from 'react-uuid';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
  FlatList,
} from 'react-native';
import ViewShot from 'react-native-view-shot';

import sc_icon from '../assets/overlayIcons/sc.png';
import c_icon from '../assets/overlayIcons/c.png';
import p_icon from '../assets/overlayIcons/p.png';

import sc_icon_rect from '../assets/overlayIcons/sc_rect.png';
import c_icon_rect from '../assets/overlayIcons/c_rect.png';
import p_icon_rect from '../assets/overlayIcons/p_rect.png';

var RNFS = require('react-native-fs');

const sc_icon_uri = Image.resolveAssetSource(sc_icon).uri;
const c_icon_uri = Image.resolveAssetSource(c_icon).uri;
const p_icon_uri = Image.resolveAssetSource(p_icon).uri;

const sc_icon_rect_uri = Image.resolveAssetSource(sc_icon_rect).uri;
const c_icon_rect_uri = Image.resolveAssetSource(c_icon_rect).uri;
const p_icon_rect_uri = Image.resolveAssetSource(p_icon_rect).uri;

export default function DamagesInspectionScreen({route, navigation}) {
  let currentDate = new Date(); //use your date here
  let newDate = currentDate.toLocaleDateString('en-US'); // "en-US" gives date in US Format - mm/dd/yy
  const viewShotRef = useRef(null);
  const [imageSet, setImageSet] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState('sc');
  const [currentIndex, setCurrentIndex] = useState('');
  const [readyForShot, setReadyForShot] = useState(0);
  const [foundOrder, setFoundOrder] = useState('');
  const [prepare, setPrepare] = useState(false);

  useEffect(() => {
    StatusBar.setHidden(true);
    Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    if (route.params.is_edit_mode) {
      setImageSet(route.params.existed_order_data[0].imageSet);
      setFoundOrder(route.params.existed_order_data[0]);
    } else {
      let imageRawArray = route.params.pickedImageUri;

      imageRawArray.forEach((image) => {
        let key = uuid();
        const imageSet = {
          backGroundImageUri: image.image_uri,
          image_type: image.image_type,
          overlay: [],
          key: key,
        };
        setImageSet((currentState) => [...currentState, imageSet]);
      });
    }
  }, [route.params]);

  const setCoordinates = (ev, index) => {
    if (route.params.mode === 'pickup') {
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
      setPrepare(!prepare);
  
      setImageSet(currentArray);
    }

    if (route.params.mode === 'delivery') {
      let selected_icon = sc_icon_rect_uri;

      if (selectedIcon === 'c') {
        selected_icon = c_icon_rect_uri;
      } else if (selectedIcon === 'sc') {
        selected_icon = sc_icon_rect_uri;
      } else if (selectedIcon === 'p') {
        selected_icon = p_icon_rect_uri;
      }
      let newImageCoordinates = {
        y: ev.nativeEvent.locationX - 22,
        x: ev.nativeEvent.locationY - 22,
        uri: selected_icon,
      };
  
      currentArray = imageSet;
      currentArray[index].overlay.push(newImageCoordinates);
  
      setCurrentIndex(index);
      setPrepare(!prepare);
  
      setImageSet(currentArray);
    }

 
  };

  useEffect(() => {
    setReadyForShot(readyForShot + 1);
  }, [prepare]);

  useEffect(() => {
    if (readyForShot > 1) {
      const result = async () => {
        let currentArray = imageSet;
        let index = currentIndex;
        const newId = uuid();
        await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/photo`)
        let path ='file://'+ RNFS.DocumentDirectoryPath + "/photo/" + newId + '.jpg';
        const dataUri = await viewShotRef.current.capture();
        console.log(dataUri)
        const dataFile = await RNFS.readFile(dataUri, 'base64');

        await RNFS.writeFile(path, dataFile, 'base64');
        
        currentArray[index].mergedImage = path;
      };
      result();
    }
  }, [readyForShot]);

  const deleteMarkHandler = (index, indexBackImage) => {
    const updatedOverlay = [...imageSet];
    updatedOverlay[indexBackImage].overlay.splice(index, 1);
    setImageSet(updatedOverlay);
  };

  const selectedIconHandler = (icon) => {
    //set state of current selected icon
    setSelectedIcon(icon);
  };

  const InspectionDataScreenHandler = () => {
    navigation.navigate('InspectionData', {
      imageSet: imageSet,
      is_edit_mode: route.params.is_edit_mode ? true : false,
      mode: route.params.mode,
      existed_order: foundOrder && foundOrder,
      order_id: route.params.order_id,
      odometer: route.params.existed_order_data
        ? route.params.existed_order_data[0].odometer
        : '',
      driver_pickup_notes: route.params.existed_order_data
        ? route.params.existed_order_data[0].driver_pickup_notes
        : '',
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
      <View style={styles.icons}>
        <TouchableWithoutFeedback
          onPress={() => {
            selectedIconHandler('sc');
          }}>
          <Image
            style={{
              width: 70,
              height: 70,
              transform: [{rotate: '90deg'}],
            }}
            resizeMode="contain"
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
              width: 70,
              height: 70,
              transform: [{rotate: '90deg'}],
            }}
            resizeMode="contain"
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
              width: 70,
              height: 70,
              transform: [{rotate: '90deg'}],
            }}
            resizeMode="contain"
            source={
              selectedIcon === 'p'
                ? require('../assets/overlayIcons/p_green.png')
                : require('../assets/overlayIcons/p.png')
            }
          />
        </TouchableWithoutFeedback>
      </View>
      <ViewShot
        style={styles.mainWindow}
        ref={viewShotRef}
        options={{format: 'jpg', quality: 0.9}}>
        <View style={styles.mainWindow}>
          <FlatList
            horizontal
            pagingEnabled
            getItemLayout={(data, index) => ({
              length: Dimensions.get('window').height * 0.8,
              offset: Dimensions.get('window').width * index,
              index,
            })}
            initialScrollIndex={route.params.index}
           
            data={imageSet}
            renderItem={({item, index}) => (
              <TouchableWithoutFeedback
                onPress={(ev) => {
                  setCoordinates(ev, index);
                }}>
                <ImageBackground
                  style={styles.imagePreview}
                  source={{uri: item.backGroundImageUri}}>
                  {item.overlay.map((image, indexIcon) => (
                    <TouchableWithoutFeedback
                      key={indexIcon}
                      onPress={() => {
                        deleteMarkHandler(indexIcon, index);
                      }}>
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          margin: 2,
                          position: 'absolute',
                          top: image.x,
                          left: image.y,
                          transform: [{rotate: '90deg'}],
                        }}
                        resizeMode="contain"
                        source={{uri: image.uri}}
                      />
                    </TouchableWithoutFeedback>
                  ))}
                </ImageBackground>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      </ViewShot>
      <View style={styles.buttons}>
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
  );
}

const styles = StyleSheet.create({
  screen: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  icons: {
    flex: 1,
    flexDirection: 'row',

    backgroundColor: 'black',
    justifyContent: 'center',
  },
  mainWindow: {
    flex: 7,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'black',
  },
  imagePreview: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
});
