import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const Webview = () =>{
    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1}}>
                 <WebView
                    source={{ uri: 'http://172.30.1.8' }}
                    style={{ marginTop: 20 }}
                />
            </View>
        </SafeAreaView>
    )
}

export default Webview