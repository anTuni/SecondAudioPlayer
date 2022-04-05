import React,{useState,useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  TrackPlayerInstance,messageHandler
}
from './TrackPlayerInstance'

class Webview extends React.Component {
    constructor(props) {
        super(props);
        this.trackPlayerRef = React.createRef();
    }

    runSingleFuncScript(fucntionName,argument){
        var run = `${fucntionName}('${JSON.stringify(argument)}')`
        this.injectJavascript(run)
    }
    injectJavascript(script){
        var run = script ? script : 'alert("hello from RN to Webview");'
        if(this.webref){
            this.webref.injectJavaScript(run);
        }
    }
    componentDidMount() {
      trackPlayerInit((fucntionName,argument)=>{runSingleFuncScript(fucntionName,argument)});
    }
    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={{flex:1}}>
                     <WebView
                        ref={(r) => {this.webref = r}}
                        source={{ uri: 'http://172.30.1.52:8800' }}
                        style={{ marginTop: 20 }}
                        onMessage={(msg)=>this.trackPlayerRef.currentmessageHandler(msg)}
                        cacheEnabled={false}
                        cacheMode='LOAD_NO_CACHE'
                    />
                    <TrackPlayerInstance 
                      ref={(r) => {this.trackPlayerRef = r}}
                      runSingleFuncScript={(fucntionName,argument)=>this.runSingleFuncScript(fucntionName,argument)}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

export default Webview