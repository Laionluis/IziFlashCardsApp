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
  const [titulo, setTitulo] = useState('Nenhum card selecionado!');
  const [idPagina, setIdPagina] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSide, setActiveSide] = useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.dangerouslyGetParent().addListener('focus', () => {
        RecuperarDados1();
    });
    return unsubscribe;
  }, [route],[navigation]); 

  function RecuperarDados1(){
    if(route != null && route.params != null && route.params.nodeBanco != null){
      //console.log(idPagina);
      if(idPagina != route.params.nodeBanco.id.substring(0, route.params.nodeBanco.id.length - 1)){
        setActiveSide(true);
        setActiveIndex(0);
      } else {
        setActiveSide(false);
      }        
      setIdPagina(route.params.nodeBanco.id.substring(0, route.params.nodeBanco.id.length - 1));
      setTitulo(route.params.nodeBanco.nome);
      findCardsPorIdFlashCard(route.params.nodeBanco.id.substring(0, route.params.nodeBanco.id.length - 1)).then((result3) => 
      {     
        var listaItens = [];
        for (let index = 0; index < result3.length; index++) {
          const element = result3[index];
          var itemCarrosel = 
          {
            id: element.id,
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
      <Text style={{ backgroundColor:'rgb(194, 202, 208)', width: '100%', fontSize: 25, textAlign: 'center', color: 'black' }}> {titulo} </Text>   
      <MyCarousel carouselItems={flashCards} activeIndex={activeIndex} setActiveIndex={setActiveIndex} route={route} navigation={navigation} activeSide={activeSide} setActiveSide={setActiveSide} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(194, 202, 208)'
  },
  
});
