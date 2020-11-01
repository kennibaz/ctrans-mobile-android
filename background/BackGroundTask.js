import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import uuid from 'react-uuid';
import firestore from '@react-native-firebase/firestore';
const db = firestore();



export const BGUploadTask = BackgroundTimer.runBackgroundTimer(async () => {
  console.log('running in BG');
  try {
    const value = await AsyncStorage.getItem('TASKS');
    if (value !== null) {
      let data = JSON.parse(value);
      let uploadedImagesUri = []
      const newSignUuid = uuid();
      const reference = storage().ref(
        `/c87U6WtSNRybGF0WrAXb/signature-${newSignUuid}.jpg`,
      );
      const signatureUri = data[0].taskBody.signatureUri;
      const imagesArray = data[0].taskBody.imagesArray;

      db.collection('carriers-records')
      .doc('c87U6WtSNRybGF0WrAXb')
      .collection('orders')
      .doc(data[0].taskBody.doc_id).update({
        order_status: 'Picked',
        'pickup.pickup_conditions.name_on_pickup_signature': data[0].taskBody.name_on_pickup_signature,
        'pickup.pickup_conditions.email_on_pickup_signature': data[0].taskBody.email_on_pickup_signature,
        'pickup.pickup_conditions.odometer': data[0].taskBody.odometer,
        'pickup.pickup_conditions.driver_pickup_notes': data[0].taskBody.pickupNotes,
      })
      console.log("Data uploaded")


      imagesArray.forEach(async (image) => {
        const newId = uuid();
        const reference = storage().ref(
          `/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`,
        );
        const pathToFile = image.mergedImage;
        await reference.putFile(pathToFile);
        const url = await storage()
          .ref(`/c87U6WtSNRybGF0WrAXb/inspection-photo-${newId}.jpg`)
          .getDownloadURL();
        // setUploadedImages((currentImages) => [...currentImages, url]);
        uploadedImagesUri.push(url)
      });

      await reference.putFile(signatureUri);
      const signatureResultUri = await storage()
        .ref(`/c87U6WtSNRybGF0WrAXb/signature-${newSignUuid}.jpg`)
        .getDownloadURL();

      if (uploadedImagesUri.length === imagesArray.length && signatureResultUri) {
        db.collection('carriers-records')
          .doc('c87U6WtSNRybGF0WrAXb')
          .collection('orders')
          .doc(data[0].taskBody.doc_id)
          .update({
            'pickup.pickup_conditions.pickup_inspection_images_links': uploadedImagesUri,
            'pickup.pickup_conditions.signature_image_link': signatureResultUri,
          });
          console.log("photo uploaded")
          data.shift();
      }


      try {
        await AsyncStorage.setItem('TASKS', JSON.stringify(data));
      } catch (e) {
        // saving error
      }
    } else {
      console.log('Nothing is scheduled');
    }
  } catch (e) {
    // error reading value
  }
}, 30000);
