import React,{forwardRef} from 'react';
import {StyleSheet, TextInput} from 'react-native';

const TextInputComponent=forwardRef((props,ref)=>{
    return(
        <TextInput
        {...props}
        ref={ref}
        style={styles.textInputStyle}
        placeholder={props.placeholder}
        onChangeText={props.changeText}
        value={props.value}
        blurOnSubmit={false}
        />
    )
})

const styles=StyleSheet.create({
    textInputStyle:{
        borderWidth:0.8,
        borderRadius:30,
        width:'100%',
        marginVertical:5,
        paddingHorizontal:15,
        fontSize:18
    }
})

export default TextInputComponent;