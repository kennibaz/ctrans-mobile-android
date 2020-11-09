import React, {useRef, useState, useEffect} from 'react';

import uuid from 'react-uuid';
import firestore from '@react-native-firebase/firestore';
import SignatureScreen from 'react-native-signature-canvas';
import {TextInput} from 'react-native-paper';

import storage from '@react-native-firebase/storage';
import {updateSignature} from '../store/actions/orders';
import AsyncStorage from '@react-native-async-storage/async-storage';
var RNFS = require('react-native-fs');
import {View, Button} from 'react-native';
const db = firestore();

export default function InspectionSignatureScreen({route, navigation}) {
  const ref = useRef();
  const [localPickupOrders, setLocalPickupOrders] = useState('');
  const [localDeliveryOrders, setLocalDeliveryOrders] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [signatureUri, setSignatureUri] = useState('');
  const [readyToSave, setReadyToSave] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  useEffect(() => {
    const result = async () => {
      if (route.params.mode === 'pickup') {
        try {
          let fetchFromAsyncStorage = await AsyncStorage.getItem(
            'pickupOrdersLocalStorage',
          );
          if (fetchFromAsyncStorage !== null) {
            setLocalPickupOrders(JSON.parse(fetchFromAsyncStorage));
            console.log(JSON.parse(fetchFromAsyncStorage));
          }
        } catch (e) {
          console.log('something went wrong', e);
        }
      }
      if (route.params.mode === 'delivery') {
        try {
          let fetchFromAsyncStorage = await AsyncStorage.getItem(
            'deliveryOrdersLocalStorage',
          );
          if (fetchFromAsyncStorage !== null) {
            setLocalDeliveryOrders(JSON.parse(fetchFromAsyncStorage));
            console.log(JSON.parse(fetchFromAsyncStorage));
          }
        } catch (e) {
          console.log('something went wrong', e);
        }
      }
    };
    result();
  }, []);

  const onPickupHandler = async () => {
    if(route.params.mode === "pickup"){
      const foundOrder = localPickupOrders.filter((order) => {
        return order.key === route.params.order_id;
      });
      const foundOrderIndex = localPickupOrders.findIndex((order) => {
        return order.key === route.params.order_id;
      });
      const imagesArray = foundOrder[0].imageSet;
      // add a task to background
      let taskId = uuid();
      let taskBody = {
        taskId: taskId,
        taskBody: {
          mode: "pickup",
          signatureUri: signatureUri,
          odometer: foundOrder[0].odometer,
          pickupNotes: foundOrder[0].driver_pickup_notes,
          imagesArray: imagesArray,
          name_on_pickup_signature: name,
          email_on_pickup_signature: email,
          doc_id: route.params.order_id,
        },
      };
  
      let currentTaskArray = [];
      try {
        const value = await AsyncStorage.getItem('TASKS');
        if (value === null) {
          await AsyncStorage.setItem('TASKS', JSON.stringify(taskBody));
        }
        if (value !== null) {
          currentTaskArray = JSON.parse(value);
        }
      } catch (error) {
        console.log(error);
      }
      currentTaskArray.push(taskBody);
  
      try {
        await AsyncStorage.setItem('TASKS', JSON.stringify(currentTaskArray));
      } catch (e) {
        console.log('something went wrong');
      }
  
      db.collection('carriers-records')
        .doc('c87U6WtSNRybGF0WrAXb')
        .collection('orders')
        .doc(route.params.order_id)
        .update({
          loadingInProgress: true,
        });
  
      localPickupOrders.splice(foundOrderIndex, 1);
      try {
        await AsyncStorage.setItem(
          'pickupOrdersLocalStorage',
          JSON.stringify(localPickupOrders),
        );
      } catch (e) {
        console.log('something went wrong');
      }
      setUploadDone(true);
    }
    if(route.params.mode === "delivery"){
      const foundOrder = localDeliveryOrders.filter((order) => {
        return order.key === route.params.order_id;
      });
      const foundOrderIndex = localDeliveryOrders.findIndex((order) => {
        return order.key === route.params.order_id;
      });
      const imagesArray = foundOrder[0].imageSet;
      // add a task to background
      let taskId = uuid();
      let taskBody = {
        taskId: taskId,
        taskBody: {
          mode: "delivery",
          signatureUri: signatureUri,
          odometer: foundOrder[0].odometer,
          pickupNotes: foundOrder[0].driver_pickup_notes,
          imagesArray: imagesArray,
          name_on_pickup_signature: name,
          email_on_pickup_signature: email,
          doc_id: route.params.order_id,
        },
      };
  
      let currentTaskArray = [];
      try {
        const value = await AsyncStorage.getItem('TASKS');
        if (value === null) {
          await AsyncStorage.setItem('TASKS', JSON.stringify(taskBody));
        }
        if (value !== null) {
          currentTaskArray = JSON.parse(value);
        }
      } catch (error) {
        console.log(error);
      }
      currentTaskArray.push(taskBody);
  
      try {
        await AsyncStorage.setItem('TASKS', JSON.stringify(currentTaskArray));
      } catch (e) {
        console.log('something went wrong');
      }
  
      db.collection('carriers-records')
        .doc('c87U6WtSNRybGF0WrAXb')
        .collection('orders')
        .doc(route.params.order_id)
        .update({
          loadingInProgress: true,
        });
  
      localDeliveryOrders.splice(foundOrderIndex, 1);
      try {
        await AsyncStorage.setItem(
          'deliveryOrdersLocalStorage',
          JSON.stringify(localDeliveryOrders),
        );
      } catch (e) {
        console.log('something went wrong');
      }
      setUploadDone(true);
    }
    
  };

  useEffect(() => {
    if (uploadDone && route.params.mode ==="pickup") {
      navigation.navigate('PickupOrders');
    }
    if (uploadDone && route.params.mode ==="delivery") {
      navigation.navigate('DeliveryOrders');
    }
  }, [uploadDone]);

  const handleSignature = async (signature) => {
    const newId = uuid();
    let correctedSignature = signature.replace('data:image/png;base64,', '');
    let path = RNFS.DocumentDirectoryPath + newId + '-signature.jpg';
    const signatureFile = await RNFS.writeFile(
      path,
      correctedSignature,
      'base64',
    );

    setSignatureUri('file://' + path);
    // dispatch(updateSignature(route.params.order_id, signatureUri, name, email));
    setReadyToSave(true);
  };

  const handleEmpty = () => {
    console.log('Empty');
  };

  const handleClear = () => {
    console.log('clear success!');
    // setReadyToSave(false)
  };

  const handleEnd = () => {
    ref.current.readSignature();
  };
  return (
    <View>
      <TextInput
        label="Name"
        value={name}
        onChangeText={(name) => setName(name)}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />

      <View style={{height: '50%'}}>
        <SignatureScreen
          ref={ref}
          onEnd={handleEnd}
          onOK={handleSignature}
          onEmpty={handleEmpty}
          onClear={handleClear}
          autoClear={false}
          confirmText="Save"
        />
      </View>
      <View
        style={{width: '30%', alignItems: 'center', justifyContent: 'center'}}>
        <Button
          disabled={!readyToSave}
          title="Mark As Picked Up"
          onPress={onPickupHandler}
        />
      </View>
    </View>
  );
}
