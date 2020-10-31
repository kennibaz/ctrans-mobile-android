export const LOAD_ORDERS = 'LOAD_ORDERS'
export const UPDATE_IMAGES= 'UPDATE_IMAGES'
export const UPDATE_SIGNATURE = "UPDATE_SIGNATURE"

export const loadOrders = (data) => {
 
    return {type: LOAD_ORDERS, orderData: data }
}

export const updateImages = (order_id, imageSet, odometer, notes) => {
 
    return {type: UPDATE_IMAGES, order_id: order_id, imageSet, odometer, driver_pickup_notes: notes}
}


export const updateSignature = (order_id, signature, name, email) => {
 
    return {type: UPDATE_SIGNATURE, order_id: order_id, signature, name, email}
}