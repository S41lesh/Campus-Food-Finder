import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Platform } from 'react-native'
import React from 'react'
import { themeColors } from '../theme'
import { useNavigation } from '@react-navigation/native'
import { StarIcon } from 'react-native-heroicons/solid';
import { PlusIcon } from 'react-native-heroicons/outline';
const {width, height} = Dimensions.get('window');
const ios = Platform.OS == 'ios';
export default function CoffeeCard({item}) {
  const navigation = useNavigation();
  const isTimeWithinRange = () => {
    const currentTime = new Date(); 
    const fromTime = item.From.toDate();
    const toTime = item.To.toDate();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const fromHour = fromTime.getHours();
    const fromMinute = fromTime.getMinutes();
    const toHour = toTime.getHours();
    const toMinute = toTime.getMinutes();

    if (
      (currentHour > fromHour || (currentHour === fromHour && currentMinute >= fromMinute)) &&
      (currentHour < toHour || (currentHour === toHour && currentMinute <= toMinute))
    ) {
      return true; // Current time is within the range
    } else {
      return false; // Current time is not within the range
    }
  };


  const renderTimingText = () => {
    if (isTimeWithinRange()) {
      return (
        <Text style={{ color: 'green'}}>
          Available Now
        </Text>
      );
    } else {
      return (
        <Text style={{ color: 'red'}}>
          Not Available
        </Text>
      );
    }
  };

  return (
        
      <View 
        style={{
          borderRadius: 40, 
          backgroundColor: themeColors.bgDark, 
          height: ios? height*0.4 : height*0.50, 
          width: width*0.65,
        }} 
        >

        <View 
        style={{
          shadowColor: 'black',
          shadowRadius: 30,
          shadowOffset: {width: 0, height: 40},
          shadowOpacity: 0.8,
          marginTop: ios? -(height*0.08): 15,
        }}
        className="flex-row justify-center">
          <Image 
            source={{uri:item.image}} 
            className="h-40 w-40" 
          />
        </View>
          <View className={`px-5 flex-1 justify-between ${ios? 'mt-5': ''}`}>
            <View className="space-y-3 mt-3">
              <Text className="text-3xl text-white font-semibold z-10 py-5">
                {item.id}
              </Text>
              <Text className="text-3xl text-white font-semibold z-10 py-5">
                {renderTimingText()}
              </Text>

            </View>
            

            <View style={{
              backgroundColor: ios? themeColors.bgDark: 'transparent',
              shadowColor: themeColors.bgDark,
              shadowRadius: 25,
              shadowOffset: {width: 0, height: 40},
              shadowOpacity: 0.8,
            }} className="flex-row justify-between items-center mb-5">
              <Text className="text-white font-bold text-lg">Rs. {item.Price}</Text>
              <TouchableOpacity>
      <Image
        source={require('../assets/images/chef-cook.png')}
        style={{ width: 40, height: 40 }}
      />
      
    </TouchableOpacity>
            </View>
            
            
          </View>

      </View>
    
  )
}