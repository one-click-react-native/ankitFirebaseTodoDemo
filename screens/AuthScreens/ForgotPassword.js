import React, { useState } from 'react';
import {View,Text,StyleSheet, ToastAndroid} from 'react-native';
import Auth from '@react-native-firebase/auth';
import TextInputComponent from '../../Components/TextInput';
import ButtonComponent from '../../Components/ButtonComponent';

const ForgotPassword=props=>{

    const [emailInput,setEmailInput]=useState('');
    const emailTextChangeHandler=text=>{
        setEmailInput(text);
    }


    const sendLinkClickHandler=async()=>{
        if(emailInput!==''){
        try {
            await Auth().sendPasswordResetEmail(emailInput).then((value)=>{
                ToastAndroid.show('Reset password link sent to your register email',ToastAndroid.SHORT);
                setEmailInput('')
                props.navigation.goBack();
            });
        } catch (error) {
            ToastAndroid.show(error.code,ToastAndroid.SHORT);
        }
    }else{
        ToastAndroid.show("Please enter email!",ToastAndroid.SHORT);
    }
      
    }

    return(
        <View style={styles.mainContainer}>
            <Text style={styles.titleText}>Forgot Password?</Text>
            <TextInputComponent
                value={emailInput}
                placeholder="Enter email..."
                changeText={emailTextChangeHandler}
                onSubmitEditing={sendLinkClickHandler}
                returnKeyType="done"
                keyboardType='email-address'
            />
            <ButtonComponent btnClick={sendLinkClickHandler} text="Send link" />
        </View>
    )
}

const styles=StyleSheet.create({
    mainContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:20,
    },
    titleText:{
        fontSize:34,
        fontWeight:'bold',
        marginBottom:10,
        color:'blue',
        width:'100%',
        textAlign:'center',
        fontStyle:'italic',
        textDecorationLine:'underline'
    },
})

export default ForgotPassword;