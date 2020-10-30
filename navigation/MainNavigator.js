import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import {PickupOrdersNavigator} from './OrdersNavigator';

const Tab = createBottomTabNavigator();
const ordersNav = createStackNavigator();

function OrderTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Pickup" component={PickupOrdersNavigator} />

      </Tab.Navigator>
    );
  }

  export default function MainNavigator() {
    return (
      <NavigationContainer>
        <ordersNav.Navigator>
          <ordersNav.Screen name="Tabs" component={OrderTabs} />
        </ordersNav.Navigator>
      </NavigationContainer>
    );
  }
  