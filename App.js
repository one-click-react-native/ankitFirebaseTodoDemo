import React,{useState,useEffect,useCallback} from 'react';
import { View,LogBox } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import AuthNavigator from './Navigations/AuthNavigator';
import {createStore,applyMiddleware,combineReducers} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import AuthReducer from './store/Reducer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App=()=>{

  LogBox.ignoreAllLogs(true);

  const RootReducer=combineReducers({
    AuthReducer:AuthReducer
  });

  const persistConfig={
    storage:AsyncStorage,
    key:'root'
  }

  const persistedReducer=persistReducer(persistConfig,RootReducer);
  let store=createStore(persistedReducer,applyMiddleware(ReduxThunk));
  let persistor=persistStore(store);

  useEffect(()=>{
    checkPermission();
    createNotification();
  },[])

  const checkPermission=async()=>{
    const enabled=await messaging().hasPermission();
    console.log("Permission Push nOtification :",enabled)
      if(enabled){
        getToken();
      }else{
        requestPermission();
      }
  }


  const getToken=async()=>{
  //  let fcmToken=await AsyncStorage.getItem("@fcmToken");
    // if(!fcmToken){
     let fcmToken=await messaging().getToken();
     if(fcmToken){
       await AsyncStorage.setItem('@fcmToken',fcmToken)
     }

   
    console.log(fcmToken);
  }
  const requestPermission=async()=>{
    try {
      await messaging().requestPermission();
      getToken();
    } catch (error) {
      console.log("Permission Rejected!");
    }
  }

  const createNotification=async()=>{
     await messaging().onMessage(remoteMessage=>{
      console.log("Remote Message :",remoteMessage)
    });

    await messaging().setBackgroundMessageHandler(remoteMessage=>{
      console.log("Remote back Message :",remoteMessage)
    })
  }


  return (
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <SafeAreaProvider>
              <AuthNavigator/>
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
    );
};

export default App;
