import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableHighlight,TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native';

export default function PopUpOptions({modalVisible, setModalVisible, locationY}) 
{
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
                        <TouchableOpacity style={styles.buttonTouch}>
                            <Text style={styles.modalText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonTouch}>
                            <Text style={styles.modalText}>Excluir</Text>    
                        </TouchableOpacity>            
                    </View>
                </View>
            </Modal>
        </View>
  );
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderTopLeftRadius: 0,
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