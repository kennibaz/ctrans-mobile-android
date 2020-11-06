import React from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';

export default function testScreen() {
  const setCoordinates = (ev) => {
    console.log(ev.nativeEvent.locationX - 22, ev.nativeEvent.locationY - 22);
  };
  return (
    <View style={styles.outerView}>
        <View style={styles.upperPanel}></View>
      <TouchableWithoutFeedback
        onPress={(ev) => {
          setCoordinates(ev);
        }}>
        <View style={styles.middlePanel}></View>
      </TouchableWithoutFeedback>
      <View style={styles.lowerPanel}></View>
    </View>
  );
}

const styles = StyleSheet.create({
    middlePanel: {
    flex: 4,
    height: '70%',
    backgroundColor: 'red',
  },
  upperPanel: {
      flex:1,
      height: "15%",
      backgroundColor: "blue"
  },
  lowerPanel: {
    flex:1,
    height: "15%",
    backgroundColor: "green"
},
  outerView: {
    backgroundColor: 'blue',
    flex: 1,
    height: '100%',
  },
});
