import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableHighlight,TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native';
import {deletePasta, deleteSubPastaPorId, deleteSubPastaPorPai, deleteFlashCardsPorId} from '../services/pastaService';
import ModalCriarEditarPasta from '../components/ModalNovaPasta';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import { translate } from '../i18n/scr/locales'

export default function PopUpOptions({carregarTreeview, modalVisible, setModalVisible, locationY, idLongPress, navigation}) 
{
    const [modalEditarVisibleAddPasta, setModalEditarVisibleAddPasta] = useState(false);

    function irParaPaginaCriarCard(criarNovo) {
        navigation.navigate('CriarFlashCard', {
            cardBanco: idLongPress,
            criarNovo: criarNovo
        });
    }
    
    function deletePasta_Click() {  
        
        if(idLongPress.ehFlashCard){
            deleteFlashCardsPorId(idLongPress.id.substring(0, idLongPress.id.length - 1)).then((resp1) => {
                console.log('deletado flashCard' + idLongPress.id);    
                carregarTreeview();
                setModalVisible(false);        
            }).catch((error) => {
                console.log(error);
            });    
        } else{
            if(idLongPress.children != null)
            {            
                deleteSubPastaPorPai(idLongPress.id).then((resp1) => {
                    console.log('deletado subPasta' + idLongPress.id);        
                    carregarTreeview();
                    setModalVisible(false);    
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
    }

    function editarPasta_Click(){
        if(idLongPress.ehFlashCard){
            setModalVisible(false);
            irParaPaginaCriarCard(false);
        } else{            
            setModalEditarVisibleAddPasta(true);
        }
    }

    function criarFlashCard_Click(){        
        setModalVisible(false);
        irParaPaginaCriarCard(true);         
    }

    return (
        <View>
            <Modal
                transparent={true}
                visible={modalVisible}
                seNativeDriver={true}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>

                <TouchableWithoutFeedback onPress={() => {setModalVisible(false)}}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>

                <View style={{top: locationY-10, alignItems: 'flex-start', left: 40}}>
                    <View style={styles.modalView}>
                        {idLongPress.ehFlashCard == null && <Menu.Item onPress={() => {criarFlashCard_Click()}} title={translate('Criar')} />}
                        <Menu.Item onPress={() => {editarPasta_Click()}} title={translate('Editar')} />
                        <Menu.Item onPress={() => {deletePasta_Click()}} title={translate('Excluir')} />
                                
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
        
        alignItems: 'center',
        elevation: 4,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        fontSize: 18,
        width: 90,
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