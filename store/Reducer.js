import {LOGIN,SIGNUP,CLEARDATA} from '../store/Actions'

const intialState={
    userData:null,
    todoDatas:[]
}

const AuthReducer=(state=intialState,action)=>{
    switch(action.type){
        case LOGIN:
            return{
                ...state,
                userData:action.userData
            }
        case SIGNUP:
            return{
                ...state,
                userData:action.userData
            }
        case CLEARDATA:
            return intialState;
    }
    return state;
}

export default AuthReducer;