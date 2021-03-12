import React,{useState,useEffect} from 'react';
import { View,StyleSheet,FlatList,KeyboardAvoidingView,Keyboard,
    TouchableOpacity,TextInput,Text, ToastAndroid,I18nManager } from "react-native";
import firestore, { firebase } from '@react-native-firebase/firestore';
import ListComponent from '../../Components/ListComponent';
import AppLoader from '../../Components/Loader';
import Auth from '@react-native-firebase/auth';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';



const transaltionGetters={
  'ar-EG':()=>require("../../src/translations/ar.json"),
  'fr-FR':()=>require("../../src/translations/fr.json"),
  'en-IN':()=>require("../../src/translations/en.json"),
  'ar':()=>require("../../src/translations/ar.json"),
  'fr':()=>require("../../src/translations/fr.json"),
  'en':()=>require("../../src/translations/en.json"),
}
const translate=memoize(
  (key,config)=>{
    console.log("key congif ",key,config)
    return(i18n.t(key,config))
  },
  (key,config)=>{
    console.log("key confi 2 :")
    return(config ? key + JSON.stringify(config) : key)
  }
  );


  const set18nConfig=()=>{
    i18n.fallbacks=true;
    i18n.missingTranslation=()=>{return undefined}
    const fallBack={languageTag:"en",isRTL:false}
    const { languageTag,isRTL} =
      RNLocalize.findBestAvailableLanguage(Object.keys(transaltionGetters)) || fallBack;
      translate.cache.clear();
      console.log(RNLocalize.getLocales())
      I18nManager.forceRTL(isRTL)
      i18n.translations={
        [languageTag]:transaltionGetters[languageTag](),
      };
      i18n.locale=languageTag;
  }

const HomeScreen=props=>{
    const [todoItem,setTodoItem]=useState('');
    const userData=Auth().currentUser;
    const todosRef=firestore().collection(userData.uid);
    const [todoList,setTodoList]=useState([]);

    set18nConfig();

    const [isLoading,setIsLoading]=useState(false)
    useEffect(()=>{
        
        const handleLocalizationChange=()=>{
          setI18nConfig()
      .then(() => this.forceUpdate())
      .catch((error) => {
        console.error(error);
      });
        }
    
        RNLocalize.addEventListener("change",handleLocalizationChange);
        getDataFunc();
        return ()=>{
          RNLocalize.removeEventListener("change",handleLocalizationChange)
        }
    },[])

    


    const getDataFunc=async()=>{
        try {
        await todosRef.onSnapshot(querySnapshot=>{
          const list=[];
          querySnapshot.forEach(doc=>{
            const {title,done,date}=doc.data();
            console.log("Translate ....",translate('hello'))

            list.push({
              id:doc.id,
              title:translate(title),
              done:done,
              date:date
            })
          });
          setTodoList(list);
        })
        } catch (error) {
          setIsLoading(false);
          console.log("Error Occured :",error)
        }
      }
    
      const deleteBtnClickHandler=async(item)=>{
          try {
             await firestore().collection(userData.uid).doc(item.id).delete();
          } catch (error) {
            console.log('Something went wrong!')
          }
          ToastAndroid.show("Item Deleted!",ToastAndroid.SHORT);
      }
      const addClickHandler=async()=>{
    
        await todosRef.doc(Date.now().toString()).set({
          title:todoItem,
          done:false,
          Created_At:new Date().toISOString()
        })
          // await todosRef.add({
          //   title:todoItem,
          //   done:false
          // })
          setTodoItem('');
      }
      
      const changeTaskItemHandler=text=>{
        setTodoItem(text);
      }
    
      const editBtnClickHander=async(item,editableTodo)=>{
        try {
          await firestore().collection(userData.uid).doc(item.id).update({
            title:editableTodo
          }).then(()=>{
            ToastAndroid.show('Item Updated!',ToastAndroid.SHORT)
          })
        } catch (error) {
          console.log("Error occured : ",error)
        }
      }

    return(
        <KeyboardAvoidingView keyboardVerticalOffset={10} style={{flex:1,paddingHorizontal:10,paddingVertical:5}}>
       
        <View style={{flex:1,paddingHorizontal:10,paddingVertical:5}}>
          {
        todoList.length===0 ?
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:'#00000060',fontSize:18}}>No task available!</Text>
        </View>
        :
        <FlatList data={todoList}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps='always'
        keyExtractor={(items,index)=>index.toString()}   
       renderItem={(items)=>{
           return(
               <ListComponent edit={translate("edit")} delete={translate("delete")}
               cancel={translate("cancel")}
               save={translate("save")}
               data={items.item} name={items.item.title} 
               deleteBtnClick={deleteBtnClickHandler} editBtnClick={editBtnClickHander}  />
           )                
       }}/>
          }
        
   
       <View style={{width:'100%',flexDirection:'column',borderTopWidth:0.3,paddingTop:10}}>
           <TextInput 
               keyboardType='default'
               placeholder={translate('enter_task')}
               onSubmitEditing={()=>{
                   Keyboard.dismiss();
               }}
               value={todoItem}
               onChangeText={changeTaskItemHandler}
               style={{borderRadius:30,borderWidth:0.5,paddingHorizontal:10,fontSize:18}}
           />
       <View style={{width:'100%',alignItems:'center'}}>
           <TouchableOpacity 
           activeOpacity={0.6} 
           onPress={addClickHandler}
           style={{width:'30%',alignItems:'center',borderRadius:30,
           marginTop:10,
           paddingHorizontal:10,paddingVertical:5,backgroundColor:'blue'}}>
               <Text style={{fontSize:18,fontWeight:'bold',color:'#fff'}}>{translate('add')}</Text>
           </TouchableOpacity>
       </View>
   </View>
   <AppLoader isLoading={isLoading}/>
   </View>
    </KeyboardAvoidingView>
    )
}

const styles=StyleSheet.create({

});

export default HomeScreen;