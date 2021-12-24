import Carousel from 'react-native-snap-carousel';
import * as React from 'react';
import {  Text, View,  SafeAreaView, TouchableOpacity, Alert, Button, StyleSheet  } from 'react-native';
import CardFlip from 'react-native-card-flip';
import { useState, Fragment, useRef } from 'react';

export default function MyCarousel({carouselItems}) {
    const teste = useRef(this);
    const [activeIndex, setActiveIndex] = useState(0);
        
    function renderItem({item,index}){
        return (
            <View style={styles.container}>                
                <CardFlip style={styles.cardContainer} ref={card => teste.current['card' + index] = card} >
                    <TouchableOpacity activeOpacity={1} style={[styles.card1]} onPress={() => teste.current['card' + index].flip()}  >
                        <View style={{
                            borderRadius: 5,
                            height: 350,
                            padding: 50,
                            marginLeft: 25,
                            marginRight: 25, }}>
                            <Text style={{fontSize: 30, color: 'white'}}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={[styles.card2]} onPress={() => teste.current['card' + index].flip()} >
                        <View style={{
                            borderRadius: 5,                            
                            height: 350,
                            padding: 50,
                            marginLeft: 25, 
                            marginRight: 25, }}>
                            <Text style={{fontSize: 30, color: 'white'}}>{item.text}</Text>
                        </View>
                    </TouchableOpacity>
                </CardFlip>   
            </View>    
        )
    } 
    
    return (
        <SafeAreaView style={{flex: 1, backgroundColor:'white', paddingTop: 30, width: '100%' }}>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
                <Carousel
                    layout={"default"}
                    ref={ref => carousel = ref}
                    data={carouselItems}
                    sliderWidth={360}
                    itemWidth={350}
                    renderItem={renderItem}
                    onSnapToItem = { index => setActiveIndex(index) } />
            </View>               
        </SafeAreaView>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    cardContainer: {
        width: 320,
        height: 400,

    },
    card1: {
        backgroundColor: '#1d86ba',
        borderRadius: 20,
        borderWidth: 3,
    },
    card2: {
        backgroundColor: '#4cae7b',
        borderRadius: 20,
        borderWidth: 3,
    },
});