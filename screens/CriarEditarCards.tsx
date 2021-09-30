import React, { useState, Fragment } from "react";
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, Text, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
//import TreeView from 'react-native-final-tree-view';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalCriarEditarPasta from '../components/ModalNovaPasta';
import PopUpOptions from '../components/PopUpOptions'
import TreeView from '../components/TreeView'
import FloatingAction from '../components/FloatingButton'
import {findAll, findAllSubPasta} from '../services/pastaService';

function getButtonEditar(isExpanded, hasChildrenNodes) {
    if (!hasChildrenNodes) {
        return ''
    } else if (isExpanded) {
        return <Icon name="create-outline" size={22} />;
    } else {
        return <Icon name="create-outline" size={22}/>;
    }
}

function getListaTreeView() {
    if (!hasChildrenNodes) {
        return ''
    } else if (isExpanded) {
        return <Icon name="create-outline" size={22} />;
    } else {
        return <Icon name="create-outline" size={22}/>;
    }
}

export default function CriarEditarCards() {

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleAddPasta, setModalVisibleAddPasta] = useState(false);
    const [locationX, setLocationX] = useState(0);
    const [locationY, setLocationY] = useState(0);
    const [carregouPastas, setCarregouPastas] = useState(0);  //pra nao ficar carregando toda hora 
    const [listaTreeview, setListaTreeview] = useState([]);
    const [zIndexFloatButton, setZIndexFloatButton] = useState();

    if(!carregouPastas)
    {
        reCarregaTreeView();
    }

    function reCarregaTreeView(){
        findAll().then((result) => 
        {          
            setCarregouPastas(true);         
            setListaTreeview(result);
        });    
    }

    function onNodeLongPress({node, level, evt}){
        setLocationY(evt.nativeEvent.pageY);
        setModalVisible(true);
    }

    function getIndicator(isExpanded, hasChildrenNodes, node) {
        if (!hasChildrenNodes) {
            return ''
        } else if (isExpanded) {
            return <Icon name="caret-back-circle-outline" size={18} />;
        } else {
            return <Icon name="caret-down-circle" size={18}/>;
        }
    }

    const actions = [
        {
            text: "Adicionar Pasta/SubPasta",
            icon: <Icon name='add' size={28} color='#01a699' />,
            name: "bt_addPasta",
            position: 2
        },
        {
            text: "Adicionar Card",
            icon: <Icon name='add' size={28} color='#01a699' />,
            name: "bt_addCard",
            position: 1
        },  
    ];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, padding: 10 }}>
                <TreeView                         
                    getCollapsedNodeHeight={() => 35}
                    data={listaTreeview}
                    renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                        return (                
                            <View style={{ paddingBottom: 3, bottom: 3}}  >
                                <Text
                                    style={{
                                        marginLeft: 25 * level,
                                        fontSize: 23,
                                    }}>
                                    {getIndicator(isExpanded, hasChildrenNodes, node)} {node.nome} 
                                </Text>
                            </View>               
                        );
                    }}
                    onNodeLongPress={onNodeLongPress}
                />
                <PopUpOptions modalVisible={modalVisible} setModalVisible={setModalVisible} locationY={locationY}  />
            </ScrollView>
            <ModalCriarEditarPasta modalVisible={modalVisibleAddPasta} setModalVisible={setModalVisibleAddPasta} locationY={locationY}  />
            <FloatingAction
                actions={actions}
                onPressItem={name => {
                    if(name == "bt_addCard"){
                        setModalVisibleAddPasta(true);
                    }
                }}
            />
        
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    zIndexFloatButton_0:{
        flex: 2,
        zIndex: 0
    },
    zIndexFloatButton_1:{
        flex: 2,
        zIndex: 1
    }
});
