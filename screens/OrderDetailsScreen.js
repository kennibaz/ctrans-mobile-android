import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Card, Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrderDetailsScreen({route, navigation}) {
  const [order, setOrder] = useState('');
  const [existedOrder, setExistedOrder] = useState('');
  const [pickupOrders, setPickupOrders] = useState([]);
  const [pickupOrdersLocalStorage, setPickupOrdersLocalStorage] = useState([]);
  useEffect(() => {
    const result = async () => {
      try {
        let fetchFromAsyncStorage = await AsyncStorage.getItem('pickupOrders');
        setPickupOrders(JSON.parse(fetchFromAsyncStorage));
      } catch (e) {
        console.log('something went wrong');
      }
    };
    result();
  }, [route.params]);

  useEffect(() => {
    const result = async () => {
      try {
        let fetchFromAsyncStorage = await AsyncStorage.getItem(
          'pickupOrdersLocalStorage',
        );
        setPickupOrdersLocalStorage(JSON.parse(fetchFromAsyncStorage));
      } catch (e) {
        console.log('something went wrong');
      }
    };
    result();
  }, [route.params]);

  useEffect(() => {
    if (pickupOrdersLocalStorage && pickupOrdersLocalStorage.length > 0) {
      let existingOrder = pickupOrdersLocalStorage.filter((order) => {
        return order.key === route.params.order_id;
      });
      setExistedOrder(existingOrder);
    }
  }, [pickupOrdersLocalStorage]);

  useEffect(() => {
    let foundOrder = pickupOrders.filter((order) => {
      return order.key === route.params.order_id;
    });
    setOrder(foundOrder[0]);
  }, [pickupOrders]);

  if (!order) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  if (
    pickupOrdersLocalStorage &&
    pickupOrdersLocalStorage.length > 0 &&
    !existedOrder
  ) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Card style={styles.card}>
        <Card.Content>
          <View id="column_1">
            <Text>Payment</Text>
            <Text>{order.order_payment.order_total_amount}</Text>
            <Text>{order.is_edit_mode && 'EDIT '}</Text>
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.card_title}>
        <Card.Content>
          <View id="column_1">
            <Text style={styles.title_text}>1 Vehicle</Text>
            <Text style={styles.title_text}>
              {order.loadingInProgress ? 'upload in progress' : ''}
            </Text>
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <View id="column_1">
            <Text>
              {order.vehiclesArray[0].year} {order.vehiclesArray[0].make}{' '}
              {order.vehiclesArray[0].model}
            </Text>
          </View>
        </Card.Content>
        <Card.Actions>
          {existedOrder.length > 0 ? (
            <Button
              icon="camera"
              mode="contained"
              onPress={() => {
                navigation.navigate('Inspection', {
                  screen: 'DamageInspection',
                  params: {
                    order_id: route.params.order_id,
                    is_edit_mode: true,
                    existed_order_data: existedOrder,
                  },
                });
              }}
              style={styles.button}>
              Edit inspection
            </Button>
          ) : (
            <Button
              icon="camera"
              mode="contained"
              onPress={() => {
                navigation.navigate('Inspection', {
                  screen: 'PhotoInspection',
                  params: {
                    order_id: route.params.order_id,
                  },
                });
              }}
              style={styles.button}>
              Start inspection
            </Button>
          )}
        </Card.Actions>
      </Card>

      <Card style={styles.card_title}>
        <Card.Content>
          <View id="column_1">
            <Text style={styles.title_text}>Pickup Information</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View id="column_1">
            <Text> {order.pickup.pickup_address.business_name}</Text>
            <Text> {order.pickup.pickup_address.address}</Text>
            <Text>
              {order.pickup.pickup_address.city}{' '}
              {order.pickup.pickup_address.state}{' '}
              {order.pickup.pickup_address.zip}
            </Text>
            <Text>{order.pickup.pickup_address.contact_name}</Text>
            <Text>Phone: {order.pickup.pickup_address.phone}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card_title}>
        <Card.Content>
          <View id="column_1">
            <Text style={styles.title_text}>Delivery Information</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View id="column_1">
            <Text> {order.delivery.delivery_address.business_name}</Text>
            <Text> {order.delivery.delivery_address.address}</Text>
            <Text>
              {order.delivery.delivery_address.city}{' '}
              {order.delivery.delivery_address.state}{' '}
              {order.delivery.delivery_address.zip}
            </Text>
            <Text>{order.delivery.delivery_address.contact_name}</Text>
            <Text>Phone: {order.delivery.delivery_address.phone}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card_title}>
        <Card.Content>
          <View id="column_1">
            <Text style={styles.title_text}>Payment</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View id="column_1">
            <Text>
              Order amount: $ {order.order_payment.order_total_amount}
            </Text>
            <Text>Driver pay: ${order.order_payment.driver_pay}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card_title}>
        <Card.Content>
          <View id="column_1">
            <Text style={styles.title_text}>Shipper</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View id="column_1">
            <Text> {order.shipper.business_name}</Text>
            <Text> {order.shipper.address}</Text>
            <Text>
              {order.shipper.city} {order.shipper.state} {order.shipper.zip}
            </Text>
            <Text>{order.shipper.contact_name}</Text>
            <Text>Phone: {order.shipper.phone}</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => {
              navigation.navigate('Inspection', {
                screen: 'InspectionSignature',
                params: {
                  order_id: route.params.order_id,
                },
              });
            }}
            style={styles.button}>
            Get signature
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    justifyContent: 'flex-start',
  },
  row_title: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    width: '100%',
  },
  row_3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
  card_title: {
    backgroundColor: 'azure',
  },
  title_text: {fontWeight: '700'},
});
