import React, {useRef, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import uuid from 'react-uuid';
import firestore from '@react-native-firebase/firestore';
import SignatureScreen from 'react-native-signature-canvas';
import {TextInput} from 'react-native-paper';
import {utils} from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import {updateSignature} from '../store/actions/orders';
var RNFS = require('react-native-fs');
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
  Image,
} from 'react-native';
const db = firestore();

export default function InspectionSignatureScreen({route, navigation}) {
  const ref = useRef();
  const dispatch = useDispatch();
  const pickupOrders = useSelector((state) => state.order.pickupOrders);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [signatureUri, setSignatureUri] = useState('');
  const [signatureUploadedUri, setSignatureUploadedUri] = useState('');
  const [readyToSave, setReadyToSave] = useState(false);
  const [initialImageArrayLength, setInitialImageArrayLength] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [readyToFsUpload, setReadyToFsUpload] = useState(false);
  const [odometer, setOdometer] = useState(false);
  const [pickupNotes, setPickupNotes] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const onPickupHandler = async () => {
    const foundOrder = pickupOrders.filter((order) => {
      return order.key === route.params.order_id;
    });

    const imagesArray = foundOrder[0].imageSet;
    console.log(imagesArray);
    setOdometer(foundOrder[0].odometer);
    setPickupNotes(foundOrder[0].driver_pickup_notes);
    setInitialImageArrayLength(imagesArray.length);

    //save a pic of a signature
    const newSignUuid = uuid();
    const reference = storage().ref(`signature-${newSignUuid}.jpg`);
    const pathToFile = signatureUri;
    await reference.putFile(pathToFile);
    setSignatureUploadedUri(
      await storage().ref(`signature-${newSignUuid}.jpg`).getDownloadURL(),
    );

    imagesArray.forEach(async (image) => {
      const newId = uuid();
      const reference = storage().ref(`inspection-photo-${newId}.jpg`);
      const pathToFile = image.mergedImage;
      await reference.putFile(pathToFile);
      const url = await storage()
        .ref(`inspection-photo-${newId}.jpg`)
        .getDownloadURL();
      setUploadedImages((currentImages) => [...currentImages, url]);
    });
  };

  useEffect(() => {
    if (uploadedImages.length === initialImageArrayLength) {
      db.collection('carriers-records')
        .doc('c87U6WtSNRybGF0WrAXb')
        .collection('orders')
        .doc(route.params.order_id)
        .update({
          order_status: 'Picked',
          'pickup.pickup_conditions.name_on_pickup_signature': name,
          'pickup.pickup_conditions.email_on_pickup_signature': email,
          'pickup.pickup_conditions.odometer': odometer,
          'pickup.pickup_conditions.driver_pickup_notes': pickupNotes,
          'pickup.pickup_conditions.pickup_inspection_images_links': uploadedImages,
          'pickup.pickup_conditions.signature_image_link': signatureUploadedUri,
        });
        setUploadDone(true)
    }
  }, [uploadedImages]);

  useEffect(() => {
    if (uploadDone) {
      navigation.navigate('PickupOrders');
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
