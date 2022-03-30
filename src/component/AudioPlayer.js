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
  Image,
  Button
} from 'react-native';
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
    url: 'https://file-examples.com/storage/fe07f859fd624073f9dbdc6/2017/11/file_example_MP3_2MG.mp3', // Load media from the network
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
/* 
Get state by Text string by State contants
retun Sring 
*/
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
/* 
플레이어 상태 표시
1) 재생 중인 트랙 정보 'trackInfo' 
1) 재생 상태 정보 'PlayerState,trackInfo' 
*/
const PlayerInfo = () => {
  const [trackTitle, setTrackTitle] = useState<string>();
  const [trackInfo, setTrackInfo] = useState({
    artist :'',
    album :'',
    artwork :'',
  });
  const [PlayerState, setPlayerState] = useState<string>();
  const progress = useProgress();
  /*
  TrackPlayer Event bindings
  Event.PlaybackTrackChanged => 트랙 바뀌었을 때(곡 전환시에)
  Event.PlaybackState => 재생 상태 바뀌었을 때(재생, 일시정지, 정지, 버퍼링 등)
  */
  useTrackPlayerEvents([Event.PlaybackTrackChanged,Event.PlaybackState], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        const {title} = track || {};
        setTrackTitle(title);
        setTrackInfo(track);
        console.log('PlayerInfo :: PlaybackTrackChanged ::trackInfo =\n',track)
    }else if (event.type === Event.PlaybackState){
      const state = await TrackPlayer.getState();
      setPlayerState(stateText(state));
      console.log('PlayerInfo :: useTrackPlayerEvents ::PlayerState =\n',stateText(state))
    }
  });

  return (
    <View style = {{justifyContent: 'center',alignItems: 'center',padding:10}}>
      <Text>Title : {trackTitle}</Text>
      <Text>artist : {trackInfo.artist}</Text>
      <Text>album : {trackInfo.album}</Text>
      <Image  
      style={{width:100,height:100}}
      source={{
          uri: trackInfo.artwork ? trackInfo.artwork:'https://reactnative.dev/img/tiny_logo.png',
        }}/>
      <Text>STATE : {PlayerState}</Text>
      <Text>Buffered : {progress.buffered}</Text>
      <Text>Position : {progress.position}</Text>
      <Text>Duration : {progress.duration}</Text>
    </View>
  );
}
const PlayerControlBox=(props)=>{
  return(
    <View style={{flex:1,flexDirection:'row',justifyContent: 'space-between',alignItems: 'center'}}>
      <PlayerController title='이전' 
        onPress={async()=>{
          await TrackPlayer.skipToPrevious()
      }}/>
      <PlayerController title='재생' 
        onPress={()=>{
          TrackPlayer.play()
      }}/>
      <PlayerController title='일시정지' 
        onPress={()=>{
          TrackPlayer.pause()
      }}/>
      <PlayerController title='정지' 
        onPress={()=>{
          TrackPlayer.stop()
      }}/>
      <PlayerController title='다음' 
        onPress={async()=>{
          await TrackPlayer.skipToNext()
      }}/>
    </View>
  )
}
const PlayerController= (props)=>{
  return(
    <TouchableHighlight
      onPress={props.onPress}
      style={styles.btnContainer}>
      <Text>
        {props.title}
      </Text>
    </TouchableHighlight>
  )
}
class App extends React.Component {

  constructor(props) {
    super(props);
  }
  trackPlayerInit = async() =>{
    await TrackPlayer.setupPlayer({})

    await TrackPlayer.add(tracks).then(()=>{
      TrackPlayer.stop();
    });
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
  }
  componentDidMount() {
    this.trackPlayerInit();
  }
  render(){
    return (
      <SafeAreaView style={{flex:1}}>
        <ScrollView
          style={{flex:1}}>
          <PlayerInfo />
          <PlayerControlBox />
          <Button title="toWebeiw" onPress={() => {this.props.navigation.navigate('Webview')}}></Button>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  btnContainer: {
    padding:10,
    borderWidth:1
  }
});

export default App;
