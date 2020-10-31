import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';

import {Card} from 'react-native-paper';
import {loadOrders} from '../store/actions/orders';
const db = firestore();

export default function PickupOrdersScreen(props) {
  const pickupOrders = useSelector((state) => state.order.pickupOrders);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [orders, setOrders] = useState([]); // Initial empty array
  const [testOrders, setTestOrders] = useState([]); // Initial empty array

  useEffect(() => {
    const subscriber = firestore()
      .collection('carriers-records')
      .doc('c87U6WtSNRybGF0WrAXb')
      .collection('orders')
      .onSnapshot((querySnapshot) => {
        const orders = [];
        querySnapshot.forEach((documentSnapshot) => {
          orders.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        dispatch(loadOrders(orders))
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(()=>{
    setOrders(pickupOrders)
    setLoading(false);
  },[pickupOrders])

  if (loading) {
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={orders}
        renderItem={({item}) => (
            <View style={styles.screen} >
            <Card style={styles.card}>
              <Card.Content>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate('OrderDetails', {
                        order_data: item,
                        order_id: item.key
                      });
                    }}>
                    <View>
                      <View id="row_1" style={styles.row}>
                        <Text style={{fontWeight: '700'}}>
                          {item.order_shipper_inner_id}
                        </Text>
                        <Text>
                          $ {item.order_payment.order_total_amount}
                        </Text>
                      </View>
                      <View id="row_2" style={styles.row}>
                        <Text>
                          {item.vehiclesArray.year}{' '}
                          {item.vehiclesArray.make}{' '}
                          {item.vehiclesArray.model}
                        </Text>
                      </View>
                      <View id="row_3" style={styles.row}>
                        <Text>
                          {item.pickup.pickup_address.city},{' '}
                          {item.pickup.pickup_address.state}{' '}
                          {item.pickup.pickup_address.zip}{' '}
                        </Text>
                        <Text>
                          {item.pickup.pickup_scheduled_first_date}
                        </Text>
                      </View>
                      <View id="row_4" style={styles.row}>
                        <Text>
                          {item.delivery.delivery_address.city},{' '}
                          {item.delivery.delivery_address.state}{' '}
                          {item.delivery.delivery_address.zip}{' '}
                        </Text>
                        <Text>
                          {item.delivery.delivery_scheduled_first_date}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    card: {
      padding: 2,
      marginBottom: 4,
      marginTop: 4,
      width: '97%',
      borderRadius: 5,
      borderLeftWidth: 4,
      borderColor: 'blue',
    },
  });
  
