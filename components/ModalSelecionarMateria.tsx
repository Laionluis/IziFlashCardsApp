import React, { useState, Fragment } from "react";
import { Alert, Modal, StyleSheet, Text,TextInput, Button, View, TouchableWithoutFeedback, TouchableOpacity, Image, ActivityIndicator, CheckBox,ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {addData, insereSubPasta, atualizarPasta, atualizarSubPasta, deleteSubPastaPorId,findAll} from '../services/pastaService';
import ModalCriarEditarPasta from './ModalNovaPasta';
import { translate } from '../i18n/scr/locales'

export default function ModalSelecionarMateria({modalVisible, setModalVisible, setMateria, setAssunto})
{
    const [materias, setMaterias] = useState([]);
    const [modalVisibleAddPasta, setModalVisibleAddPasta] = useState(false);

    function RecuperarDados(){        
        setMaterias([]);        
        
        findAll().then((result) => 
        {         
            setMaterias(result);
        });  
    }

    function AposSelecionado(data){
        //console.log(data);
        setMateria(data);
        setAssunto({nome: 'Assunto'});
        setModalVisible(false);
    }

    return (
        <View>
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            seNativeDriver={true}
            onRequestClose={() => {         
                setModalVisible(!modalVisible);
            }}
            onShow={() => {         
                RecuperarDados();
            }}
            >
                <TouchableWithoutFeedback onPress={() => {setModalVisible(false)}}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>

                <View>
                    <View style={styles.modalView}>            
                    
                        <ScrollView >
                            {materias.map((data, index) =>    
                            <View key={data.id}  style={styles.fixToText2}>    

                                <TouchableOpacity style = {{padding: 5, width: 200, borderWidth: 1, margin: 5, borderRadius: 20}} onPress={() => AposSelecionado(data)}>
                                    <Text style = {{textAlign: 'center', justifyContent: 'center'}}> {data.nome} </Text>
                                </TouchableOpacity>
                            
                            </View>                                 
                            )}
                        </ScrollView> 

                        <TouchableOpacity style={styles.addCardButton} onPress={() => setModalVisibleAddPasta(true)}>
                            <Icon name='add' size={28} color='#01a699' />
                            <Text style={{ paddingRight: 5}}>{translate('AddMateriuas')}</Text>
                        </TouchableOpacity>
                    

                    </View>
                </View>
            </Modal>
            <ModalCriarEditarPasta carregarTreeview={RecuperarDados} modalVisible={modalVisibleAddPasta} setModalVisible={setModalVisibleAddPasta}  />
        </View>
    );

};

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: 500
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent'
    },

    Buttons: {
        backgroundColor:"#666",
        borderRadius:25,
        height:35,
        width:100,
        alignItems:"center",
        justifyContent:"center",
        margin: 15
    },
    input: {
        margin: 5,
        width: '100%',
        marginHorizontal: 20,
        padding: 5,
        borderColor: '#7a42f4',
        borderWidth: 1
    },
    input2: {
        marginTop: 5,
        marginBottom: 5,  
        marginLeft: 0,
        marginRight: 5,
        width: '85%',
        marginHorizontal: 10,
        padding: 5,
        borderColor: '#7a42f4',
        borderWidth: 1
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fixToText2: {
        flexDirection: 'row',        
        alignContent: 'center',
        textAlign: 'center'
    },
    scrollViewStyle: {
        height: 300,    
        marginRight: 0,
        marginLeft: 0
    },
    addCardButton: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',      
      height: 40,
      backgroundColor: '#fff',
      borderRadius: 100,
      marginTop: 15
   },
    container3: {
    flex: 1,
    width: 200,
    backgroundColor: '#fff'
  },
});
