import React, { useState } from 'react';
import {View,StyleSheet,Text,TouchableOpacity, TextInput,Keyboard, KeyboardAvoidingView} from 'react-native';

const ListComponent=props=>{

    const [editable,setEditable]=useState(false);
    const [editText,setEditText]=useState(props.name)
    const changeTaskItemHandler=text=>{
        setEditText(text);
    }
    return(
        <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={10} style={{width:'100%',flexDirection:'column',
        borderWidth:1,paddingHorizontal:10,
        paddingVertical:15,marginBottom:5,borderRadius:20}}>
            {
                editable!==true ?
                <Text style={{width:'100%',fontSize:24,fontWeight:'bold',color:'#000',textAlign:'center'}}>{props.name}</Text>
                :
                <TextInput 
                keyboardType='default'
                onSubmitEditing={()=>{
                    Keyboard.dismiss();
                }}
                value={editText}
                onChangeText={changeTaskItemHandler}
                style={{width:'100%',fontSize:24,fontWeight:'bold',color:'#000',textAlign:'center'}}
            />
            }
            <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',marginTop:10}}>
                {
                    editable &&
                    <TouchableOpacity 
                    activeOpacity={0.6} 
                    onPress={()=>{
                        props.editBtnClick(props.data,editText)
                        setEditable(false)
                    }}
                    style={{width:'30%',alignItems:'center',borderRadius:30,
                    paddingHorizontal:10,paddingVertical:5,backgroundColor:'red'}}>
                   <Text style={{fontSize:18,fontWeight:'bold',color:'#fff'}}>Save</Text>
                   </TouchableOpacity>
                }
            <TouchableOpacity 
             activeOpacity={0.6} 
             onPress={()=>{
                 console.log('selected data :',props.data)
                //  props.deleteBtnClick(props.data)
                if(editable){
                    setEditable(false);
                }else{
                    setEditText(props.name)
                    setEditable(true)
                }
             }}
             style={{width:'30%',alignItems:'center',borderRadius:30,
             paddingHorizontal:10,paddingVertical:5,backgroundColor:'red'}}>
            <Text style={{fontSize:18,fontWeight:'bold',color:'#fff'}}>{editable ? 'Cancel' : 'Edit' }</Text>
            </TouchableOpacity>
            <TouchableOpacity 
             activeOpacity={0.6} 
             onPress={()=>{
                 console.log('selected data :',props.data)
                 props.deleteBtnClick(props.data)
             }}
             style={{width:'30%',alignItems:'center',borderRadius:30,
             paddingHorizontal:10,paddingVertical:5,backgroundColor:'red'}}>
            <Text style={{fontSize:18,fontWeight:'bold',color:'#fff'}}>Delete</Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    )
}

export default ListComponent;