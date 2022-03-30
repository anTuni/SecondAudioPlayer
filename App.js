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


class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
    return (
      <SafeAreaView style={{flex:1}}>
        <ScrollView
          style={{flex:1}}>
          <AudioPlayer />
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({});

export default App;
