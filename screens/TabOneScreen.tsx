import * as React from 'react';
import { useState } from "react";
import { StyleSheet } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import EditScreenInfo from '../components/EditScreenInfo';
import MyCarousel from '../components/Carrossel';
import { Text, View } from '../components/Themed';
import {findCardsPorIdFlashCard} from '../services/pastaService';

export default function TabOneScreen({ route, navigation }) {

  const [flashCards, setFlashCards] = useState([]);

  React.useEffect(() => {
    const unsubscribe = navigation.dangerouslyGetParent().addListener('focus', () => {
        
        RecuperarDados1();
    });
    return unsubscribe;
  }, [route],[navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.dangerouslyGetParent().addListener('blur', () => {        
      var listaItens = [];
      setFlashCards(listaItens);
    });
    return unsubscribe;
  }, [route],[navigation]);
 

  function RecuperarDados1(){
    if(route != null && route.params != null && route.params.nodeBanco != null){

      findCardsPorIdFlashCard(route.params.nodeBanco.id.substring(0, route.params.nodeBanco.id.length - 1)).then((result3) => 
      {     
        var listaItens = []     
        for (let index = 0; index < result3.length; index++) {
          const element = result3[index];
          var itemCarrosel = 
          {
            title: element.frente,
            text: element.verso
          }    
          listaItens.push(itemCarrosel);      
        }
        setFlashCards(listaItens);
      });   
    }
  }

  return (
    <View style={styles.container}>
      <MyCarousel carouselItems={flashCards}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
