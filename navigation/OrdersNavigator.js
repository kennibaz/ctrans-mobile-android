import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import PickupOrdersScreen from '../screens/PickupOrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';

const PickupOrdersStackNavigator = createStackNavigator();


export const PickupOrdersNavigator = () => {
    return (
      <PickupOrdersStackNavigator.Navigator>
        <PickupOrdersStackNavigator.Screen
          name="PickupOrders"
          component={PickupOrdersScreen}
        />
        <PickupOrdersStackNavigator.Screen
          name="OrderDetails"
          component={OrderDetailsScreen}
        />
      </PickupOrdersStackNavigator.Navigator>
    );
  };