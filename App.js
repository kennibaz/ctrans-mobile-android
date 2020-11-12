import React, {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import uuid from 'react-uuid';
import {Provider as PaperProvider} from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';

// import {BGUploadTask} from './background/BackGroundTask';

import MainNavigator from './navigation/MainNavigator';

const db = firestore();

export default function App1() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Message handled in the foreground!', remoteMessage);
      const newId = uuid();
      const reference = storage().ref(
        `/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`,
      );
      const pathToFile = remoteMessage.data.path
      await reference.putFile(pathToFile);
          const url = await storage()
            .ref(`/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`)
            .getDownloadURL();
      db.collection('carriers-records')
        .doc('c87U6WtSNRybGF0WrAXb')
        .collection('orders')
        .doc(remoteMessage.data.doc)
        .update({
          remoteMessage: 'sent',
          remoteUri: url
        });
    
        messaging().sendMessage({
          data: {
            url: url,
          },
        });
    });

    return unsubscribe;
  }, []);
  return (
    <PaperProvider>
      <MainNavigator />
    </PaperProvider>
  );
}
