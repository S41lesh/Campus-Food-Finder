import { View, Text, Image, TouchableOpacity, TextInput, FlatList, Dimensions, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {themeColors} from '../theme';
import { auth } from '../config/firebase'
import { signOut} from 'firebase/auth'
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native'
import Carousel from 'react-native-snap-carousel';
import CoffeeCard from '../components/coffeeCard';
import { BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'
import {db} from '../config/firebase'
import { getDocs,getDoc,doc,collection} from 'firebase/firestore';


const {width, height} = Dimensions.get('window');
const ios = Platform.OS == 'ios';
export default function HomeScreen() {
  const navigation = useNavigation();
  const handleLogut = async ()=>{
    await signOut(auth);
  }
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(1);
  const [foodItems, setFoodItems] = useState([]);

  const categorycollection = collection(db, "foodfinder");
  useEffect(() => {
    const getcategorylist = async() => {
      try{
      const QuerySnapshot = await getDocs(categorycollection);
      const categoriesData=[];
      QuerySnapshot.forEach((doc2)=>{
        const categoryData=doc2.data().Category;
        categoriesData.push({
          id:doc2.id,
          title:categoryData,
        });
      });
      if (categoriesData.length > 0) {
        setActiveCategory(categoriesData[0]);
      }
      setCategories(categoriesData);
      console.log(categories);
      }
      catch(err){
        console.error(err)
      }
    };
    getcategorylist();
  },[]);

  useEffect(() => {
    if (!activeCategory) {
      console.log("activeCategoryId is empty or undefined.");
      return;
    }
    const getActiveCategoryData = async () => {
      try {
        const activeCategoryDocRef = doc(categorycollection, activeCategory.id);
      const activeCategoryDocSnapshot = await getDoc(activeCategoryDocRef);
      if (activeCategoryDocSnapshot.exists()) {
        const activeCategoryData = activeCategoryDocSnapshot.data();
        const items = activeCategoryData.Items;
        const ogitems=[];
        const keyss=Object.keys(items);
        keyss.forEach((doc1)=>{
          ogitems.push({
            id:doc1,
            Price:items[doc1].Price,
            image:items[doc1].image,
            From:items[doc1].From,
            To:items[doc1].To
          });
        });
        setFoodItems(ogitems);
        console.log(ogitems[1].image);
      } else {
        console.log("Active category document not found.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  getActiveCategoryData();
}, [activeCategory]);
  

  return (
    <View className="flex-1 relative bg-white">
      <StatusBar />

      <Image 
        source={require('../assets/images/beansBackground1.png')} 
        style={{height: height*0.2}} 
        className="w-full absolute -top-5 opacity-10" />
      <SafeAreaView className={ios? '-mb-8': ''}>
        {/* avatar and bell icon */}
        <View className="mx-4 flex-row justify-between items-center">
          <Image source={require('../assets/images/avatar.png')} 
            className="h-9 w-9 rounded-full" />
          
          <View className="flex-row items-center space-x-2">
            <MapPinIcon size="25" color={themeColors.bgLight} />
            <Text className="font-semibold text-base">
              Amrita Vishwa Vidyapeetham
            </Text>
          </View>
          <BellIcon size="27" color="black" onPress={handleLogut}/>
        </View>
        {/* search bar */}
        
        <View className="mx-5 shadow" style={{marginTop: height*0.06}}>
          <View className="flex-row items-center rounded-full p-1 bg-[#e6e6e6]">
            <TextInput placeholder='Search' className="p-4 flex-1 font-semibold text-gray-700" />
            <TouchableOpacity 
              className="rounded-full p-2" 
              style={{backgroundColor: themeColors.bgLight}}>
              <MagnifyingGlassIcon size="25" strokeWidth={2} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        {/* categories */}
        <View className="px-5 mt-6">
          <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={item=> item.id}
            className="overflow-visible"
            renderItem={({item})=>{
              isActive = item==activeCategory;
              let activeTextClass = isActive? 'text-white': 'text-gray-700';
              return (
                <TouchableOpacity 
                onPress={()=> setActiveCategory(item)}
                style={{backgroundColor: isActive? themeColors.bgLight: 'rgba(0,0,0,0.07)'}} 
                className="p-4 px-5 mr-2 rounded-full shadow">
                  <Text className={"font-semibold " + activeTextClass}>{item.title}</Text>
                </TouchableOpacity>
              )
            }}
          />
        </View>
          
      </SafeAreaView>

      {/* coffee cards */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} className={'mt-14'}>
          <Carousel
            containerCustomStyle={{overflow: 'visible'}}
            data={foodItems}
            renderItem={({item})=> <CoffeeCard item={item} />}
            firstItem={1}
            loop={true}
            inactiveSlideScale={0.75}
            inactiveSlideOpacity={0.75}
            sliderWidth={width}
            itemWidth={width*0.63}
            slideStyle={{display: 'flex', alignItems: 'center'}}
          />
        
      </View>
      
      
    </View>
  )
}