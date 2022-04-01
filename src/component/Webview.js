import React,{useState,useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import TrackPlayer,
{
  Event,
  useTrackPlayerEvents,
  State,
  Capability,
  useProgress,
 } from 'react-native-track-player';
const tracks = [
{
    url: 'https://file-examples.com/storage/fe02ad24406246a3cc690e0/2017/11/file_example_MP3_2MG.mp3', // Load media from the network
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'https://www.fnordware.com/superpng/pnggrad8rgb.png', // Load artwork from the network
    duration: 52 // Duration in seconds
},
{
    url: 'https://samplelib.com/lib/preview/mp3/sample-15s.mp3', // Load media from the network
    title: 'Second',
    artist: 'Secondary',
    album: 'Secondwhile(1<2)',
    genre: 'Second House, Second House',
    date: '2022-01-10T01:00:00+00:00', // RFC 3339
    artwork: 'https://www.pngall.com/wp-content/uploads/8/Sample.png', // Load artwork from the network
    duration: 19 // Duration in seconds
},
]
const stateText = (playerState)=>{
    var text
    switch(playerState)
    {
      case State.None:
        text = 'None'
      break;
      case State.Ready:
        text = 'Ready'
      break;
      case State.Playing:
        text = 'Playing'
      break;
      case State.Paused:
        text = 'Paused'
      break;
      case State.Stopped:
        text = 'Stopped'
      break;
      case State.Buffering:
        text = 'Buffering'
      break;
      case State.Connecting:
        text = 'Connecting'
      break;
      default:
        text = 'None'
    }
    return text
  }
 const PlayerInfo = (props) => {
    const progress = useProgress();
    const [PlayerState, setPlayerState] = useState('');
    const [trackInfo, setTrackInfo] = useState({
      artist :'',
      album :'',
      artwork :'',
    });
    /*
    TrackPlayer Event bindings
    Event.PlaybackTrackChanged => 트랙 바뀌었을 때(곡 전환시에)
    Event.PlaybackState => 재생 상태 바뀌었을 때(재생, 일시정지, 정지, 버퍼링 등)
    */
    useTrackPlayerEvents([Event.PlaybackTrackChanged,Event.PlaybackState], async event => {
      console.log('useTrackPlayerEvents triggered')
      if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        setTrackInfo(track);
        props.runSingleFuncScript('handleState',track);
        console.log('PlayerInfo :: PlaybackTrackChanged ::trackInfo =\n',track)
      }else if (event.type === Event.PlaybackState){
        const state = await TrackPlayer.getState();
        setPlayerState(stateText(state));
        const track = await TrackPlayer.getCurrentTrack().then(async(index)=>{
            const track = await TrackPlayer.getTrack(index);
            console.log('PlayerInfo :: useTrackPlayerEvents ::track =\n',track)
            props.runSingleFuncScript('handleState',track);
        });
        console.log('PlayerInfo :: useTrackPlayerEvents ::PlayerState =\n',stateText(state))
      }
    });
    useEffect(() => {
        props.runSingleFuncScript('handleProgress',progress);
    });
    return (<View></View>)
}
class Webview extends React.Component {
    constructor(props) {
        super(props);
    }
    messageHandler = async(msg)=>{
        console.log('messageHandler::msg ',msg)
        switch (msg.nativeEvent.data) {
            case 'skipToPrev':
                await TrackPlayer.skipToPrevious()
                break;
            case 'play':
                TrackPlayer.play()
                break;
            case 'pause':
                TrackPlayer.pause()
                break;
            case 'stop':
                TrackPlayer.stop()
                break;
            case 'skipToNext':
                await TrackPlayer.skipToNext()
                break;
        
            default:
                this.injectJavascript('alert("hello from RN\'s messageHandler to Webview");')
                break;
        }
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
    trackPlayerInit = async() =>{
        await TrackPlayer.setupPlayer({})

        TrackPlayer.updateOptions({
          /*
         안드로이드에서 앱이 closed 상태가 되었을 때 미디어플레이어를 destroy 할 것인지 정의
          */
          stopWithApp: true,
          /*
         Background 상태에서 허용할 컨트롤 정의 => 여기서 허용한 것만 Event 발생 
         ※Stop을 사용할 경우 앱이 종료 될 수 있음 
          */
         capabilities: [
           Capability.Play,
           Capability.Pause,
           Capability.SkipToNext,
           Capability.SkipToPrevious,
          ],
          /*
         안드로이드 Background 상태에서 알림센터, 잠금화면 UI에서 허용할 버튼 정의
          */
          compactCapabilities: [
            Capability.Play, 
            Capability.Pause, 
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });
        await TrackPlayer.add(tracks).then(async()=>{
            TrackPlayer.stop()
        });
      }
      componentDidUpdate(){
          
      }
      componentDidMount() {
        this.trackPlayerInit();
      }
    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={{flex:1}}>
                     <WebView
                        ref={(r) => {this.webref = r}}
                        source={{ uri: 'http://172.30.1.36' }}
                        style={{ marginTop: 20 }}
                        onMessage={(msg)=>this.messageHandler(msg)}
                    />
                </View>
                <PlayerInfo runSingleFuncScript = {(func,arg)=>this.runSingleFuncScript(func,arg)}/>
            </SafeAreaView>
        )
    }
}

export default Webview