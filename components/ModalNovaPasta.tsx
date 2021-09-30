import React, { useState, Fragment } from "react";
import { Alert, Modal, StyleSheet, Text,TextInput, Button, View, TouchableWithoutFeedback, TouchableOpacity, Image, ActivityIndicator, CheckBox,ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {addData, insereSubPasta} from '../services/pastaService';

export default function ModalCriarEditarPasta({carregarTreeview, modalVisible, setModalVisible})
{
    const [pasta, setPasta] = useState('');
    const [subPastas, setSubPastas] = useState([]);
    const [subPasta, setSubPasta] = useState('');
    const [apertouSalvar, setApertouSalvar] = useState(false);
    const [terminou, setTerminou] = useState(false);
    const [isSelected, setSelection] = useState(true);

    const [nomeError, setNomeError] = useState('');
    const [sucesso, setSucesso] = useState('');
    
    function limpaCampos(){
        setTerminou(true);
        setApertouSalvar(false);
        setSucesso("Pasta salva com sucesso.");
        setPasta('');
        setSubPasta('');
        setSubPastas([]);
        setSelection(true);
        setTimeout(() => {setTerminou(false)}, 3000);        
    }

    function salvaSubPasta(aux){
        insereSubPasta(aux).then((resp1) => {
            limpaCampos();
        }).catch((error) => {
            setNomeError(error);
            setSucesso('');
            setApertouSalvar(false);
        });          
    }

    function salvarPasta() {        
        setNomeError(null);
        setApertouSalvar(true);
        var parametros = {
            nome: pasta,
        };     
        addData(parametros).then((resp) => {            
            if (subPastas.length != 0){
                subPastas.forEach(element => {
                    var parametrosSubPasta = {
                        nome: element.nome,
                        idPasta: resp,
                    };                      
                    salvaSubPasta(parametrosSubPasta);
                });        
            }else{
                limpaCampos();
            }    
            carregarTreeview();                         
        }).catch((error) => {
            setNomeError(error);
            setSucesso('');
            setApertouSalvar(false);
        });           
    }

    function salvar() {  
        if (pasta.trim() === "") {
            setNomeError("Nome da pasta é obrigatório.");
            setSucesso('');
        } else {            
            salvarPasta();     
        }        
    }

    function addSubPasta(ehPrimeiro) {  
        if (subPasta.trim() === "") {
            setNomeError("Nome da sub pasta é obrigatório.");
            setSucesso('');
        } else {     
            setNomeError(null);
            var listaSubPasta = subPastas;
            var id = 0;
            if (!ehPrimeiro){
                id = listaSubPasta.slice(-1)[0].idTemp + 1;
            }
            var subPastaItem = {
                nome: subPasta,
                idTemp: id
            };     
            listaSubPasta.push(subPastaItem);
            setSubPastas(listaSubPasta);
            setSubPasta('');
        }
    }

    function deleteSubPasta(itemAremover) {  
        var listaSubPasta = subPastas;
        const filteredItems = listaSubPasta.filter(item => item !== itemAremover)
        setSubPastas(filteredItems);
    }

    function getTextInputSubPasta(ehPrimeiro){
        return (
            <View style={styles.fixToText2}>
                <TextInput style = {styles.input2}
                underlineColorAndroid = "transparent"
                placeholder = "Nome sub pasta"
                placeholderTextColor = "#9a73ef"
                autoCapitalize = "none"
                onChangeText={text => setSubPasta(text)}
                value={subPasta}
                />
               
                <TouchableOpacity
                style={{
                    borderWidth: 1,
                    borderColor: 'black',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 30,                    
                    top: 10,
                    right: 7,
                    height: 30,
                    backgroundColor: '#fff',
                    borderRadius: 100,
                    }}
                onPress={() => addSubPasta(ehPrimeiro)}
                >
                    <Icon name='add' size={28} color='#01a699' />
                </TouchableOpacity>  
            </View> 
        )
    }

    function SubPastas(props) {
        if (subPastas.length != 0){
            return(
                <ScrollView style={styles.scrollViewStyle}>
                    {subPastas.map((data) =>    
                        <View key={data.idTemp}  style={styles.fixToText2}>
                            <TextInput style = {styles.input2}
                            underlineColorAndroid = "transparent"
                            placeholder = "Nome sub pasta"
                            placeholderTextColor = "#9a73ef"
                            autoCapitalize = "none"
                            editable={false}
                            value={data.nome}
                            />
                        
                            <TouchableOpacity
                            style={{
                                borderWidth: 1,
                                borderColor: 'black',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 30,                    
                                top: 10,
                                right: 7,
                                height: 30,
                                backgroundColor: '#fff',
                                borderRadius: 100,
                                }}
                            onPress={() => deleteSubPasta(data)}
                            >
                                <Icon name='clear' size={28} color='#01a699' />
                            </TouchableOpacity>  
                        </View>                                 
                    )}
                    {getTextInputSubPasta(false)}
                </ScrollView> )
        } else{
            return (
                <ScrollView style={styles.scrollViewStyle}>
                    {getTextInputSubPasta(true)}
                </ScrollView>
            )
        }

    }

return (
    <View>
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {         
            setModalVisible(!modalVisible);
        }}
    >
        <TouchableWithoutFeedback onPress={() => {setModalVisible(false)}}>
            <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View>
        <View style={styles.modalView}>            
            <TextInput style = {styles.input}
            underlineColorAndroid = "transparent"
            placeholder = "Nome pasta"
            placeholderTextColor = "#9a73ef"
            autoCapitalize = "none"
            onChangeText={text => setPasta(text)}
            value={pasta}
            />

            {!!nomeError && (
            <Text style={{ color: "red" }}>{nomeError}</Text>
            )}
            
            {SubPastas()}                
                     
            <View style={styles.fixToText}>  
                <TouchableOpacity
                    style={styles.Buttons}                                    
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text> Cancelar </Text>        
                </TouchableOpacity>  
                <TouchableOpacity
                    style={styles.Buttons}                                    
                    onPress={() => salvar()}>
                    <Text style={apertouSalvar? {display: 'none'} : !terminou? {display: 'flex'} : {display: 'none'}}> Salvar </Text>
                    <ActivityIndicator size="small" color="#00ff00" 
                        style={apertouSalvar && !terminou? {display: 'flex'} : {display: 'none'}} 
                    />
                    <Icon style={terminou? {display: 'flex'} : {display: 'none'}} 
                        name="done" size={20} color="#00ff00"
                    />
                </TouchableOpacity>      
            </View>
            {!!sucesso && terminou && (
            <Text style={{ color: "green" }}>{sucesso}</Text>
            )}
        </View>
        </View>
        </Modal>
       
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
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    button: {
        borderRadius: 20,
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
        marginTop:15,
        marginBottom:10,
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
        margin: 5,
        marginLeft: 0,
        width: '80%',
        marginHorizontal: 10,
        padding: 4,
        borderColor: '#7a42f4',
        borderWidth: 1
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fixToText2: {
        flexDirection: 'row',        
    },
    scrollViewStyle: {
        height: 300,
        right: 5,
        marginLeft: 0,
    },

});
