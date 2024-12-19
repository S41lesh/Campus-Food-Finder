import { View, Text, TouchableOpacity, Image, TextInput,Button } from 'react-native'
import React,{useState} from 'react'
import { themeColors } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { auth,db,storage} from '../config/firebase';
import { doc, updateDoc, serverTimestamp,collection,getDoc } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { Alert } from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import 'text-encoding';
import 'cross-fetch/polyfill';
import { decode } from 'base-64';

import DateTimePicker from '@react-native-community/datetimepicker';






// subscribe for more videos like this :)
export default function AddFood() {
    const route = useRoute();
  const receivedData = route.params?.data || {};
    const navigation = useNavigation();
    const [iname, setiname] = useState('');
    const [Price1, setPrice] = useState('');
    const [imageUri, setImageUri] = useState(null);
    if(typeof atob === 'undefined') {
      global.atob = decode;
    }

    const categorycollection = collection(db, "foodfinder");


    const [showFromPicker, setShowFromPicker] = useState(false);
  const [selectedFromTime, setSelectedFromTime] = useState(new Date());

  const showFromTimePicker = () => {
    setShowFromPicker(true);
  };

  const handleFromTimeChange = (event, selected) => {
    setShowFromPicker(false);

    if (selected) {
      setSelectedFromTime(selected);
    }
  };


  const [showToPicker, setShowToPicker] = useState(false);
  const [selectedToTime, setSelectedToTime] = useState(new Date());

  const showToTimePicker = () => {
    setShowToPicker(true);
  };

  const handleToTimeChange = (event, selected) => {
    setShowToPicker(false);

    if (selected) {
      setSelectedToTime(selected);
    }
  };
    const handleImagePick = async () => {
      try {
        const result = await launchImageLibraryAsync({
        });
    
          setImageUri(result.assets[0].uri);
      } catch (error) {
        console.error('Error picking image:', error);
      }
    };
    
    const storage = getStorage();

    const uploadImage = async () => {
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
    
        // Create a unique filename
        const filename = `images/${new Date().getTime()}`;
    
        // Reference to the Firebase Storage
        const storageRef = ref(storage, filename);
    
        // Upload the file
        const snapshot = await uploadBytes(storageRef, blob);
    
        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Image uploaded successfully! URL:', downloadURL);
    
        return downloadURL;
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
      
  const handleSubmit = async () => {
    const imageUrl = await uploadImage();
    console.log(imageUri)

    if (imageUrl) {
      const collectionRef = doc(categorycollection, receivedData);

      try {
        const docSnap = await getDoc(collectionRef);

        if (docSnap.exists()) {
          const itemMap = docSnap.data().Items || {};
          const foodMap = {
            ...itemMap,
            [iname]: {
              Price: Price1,
              To: selectedToTime,
              From: selectedFromTime,
              image: imageUrl,
            },
          };

          await updateDoc(collectionRef, {
            Items: foodMap,
          });

          console.log('Document updated successfully!');
          navigation.goBack();
        } else {
          console.error('Document does not exist.');
        }
      } catch (error) {
        console.error('Error updating document:', error);
      }
    } else {
      Alert.alert('Error', 'Failed to upload the image. Please try again.');
    }
  };
  return (
    <View className="flex-1 bg-white" style={{backgroundColor: themeColors.bg}}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
            <TouchableOpacity 
                onPress={()=> navigation.goBack()}
                className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
                <ArrowLeftIcon size="20" color="black" />
            </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
            <Image source={require('../assets/images/signup.png')} 
                style={{width: 165, height: 110}} />
        </View>
      </SafeAreaView>
      <View className="flex-1 bg-white px-8 pt-8"
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}
      >
        <View className="form space-y-2">
            <Text className="text-black-700 ml-4">Food Name</Text>
            <TextInput
                className="p-4 bg-gray-100 text-gray-500 rounded-2xl mb-3"
                value={iname}
                onChangeText={value=>setiname(value)}
                placeholder='Enter Food Name'
            />
            <Text className="text-black-700 ml-4 mb-2">From</Text>
            <Button title={selectedFromTime.toLocaleTimeString()} onPress={showFromTimePicker}/>
            {showFromPicker && (
              <DateTimePicker
                value={selectedFromTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleFromTimeChange}
              />
            )}
            <Text className="text-black-700 ml-4 mb-2">To</Text>
              <Button title={selectedToTime.toLocaleTimeString()} onPress={showToTimePicker} />
            {showToPicker && (
              <DateTimePicker
                value={selectedToTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleToTimeChange}
              />
            )}
            <Text className="text-black-700 ml-4">Price</Text>
            <TextInput
                className="p-4 bg-gray-100 text-gray-500 rounded-2xl mb-3"
                value={Price1}
                onChangeText={value=>setPrice(value)}
                placeholder='Enter Price'
            />
            <View style={{ marginBottom: 10 }}>
            <Text className="text-black-700 ml-4">Image</Text>
          <TouchableOpacity onPress={handleImagePick} style={{marginTop:5, marginBottom: 10 }}>
            <Image
              source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
              style={{ width: 100, height: 100, borderRadius: 75 }}
            />
          </TouchableOpacity>
        </View>
        
            
            <TouchableOpacity
                className="py-3 bg-yellow-400 rounded-xl"
                onPress={handleSubmit}
            >
                <Text className="font-xl font-bold text-center text-gray-700">
                    Add
                </Text>
            </TouchableOpacity>
        </View>

      </View>
    </View>
  )
}
