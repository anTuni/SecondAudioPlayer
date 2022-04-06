import React,{useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
    TrackPlayerComponent
}
from './TrackPlayerComponent'

class Webview extends React.Component {
    constructor(props) {
        super(props);
        this.trackPlayerRef = React.createRef();
    }
    messageHandler(msg){
        this.trackPlayerRef.trackController(msg)
    }
    componentDidMount() {
    }
    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={{flex:1}}>
                     <WebView
                        ref={(r) => {this.webref = r}}
                        source={{ uri: 'http://172.30.1.39:8800' }}
                        style={{ marginTop: 20 }}
                        onMessage={(msg)=>this.messageHandler(msg)}
                        cacheEnabled={false}
                        cacheMode='LOAD_NO_CACHE'
                    />
                    <TrackPlayerComponent 
                      ref={(r) => {this.trackPlayerRef = r}}
                      injectJavaScript={(script)=>this.webref.injectJavaScript(script)}
                      logging={true}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

export default Webview

/* 
깃북에 문서 작업해보기
문서만 보고 사용할 수 있도록
깔끔하게 정리해보기

디자인만 쉽게 적용할 수 있도록
*/