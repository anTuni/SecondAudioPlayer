import React,{Component,useEffect} from 'react'
import {View,} from 'react-native'
import TrackPlayer,
{
  Event,
  useTrackPlayerEvents,
  State,
  Capability,
  useProgress,
  RepeatMode,
 } from 'react-native-track-player';
const webViewInstanceMethod = {runSingleFuncScript:()=>{}}

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
const PlayerState = (props) =>{
    /*
    TrackPlayer Event bindings
    Event.PlaybackTrackChanged => 트랙 바뀌었을 때(곡 전환시에)
    Event.PlaybackState => 재생 상태 바뀌었을 때(재생, 일시정지, 정지, 버퍼링 등)
    */
    useTrackPlayerEvents([Event.PlaybackTrackChanged,Event.PlaybackState], async event => {
        props.log('PlayerState :: useTrackPlayerEvents triggered')
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            props.trackEventTrigger('PlayerTrackChanged',track);

            props.log('PlayerState :: useTrackPlayerEvents :: Event.PlaybackTrackChanged ::getTrack =',track)

        }else if (event.type === Event.PlaybackState){
            const state = await TrackPlayer.getState();
            props.trackEventTrigger('PlaybackState',stateText(state));

            props.log('PlayerState :: useTrackPlayerEvents :: Event.PlaybackState ::getState =',stateText(state))
        }
    });
    const progress = useProgress();

    useEffect(() => {
        props.trackEventTrigger('progress',progress);
        props.log('PlayerState :: handleProgress :: progress =',progress)
    })
    return (<View></View>);
}
export class TrackPlayerComponent extends React.Component{
    constructor(props){
        super(props);
    }
    logging(...args){
        (this.props.logging) && console.log(...args);
    }
    errorHandler(error,message){
        console.log(`${message}\n${error}`);
        this.trackEventTrigger('Error', error)
    }
    trackEventTrigger(eventType,params){
        var script = `window.ReactNativeWebView.trackEventTrigger('${eventType}','${JSON.stringify(params)}')`
        this.logging('TrackPlayerComponent :: trackEventTrigger :: script= ',script)
        if(typeof this.props.injectJavaScript == 'function'){
            this.props.injectJavaScript(script)
        }else{
            this.logging('TrackPlayerComponent :: trackEventTrigger :: injectJavaScript is not a function ')
        }
    }
    runSingleFuncScript(fucntionName,argument){
        var script = `${fucntionName}('${JSON.stringify(argument)}')`
        this.logging('TrackPlayerComponent :: runSingleFuncScript :: script= ',script)
        if(typeof this.props.injectJavaScript == 'function'){
            this.props.injectJavaScript(script)
        }else{
            this.logging('TrackPlayerComponent :: runSingleFuncScript :: injectJavaScript is not a function ')
        }
    }
    async trackController(msg){
        /*
        msg : JSON String of Object 
        
        {
            func:function name,
            args: arguments passed to function
        }  
         */
        let obj = JSON.parse(msg.nativeEvent.data)
        this.logging('TrackPlayerComponent :: trackController :: obj =',obj)
       switch (obj.func) {
            case 'skipToPrev':
                await TrackPlayer.skipToPrevious().then()
                .catch(err=>{
                    this.errorHandler(err,'TrackPlayer.skipToPrevious()')
                })
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
                await TrackPlayer.skipToNext().then()
                .catch(err=>{
                    this.errorHandler(err,'TrackPlayer.skipToNext()')
                })
                break;
            case 'skip':
                await TrackPlayer.skip(obj.data.index).then()
                .catch(err=>{
                    this.errorHandler(err,'TrackPlayer.skip()')
                })
                break;
            case 'addTrack':
                await TrackPlayer.add(obj.data).then()
                .catch(err=>{
                    this.errorHandler(err,'TrackPlayer.add()')
                })
                this.handlePlayList();
                break;
            case 'remove':
                this.removeFromQueue(obj.data);
                break;
            case 'seekTo':
                await TrackPlayer.seekTo(Number(obj.data.position)).then()
                .catch(err=>{
                    this.errorHandler(err,'TrackPlayer.seekTo()')
                })
                break;
            case 'setVolume':
                await TrackPlayer.setVolume(Number(obj.data.volume)/100).then()
                .catch(err=>{
                    this.errorHandler(err,'TrackPlayer.setVolume()')
                })
                break;
            case 'setRepeatMode':
                this.setRepeatMode(obj.data);
                break;
        
            default:
                this.logging('TrackPlayerComponent :: trackController :: error \n','messge should be on of \n [skipToPrev,play,pause,stop,skipToNext,skip,addTrack,seekTo,setVolume,setRepeatMode,]')
                break;
        }
    } 
    async removeFromQueue(indexs) {
        if(){
            // 현재 트랙이 포함 됐을 때 남은 트랙으로 이동후 현재 트랙도 삭제
            // 남은 트랙 없을 땐 큐 초기화
            
        }
        await TrackPlayer.remove(indexs).then((result) =>{
            console.log("TrackPlayer.remove :: ",indexs,typeof indexs);
        })
        .catch(err=>{
            this.errorHandler(err,'TrackPlayer.remove()')
        })
        this.handlePlayList();
    }
    async setRepeatMode(mode){
        this.logging('TrackPlayerComponent :: setRepeatMode :: mode=',mode)
        switch (mode) {
          case 1:
            await TrackPlayer.setRepeatMode(RepeatMode.Track).then()
            .catch(err=>{
                this.errorHandler(err,`TrackPlayer.setRepeatMode(${RepeatMode.Track})`)
            })
            break;
          case 2:
            await TrackPlayer.setRepeatMode(RepeatMode.Queue).then()
            .catch(err=>{
                this.errorHandler(err,`TrackPlayer.setRepeatMode(${RepeatMode.Queue})`)
            })
            break;
          default:
            await TrackPlayer.setRepeatMode(RepeatMode.Off).then()
            .catch(err=>{
                this.errorHandler(err,`TrackPlayer.setRepeatMode(${RepeatMode.Off})`)
            })
            break;
        }
        this.handleRepeatMode()
    }
    async handleRepeatMode(){
        const mode = await TrackPlayer.getRepeatMode().then()
            .catch(err=>{
                this.errorHandler(err,`TrackPlayer.getRepeatMode()`)
            });
        this.logging('TrackPlayerComponent :: RepeatMode :: mode ',mode)
        this.trackEventTrigger('RepeatMode',mode);
    }
    async handlePlayList(){
        const tracks = await TrackPlayer.getQueue().then()
            .catch(err=>{
                this.errorHandler(err,`TrackPlayer.getQueue()`)
            });
        this.logging('TrackPlayerComponent :: handlePlayList :: track ',tracks)
        this.trackEventTrigger('PlayList',tracks);
    }
    async trackPlayerInit(){
            /* 
    오디오 플레이어 초기화        
    */
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
       Capability.Stop,
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
    componentDidUpdate(){
        this.runSingleFuncScript('handleProgress',this.progress);
    }
    componentDidMount(){
        this.trackPlayerInit().then(
            ()=>this.logging('TrackPlayerComponent :: trackPlayerInit :: trackPlayer Initialized')
        )
    }
    render(){
        return (
            <PlayerState 
                runSingleFuncScript={(fucntionName,argument)=>this.runSingleFuncScript(fucntionName,argument)}
                trackEventTrigger={(eventType,params)=>this.trackEventTrigger(eventType,params)}
                log = {(...args)=>this.logging(...args)}
            />
        )
    }
}