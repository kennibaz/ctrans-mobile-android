import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import uuid from 'react-uuid';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
const db = firestore();

export const BGUploadTask = BackgroundTimer.runBackgroundTimer(async () => {
  console.log('running in BG');
  let uploadDone = false;
  try {
    const value = await AsyncStorage.getItem('TASKS');
    if (value !== null) {
      let data = JSON.parse(value);
      if (data[0].taskBody.mode === 'pickup') {
        const created_at = new Date();
        const new_activity = {
          activity_date: created_at,
          activity_type: 'Order was picked up',
          activity_user: 'driver',
          activity_log: `Order was picked up at ${created_at}`,
        };

        let uploadedImagesUri = [];
        let uploadedDiagramUri;

        const newSignUuid = uuid();
        const reference = storage().ref(
          `/c87U6WtSNRybGF0WrAXb/signature-${newSignUuid}.jpg`,
        );
        const signatureUri = data[0].taskBody.signatureUri;
        const imagesArray = data[0].taskBody.imagesArray;

        imagesArray.forEach(async (image) => {
          console.log(image);
          if (image.image_type === 'photo') {
            const newId = uuid();
            const reference = storage().ref(
              `/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`,
            );
            const pathToFile = image.mergedImage
              ? image.mergedImage
              : image.backGroundImageUri;
            await reference.putFile(pathToFile);
            const url = await storage()
              .ref(`/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`)
              .getDownloadURL();
            // setUploadedImages((currentImages) => [...currentImages, url]);
            uploadedImagesUri.push(url);
            console.log('rest of the array is', imagesArray.length);
            imagesArray.shift();
            console.log('done with photo');
          }
          if (image.image_type === 'diagram') {
            const newId = uuid();
            const reference = storage().ref(
              `/c87U6WtSNRybGF0WrAXb/inspection-diagram-${newId}.jpg`,
            );
            const pathToFile = image.mergedImage
              ? image.mergedImage
              : image.backGroundImageUri;
            await reference.putFile(pathToFile);
            const url = await storage()
              .ref(`/c87U6WtSNRybGF0WrAXb/inspection-diagram-${newId}.jpg`)
              .getDownloadURL();
            // setUploadedImages((currentImages) => [...currentImages, url]);
            uploadedDiagramUri = url;
            console.log('diagram URI', uploadedDiagramUri);
            console.log('rest of the array is', imagesArray.length);
            imagesArray.shift();
            console.log('done with diagram');
          }
        });

        await reference.putFile(signatureUri);
        const signatureResultUri = await storage()
          .ref(`/c87U6WtSNRybGF0WrAXb/signature-${newSignUuid}.jpg`)
          .getDownloadURL();

        console.log('done with signature');

        if (imagesArray.length === 0) {
          db.collection('carriers-records')
            .doc('c87U6WtSNRybGF0WrAXb')
            .collection('orders')
            .doc(data[0].taskBody.doc_id)
            .update({
              order_status: 'Picked',
              'pickup.pickup_conditions.name_on_pickup_signature':
                data[0].taskBody.name_on_pickup_signature,
              'pickup.pickup_conditions.email_on_pickup_signature':
                data[0].taskBody.email_on_pickup_signature,
              'pickup.pickup_conditions.odometer': data[0].taskBody.odometer,
              'pickup.pickup_conditions.driver_pickup_notes':
                data[0].taskBody.pickupNotes,
              'pickup.pickup_conditions.pickup_inspection_images_links': uploadedImagesUri,
              'pickup.pickup_conditions.pickup_inspection_diagram_link': uploadedDiagramUri,
              'pickup.pickup_conditions.signature_image_link': signatureResultUri,
              order_activity: firestore.FieldValue.arrayUnion(new_activity),
              loadingInProgress: false,
            });
          await axios.post('https://ctrans.herokuapp.com/api/add-data', {
            documentUri: `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${data[0].taskBody.doc_id}`,
            status: 'picked',
          });
          uploadDone = true;
        }

        if (uploadDone) {
          data.shift();
          try {
            await AsyncStorage.setItem('TASKS', JSON.stringify(data));
          } catch (e) {
            console.log(e);
          }
        }
      }
      if (data[0].taskBody.mode === 'delivery') {
        const created_at = new Date();
        const new_activity = {
          activity_date: created_at,
          activity_type: 'Order was delivered',
          activity_user: 'driver',
          activity_log: `Order was delivered at ${created_at}`,
        };

        let uploadedImagesUri = [];
        let uploadedDiagramUri;

        const newSignUuid = uuid();
        const reference = storage().ref(
          `/c87U6WtSNRybGF0WrAXb/signature-${newSignUuid}.jpg`,
        );
        const signatureUri = data[0].taskBody.signatureUri;
        const imagesArray = data[0].taskBody.imagesArray;

        imagesArray.forEach(async (image) => {
          if (image.image_type === 'photo') {
            const newId = uuid();
            const reference = storage().ref(
              `/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`,
            );
            const pathToFile = image.mergedImage
              ? image.mergedImage
              : image.backGroundImageUri;
            await reference.putFile(pathToFile);
            const url = await storage()
              .ref(`/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`)
              .getDownloadURL();
            // setUploadedImages((currentImages) => [...currentImages, url]);
            uploadedImagesUri.push(url);
            console.log('rest of the array is', imagesArray.length);
            imagesArray.shift();
            console.log('done with photo');
          }
          if (image.image_type === 'diagram') {
            const newId = uuid();
            const reference = storage().ref(
              `/c87U6WtSNRybGF0WrAXb/inspection-diagram-${newId}.jpg`,
            );
            const pathToFile = image.mergedImage
              ? image.mergedImage
              : image.backGroundImageUri;
            await reference.putFile(pathToFile);
            const url = await storage()
              .ref(`/c87U6WtSNRybGF0WrAXb/inspection-diagram-${newId}.jpg`)
              .getDownloadURL();
            // setUploadedImages((currentImages) => [...currentImages, url]);
            uploadedDiagramUri = url;
            console.log('rest of the array is', imagesArray.length);
            imagesArray.shift();
            console.log('done with diagram');
          }
        });

        await reference.putFile(signatureUri);
        const signatureResultUri = await storage()
          .ref(`/c87U6WtSNRybGF0WrAXb/signature-${newSignUuid}.jpg`)
          .getDownloadURL();

        console.log('done with signature');

        if (imagesArray.length === 0) {
          db.collection('carriers-records')
            .doc('c87U6WtSNRybGF0WrAXb')
            .collection('orders')
            .doc(data[0].taskBody.doc_id)
            .update({
              order_status: 'Delivered',
              'delivery.delivery_conditions.name_on_delivery_signature':
                data[0].taskBody.name_on_pickup_signature,
              'delivery.delivery_conditions.email_on_delivery_signature':
                data[0].taskBody.email_on_pickup_signature,
              'delivery.delivery_conditions.odometer':
                data[0].taskBody.odometer,
              'delivery.delivery_conditions.driver_pickup_notes':
                data[0].taskBody.pickupNotes,
              'delivery.delivery_conditions.delivery_inspection_images_links': uploadedImagesUri,
              'delivery.delivery_conditions.delivery_inspection_diagram_link': uploadedDiagramUri,
              'delivery.delivery_conditions.signature_image_link': signatureResultUri,
              order_activity: firestore.FieldValue.arrayUnion(new_activity),
              loadingInProgress: false,
            });
            await axios.post('https://ctrans.herokuapp.com/api/add-data', {
              documentUri: `carriers-records/c87U6WtSNRybGF0WrAXb/orders/${data[0].taskBody.doc_id}`,
              status: "delivered"
            });
            uploadDone = true;
          uploadDone = true;
        }

        if (uploadDone) {
          data.shift();
          try {
            await AsyncStorage.setItem('TASKS', JSON.stringify(data));
          } catch (e) {
            console.log(e);
          }
        }
      }
    } else {
      console.log('Nothing is scheduled');
    }
  } catch (e) {
    console.log(e);
  }
}, 15000);
