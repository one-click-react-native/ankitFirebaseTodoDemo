import React, { useState } from 'react';
import { View,StyleSheet,Text, ToastAndroid } from 'react-native';
import ButtonComponent from '../../Components/ButtonComponent';
import Auth from '@react-native-firebase/auth';
import AppLoader from '../../Components/Loader';
import TextInputComponent from '../../Components/TextInput';

const ChangeDetailScreen=props=>{

    const [isLoading,setLoading]=useState(false);
    const [editable,setEditable]=useState(false);
    const [passEditable,setPassEditable]=useState(false);

    const userData=Auth().currentUser;
    const [emailInput,setEmailInput]=useState(userData.email)
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
                await userData.updateEmail(emailInput).then((value)=>{
                    console.log(value);
                    setLoading(false);
                    ToastAndroid.show("Email Updated!",ToastAndroid.SHORT);
                    setEmailInput(userData.email)
                });
            } catch (error) {
                setLoading(false);
                ToastAndroid.show(error.code,ToastAndroid.SHORT);
            }
        }else{
            setEditable(true);
        }
    }

    return(
        <View style={styles.mainContainer}>
            
                <TextInputComponent
                value={emailInput}
                placeholder="Enter email..."
                keyboardType="email-address"
                changeText={emailChangeHandler}
                onSubmitEditing={changeEmailClickHandler}
                returnKeyType="done"
               />
            <ButtonComponent text={editable ? "Save Email" : "Change Email"} btnClick={changeEmailClickHandler} />
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