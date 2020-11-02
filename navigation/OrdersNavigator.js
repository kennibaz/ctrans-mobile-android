import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PickupOrdersScreen from '../screens/PickupOrdersScreen';
import DeliveryOrdersScreen from '../screens/DeliveryOrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import PhotoInspectionScreen from '../screens/PhotoInspectionScreen';
import DamagesInspectionScreen from '../screens/DamagesInspectionScreen';
import InspectionDataScreen from '../screens/InspectionDataScreen';
import InspectionSignatureScreen from '../screens/InspectionSignatureScreen';

const PickupOrdersStackNavigator = createStackNavigator();
const DeliveryOrdersStackNavigator = createStackNavigator();
const InspectionStackNavigator = createStackNavigator();

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

export const DeliveryOrdersNavigator = () => {
  return (
    <DeliveryOrdersStackNavigator.Navigator>
      <DeliveryOrdersStackNavigator.Screen
        name="DeliveryOrders"
        component={DeliveryOrdersScreen}
      />
      <DeliveryOrdersStackNavigator.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
      />
    </DeliveryOrdersStackNavigator.Navigator>
  );
};

export const InspectionNavigator = () => {
  return (
    <InspectionStackNavigator.Navigator>
      <InspectionStackNavigator.Screen
        name="PhotoInspection"
        component={PhotoInspectionScreen}
        options={{
          headerShown: false,
        }}
      />
      <InspectionStackNavigator.Screen
        name="DamageInspection"
        component={DamagesInspectionScreen}
        options={{
          headerShown: false,
        }}
      />
  
      <InspectionStackNavigator.Screen
        name="InspectionData"
        component={InspectionDataScreen}
        options={{
          headerShown: true,
        }}
      />
      <InspectionStackNavigator.Screen
        name="InspectionSignature"
        component={InspectionSignatureScreen}
        options={{
          headerShown: true,
        }}
      />
      {/* <InspectionStackNavigator.Screen
        name="MergedImageTest"
        component={ShowMergedImageTest}
        options={{
          headerShown: true,
        }}
      /> */}
    </InspectionStackNavigator.Navigator>
  );
};
