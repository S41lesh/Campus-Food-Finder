import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import AdminScreen from '../screens/AdminScreen';
import AddFood from '../screens/AddFood';
import EditFood from '../screens/EditFood';
import useAuth from '../hooks/useAuth';
import { auth, googleprovider, db } from '../config/firebase';
import { getDoc, doc, collection } from 'firebase/firestore';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const { user } = useAuth();
  const categorycollection = collection(db, "users");

  const handleSubmi = async () => {
    console.log("User signed in:", user);

    try {
      const activeCategoryDocRef = doc(categorycollection, user.uid);
      const activeCategoryDocSnapshot = await getDoc(activeCategoryDocRef);

      if (activeCategoryDocSnapshot.exists()) {
        const activeCategoryData = activeCategoryDocSnapshot.data();
        const role = activeCategoryData.role;
        console.log("User Role:", role);
        return String(role);
      } else {
        console.log("User document does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving user role:", error.message);
      return null;
    }
  };

  // Use state to manage the items and trigger a re-render
  const [items, setItems] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const result = await handleSubmi();
      setItems(result);
    };

    fetchItems();
  }, [user]);

  if (items === 'user') {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else if (items === 'Admin') {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='AdminHome'>
          <Stack.Screen name="AdminHome" options={{ headerShown: false }} component={AdminScreen} />
          <Stack.Screen name="AddFood" options={{ headerShown: false }} component={AddFood} />
          <Stack.Screen name="EditFood" options={{ headerShown: false }} component={EditFood} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
          <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
          <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
