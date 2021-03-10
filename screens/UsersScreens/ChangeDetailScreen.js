import React, { useState } from 'react';
import { View,StyleSheet,Text, ToastAndroid } from 'react-native';
import ButtonComponent from '../../Components/ButtonComponent';
import Auth from '@react-native-firebase/auth';
import AppLoader from '../../Components/Loader';
import TextInputComponent from '../../Components/TextInput';

const ChangeDetailScreen=props=>{

    const [isLoading,setLoading]=useState(false);
    const [passEditable,setPassEditable]=useState(false);
    const [editable,setEditable]=useState(false)
    const userData=Auth().currentUser;
    console.log(userData)
    const [emailInput,setEmailInput]=useState(userData!==null ? userData.email : '')
    const [passwordInput,setPasswordInput]=useState('')

    const emailChangeHandler=text=>{
        setEmailInput(text)
    }

    const passwordChangeHandler=text=>{
        setPasswordInput(text);
    }


    const changePasswordClickhandler=async()=>{
        if(passEditable){
            try {
                setLoading(true);
                await userData.updatePassword(passwordInput).then((value)=>{
                    console.log(value);
                    setLoading(false);
                    ToastAndroid.show("password Updated!",ToastAndroid.SHORT);
                    setPasswordInput('')
                    setPassEditable(false)
                });
            } catch (error) {
                setLoading(false);
                ToastAndroid.show(error.code,ToastAndroid.SHORT);

            }
        }else{
            setPassEditable(true);
        }
    }

    const changeEmailClickHandler=async()=>{
        if(editable){
            try {
                setLoading(true);
                await userData.updateEmail(emailInput);
                    setLoading(false);
                    ToastAndroid.show("Email Updated!",ToastAndroid.SHORT);
                    setEmailInput(userData.email);
                    setEditable(false);
            } catch (error) {
                setLoading(false);
                ToastAndroid.show(error.code,ToastAndroid.SHORT);
            }   
        }else{
            setEditable(true);
        }
      
    }
    const logoutBtnClickHandler=async()=>{
        try {
              await Auth().signOut();
        } catch (error) {
            ToastAndroid.show(error.code,ToastAndroid.SHORT);
        }
    }


    return(
        <View style={styles.mainContainer}>
            {
                !editable ?
                <Text style={styles.textStyle}>{userData.email}</Text>
                :
                <TextInputComponent
                value={emailInput}
                placeholder="Enter email..."
                keyboardType="email-address"
                changeText={emailChangeHandler}
                onSubmitEditing={changeEmailClickHandler}
                returnKeyType="done"
               />

            }
                
            <ButtonComponent text={editable ? "Change Email" : "Edit Email" } btnClick={changeEmailClickHandler} />
            {
                      editable && 
                      <ButtonComponent text="Cancel" btnClick={()=>{
                          setEditable(false);
                      }} />
                  }
            {
                passEditable && 
                <TextInputComponent
                value={passwordInput}
                secureTextEntry={true}
                placeholder="Enter password..."
                keyboardType="default"
                changeText={passwordChangeHandler}
                onSubmitEditing={changePasswordClickhandler}
                returnKeyType="done"
               />
            }
            <ButtonComponent text="Change Password" btnClick={changePasswordClickhandler} />
            <ButtonComponent text="Logout" btnClick={logoutBtnClickHandler} />
            <AppLoader isLoading={isLoading} />
        </View>
    )
}

const styles=StyleSheet.create({
    mainContainer:{
        flex:1,
        paddingHorizontal:20,
        paddingVertical:10
    },
    textStyle:{
        borderWidth:0.8,
        borderRadius:30,
        width:'100%',
        marginVertical:5,
        paddingHorizontal:15,
        paddingVertical:10,
        fontSize:18,
        fontWeight:'bold'
    }
})

export default ChangeDetailScreen;