import React, {useRef, useState, useEffect} from 'react';

import uuid from 'react-uuid';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import SignatureScreen from 'react-native-signature-canvas';
import {TextInput} from 'react-native-paper';
import axios from 'axios';

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
          }
        } catch (e) {
          console.log('something went wrong', e);
        }
      }
    };
    result();
  }, []);

  const onPickupHandler = async () => {
    if (route.params.mode === 'pickup') {
      db.collection('carriers-records')
        .doc('c87U6WtSNRybGF0WrAXb')
        .collection('orders')
        .doc(route.params.order_id)
        .update({
          loadingInProgress: true,
        });

      setUploadDone(true);
      
      const foundOrder = localPickupOrders.filter((order) => {
        return order.key === route.params.order_id;
      });
      const foundOrderIndex = localPickupOrders.findIndex((order) => {
        return order.key === route.params.order_id;
      });
      const imagesArray = foundOrder[0].imageSet;

      const created_at = new Date();

      const new_activity = {
        activity_date: created_at,
        activity_type: 'Order was picked up',
        activity_user: 'driver',
        activity_log: `Order was picked up at ${created_at}`,
      };

      let uploadedImagesUri = [];
      let uploadedDiagramUri;

      const newSignUuid = uuid();
      const reference = storage().ref(
        `/c87U6WtSNRybGF0WrAXb/signature-${newSignUuid}.jpg`,
      );
      // const signatureUri = signatureUri;
      const imagesArrayCopy = [...imagesArray];

      imagesArrayCopy.forEach(async (image) => {
        console.log(image);
        if (image.image_type === 'photo') {
          const newId = uuid();
          const reference = storage().ref(
            `/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`,
          );
          const pathToFile = image.mergedImage
            ? image.mergedImage
            : image.backGroundImageUri;
          console.log('path', pathToFile);
          await reference.putFile(pathToFile);
          const url = await storage()
            .ref(`/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`)
            .getDownloadURL();

          uploadedImagesUri.push(url);
          console.log('rest of the array is', imagesArrayCopy.length);
          imagesArrayCopy.shift();
          console.log('done with photo');
        }
        if (image.image_type === 'diagram') {
          const newId = uuid();
          const reference = storage().ref(
            `/c87U6WtSNRybGF0WrAXb/inspection-diagram-${newId}.jpg`,
          );
          const pathToFile = image.mergedImage
            ? image.mergedImage
            : image.backGroundImageUri;
          await reference.putFile(pathToFile);
          const url = await storage()
            .ref(`/c87U6WtSNRybGF0WrAXb/inspection-diagram-${newId}.jpg`)
            .getDownloadURL();
          // setUploadedImages((currentImages) => [...currentImages, url]);
          uploadedDiagramUri = url;

          console.log('rest of the array is', imagesArrayCopy.length);
          imagesArrayCopy.shift();
          console.log('done with diagram');
        }
      });

      console.log('before signature');

      await reference.putFile(signatureUri);
      console.log('after signature');
      const signatureResultUri = await storage()
        .ref(`/c87U6WtSNRybGF0WrAXb/signature-${newSignUuid}.jpg`)
        .getDownloadURL();

      console.log('done with signature');

      if (imagesArrayCopy.length === 0) {
        db.collection('carriers-records')
          .doc('c87U6WtSNRybGF0WrAXb')
          .collection('orders')
          .doc(route.params.order_id)
          .update({
            'pickup.pickup_conditions.name_on_pickup_signature': name,
            'pickup.pickup_conditions.email_on_pickup_signature': email,
            'pickup.pickup_conditions.odometer': foundOrder[0].odometer,
            'pickup.pickup_conditions.driver_pickup_notes':
              foundOrder[0].driver_pickup_notes,
            'pickup.pickup_conditions.pickup_inspection_images_links': uploadedImagesUri,
            'pickup.pickup_conditions.pickup_inspection_diagram_link': uploadedDiagramUri,
            'pickup.pickup_conditions.signature_image_link': signatureResultUri,
            order_activity: firestore.FieldValue.arrayUnion(new_activity),
          });
        const httpReq = await axios.post(
          'https://ctrans.herokuapp.com/api/add-data',
          {
            documentUri: `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${route.params.order_id}`,
            status: 'picked',
          },
        );
        console.log(httpReq);
        db.collection('carriers-records')
        .doc('c87U6WtSNRybGF0WrAXb')
        .collection('orders')
        .doc(route.params.order_id)
        .update({order_status: 'Picked', loadingInProgress: false,})
        localPickupOrders.splice(foundOrderIndex, 1);
        try {
          await AsyncStorage.setItem(
            'pickupOrdersLocalStorage',
            JSON.stringify(localPickupOrders),
          );
        } catch (e) {
          console.log('something went wrong');
        }
      }
    }
    if (route.params.mode === 'delivery') {
      db.collection('carriers-records')
        .doc('c87U6WtSNRybGF0WrAXb')
        .collection('orders')
        .doc(route.params.order_id)
        .update({
          loadingInProgress: true,
        });

      setUploadDone(true);
      const foundOrder = localDeliveryOrders.filter((order) => {
        return order.key === route.params.order_id;
      });
      const foundOrderIndex = localDeliveryOrders.findIndex((order) => {
        return order.key === route.params.order_id;
      });
      const imagesArray = foundOrder[0].imageSet;

      const created_at = new Date();

      const new_activity = {
        activity_date: created_at,
        activity_type: 'Order was delivered',
        activity_user: 'driver',
        activity_log: `Order was delivered at ${created_at}`,
      };

      let uploadedImagesUri = [];
      let uploadedDiagramUri;

      const newSignUuid = uuid();
      const reference = storage().ref(
        `/c87U6WtSNRybGF0WrAXb/signature-${newSignUuid}.jpg`,
      );
      // const signatureUri = signatureUri;
      const imagesArrayCopy = [...imagesArray];

      imagesArrayCopy.forEach(async (image) => {
        console.log(image);
        if (image.image_type === 'photo') {
          const newId = uuid();
          const reference = storage().ref(
            `/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`,
          );
          const pathToFile = image.mergedImage
            ? image.mergedImage
            : image.backGroundImageUri;
          console.log('path', pathToFile);
          await reference.putFile(pathToFile);
          const url = await storage()
            .ref(`/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`)
            .getDownloadURL();

          uploadedImagesUri.push(url);
          console.log('rest of the array is', imagesArrayCopy.length);
          imagesArrayCopy.shift();
          console.log('done with photo');
        }
        if (image.image_type === 'diagram') {
          const newId = uuid();
          const reference = storage().ref(
            `/c87U6WtSNRybGF0WrAXb/inspection-diagram-${newId}.jpg`,
          );
          const pathToFile = image.mergedImage
            ? image.mergedImage
            : image.backGroundImageUri;
          await reference.putFile(pathToFile);
          const url = await storage()
            .ref(`/c87U6WtSNRybGF0WrAXb/inspection-diagram-${newId}.jpg`)
            .getDownloadURL();
          uploadedDiagramUri = url;

          console.log('rest of the array is', imagesArrayCopy.length);
          imagesArrayCopy.shift();
          console.log('done with diagram');
        }
      });

      await reference.putFile(signatureUri);
      const signatureResultUri = await storage()
        .ref(`/c87U6WtSNRybGF0WrAXb/signature-${newSignUuid}.jpg`)
        .getDownloadURL();

      console.log('done with signature');

      if (imagesArrayCopy.length === 0) {
        db.collection('carriers-records')
          .doc('c87U6WtSNRybGF0WrAXb')
          .collection('orders')
          .doc(route.params.order_id)
          .update({
            'delivery.delivery_conditions.name_on_delivery_signature': name,
            'delivery.delivery_conditions.email_on_delivery_signature': email,
            'delivery.delivery_conditions.odometer': foundOrder[0].odometer,
            'delivery.delivery_conditions.driver_delivery_notes':
              foundOrder[0].driver_pickup_notes,
            'delivery.delivery_conditions.delivery_inspection_images_links': uploadedImagesUri,
            'delivery.delivery_conditions.delivery_inspection_diagram_link': uploadedDiagramUri,
            'delivery.delivery_conditions.signature_image_link': signatureResultUri,
            order_activity: firestore.FieldValue.arrayUnion(new_activity)
          });
        const httpReq = await axios.post(
          'https://ctrans.herokuapp.com/api/add-data',
          {
            documentUri: `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${route.params.order_id}`,
            status: 'delivered',
          },
        );
        console.log(httpReq);
        db.collection('carriers-records')
          .doc('c87U6WtSNRybGF0WrAXb')
          .collection('orders')
          .doc(route.params.order_id)
          .update({order_status: 'Delivered', loadingInProgress: false,})
        localDeliveryOrders.splice(foundOrderIndex, 1);
        try {
          await AsyncStorage.setItem(
            'deliveryOrdersLocalStorage',
            JSON.stringify(localDeliveryOrders),
          );
        } catch (e) {
          console.log('something went wrong');
        }
      }
    }
  };

  // const onPickupHandler = async () => {
  //   if (route.params.mode === 'pickup') {
  //     const foundOrder = localPickupOrders.filter((order) => {
  //       return order.key === route.params.order_id;
  //     });
  //     const foundOrderIndex = localPickupOrders.findIndex((order) => {
  //       return order.key === route.params.order_id;
  //     });
  //     const imagesArray = foundOrder[0].imageSet;
  //     // add a task to background
  //     let taskId = uuid();
  //     let taskBody = {
  //       taskId: taskId,
  //       taskBody: {
  //         mode: 'pickup',
  //         signatureUri: signatureUri,
  //         odometer: foundOrder[0].odometer,
  //         pickupNotes: foundOrder[0].driver_pickup_notes,
  //         imagesArray: imagesArray,
  //         name_on_pickup_signature: name,
  //         email_on_pickup_signature: email,
  //         doc_id: route.params.order_id,
  //       },
  //     };

  //     let currentTaskArray = [];
  //     try {
  //       const value = await AsyncStorage.getItem('TASKS');
  //       if (value === null) {
  //         await AsyncStorage.setItem('TASKS', JSON.stringify(taskBody));
  //       }
  //       if (value !== null) {
  //         currentTaskArray = JSON.parse(value);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     currentTaskArray.push(taskBody);

  //     try {
  //       await AsyncStorage.setItem('TASKS', JSON.stringify(currentTaskArray));
  //     } catch (e) {
  //       console.log('something went wrong');
  //     }

  //     db.collection('carriers-records')
  //       .doc('c87U6WtSNRybGF0WrAXb')
  //       .collection('orders')
  //       .doc(route.params.order_id)
  //       .update({
  //         loadingInProgress: true,
  //       });

  //     localPickupOrders.splice(foundOrderIndex, 1);
  //     try {
  //       await AsyncStorage.setItem(
  //         'pickupOrdersLocalStorage',
  //         JSON.stringify(localPickupOrders),
  //       );
  //     } catch (e) {
  //       console.log('something went wrong');
  //     }
  //     setUploadDone(true);
  //   }
  //   if (route.params.mode === 'delivery') {
  //     const foundOrder = localDeliveryOrders.filter((order) => {
  //       return order.key === route.params.order_id;
  //     });
  //     const foundOrderIndex = localDeliveryOrders.findIndex((order) => {
  //       return order.key === route.params.order_id;
  //     });
  //     const imagesArray = foundOrder[0].imageSet;
  //     // add a task to background
  //     let taskId = uuid();
  //     let taskBody = {
  //       taskId: taskId,
  //       taskBody: {
  //         mode: 'delivery',
  //         signatureUri: signatureUri,
  //         odometer: foundOrder[0].odometer,
  //         pickupNotes: foundOrder[0].driver_pickup_notes,
  //         imagesArray: imagesArray,
  //         name_on_pickup_signature: name,
  //         email_on_pickup_signature: email,
  //         doc_id: route.params.order_id,
  //       },
  //     };

  //     let currentTaskArray = [];
  //     try {
  //       const value = await AsyncStorage.getItem('TASKS');
  //       if (value === null) {
  //         await AsyncStorage.setItem('TASKS', JSON.stringify(taskBody));
  //       }
  //       if (value !== null) {
  //         currentTaskArray = JSON.parse(value);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     currentTaskArray.push(taskBody);

  //     try {
  //       await AsyncStorage.setItem('TASKS', JSON.stringify(currentTaskArray));
  //     } catch (e) {
  //       console.log('something went wrong');
  //     }

  //     db.collection('carriers-records')
  //       .doc('c87U6WtSNRybGF0WrAXb')
  //       .collection('orders')
  //       .doc(route.params.order_id)
  //       .update({
  //         loadingInProgress: true,
  //       });

  //     localDeliveryOrders.splice(foundOrderIndex, 1);
  //     try {
  //       await AsyncStorage.setItem(
  //         'deliveryOrdersLocalStorage',
  //         JSON.stringify(localDeliveryOrders),
  //       );
  //     } catch (e) {
  //       console.log('something went wrong');
  //     }
  //     setUploadDone(true);
  //   }
  // };

  useEffect(() => {
    if (uploadDone && route.params.mode === 'pickup') {
      navigation.navigate('PickupOrders');
    }
    if (uploadDone && route.params.mode === 'delivery') {
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

    setReadyToSave(true);
  };

  const handleEmpty = () => {
    console.log('Empty');
  };

  const handleClear = () => {
    console.log('clear success!');
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
