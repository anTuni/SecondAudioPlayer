/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Pressable,
  Image
} from 'react-native';
import AudioPlayer from './src/component/AudioPlayer'
import Webview from './src/component/Webview'
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Webview"
            component={Webview}
            options={{ title: 'Track Player' }}
          />
          <Stack.Screen name="Player" component={AudioPlayer} />
        </Stack.Navigator> 
      </NavigationContainer>
    );
  }
};

const styles = StyleSheet.create({});

export default App;
