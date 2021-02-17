import React from 'react';
import {View,TouchableOpacity,Text, StyleSheet} from 'react-native';

const ButtonComponent=props=>{
    return(
        <TouchableOpacity activeOpacity={0.6} onPress={props.btnClick} style={styles.btnStyle}>
            <Text style={styles.textStyle}>{props.text}</Text>
        </TouchableOpacity>
    )
}

const styles=StyleSheet.create({
    btnStyle:{
        backgroundColor:'blue',
        width:'100%',
        paddingVertical:10,
        textAlign:'center',
        borderRadius:30,
        marginTop:15
    },
    textStyle:{
        color:'white',
        fontSize:24,
        textAlign:'center',
        fontWeight:'bold'
    }
})

export default ButtonComponent;