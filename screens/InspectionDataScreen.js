import React, {useState, useEffect} from 'react';
import {TextInput} from 'react-native-paper';
import {View, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Orientation from 'react-native-orientation-locker';

export default function InspectionDataScreen({navigation, route}) {
  const [pickupOrders, setPickupOrders] = useState([]);
  const [deliveryOrders, setDeliveryOrders] = useState([]);

  const [odometer, setOdometer] = useState('');
  const [notes, setNotes] = useState('');
  useEffect(() => {
    Orientation.lockToPortrait(); //this will lock the view to Landscape
  });
  useEffect(() => {
    setOdometer(route.params.odometer);
    setNotes(route.params.driver_pickup_notes);
  }, []);

  useEffect(() => {
    const result = async () => {
      console.log('useeffect');
      if (route.params.mode === 'pickup') {
        console.log('useeffect2');
        try {
          let fetchFromAsyncStorage = await AsyncStorage.getItem(
            'pickupOrders',
          );
          setPickupOrders(JSON.parse(fetchFromAsyncStorage));
        } catch (e) {
          console.log('something went wrong');
        }
      }
      if (route.params.mode === 'delivery') {
        try {
          let fetchFromAsyncStorage = await AsyncStorage.getItem(
            'deliveryOrders',
          );
          setDeliveryOrders(JSON.parse(fetchFromAsyncStorage));
        } catch (e) {
          console.log('something went wrong');
        }
      }
    };
    result();
  },[]);

  const saveButtonHandler = async () => {
    if (!route.params.is_edit_mode) {
      if (route.params.mode === 'pickup') {
        console.log('start');
        let foundOrder = pickupOrders.filter((order) => {
          return order.key === route.params.order_id;
        });
        console.log(foundOrder);
        let currentPickupOrders = [];
        foundOrder[0].imageSet = route.params.imageSet;
        foundOrder[0].odometer = odometer;
        foundOrder[0].driver_pickup_notes = notes;
        foundOrder[0].is_edit_mode = true;

        try {
          let fetchFromAsyncStorage = await AsyncStorage.getItem(
            'pickupOrdersLocalStorage',
          );
          if (fetchFromAsyncStorage !== null) {
            currentPickupOrders = JSON.parse(fetchFromAsyncStorage);
          }
        } catch (e) {
          console.log('something went wrong');
        }

        currentPickupOrders = [...currentPickupOrders, foundOrder[0]];
        console.log(currentPickupOrders);

        try {
          await AsyncStorage.setItem(
            'pickupOrdersLocalStorage',
            JSON.stringify(currentPickupOrders),
          );
        } catch (e) {
          console.log('something went wrong');
        }

        navigation.navigate('OrderDetails', {
          order_id: route.params.order_id,
          reload: true,
          mode: route.params.mode,
        });
      }
      if (route.params.mode === 'delivery') {
        let foundOrder = deliveryOrders.filter((order) => {
          return order.key === route.params.order_id;
        });
        let currentDeliveryOrders = [];
        foundOrder[0].imageSet = route.params.imageSet;
        foundOrder[0].odometer = odometer;
        foundOrder[0].driver_pickup_notes = notes;
        foundOrder[0].is_edit_mode = true;

        try {
          let fetchFromAsyncStorage = await AsyncStorage.getItem(
            'deliveryOrdersLocalStorage',
          );
          if (fetchFromAsyncStorage !== null) {
            currentDeliveryOrders = JSON.parse(fetchFromAsyncStorage);
          }
        } catch (e) {
          console.log('something went wrong');
        }

        currentDeliveryOrders = [...currentDeliveryOrders, foundOrder[0]];

        try {
          await AsyncStorage.setItem(
            'deliveryOrdersLocalStorage',
            JSON.stringify(currentDeliveryOrders),
          );
        } catch (e) {
          console.log('something went wrong');
        }

        navigation.navigate('OrderDetails', {
          order_id: route.params.order_id,
          reload: true,
          mode: route.params.mode,
        });
      }
    }
    if (route.params.is_edit_mode) {
      let foundOrder = route.params.existed_order;
      let currentLocalOrders;

      try {
        let fetchFromAsyncStorage = await AsyncStorage.getItem(
          'pickupOrdersLocalStorage',
        );
        if (fetchFromAsyncStorage !== null) {
          currentLocalOrders = JSON.parse(fetchFromAsyncStorage);
        }
      } catch (e) {
        console.log('something went wrong');
      }

      let indexOfOrder = currentLocalOrders.findIndex((order) => {
        return order.key === foundOrder.key;
      });

      foundOrder.imageSet = route.params.imageSet;
      foundOrder.odometer = odometer;
      foundOrder.driver_pickup_notes = notes;
      foundOrder.is_edit_mode = true;

      currentLocalOrders.splice(indexOfOrder, 1, foundOrder);
      console.log('after splice', currentLocalOrders);

      try {
        await AsyncStorage.setItem(
          'pickupOrdersLocalStorage',
          JSON.stringify(currentLocalOrders),
        );
      } catch (e) {
        console.log('something went wrong');
      }

      navigation.navigate('OrderDetails', {
        order_id: route.params.order_id,
        reload: true,
      });
    }
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
