import React,{useState,useEffect,useCallback} from 'react';
import { View,StyleSheet,FlatList,
  TouchableOpacity,TextInput,Text, ToastAndroid } from "react-native";
import HomeScreen from './HomeScreen';
import firestore, { firebase } from '@react-native-firebase/firestore';
import {nameData} from './Data/data'
import ListComponent from './Components/ListComponent';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import Loader from './Components/Loader';

const App=()=>{
  const [todoItem,setTodoItem]=useState('');
  const [isLoading,setIsLoading]=useState(false);
  const todosRef=firestore().collection('todos')
  const [todoList,setTodoList]=useState([]);

  useEffect(()=>{
    getDataFunc();
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

  const getDataFunc=async()=>{
    try {
    await todosRef.onSnapshot(querySnapshot=>{
      const list=[];
      querySnapshot.forEach(doc=>{
        const {title,done}=doc.data();
        list.push({
          id:doc.id,
          title:title,
          done:done
        })
      });
      setTodoList(list);
    })
    } catch (error) {
      setIsLoading(false);
      console.log("Error Occured :",error)
    }
  }

  const deleteBtnClickHandler=async(item)=>{
      try {
         await firestore().collection('todos').doc(item.id).delete();
      } catch (error) {
        console.log('Something went wrong!')
      }
      ToastAndroid.show("Item Deleted!",ToastAndroid.SHORT);
  }
  const addClickHandler=async()=>{

    await todosRef.doc(Date.now().toString()).set({
      title:todoItem,
      done:false
    })
      // await todosRef.add({
      //   title:todoItem,
      //   done:false
      // })
      setTodoItem('');
  }
  
  const changeTaskItemHandler=text=>{
    setTodoItem(text);
  }

  const editBtnClickHander=async(item,editableTodo)=>{
    console.log(item,editableTodo);
    try {
      await firestore().collection('todos').doc(item.id).update({
        title:editableTodo
      }).then(()=>{
        ToastAndroid.show('Item Updated!',ToastAndroid.SHORT)
      })
    } catch (error) {
      console.log("Error occured : ",error)
    }
  }

  return (
    <View style={{flex:1,paddingHorizontal:10,paddingVertical:5}}>
      {
        todoList===[] ?
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:'#00000002',fontSize:18}}>No task available!</Text>
        </View>
        :
        <View style={{flex:1,paddingHorizontal:10,paddingVertical:5}}>
        <FlatList data={todoList}
        keyExtractor={(items,index)=>index.toString()}   
       renderItem={(items)=>{
         console.log(items);
           return(
               <ListComponent data={items.item} name={items.item.title} 
               deleteBtnClick={deleteBtnClickHandler} editBtnClick={editBtnClickHander}  />
           )                
       }}/>
   
       <View style={{width:'100%',flexDirection:'column',borderTopWidth:0.3,paddingTop:10}}>
           <TextInput 
               keyboardType='default'
               placeholder='Enter task...'
               onSubmitEditing={()=>{
                   Keyboard.dismiss();
               }}
               value={todoItem}
               onChangeText={changeTaskItemHandler}
               style={{borderRadius:30,borderWidth:0.5,paddingHorizontal:10,fontSize:18}}
           />
       <View style={{width:'100%',alignItems:'center'}}>
           <TouchableOpacity 
           activeOpacity={0.6} 
           onPress={addClickHandler}
           style={{width:'30%',alignItems:'center',borderRadius:30,
           marginTop:10,
           paddingHorizontal:10,paddingVertical:5,backgroundColor:'blue'}}>
               <Text style={{fontSize:18,fontWeight:'bold',color:'#fff'}}>Add</Text>
           </TouchableOpacity>
       </View>
   </View>
   <Loader isLoading={isLoading}/>
   </View>
      }
    </View>
  );
};

export default App;
