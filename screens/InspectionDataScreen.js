import React, {useState, useEffect} from 'react';
import {TextInput} from 'react-native-paper';
import {View, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-uuid';

import {useDispatch} from 'react-redux';
import {updateImages} from '../store/actions/orders';

export default function InspectionDataScreen({navigation, route}) {
  const dispatch = useDispatch();
  const [odometer, setOdometer] = useState('');
  const [notes, setNotes] = useState('');
  useEffect(() => {
    setOdometer(route.params.odometer)
    setNotes(route.params.driver_pickup_notes)
  }, []);

  const saveButtonHandler = async () => {
    dispatch(
      updateImages(
        route.params.order_id,
        route.params.imageSet,
        odometer,
        notes,
      ),
    );

    navigation.navigate('OrderDetails', {
      order_id: route.params.order_id,
    });
  };

  return (
    <View>
      <TextInput
        label="Odometer"
        value={odometer}
        onChangeText={(odometerInfo) => setOdometer(odometerInfo)}
      />
      <TextInput
        label="Notes"
        value={notes}
        onChangeText={(notes) => setNotes(notes)}
      />
      <Button title="Save" onPress={saveButtonHandler} />
    </View>
  );
}
