import React, {useRef, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import uuid from 'react-uuid';
import firestore from '@react-native-firebase/firestore';
import SignatureScreen from 'react-native-signature-canvas';
import {TextInput} from 'react-native-paper';
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
  const [readyToSave, setReadyToSave] = useState(false)


  const onPickupHandler = async ()=>{
    db.
    collection('carriers-records')
    .doc('c87U6WtSNRybGF0WrAXb')
    .collection('orders').doc(route.params.order_id).update({
        order_status: "Picked"
    })
  }

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
    setReadyToSave(true)
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
