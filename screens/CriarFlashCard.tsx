import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, Fragment } from "react";
import { StyleSheet, Text, TouchableOpacity, View , TextInput, ScrollView, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types';
import ModalSelecionarMateria from '../components/ModalSelecionarMateria';
import ModalSelecionarAssunto from '../components/ModalSelecionarAssunto';
import {insereFlashCard, insereCards, findFlashCardPorId, findByIdPasta,findCardsPorIdFlashCard} from '../services/pastaService';

export default function CriarFlashCard({ route, navigation }) {
  const [flashCards, setFlashCards] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [frente, setFrente] = useState('');
  const [verso, setVerso] = useState('');
  const [nomeError, setNomeError] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [materia, setMateria] = useState({nome: 'Matéria'});
  const [assunto, setAssunto] = useState({nome: 'Assunto'});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleAssunto, setModalVisibleAssunto] = useState(false);
  const [apertouSalvar, setApertouSalvar] = useState(false);
  const [terminou, setTerminou] = useState(false);

  const { cardBanco } = route.params;

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        RecuperarDados();
    });
    return unsubscribe;
  }, [navigation]);


  function limpaCampos(){
    setTerminou(true);
    setApertouSalvar(false);
    setSucesso("FlashCard salvo com sucesso.");
    setTitulo('');
    setFrente('');
    setVerso('');
    setFlashCards([]);       
  }

  function RecuperarDados(){
    if(cardBanco != null){
      var param = {
          idFlashCard: cardBanco.id.substring(0, cardBanco.id.length - 1),           
      };    
      findFlashCardPorId(param).then((result) => 
      {          
        setTitulo(result.titulo);
        if(result.idMateria != null){
          findByIdPasta(result.idMateria).then((result2) => 
          {          
            setMateria(result2[0]);
          });              
        }
        if(result.idAssunto != null){
          var assuntoItem = {
            nome:result.nomeAssunto,
            id: result.idAssunto
          };
          setAssunto(assuntoItem);
        }
        findCardsPorIdFlashCard(result.idFlashCard).then((result3) => 
        {          
          setFlashCards(result3);
        });   
      });    
    }
  }

  function addFlashCard(ehPrimeiro) {  
        
        if (frente.trim() === "" || verso.trim() === "") {
            setNomeError("Frente e Verso são campos obrigatórios.");
            setSucesso('');
        } else {     
            setNomeError(null);
            var lista = flashCards;
            var id = 0;
            if (!ehPrimeiro){
                id = lista.slice(-1)[0].id + 1;
            }
            var Item = {
                frente: frente,
                verso: verso,
                id: id
            };     
            lista.push(Item);
            setFlashCards(lista);
            setFrente('');
            setVerso('');
        }
  }

  function removerFlashCard(itemAremover) {  
        var listaSubPasta = flashCards;
        const filteredItems = listaSubPasta.filter(item => item !== itemAremover)
        setFlashCards(filteredItems);      
    }

  function salvarFlashCard(){
    if (titulo.trim() === "") {
        setNomeError("O campo 'Título' é obrigatório.");
        setSucesso('');
    } else if (flashCards.length == 0){
      setNomeError("Adicionar pelo menos um card.");
      setSucesso('');
    }     
    else {
      setNomeError(null);
      setApertouSalvar(true);
      var flashCard = {
          titulo: titulo,
          idMateria: materia != null? (assunto.id != null ? null : materia.id) : null,
          idAssunto: assunto != null? assunto.id : null
      };     
      
      insereFlashCard(flashCard).then((result) => 
      {         
        var idFlashCard = result;
        for (let index = 0; index < flashCards.length; index++) {
          const element = flashCards[index];
          var Card = {
            frente: element.frente,
            verso: element.verso,
            idFlashCard: idFlashCard
          };  
          insereCards(Card).then((result) => 
          {    
            limpaCampos();
            console.log('going back');
            navigation.navigate('Root', {
                screen: 'Criar'                
            });
          }).catch((error) => {
            setNomeError(error);
            setSucesso('');
            setApertouSalvar(false);
          });     
        }
      }).catch((error) => {
          setNomeError(error);
          setSucesso('');
          setApertouSalvar(false);
      });             
    }
  }

  function getTextInputAddFlashCard(ehPrimeiro){
    return(
      <View>
        <View style={styles.container2}>              
            <TextInput style = {styles.input} placeholder="Frente" multiline={true} onChangeText={text => setFrente(text)} value={frente}/>
            <TextInput style = {styles.input2} placeholder="Verso" multiline={true} onChangeText={text => setVerso(text)} value={verso}/>       
        </View>
        <View style={styles.container3}>
          <TouchableOpacity style={styles.addCardButton} onPress={() => addFlashCard(ehPrimeiro)}>
              <Icon name='add' size={28} color='#01a699' />
              <Text style={{ paddingRight: 5}}> Adicionar Card </Text>
          </TouchableOpacity>
        </View>
      </View>);
  }

  
  function onChangeTextFrente(text, index) {          
      let newArr = [...flashCards]; 
      newArr[index].frente = text;
      setFlashCards(newArr);
  }

  function onChangeTextVerso(text, index) {          
      let newArr = [...flashCards]; 
      newArr[index].verso = text;
      setFlashCards(newArr);
  }

  function RenderFlashCards(props) {
        if (flashCards.length != 0){
            return(
                <View>
                    {flashCards.map((data, index) =>    
                        <View key={data.id}  >
                            <View style={styles.container2}>              
                                <TextInput style = {styles.input} placeholder="Frente" multiline={true} value={data.frente} onChangeText={text => onChangeTextFrente(text, index)} />
                                <TextInput style = {styles.input2} placeholder="Verso" multiline={true} value={data.verso} onChangeText={text => onChangeTextVerso(text, index)}/>       
                            </View>
                            <View style={styles.container3}>
                              <TouchableOpacity style={styles.addCardButton} onPress={() => removerFlashCard(data)}>
                                  <Icon name='clear' size={28} color='#01a699' />
                                  <Text style={{ paddingRight: 5}}> Remover Card </Text>
                              </TouchableOpacity>
                            </View>
                           
                        </View>                                 
                    )}
                    {getTextInputAddFlashCard(false)}
                </View> )
        } else{
            return (
                <View>
                  {getTextInputAddFlashCard(true)}
                </View>
            )
        }

    }

  return (
    <View style={styles.container}>
      <TextInput style = {styles.input0} placeholder="Título" onChangeText={text => setTitulo(text)} value={titulo} />
      
      {!!nomeError && (
      <Text style={{ color: "red" }}>{nomeError}</Text>
      )}

      <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, width: '100%', borderColor: 'gray'}}>

        {RenderFlashCards()} 
        
      </ScrollView>

      <View style={{ flexDirection: 'column', flexWrap: "wrap", height: 50, width: '100%', marginTop: 15, alignContent: 'stretch' }}>

        <TouchableOpacity style={styles.addMateriaButton} onPress={() => setModalVisible(true)} >
            <Icon name='edit' size={25} color='#01a699' style={{padding: 5}} />
            <Text style={{ paddingRight: 5}}> {materia.nome} </Text>
        </TouchableOpacity>

        {(materia.id != null && materia.children != null) && <TouchableOpacity style={styles.addMateriaButton} onPress={() => setModalVisibleAssunto(true)} >
            <Icon name='edit' size={25} color='#01a699' style={{padding: 5}} />
            <Text style={{ paddingRight: 5}}> {assunto.nome} </Text>
        </TouchableOpacity>}

        <TouchableOpacity style = {styles.submitButton} onPress={() => salvarFlashCard()}>
       
          <Text style={apertouSalvar? {display: 'none'} : !terminou? {display: 'flex', color: 'white'} : {display: 'none'}}> Salvar </Text>
          <ActivityIndicator size="small" color="#00ff00" 
              style={apertouSalvar && !terminou? {display: 'flex'} : {display: 'none'}} 
          />
          <Icon style={terminou? {display: 'flex'} : {display: 'none'}} 
              name="done" size={20} color="#00ff00"
          />
        </TouchableOpacity>

      </View>

      <ModalSelecionarMateria modalVisible={modalVisible} setModalVisible={setModalVisible} setMateria={setMateria} setAssunto={setAssunto}  />
      <ModalSelecionarAssunto modalVisible={modalVisibleAssunto} setModalVisible={setModalVisibleAssunto} materia={materia} setAssunto={setAssunto} />
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  container2: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
  },
  container3: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'flex-end',  
    paddingRight: 10  
  },
  input: {
      margin: 15,
      height: 100,
      width: '100%',
      borderWidth: 2,
      marginHorizontal: 20,
      padding: 5,
      borderColor: '#1d86ba'
   },
   input2: {
      margin: 15,
      height: 100,
      width: '100%',
      borderWidth: 2,
      marginHorizontal: 20,
      padding: 5,
      borderColor: '#4cae7b'
   },
   submitButton: {
      backgroundColor: 'gray',
      padding: 10,
      height: 40,
      alignSelf: "flex-end"
   },
   submitButtonText:{
      color: 'white'
   },
   addCardButton: {
      flex: 1,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',      
      height: 30,
      backgroundColor: '#fff',
      borderRadius: 100,
   },
   addMateriaButton: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',        
      height: 30,
      backgroundColor: '#fff',
      borderRadius: 100,
      marginTop: 5,
      alignSelf: "flex-start",  
   },
   input0: {
      margin: 15,      
      width: '100%',
      borderWidth: 2,
      marginHorizontal: 20,
      padding: 5,
      borderColor: '#000'
   },
});
