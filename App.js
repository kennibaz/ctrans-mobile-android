import React from 'react';
import firestore from '@react-native-firebase/firestore';
import {Provider as PaperProvider} from 'react-native-paper';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import {BGUploadTask} from './background/BackGroundTask';

import ordersReducer from './store/reducers/orders';

import MainNavigator from './navigation/MainNavigator';

import TestScreen from './screens/testScreen';

const db = firestore();

const rootReducer = combineReducers({
  order: ordersReducer,
});
const store = createStore(rootReducer);

export default function App1() {
  return (
    <PaperProvider>
      <Provider store={store}>
        <MainNavigator />
        {/* <TestScreen/> */}
      </Provider>
    </PaperProvider>
  );
}
