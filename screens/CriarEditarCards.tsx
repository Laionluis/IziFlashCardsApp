import React, { useState, Fragment, useEffect  } from "react";
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, Text, View, TouchableWithoutFeedback, TouchableOpacity, Dimensions, AppState } from 'react-native';
//import TreeView from 'react-native-final-tree-view';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalCriarEditarPasta from '../components/ModalNovaPasta';
import PopUpOptions from '../components/PopUpOptions'
import PopMenu from '../components/PopMenu'
import TreeView from '../components/TreeView'
import FloatingAction from '../components/FloatingButton'
import {findAll, findAllSubPasta, findAllFlashCards} from '../services/pastaService';
import CriarFlashCard from '../screens/CriarFlashCard';
import { translate } from '../i18n/scr/locales'

import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'expo-ads-admob';

const window = Dimensions.get("window");

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

export default function CriarEditarCards({navigation, route}) {

    const [modalVisible, setModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisibleAddPasta, setModalVisibleAddPasta] = useState(false);
    const [locationX, setLocationX] = useState(0);
    const [locationY, setLocationY] = useState(0);
    const [nodeLongPress, setNodeLongPress] = useState(0);
    const [carregouPastas, setCarregouPastas] = useState(0);  //pra nao ficar carregando toda hora 
    const [listaTreeview, setListaTreeview] = useState([]);
    const [zIndexFloatButton, setZIndexFloatButton] = useState();
    const [hasAd, setHasAd] = useState(false);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            //console.log(route);
            if((route != null && route.params != null && route.params.recarregar))
            {
                console.log('recarregou');
                reCarregaTreeView();
            }
        });
        return unsubscribe;
    }, [route],[navigation]);

    function reCarregaTreeView(){
        var auxLista = [];
        findAll().then((result) => 
        {         
            auxLista = result;
            findAllFlashCards().then((result2) => 
            {          
                setCarregouPastas(true);      
                
                if(result2 != null){
                    for (let index = 0; index < result2.length; index++) {
                        const element = result2[index];                        
                        auxLista.push(element);
                    }
                } 
                setListaTreeview(auxLista);
            });    
        });    
    }

    function onNodeLongPress({node, level, evt}){
        if((evt.nativeEvent.pageY + 150) > window.height){
            setLocationY(evt.nativeEvent.pageY - 150);
        } else{
            setLocationY(evt.nativeEvent.pageY);
        }
        
        setNodeLongPress(node);
        setModalVisible(true);
    }

    function testePress({node, level, evt}){
               
        setMenuVisible(true);
    }

    function closeMenu({node, level, evt}){               
        setMenuVisible(false);
    }

    function onPress({node, level}){
        if(node != null && node.ehFlashCard != null && node.ehFlashCard == true){
            navigation.navigate('Root', {
                screen: 'Cards',
                params: {
                    screen: 'TabOneScreen',
                    params: {
                        nodeBanco: node,
                    },
                }
            });
        }
    }

    function getIndicator(isExpanded, hasChildrenNodes, node) {
        if(node.ehFlashCard){
            return <Icon name="book-outline" size={18} />;
        } else if (!hasChildrenNodes) {
            return ''
        } else if (isExpanded) {
            return <Icon name="caret-back-circle-outline" size={18} />;
        } else {
            return <Icon name="caret-down-circle" size={18}/>;
        }
    }

    function irParaPaginaCriarCard() {
        navigation.navigate('CriarFlashCard', {
            cardBanco: null,
        });
    }

    const actions = [
        {
            text: translate('AddMateriaAssunto'),
            icon: <Icon name='add' size={28} color='#01a699' />,
            name: "bt_addPasta",
            position: 2
        },
        {
            text: translate('AddCard'),
            icon: <Icon name='add' size={28} color='#01a699' />,
            name: "bt_addCard",
            position: 1
        },  
    ];

    function bannerError(e) {
        console.log('banner error: ');
        setHasAd(false);
    }
    
    function adReceived() {
        console.log('banner ad received: ');
        setHasAd(true);
    }
    function adClicked() {
        console.log('banner ad clicked: ');
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(194, 202, 208)' }}>
            <View style={{ flex: 1 }}>    
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
                        onNodePress={onPress}
                    />
                    <PopUpOptions carregarTreeview={reCarregaTreeView} modalVisible={modalVisible} setModalVisible={setModalVisible} locationY={locationY} idLongPress={nodeLongPress} navigation={navigation}   />
                    
                </ScrollView>
                <ModalCriarEditarPasta carregarTreeview={reCarregaTreeView} modalVisible={modalVisibleAddPasta} setModalVisible={setModalVisibleAddPasta}  />
                <FloatingAction
                    actions={actions}
                    active={true}
                    showBackground={true}
                    overlayColor={'rgba(192,192,192,0.7)'}
                    onPressItem={name => {
                        if(name == "bt_addPasta"){
                            setModalVisibleAddPasta(true);
                        } else if(name == "bt_addCard"){
                            irParaPaginaCriarCard();
                        }
                    }}
                />
            </View>
            <View style={!hasAd ? { height: 0 } : {}}>
                <View>
                    <AdMobBanner
                        bannerSize="smartBanner"
                        adUnitID="ca-app-pub-7818959313803057/4602804469" // Test ID, Replace with your-admob-unit-id
                        servePersonalizedAds={false} // true or false
                        onDidFailToReceiveAdWithError={bannerError}
                        onAdViewDidReceiveAd={adReceived}
                        onAdViewWillPresentScreen={adClicked}
                    />
                </View>
            </View>
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
