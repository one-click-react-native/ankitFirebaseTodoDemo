import React, { useState,useRef } from 'react';
import {View,StyleSheet,Text,TextInput,ToastAndroid,TouchableOpacity,Image} from 'react-native';
import ButtonComponent from '../../Components/ButtonComponent';
import TextInputComponent from '../../Components/TextInput';
import Auth from '@react-native-firebase/auth';
import AppLoader from '../../Components/Loader';
import * as ImagePicker from 'react-native-image-picker';

const EditProfileScreen=props=>{
    
    const [editable,setEditable]=useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const userData=Auth().currentUser;
    let displayNameRef=useRef('displayName');
    let phoneNumRef=useRef('phone');
    const [userInput,setUserInput]=useState({
        displayName:userData!==null ? userData.displayName: '',
        phoneNumber:userData!==null ? userData.phoneNumber : '',
        imageUrl:userData!==null ? userData.photoURL : ''
    })

    const logoutBtnClickHandler=async()=>{
        try {
            setIsLoading(true)
                await Auth().signOut().then(()=>{
                    setUserInput({
                        displayName:'',
                        phoneNumber:'',
                        imageUrl:''
                    })
                setIsLoading(false);
        })
        } catch (error) {
            setIsLoading(false);
            ToastAndroid.show(error.code,ToastAndroid.SHORT);
        }
    }

    const displayNameChangeHandler=text=>{
        setUserInput({
            ...userInput,
            displayName:text
        })
    }
    const [phoneDetail,setPhoneDetail]=useState({
        showOtpInput:false,
        verificationId:'',
        code:''
    });

    const [phoneChanged,setPhoneChanged]=useState(false);

    const editBtnClickHandler=async()=>{
        if(!editable){
            setEditable(true);
        }else{
            try{
            setIsLoading(true);
            await userData.updateProfile({
                displayName:userInput.displayName,
                photoURL:userInput.imageUrl
            })
            ToastAndroid.show("Profile updated!",ToastAndroid.SHORT);
            setIsLoading(false)
            setEditable(false);
            
            if(phoneChanged){

            
                setIsLoading(true);
                    await Auth().verifyPhoneNumber(userInput.phoneNumber).on('state_changed',async(phoneAuthSnapshot)=>{ 
                    console.log('Snapshot state: ', phoneAuthSnapshot);
                    switch (phoneAuthSnapshot.state){
                        case Auth.PhoneAuthState.CODE_SENT:
                            console.log(phoneAuthSnapshot.state)
                            setPhoneDetail({
                                ...phoneDetail,
                                verificationId:phoneAuthSnapshot.verificationId
                            })
                            ToastAndroid.show("Verification code sent to your register number.",ToastAndroid.SHORT);
                            break;
                        case Auth.PhoneAuthState.AUTO_VERIFIED:
                            console.log(phoneAuthSnapshot.state)
                            const credential=Auth.PhoneAuthProvider.credential(phoneAuthSnapshot.verificationId,phoneAuthSnapshot.code)
                            console.log('credential', credential);
                              
                           await userData.updatePhoneNumber(credential);
                            ToastAndroid.show("Profile updated!",ToastAndroid.SHORT)
                             break;
                        case Auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT:
                            console.log(phoneAuthSnapshot.state)
                            setPhoneDetail({
                                ...phoneDetail,
                                showOtpInput:true,
                                verificationId:phoneAuthSnapshot.verificationId
                            })
                            break;
    
                        case Auth.PhoneAuthState.ERROR:
                            console.log(phoneAuthSnapshot.state)
                            console.log(phoneAuthSnapshot.error);
                            break;
    
                    }
                    setIsLoading(false);
                    setPhoneChanged(false);
                    setEditable(false);
                })
            }
                 
            } catch (error) {
                setIsLoading(false);
                console.log(error)
                ToastAndroid.show(error.code,ToastAndroid.SHORT);
            }
        }
    }

    const phoneNumChangeHnadler=(text)=>{
        setUserInput({
            ...userInput,
            phoneNumber:text
        })
    }

    const selectImageHandler=()=>{
        ImagePicker.launchImageLibrary({
            includeBase64:true,
            mediaType:'photo',
            maxHeight:120,
            maxWidth:120,
        },(response)=>{
            setUserInput({
                ...userInput,
                imageUrl:response.uri
            })
        })
    }
    const verifyCodeHnadler=async()=>{
        try {
            setIsLoading(true);
        const credential= await Auth.PhoneAuthProvider.credential(phoneDetail.verificationId,phoneDetail.code)
        console.log('credential', credential);
        
        await userData.updatePhoneNumber(credential);
        ToastAndroid("Profile Updated!",ToastAndroid.SHORT);
        } catch (error) {
            setIsLoading(false);
            ToastAndroid.show(error.code,ToastAndroid.SHORT);
        }
        
       
    setIsLoading(false);
}

    return(
        <View style={styles.mainContainer}>
            <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                {
                    editable ? 
                    <TouchableOpacity activeOpacity={0.5} onPress={selectImageHandler}>
                <Image source={{uri:userInput.imageUrl}}
                    style={{width:120,height:120,marginBottom:10}}
                />
                </TouchableOpacity>
                :
                <Image source={{uri:userInput.imageUrl}}
                style={{width:120,height:120,marginBottom:10}}
            />
                }
                   
         </View>

                {
                    editable ?
                    <View>
                        <TextInputComponent
                            value={userInput.displayName}
                            placeholder="Enter name..."
                            keyboardType="default"
                            changeText={displayNameChangeHandler}
                            ref={displayNameRef}
                            onSubmitEditing={()=>{
                                phoneNumRef.current.focus();
                            }}
                            returnKeyType="next"
                        />
                        <Text style={styles.textStyle}>{userData!==null && userData.email}</Text>
                        <TextInputComponent
                         value={userInput.phoneNumber}
                         placeholder="Enter Phone Number..."
                         keyboardType="default"
                         changeText={phoneNumChangeHnadler}
                         ref={phoneNumRef}
                         onTouchStart={()=>{
                             setPhoneChanged(true);
                         }}
                         onSubmitEditing={editBtnClickHandler}
                         returnKeyType="done"
                        />
                        {
                            phoneDetail.showOtpInput &&
                            <TextInputComponent
                                placeholder="Enter OTP..."
                                keyboardType="number-pad"
                                maxLength={6}
                                onSubmitEditing={()=>{
                                     Keyboard.dismiss();
                                 }}
                                changeText={otpChangeHandler}
                                value={phoneDetail.code}
                                returnKeyType="done"
                        />
                        }
                        </View>
                    :
                    <View>
                    <Text style={styles.textStyle}>{userInput.displayName}</Text>
                    <Text style={styles.textStyle}>{userData!==null && userData.email}</Text>
                    <Text style={styles.textStyle}>{userInput.phoneNumber}</Text>
                    </View>
                }
                <ButtonComponent
                 text={editable ? phoneDetail.showOtpInput ? "Verify and Save" : "Save" : "Edit Profile"}
                  btnClick={phoneDetail.showOtpInput ? verifyCodeHnadler : editBtnClickHandler} />
                <ButtonComponent text="Logout" btnClick={logoutBtnClickHandler} />
                <AppLoader isLoading={isLoading}/>
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

export default EditProfileScreen;