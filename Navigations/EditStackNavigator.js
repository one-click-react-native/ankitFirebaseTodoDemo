import React, { useState } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import EditProfileScreen from '../screens/AuthScreens/EditProfileScreen';

const Stack=createStackNavigator();
const EditStackNavigator=props=>{

    return(
            <Stack.Navigator screenOptions={{headerStyle:{backgroundColor:'blue'}}}>
                <Stack.Screen component={EditProfileScreen} name="EditStack"
                 options={{headerTintColor:"white",title:'Profile Screen',
                 }} />
            </Stack.Navigator>
    )
}

export default EditStackNavigator;