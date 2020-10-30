import React, {useEffect, useState} from 'react';
import {View, Text,FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator, StyleSheet} from 'react-native';
const db = firestore();

export default function App1() {
  const [fsOrders, setFsOrders] = useState([]);
  const [readyToLoad, setReadyToLoad] = useState(false);
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users

  useEffect(() => {
    const subscriber = firestore()
      .collection('carriers-records')
      .doc('c87U6WtSNRybGF0WrAXb')
      .collection('orders')
      .onSnapshot((querySnapshot ) => {
        const orders = []
        querySnapshot.forEach(documentSnapshot => {
          orders.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
  
        setUsers(orders);
        setLoading(false);
      });


    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View>
      <Text>Deploy</Text>
      <FlatList
      data={users}
      renderItem={({ item }) => (
        <View style={{ height: 50, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>User ID: {item.id}</Text>
          <Text>User Name: {item.order_payment.order_total_amount}</Text>
        </View>
      )}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

// useEffect(() => {
//   const result = async () => {
//     // const order_r = await db
//     //   .collection('carriers-records')
//     //   .doc('c87U6WtSNRybGF0WrAXb')
//     //   .collection('orders')
//     //   .get();
//     // setFsOrders(order_r.docs);

//     // const subs = firestore()
//     //   .collection('carriers-records')
//     //   .doc('c87U6WtSNRybGF0WrAXb')
//     //   .collection('orders')
//     //   .doc('gDEBAeJdYIesfP3G7RlB')
//     //   .onSnapshot((doc) => {
//     //     console.log(doc.data().created_at);

//     //   });

//     firestore().collection('carriers-records').doc('c87U6WtSNRybGF0WrAXb').collection('orders').get().then(querySnapshot=>{
//       console.log("total orders", querySnapshot.size)
//       querySnapshot.forEach(doc=>{
//         console.log(doc.data())
//       })
//     })
//   };
//   result();

//   // function onResult(QuerySnapshot) {
//   //   console.log('Got Users collection result.', QuerySnapshot.docs);
//   //   let new_array = []
//   //   querySnapshot.forEach(function (doc) {

//   //     let new_obj = {
//   //       id: doc.id,
//   //       data: doc.data(),
//   //     };

//   //     console.log(new_obj)

//   //     new_array.push(new_obj)
//   //     setFsOrders(new_array);
//   //   });
//   // }

//   // function onError(error) {
//   //   console.error(error);
//   // }

//   //  db.collection('Users').doc('c87U6WtSNRybGF0WrAXb')
//   // .collection('orders').onSnapshot(onResult, onError);

//   // var orderRef = db
//   //   .collection('carriers-records')
//   //   .doc('c87U6WtSNRybGF0WrAXb')
//   //   .collection('orders');

//   // orderRef.onSnapshot((querySnapshot) => {
//   //   let new_array = [];
//   //   querySnapshot.forEach(function (doc) {
//   //     let new_obj = {
//   //       id: doc.id,
//   //       data: doc.data(),
//   //     };
//   //     setFsOrdersTest(doc.data());

//   //     new_array.push(new_obj);
//   //     // setFsOrders(new_array);
//   //     setFsOrders((orders) => [...orders, new_obj]);
//   //   });
//   // });
//   setReadyToLoad(true);
// });
