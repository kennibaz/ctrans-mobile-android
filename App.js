import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';

import PickupOrdersScreen from "./screens/PickupOrdersScreen"
const db = firestore();

export default function App1() {




  return (
    <PaperProvider>
      <View>
       <PickupOrdersScreen/>
      </View>
    </PaperProvider>
  );
}

