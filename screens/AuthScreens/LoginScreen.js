import React,{useEffect,useRef,useState} from 'react';
import {View,StyleSheet,TextInput,TouchableOpacity,Text, TouchableWithoutFeedback, Keyboard, ToastAndroid} from 'react-native';
import ButtonComponent from '../../Components/ButtonComponent';
import TextInputComponent from '../../Components/TextInput';
import Auth from '@react-native-firebase/auth';
import AppLoader from '../../Components/Loader';
import {loginFuncHandler} from '../../store/Actions';

const LoginScreen=props=>{

   
    let emailRef=useRef();
    let passRef=useRef();
    const [isLoading,setIsLoading]=useState(false);

    const [userInput,setUserInput]=useState({
        email:'',
        password:''
    });

    const emailTextChangeHandler=text=>{
        setUserInput({
            ...userInput,
            email:text
        })
    }
    const passwordTextChangeHandler=text=>{
        setUserInput({
            ...userInput,
            password:text
        })
    }

    const checkValidation=()=>{

        const regCheck = new RegExp(
            /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
          );

        if(userInput.email===''){
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

    const loginClickHandler=async()=>{
        if(checkValidation()){
            Keyboard.dismiss();
            try {
                setIsLoading(true);
                await Auth().signInWithEmailAndPassword(userInput.email,userInput.password).then(()=>{
                    setIsLoading(false);
                    setUserInput({
                        email:'',
                        password:''
                    })
                    ToastAndroid.show("Login successfully!",ToastAndroid.SHORT);
                });
               
            } catch (error) {
                setIsLoading(false);
                ToastAndroid.show(error.code,ToastAndroid.SHORT);
            }
        }
       
    }

    return(
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View onPress={()=>{
            Keyboard.dismiss();
        }} style={styles.mainContainer}>
            <Text style={styles.titleText}>LOGIN</Text>
            <TextInputComponent
                value={userInput.email}
                testID="emailTestId"
                placeholder="Enter email..."
                changeText={emailTextChangeHandler}
                ref={emailRef}
                onSubmitEditing={()=>{
                    passRef.current.focus();
                }}
                returnKeyType="next"
                keyboardType='email-address'
            />
            <TextInputComponent
                value={userInput.password}
                testID="passwordTestId"
                placeholder="Enter password..."
                changeText={passwordTextChangeHandler}
                ref={passRef}
                secureTextEntry={true}
                onSubmitEditing={loginClickHandler}
                returnKeyType="done"
                keyboardType='default'
            />
            
            <ButtonComponent testID="loginBtnClickTest" btnClick={loginClickHandler} text="Login"/>
            <View style={{flexDirection:'row',marginTop:10}}>
                <Text style={{color:'blue',fontSize:16}}>Create a new account ? </Text>
                <TouchableOpacity testID="signupBtnClickTest" onPress={()=>{
                    props.navigation.navigate('Signup');
                }} activeOpacity={0.4}>
                    <Text style={{color:'blue',fontSize:17,textDecorationLine:'underline'}}>Signup</Text>
                </TouchableOpacity>
               
            </View>
            <TouchableOpacity testID="forgotBtnClickTest" style={{marginTop:20}} onPress={()=>{
                    props.navigation.navigate('ForgotPassword');
                }} activeOpacity={0.4}>
                    <Text style={{color:'blue',fontSize:17,textDecorationLine:'underline'}}>Forgot Password?</Text>
                </TouchableOpacity>
            <AppLoader isLoading={isLoading}/>
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
    },
})

export default LoginScreen;