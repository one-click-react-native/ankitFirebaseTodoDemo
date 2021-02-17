import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/UsersScreens/HomeScreen'
import EditProfileScreen from '../screens/AuthScreens/EditProfileScreen';

const Stack=createStackNavigator();
const UserNavigator=props=>{
    return(
            <Stack.Navigator screenOptions={{headerStyle:{backgroundColor:'blue'}}}>
                <Stack.Screen component={HomeScreen} name="HomeStack" options={{headerTintColor:"white",title:'Home Screen'}} />
            </Stack.Navigator>
    )
}

export default UserNavigator;