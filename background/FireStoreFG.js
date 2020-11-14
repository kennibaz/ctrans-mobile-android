import React, {useEffect} from 'react'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import uuid from 'react-uuid';
import axios from 'axios';
const db = firestore();

export default function FireStoreFG() {
    useEffect(() => {
        const subscriber = firestore()
          .collection('carriers-records')
          .doc('c87U6WtSNRybGF0WrAXb')
          .collection('orders')
          .onSnapshot((querySnapshot) => {
            let uploadingOrder;
            querySnapshot.docChanges().forEach((change) => {
              if (change.type === 'modified') {
                rawData = change.doc.data();
                rawId = change.doc.id;
    
                if (
                  (rawData.order_status === 'Picked',
                  rawData.readyToUploadPickupImages &&
                    rawData.pickup.pickup_conditions.upload
                      .number_of_images_to_upload !==
                      rawData.pickup.pickup_conditions.upload
                        .number_of_uploaded_images)
                ) {
                  uploadingOrder = rawData;
                  const newId = uuid();
                  let counter =
                    uploadingOrder.pickup.pickup_conditions.upload
                      .number_of_uploaded_images;
    
                  const result = async () => {
                    const reference = storage().ref(
                      `/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`,
                    );
                    const pathToFile =
                      uploadingOrder.pickup.pickup_conditions.upload
                        .images_to_upload[0];
                    await reference.putFile(pathToFile);
                    const url = await storage()
                      .ref(`/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`)
                      .getDownloadURL();
                    counter = counter + 1;
                    db.doc(
                      `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${rawId}`,
                    ).update({
                      'pickup.pickup_conditions.pickup_inspection_images_links': firestore.FieldValue.arrayUnion(
                        url,
                      ),
                      'pickup.pickup_conditions.upload.images_to_upload': firestore.FieldValue.arrayRemove(
                        pathToFile,
                      ),
                      'pickup.pickup_conditions.upload.number_of_uploaded_images': counter,
                    });
                  };
                  result();
                }
                if (
                  rawData.order_status === 'Picked' &&
                  rawData.readyToUploadPickupSignature
                ) {
                  uploadingOrder = rawData;
                  const newId = uuid();
                  const result = async () => {
                    const reference = storage().ref(
                      `/c87U6WtSNRybGF0WrAXb/inspection-signature-${newId}.jpg`,
                    );
                    const pathToFile =
                      uploadingOrder.pickup.pickup_conditions.upload.signature_file;
                    await reference.putFile(pathToFile);
                    const url = await storage()
                      .ref(
                        `/c87U6WtSNRybGF0WrAXb/inspection-signature-${newId}.jpg`,
                      )
                      .getDownloadURL();
                    db.doc(
                      `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${rawId}`,
                    ).update({
                      'pickup.pickup_conditions.pickup_inspection_signature_link': url,
                      'pickup.pickup_conditions.upload.signature_file': firestore.FieldValue.delete(),
                      readyToUploadPickupSignature: false,
                      readyToUploadPickupInspectionDiagram: true,
                    });
                  };
                  result();
                }
                if (
                  rawData.order_status === 'Picked' &&
                  rawData.readyToUploadPickupInspectionDiagram
                ) {
                  uploadingOrder = rawData;
                  const newId = uuid();
                  const result = async () => {
                    const reference = storage().ref(
                      `/c87U6WtSNRybGF0WrAXb/inspection-diagram-${newId}.jpg`,
                    );
                    const pathToFile =
                      uploadingOrder.pickup.pickup_conditions.upload
                        .inspection_diagram;
                    await reference.putFile(pathToFile);
                    const url = await storage()
                      .ref(`/c87U6WtSNRybGF0WrAXb/inspection-diagram-${newId}.jpg`)
                      .getDownloadURL();
                    db.doc(
                      `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${rawId}`,
                    ).update({
                      'pickup.pickup_conditions.pickup_inspection_diagram_link': url,
                      'pickup.pickup_conditions.upload.inspection_diagram': firestore.FieldValue.delete(),
                      readyToUploadPickupInspectionDiagram: false,
                      readyToUploadPickupImages: true,
                    });
                  };
                  result();
                }
                if (
                  (rawData.order_status === 'Picked',
                  rawData.readyToUploadPickupImages &&
                    rawData.pickup.pickup_conditions.upload
                      .number_of_images_to_upload ===
                      rawData.pickup.pickup_conditions.upload
                        .number_of_uploaded_images)
                ) {
                  uploadingOrder = rawData;
                  const result = async () => {
                    console.log('set to false');
    
                    db.doc(
                      `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${rawId}`,
                    ).update({
                      readyToUploadPickupImages: false,
                      readyForPickupBOL: true
                    });
                    
                  };
                  result();
                }
                // }
              }
            });
          });
    
        // Unsubscribe from events when no longer in use
        return () => subscriber();
      }, []);
    
      useEffect(() => {
        const subscriber = firestore()
          .collection('carriers-records')
          .doc('c87U6WtSNRybGF0WrAXb')
          .collection('orders')
          .onSnapshot((querySnapshot) => {
            let uploadingOrder;
            querySnapshot.docChanges().forEach((change) => {
              if (change.type === 'modified') {
                rawData = change.doc.data();
                rawId = change.doc.id;
    
                if (
                  (rawData.order_status === 'Delivered',
                  rawData.readyToUploadDeliveryImages &&
                    rawData.delivery.delivery_conditions.upload
                      .number_of_images_to_upload !==
                      rawData.delivery.delivery_conditions.upload
                        .number_of_uploaded_images)
                ) {
                  uploadingOrder = rawData;
                  const newId = uuid();
                  let counter =
                    uploadingOrder.delivery.delivery_conditions.upload
                      .number_of_uploaded_images;
    
                  const result = async () => {
                    const reference = storage().ref(
                      `/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`,
                    );
                    const pathToFile =
                      uploadingOrder.delivery.delivery_conditions.upload
                        .images_to_upload[0];
                    await reference.putFile(pathToFile);
                    const url = await storage()
                      .ref(`/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`)
                      .getDownloadURL();
                    counter = counter + 1;
                    db.doc(
                      `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${rawId}`,
                    ).update({
                      'delivery.delivery_conditions.delivery_inspection_images_links': firestore.FieldValue.arrayUnion(
                        url,
                      ),
                      'delivery.delivery_conditions.upload.images_to_upload': firestore.FieldValue.arrayRemove(
                        pathToFile,
                      ),
                      'delivery.delivery_conditions.upload.number_of_uploaded_images': counter,
                    });
                  };
                  result();
                }
                if (
                  rawData.order_status === 'Delivered' &&
                  rawData.readyToUploadDeliverySignature
                ) {
                  uploadingOrder = rawData;
                  const newId = uuid();
                  const result = async () => {
                    const reference = storage().ref(
                      `/c87U6WtSNRybGF0WrAXb/inspection-signature-${newId}.jpg`,
                    );
                    const pathToFile =
                      uploadingOrder.delivery.delivery_conditions.upload
                        .signature_file;
                    await reference.putFile(pathToFile);
                    const url = await storage()
                      .ref(
                        `/c87U6WtSNRybGF0WrAXb/inspection-signature-${newId}.jpg`,
                      )
                      .getDownloadURL();
                    db.doc(
                      `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${rawId}`,
                    ).update({
                      'delivery.delivery_conditions.delivery_inspection_signature_link': url,
                      'delivery.delivery_conditions.upload.signature_file': firestore.FieldValue.delete(),
                      readyToUploadDeliverySignature: false,
                      readyToUploadDeliveryInspectionDiagram: true,
                    });
                  };
                  result();
                }
                if (
                  rawData.order_status === 'Delivered' &&
                  rawData.readyToUploadDeliveryInspectionDiagram
                ) {
                  uploadingOrder = rawData;
                  const newId = uuid();
                  const result = async () => {
                    const reference = storage().ref(
                      `/c87U6WtSNRybGF0WrAXb/inspection-diagram-${newId}.jpg`,
                    );
                    const pathToFile =
                      uploadingOrder.delivery.delivery_conditions.upload
                        .inspection_diagram;
                    await reference.putFile(pathToFile);
                    const url = await storage()
                      .ref(`/c87U6WtSNRybGF0WrAXb/inspection-diagram-${newId}.jpg`)
                      .getDownloadURL();
                    db.doc(
                      `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${rawId}`,
                    ).update({
                      'delivery.delivery_conditions.delivery_inspection_diagram_link': url,
                      'delivery.delivery_conditions.upload.inspection_diagram': firestore.FieldValue.delete(),
                      readyToUploadDeliveryInspectionDiagram: false,
                      readyToUploadDeliveryImages: true,
                    });
                  };
                  result();
                }
                if (
                  (rawData.order_status === 'Delivery',
                  rawData.readyToUploadDeliveryImages &&
                    rawData.delivery.delivery_conditions.upload
                      .number_of_images_to_upload ===
                      rawData.delivery.delivery_conditions.upload
                        .number_of_uploaded_images)
                ) {
                  uploadingOrder = rawData;
                  const result = async () => {
                    console.log('set to false');
    
                    db.doc(
                      `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${rawId}`,
                    ).update({
                      readyToUploadDeliveryImages: false,
                      readyForDeliveryBOL: true
                    });
                  };
                  result();
                }
                // }
              }
            });
          });
    
        // Unsubscribe from events when no longer in use
        return () => subscriber();
      }, []);
    
      useEffect(() => {
        const subscriber = firestore()
          .collection('carriers-records')
          .doc('c87U6WtSNRybGF0WrAXb')
          .collection('orders')
          .onSnapshot((querySnapshot) => {
            let uploadingOrder;
            querySnapshot.docChanges().forEach((change) => {
              if (change.type === 'modified') {
                rawData = change.doc.data();
                rawId = change.doc.id;
    
                if (rawData.readyForPickupBOL === true) {
                  uploadingOrder = rawData;
    
                  const result = async () => {
                    await axios.post(
                      'https://ctrans.herokuapp.com/api/add-data',
                      {
                        documentUri: `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${change.doc.id}`,
                        status: 'picked',
                      },
                    );
                  };
                  result();
                  db.doc(
                    `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${rawId}`,
                  ).update({
                  
                    readyForPickupBOL: false
                  });
                }
    
    
                if (rawData.readyForDeliveryBOL === true) {
                  uploadingOrder = rawData;
    
                  const result = async () => {
                    await axios.post(
                      'https://ctrans.herokuapp.com/api/add-data',
                      {
                        documentUri: `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${change.doc.id}`,
                        status: 'delivered',
                      },
                    );
                  };
                  result();
                  db.doc(
                    `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${rawId}`,
                  ).update({
                  
                    readyForDeliveryBOL: false
                  });
                }
               
          
              }
            });
          });
    
        // Unsubscribe from events when no longer in use
        return () => subscriber();
      }, []);
      // useEffect(() => {
      //   const subscriber = firestore()
      //     .collection('carriers-records')
      //     .doc('c87U6WtSNRybGF0WrAXb')
      //     .collection('orders')
      //     .where('ready_for_pickup_BOL', '==', true)
      //     .onSnapshot((querySnapshot) => {
      //       const orders = [];
      //       querySnapshot.forEach((documentSnapshot) => {
      //         rawData = documentSnapshot.data();
      //         (id = documentSnapshot.id),
      //           orders.push({
      //             ...rawData,
      //             key: documentSnapshot.id,
      //           });
      //       });
      //       const result = async () => {
      //         const httpReq = await axios.post(
      //           'https://ctrans.herokuapp.com/api/add-data',
      //           {
      //             documentUri: `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${documentSnapshot.id}`,
      //             status: 'picked',
      //           },
      //         );
      //       };
      //       result();
      //     });
    
      //   // Unsubscribe from events when no longer in use
      //   return () => subscriber();
      // }, []);
    
    return (
       null
    )
}
