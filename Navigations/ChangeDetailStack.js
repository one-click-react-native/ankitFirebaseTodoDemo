import React, { useState } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ChangeDetailScreen from '../screens/UsersScreens/ChangeDetailScreen';

const Stack=createStackNavigator();
const ChangeStackNavigator=props=>{

    return(
            <Stack.Navigator screenOptions={{headerStyle:{backgroundColor:'blue'}}}>
                <Stack.Screen component={ChangeDetailScreen} name="changeStack"
                 options={{headerTintColor:"white",title:'Change Detail',
                 }} />
            </Stack.Navigator>
    )
}

export default ChangeStackNavigator;