import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import PickupOrdersScreen from '../screens/PickupOrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import PhotoInspectionScreen from "../screens/PhotoInspectionScreen"
import DamagesInspectionScreen from "../screens/DamagesInspectionScreen"
import InspectionDataScreen from "../screens/InspectionDataScreen"

const PickupOrdersStackNavigator = createStackNavigator();
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
        {/* <InspectionStackNavigator.Screen
        name="SignaturePad"
        component={SignaturePad}
        options={{
          headerShown: true,
        }}
      /> */}
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
