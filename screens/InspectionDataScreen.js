import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';
import {View, Button} from 'react-native';

export default function InspectionDataScreen() {
  const [odometer, setOdometer] = useState('');
  const [notes, setNotes] = useState('');
  return (
    <View>
      <TextInput
        label="Odometer"
        value={odometer}
        onChangeText={(odometerInfo) => setOdometer(odometerInfo)}
      />
      <TextInput
        label="Notes"
        value={notes}
        onChangeText={(notes) => setNotes(notes)}
      />
      {/* <Button title="Save" onPress={newSaveButtonHandler} /> */}
    </View>
  );
}
