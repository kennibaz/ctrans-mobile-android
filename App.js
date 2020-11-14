import React from 'react';
import firestore from '@react-native-firebase/firestore';

import {Provider as PaperProvider} from 'react-native-paper';

import FireStoreFG from "./background/FireStoreFG"

// import {BGUploadTask} from './background/BackGroundTask';

import MainNavigator from './navigation/MainNavigator';

const db = firestore();

export default function App1() {
 
 
  return (
    <PaperProvider>
      <FireStoreFG/>
      <MainNavigator />
    </PaperProvider>
  );
}
