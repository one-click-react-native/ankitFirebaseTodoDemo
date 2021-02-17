import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {View,Text,StyleSheet} from 'react-native'
import Animated from 'react-native-reanimated';
import { useSelector } from 'react-redux';

const SplashScreen=props=>{

    const userData=useSelector(state=>state.AuthReducer.userData);
    const [animatedState,setAnimatedState]=useState({
        animation:new Animated.Value(1)
    })

    const animantionStyle = {
        transform: [
          {
            scale: animatedState.animation,
          },
        ],
      };
    
      const startAnimation = () => {
        Animated.timing(animatedState.animation, {
          toValue: 2,
          duration: 3000,
        }).start();
      };

      useEffect(()=>{
          startAnimation();
          setTimeout(()=>{
            if(userData!==null){
                
            }
          },3000)
      },[])

    return(
        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
            <Animated.Text style={{fontSize:40,color:'blue',fontWeight:'bold',fontStyle:'italic'}}>
                TODO APP
            </Animated.Text>
        </View>
    )
}
