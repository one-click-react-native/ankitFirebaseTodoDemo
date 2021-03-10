import React,{useEffect,useRef,useState} from 'react';
import {View,StyleSheet,TextInput,TouchableOpacity,Image,
    Text, ScrollView, Keyboard, ToastAndroid,TouchableWithoutFeedback} from 'react-native';
import ButtonComponent from '../../Components/ButtonComponent';
import TextInputComponent from '../../Components/TextInput';
import Auth from '@react-native-firebase/auth';
import AppLoader from '../../Components/Loader';
import { useDispatch } from 'react-redux';
import AuthActions from '../../store/Actions';
import * as ImagePicker from 'react-native-image-picker';

const SignupScreen=props=>{

    const [userInput,setUserInput]=useState({
        displayName:'',
        phoneNum:'',
        email:'',
        password:'',
        imageUrl:''
    })

    const [isLoading,setIsLoading]=useState(false);
    const [phoneDetail,setPhoneDetail]=useState({
        showOtpInput:false,
        verificationId:'',
        code:''
    });

    let displayNameRef=useRef();
    let phoneNumRef=useRef();
    let emailRef=useRef();
    let passRef=useRef();

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

    const displayNameChangeHandler=text=>{
        setUserInput({
            ...userInput,
            displayName:text
        })
    }
    const phoneNumChangeHandler=text=>{
        setUserInput({
            ...userInput,
            phoneNum:text
        })
    }
    const emailChangeHandler=text=>{
        setUserInput({
            ...userInput,
            email:text
        })
    }
    const passwordChangeHandler=text=>{
        setUserInput({
            ...userInput,
            password:text
        })
    }

    const checkValidation=()=>{
        const regCheck = new RegExp(
            /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
          );
        if(userInput.displayName===''){
            ToastAndroid.show("Please enter name!",ToastAndroid.SHORT);
            return false;
        }else if(userInput.phoneNum===''){
            ToastAndroid.show("Please enter phone number!",ToastAndroid.SHORT);
            return false;
        }else if(userInput.email===''){
            ToastAndroid.show("Please enter email!",ToastAndroid.SHORT);
            return false;
        }else if (!regCheck.test(userInput.email)) {
            ToastAndroid.show("Please enter proper email!",ToastAndroid.SHORT);
            return false;
        }else if(userInput.password===''){
            ToastAndroid.show("Please enter password!",ToastAndroid.SHORT);
            return false;
        }
        return true;
    }

    const signUpClickHandler=async()=>{
       if(checkValidation()){
        Keyboard.dismiss();
        try {
            setIsLoading(true);
            const number='+91'+userInput.phoneNum;
                console.log(number)
                await Auth().verifyPhoneNumber(number).on('state_changed',async(phoneAuthSnapshot)=>{ 
                console.log('Snapshot state: ', phoneAuthSnapshot);
                switch (phoneAuthSnapshot.state){
                    case Auth.PhoneAuthState.CODE_SENT:
                        console.log(phoneAuthSnapshot.state)
                        setPhoneDetail({
                            ...phoneDetail,
                            verificationId:phoneAuthSnapshot.verificationId
                        })
                        ToastAndroid.show("Verification code sent to your register number.",ToastAndroid.SHORT);
                        ToastAndroid.show("Please wait for otp input or auto verification.",ToastAndroid.SHORT);

                        break;
                    case Auth.PhoneAuthState.AUTO_VERIFIED:
                        console.log(phoneAuthSnapshot.state)
                        const credential=Auth.PhoneAuthProvider.credential(phoneAuthSnapshot.verificationId,phoneAuthSnapshot.code)
                        console.log('credential', credential);
                        setIsLoading(true);
                         Auth().createUserWithEmailAndPassword(userInput.email,userInput.password).then(async(resData)=>{
                            await Auth().currentUser.updateProfile({
                            displayName:userInput.displayName,
                            photoURL: userInput.imageUrl==='' ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' : userInput.imageUrl
                         });
                       await resData.user.updatePhoneNumber(credential);
                        setUserInput({
                        displayName:'',
                        phoneNum:'',
                        email:'',
                        password:''
                     })
                     setIsLoading(false);
                 }).catch((error)=>{
                     ToastAndroid.show(error.code,ToastAndroid.SHORT)
                 });
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
                        ToastAndroid.show(phoneAuthSnapshot.error.code,ToastAndroid.SHORT)
                        break;

                }
                setIsLoading(false)
            })   
        } catch (error) {
            setIsLoading(false);
            console.log(error)
            ToastAndroid.show(error.code,ToastAndroid.SHORT);
        }
       }
    }

    const otpChangeHandler=text=>{
        setPhoneDetail({
            ...phoneDetail,
            code:text
        })
    }

    const verifyCodeHnadler=async()=>{
        setIsLoading(true);
        const credential=Auth.PhoneAuthProvider.credential(phoneDetail.verificationId,phoneDetail.code)
        console.log('credential', credential);
        Auth().createUserWithEmailAndPassword(userInput.email,userInput.password).then(async(resData)=>{
        await Auth().currentUser.updateProfile({
            displayName:userInput.displayName,
            photoURL: userInput.imageUrl==='' ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' : userInput.imageUrl
         });
        await resData.user.updatePhoneNumber(credential);
        setUserInput({
            displayName:'',
            phoneNum:'',
            email:'',
            password:''
        })
    })
    setIsLoading(false);
}


    return(
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View style={{flex:1,paddingHorizontal:20}} >
            <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity activeOpacity={0.5} onPress={selectImageHandler}>
                <Image source={{uri:userInput.imageUrl==='' ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' :userInput.imageUrl}}
                    style={{width:120,height:120,marginBottom:10}}
                />
                </TouchableOpacity>
             </View>
            <TextInputComponent
                placeholder="Enter name..."
                keyboardType="default"
                changeText={displayNameChangeHandler}
                value={userInput.displayName}
                ref={displayNameRef}
                onSubmitEditing={()=>{
                    phoneNumRef.current.focus();
                }}
                returnKeyType="next"
            />
            <TextInputComponent
                placeholder="Enter Phone Number..."
                keyboardType="number-pad"
                maxLength={10}
                changeText={phoneNumChangeHandler}
                value={userInput.phoneNum}
                ref={phoneNumRef}
                onSubmitEditing={()=>{
                    emailRef.current.focus();
                }}
                returnKeyType="next"
            />
            <TextInputComponent
                placeholder="Enter email..."
                keyboardType="email-address"
                changeText={emailChangeHandler}
                value={userInput.email}
                ref={emailRef}
                onSubmitEditing={()=>{
                    passRef.current.focus();
                }}
                returnKeyType="next"
            />
            <TextInputComponent
                placeholder="Enter password..."
                keyboardType="default"
                changeText={passwordChangeHandler}
                value={userInput.password}
                ref={passRef}
                secureTextEntry={true}
                onSubmitEditing={signUpClickHandler}
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
            <ButtonComponent text={phoneDetail.showOtpInput ? "Verify code": "Sign up"}
             btnClick={phoneDetail.showOtpInput ? verifyCodeHnadler : signUpClickHandler}/>
            <AppLoader isLoading={isLoading} />
        </View>
        </TouchableWithoutFeedback>
    )
}
const styles=StyleSheet.create({
    mainContainer:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:20
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
    }
})

export default SignupScreen;