import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import DatabaseInit from './database/DatabaseInit';

import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'expo-ads-admob';

export default class App extends Component {
  constructor () {
    super();    
  }

  // async componentDidMount(){
  //     AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712'); // Test ID, Replace with your-admob-unit-id
  //     await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: false});      
  //     await AdMobInterstitial.showAdAsync();
  //     console.log('mount it!');
  // }
  
  render () {
    new DatabaseInit;
    console.log("initialize database");
    
    return (
      <SafeAreaProvider>        
        <Navigation  />
        <StatusBar />      
      </SafeAreaProvider>
    );
    
  }
}
