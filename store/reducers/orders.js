import {LOAD_PICKUP_ORDERS} from '../actions/orders';
import {LOAD_DELIVERY_ORDERS} from '../actions/orders';
import {UPDATE_IMAGES} from '../actions/orders';
import {UPDATE_SIGNATURE} from '../actions/orders';

const initialState = {
  pickupOrders: [],
  deliveryOrders: [],
};

const orderReducer = (state = initialState, action) => {
  let currentPickupOrders
  let indexOfOrder
  let foundOrder

  switch (action.type) {
    case LOAD_PICKUP_ORDERS:
      return {...state, pickupOrders: action.orderData};
      case LOAD_DELIVERY_ORDERS:
        return {...state, deliveryOrders: action.orderData};
    case UPDATE_IMAGES:
      currentPickupOrders = state.pickupOrders;
      indexOfOrder = currentPickupOrders.findIndex(
        (element) => element.key === action.order_id,
      );
      foundOrder = currentPickupOrders.filter((order) => {
        return order.key === action.order_id;
      });
      foundOrder[0].imageSet = action.imageSet;
      foundOrder[0].odometer = action.odometer;
      foundOrder[0].driver_pickup_notes = action.driver_pickup_notes;
      foundOrder[0].is_edit_mode = true
      currentPickupOrders.splice(indexOfOrder, 1, foundOrder[0]);
      return {...state, pickupOrders: currentPickupOrders};
    case UPDATE_SIGNATURE:
      currentPickupOrders = state.pickupOrders;
      indexOfOrder = currentPickupOrders.findIndex(
        (element) => element._id === action.order_id,
      );
      foundOrder = currentPickupOrders.filter((order) => {
        return order._id === action.order_id;
      });
      foundOrder[0].signature = action.signature;
      foundOrder[0].nameOnSignature = action.name;
      foundOrder[0].emailOnSignature = action.email;
      currentPickupOrders.splice(indexOfOrder, 1, foundOrder[0]);
      return {...state, pickupOrders: currentPickupOrders};

    default:
      return state;
  }
  return state;
};

export default orderReducer;
