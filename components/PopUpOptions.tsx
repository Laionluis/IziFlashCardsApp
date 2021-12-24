import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableHighlight,TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native';
import {deletePasta, deleteSubPastaPorId, deleteSubPastaPorPai} from '../services/pastaService';
import ModalCriarEditarPasta from '../components/ModalNovaPasta';

export default function PopUpOptions({carregarTreeview, modalVisible, setModalVisible, locationY, idLongPress, navigation}) 
{
    const [modalEditarVisibleAddPasta, setModalEditarVisibleAddPasta] = useState(false);

    function irParaPaginaCriarCard() {
        navigation.navigate('CriarFlashCard', {
            cardBanco: idLongPress,
        });
    }
    
    function deletePasta_Click() {  
        if(idLongPress.children != null)
        {            
            deleteSubPastaPorPai(idLongPress.id).then((resp1) => {
                console.log('deletado subPasta' + idLongPress.id);            
            }).catch((error) => {
                console.log(error);
            });      
        }

        if(idLongPress.parent != null){
            deleteSubPastaPorId(idLongPress.id).then((resp1) => {
                console.log('deletado SubPasta' + idLongPress.id);
                carregarTreeview();
                setModalVisible(false);
            }).catch((error) => {
                console.log(error);
            });   
        } else{
            deletePasta(idLongPress.id).then((resp1) => {
                console.log('deletado Pasta' + idLongPress.id);
                carregarTreeview();
                setModalVisible(false);
            }).catch((error) => {
                console.log(error);
            });   
        }   
    }

    function editarPasta_Click(){
        if(idLongPress.ehFlashCard){
            setModalVisible(false);
            irParaPaginaCriarCard();
        } else{            
            setModalEditarVisibleAddPasta(true);
        }
    }

    return (
        <View>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>

                <TouchableWithoutFeedback onPress={() => {setModalVisible(false)}}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>

                <View style={{top: locationY-10, flex: 1, alignItems: 'center', right: 30}}>
                    <View style={styles.modalView}>
                        {idLongPress.ehFlashCard == null && <TouchableOpacity style={styles.buttonTouch} onPress={() => {editarPasta_Click()}}>
                            <Text style={styles.modalText}>Criar</Text>
                        </TouchableOpacity>}
                        <TouchableOpacity style={styles.buttonTouch} onPress={() => {editarPasta_Click()}}>
                            <Text style={styles.modalText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonTouch} onPress={() => {deletePasta_Click()}}>
                            <Text style={styles.modalText}>Excluir</Text>    
                        </TouchableOpacity>            
                    </View>
                </View>
            </Modal>
            <ModalCriarEditarPasta carregarTreeview={carregarTreeview} modalVisible={modalEditarVisibleAddPasta} setModalVisible={setModalEditarVisibleAddPasta} nodeEditar={idLongPress}  />
        </View>
  );
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        fontSize: 18,
        width: 50,
        textAlign: "center",
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent'
    },
    separator: {
        borderBottomColor: "black", 
        borderBottomWidth: StyleSheet.hairlineWidth, 
        alignSelf:'stretch',
        width: 70
    },
    buttonTouch: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: "center",
        paddingVertical: 7,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
    },
});