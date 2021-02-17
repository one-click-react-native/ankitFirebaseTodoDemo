import React,{useState,useEffect} from 'react';
import { View,StyleSheet,FlatList,KeyboardAvoidingView,Keyboard,
    TouchableOpacity,TextInput,Text, ToastAndroid } from "react-native";
import firestore, { firebase } from '@react-native-firebase/firestore';
import ListComponent from '../../Components/ListComponent';
import AppLoader from '../../Components/Loader';
import Auth from '@react-native-firebase/auth';


const HomeScreen=props=>{
    const [todoItem,setTodoItem]=useState('');
    const userData=Auth().currentUser;
    const todosRef=firestore().collection(userData.uid);
    const [todoList,setTodoList]=useState([]);

    const [isLoading,setIsLoading]=useState(false)
    useEffect(()=>{
        getDataFunc();
    },[])

    const getDataFunc=async()=>{
        try {
        await todosRef.onSnapshot(querySnapshot=>{
          const list=[];
          querySnapshot.forEach(doc=>{
            const {title,done,date}=doc.data();
            list.push({
              id:doc.id,
              title:title,
              done:done,
              date:date
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
             await firestore().collection(userData.uid).doc(item.id).delete();
          } catch (error) {
            console.log('Something went wrong!')
          }
          ToastAndroid.show("Item Deleted!",ToastAndroid.SHORT);
      }
      const addClickHandler=async()=>{
    
        await todosRef.doc(Date.now().toString()).set({
          title:todoItem,
          done:false,
          Created_At:new Date().toISOString()
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
        try {
          await firestore().collection(userData.uid).doc(item.id).update({
            title:editableTodo
          }).then(()=>{
            ToastAndroid.show('Item Updated!',ToastAndroid.SHORT)
          })
        } catch (error) {
          console.log("Error occured : ",error)
        }
      }

    return(
        <KeyboardAvoidingView keyboardVerticalOffset={10} style={{flex:1,paddingHorizontal:10,paddingVertical:5}}>
       
        <View style={{flex:1,paddingHorizontal:10,paddingVertical:5}}>
          {
        todoList.length===0 ?
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:'#00000060',fontSize:18}}>No task available!</Text>
        </View>
        :
        <FlatList data={todoList}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps='always'
        keyExtractor={(items,index)=>index.toString()}   
       renderItem={(items)=>{
           return(
               <ListComponent data={items.item} name={items.item.title} 
               deleteBtnClick={deleteBtnClickHandler} editBtnClick={editBtnClickHander}  />
           )                
       }}/>
          }
        
   
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
   <AppLoader isLoading={isLoading}/>
   </View>
    </KeyboardAvoidingView>
    )
}

const styles=StyleSheet.create({

});

export default HomeScreen;