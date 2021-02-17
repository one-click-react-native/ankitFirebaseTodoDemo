import Auth from '@react-native-firebase/auth';
import {ToastAndroid} from 'react-native';

export const LOGIN="LOGIN";
export const SIGNUP="SIGNUP";
export const CLEARDATA='CLEARDATA'

export const loginFuncHandler=(email,password)=>{
    return async dispatch=>{
    try {
       const userData=await Auth().signInWithEmailAndPassword(email,password);
       dispatch({
           type:LOGIN,
           userData:userData.user,
       })
       return userData;
    } catch (error) {
        ToastAndroid.show(error.code,ToastAndroid.SHORT);
    }
}
}

export default signUpFuncHandler=(email,password)=>{
    return async dispatch=>{
        try {
            const userData=await Auth().createUserWithEmailAndPassword(email,password);
            dispatch({
                type:SIGNUP,
                userData:userData.user
            })
            return userData;
        } catch (error) {
            ToastAndroid.show(error.code,ToastAndroid.SHORT);
        }
    }
}