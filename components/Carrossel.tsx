import Carousel, { Pagination }  from 'react-native-snap-carousel';
import * as React from 'react';
import {  Text, View,  SafeAreaView, TouchableOpacity, Alert, Button, StyleSheet, Dimensions } from 'react-native';
import CardFlip from 'react-native-card-flip';
import { useState, Fragment, useRef } from 'react';

const windowDevice = Dimensions.get("window");

export default function MyCarousel({carouselItems, activeIndex, setActiveIndex, route, navigation, activeSide, setActiveSide}) {
    
    const teste = useRef(this);    
    const isCarousel = React.useRef(null);
    const [width, setWidth] = useState(windowDevice.width);
    const [height, setHeight] = useState(windowDevice.height);

    Dimensions.addEventListener('change', () => {
        setWidth(Dimensions.get("window").width);
        setHeight(Dimensions.get("window").height)
    });

    function renderItem({item,index}){
        return (
            <View style={styles.container}>                
                <CardFlip style={styles.cardContainer} ref={card => teste.current['card' + item.id + index] = card} initialSide={activeSide} route={route} navigation={navigation} >
                    <TouchableOpacity activeOpacity={1} style={[styles.card1]} onPress={() => teste.current['card' + item.id + index].flip()}  >
                        <View style={{
                            borderRadius: 3,
                            height: 350,
                            padding: 10,
                            marginLeft: 10,
                            marginRight: 10, }}>
                            <Text style={{fontSize: 20, color: 'white', textAlign: 'center'}}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={[styles.card2]} onPress={() => teste.current['card' + item.id + index].flip()} >
                        <View style={{
                            borderRadius: 3,                            
                            height: 350,
                            padding: 10,
                            marginLeft: 10, 
                            marginRight: 10, }}>
                            <Text style={{fontSize: 20, color: 'white' , textAlign: 'center'}}>{item.text}</Text>
                        </View>
                    </TouchableOpacity>
                </CardFlip>   
            </View>    
        )
    } 

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',        
        },
        cardContainer: {
            flex: 1,
            top: 20,
            bottom: 15,
            width: width - 40,
        },
        card1: {
            backgroundColor: '#1d86ba',
            borderRadius: 20,
            borderWidth: 2,
            height: height - 255
        },
        card2: {
            backgroundColor: '#4cae7b',
            borderRadius: 20,
            borderWidth: 2,
            height: height - 255
        },
    });
    
    return (
        <SafeAreaView style={{flex: 1, backgroundColor:'rgb(194, 202, 208)', Top: 20, width: '100%' }}>             
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Carousel
                    layout={"stack"}
                    ref={isCarousel}
                    data={carouselItems}
                    sliderWidth={width}
                    itemWidth={width}
                    onSnapToItem={(activeIndex) => setActiveIndex(activeIndex)}
                    renderItem={renderItem} />
                <Pagination
                    dotsLength={carouselItems.length}
                    activeDotIndex={activeIndex}
                    carouselRef={isCarousel}
                    dotStyle={{
                        width: 10,
                        height: 7,
                        borderRadius: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.92)'
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    tappableDots={true}
                />
            </View>               
        </SafeAreaView>
    );    
}

