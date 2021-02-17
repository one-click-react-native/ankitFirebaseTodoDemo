import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import SignupScreen from '../screens/AuthScreens/SignupScreen';
import { useSelector } from 'react-redux';
import HomeScreen from '../screens/UsersScreens/HomeScreen';
import Auth from '@react-native-firebase/auth';
import { Image, TouchableOpacity } from 'react-native';
import EditProfileScreen from '../screens/AuthScreens/EditProfileScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import UserNavigator from './UserNavigator';
import EditStackNavigator from './EditStackNavigator';
import ChangeStackNavigator from './ChangeDetailStack';
import ForgotPassword from '../screens/AuthScreens/ForgotPassword';

const Stack=createStackNavigator();
const Tab=createBottomTabNavigator();

const AuthNavigator=props=>{

    const [loggedIn,setLoggedIn]=useState(false);

    useEffect(()=>{
        Auth().onAuthStateChanged((user)=>{
            console.log("AUth User :",user);
            if(user!==null){
                setLoggedIn(true);
            }else{
                setLoggedIn(false)
            }
        })
    },[])

   


    return(
        <NavigationContainer>
                {
                    loggedIn!==false ?
                        <Tab.Navigator initialRouteName="Home" tabBarOptions={{activeTintColor:'blue'}}>
                            <Tab.Screen name="Home"
                             component={UserNavigator}
                             options={{
                                 tabBarIcon:({focused,size,color})=>{
                                     if(focused){
                                         return(<Image source={require('../assets/home_sel.png')} 
                                         style={{width:25,height:25}} />)
                                     }else{
                                         return(<Image source={require('../assets/home.png')}
                                          style={{width:25,height:25}}/>)
                                     }
                                 }
                                 
                             }}
                             />
                            <Tab.Screen name="Profile"
                             component={EditStackNavigator}
                             options={{
                                tabBarIcon:({focused,size,color})=>{
                                    if(focused){
                                        return(<Image source={require('../assets/user-sel.png')} 
                                        style={{width:25,height:26}} />)
                                    }else{
                                        return(<Image source={require('../assets/user.png')}
                                         style={{width:25,height:26}}/>)
                                    }
                                }
                                
                            }}
                             />
                             <Tab.Screen name="Change Auth"
                             component={ChangeStackNavigator}
                             options={{
                                tabBarIcon:({focused,size,color})=>{
                                    if(focused){
                                        return(<Image source={require('../assets/auth-sel.png')} 
                                        style={{width:25,height:26}} />)
                                    }else{
                                        return(<Image source={require('../assets/auth.png')}
                                         style={{width:25,height:26}}/>)
                                    }
                                }
                                
                            }}
                             />
                        </Tab.Navigator>
                    :
            <Stack.Navigator screenOptions={{headerStyle:{backgroundColor:'blue'}}}>

                <Stack.Screen name="Login" component={LoginScreen} options={{title:'Login Screen',headerTintColor:'white'}}/>
                <Stack.Screen name="Signup" component={SignupScreen} options={{title:'Signup Screen',headerTintColor:'white'}} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{title:'Forgot Password',headerTintColor:'white'}} />

            </Stack.Navigator>
                }
                
        </NavigationContainer>
    )
}

//<Stack.Navigator screenOptions={{headerStyle:{backgroundColor:'blue'}}}>
            //     <Stack.Screen component={HomeScreen} name="Home" 
            //      options={{headerTintColor:"white",title:'Home Screen',
            //         headerRight:()=>(
            //             <TouchableOpacity onPress={navigateScreen} activeOpacity={0.5} style={{marginRight:5}}>
            //                 <Image source={require('../assets/edit.png')} style={{width:28,height:28}} />
            //             </TouchableOpacity>
            //         )
            //      }} />
            //      <Stack.Screen component={EditProfileScreen} name="Edit"
            //         options={{headerTintColor:"white",title:'Profile Screen',
            //         headerRight:()=>(
            //             <TouchableOpacity activeOpacity={0.5} style={{marginRight:5}}>
            //                 <Image source={require('../assets/logout.png')} style={{width:28,height:28}} />
            //             </TouchableOpacity>
            //         )
            //      }}
            //      />
            // </Stack.Navigator>

export default AuthNavigator;