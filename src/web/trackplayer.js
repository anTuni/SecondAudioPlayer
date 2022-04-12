class ReactNativeTrackPlayer{
    queue = [];
    currentTrackIndex;
    state;
    position;
    duration;
    buffuered;
    repeatMode;
    trackEventListeners ={
        progress:new Array(),
        PlaybackState:new Array(),
        PlayerTrackChanged: new Array(),
        PlayList: new Array(),
        RepeatMode: new Array(),
    };

    constructor(){
    }
    callTrackController(func,data){
        var message = {func}
        if(data){
            message.data=data
        }
        window.ReactNativeWebView.postMessage(JSON.stringify(message))
    }
    trackEventTrigger(eventType,params){
        switch(eventType){
            case 'progress':
                this.trackEventListeners.progress.forEach(function (item) {
                    (typeof item == "function") && item(params);
                })
            break;
            case 'PlaybackState':
                this.trackEventListeners.PlaybackState.forEach(function (item) {
                    (typeof item == "function") && item(params);
                })
            break;
            case 'PlayerTrackChanged':
                this.trackEventListeners.PlayerTrackChanged.forEach(function (item) {
                    (typeof item == "function") && item(params);
                })
            break;
            case 'PlayList':
                this.trackEventListeners.PlayList.forEach(function (item) {
                    (typeof item == "function") && item(params);
                })
            break;
            case 'RepeatMode':
                this.trackEventListeners.RepeatMode.forEach(function (item) {
                    (typeof item == "function") && item(params);
                })
            break;
            default:
            break;
        }
    }
    addTrackEventListener(eventType, listener){
        switch(eventType){
            case 'progress':
                this.trackEventListeners.progress.push(listener);
            break;
            case 'PlaybackState':
                this.trackEventListeners.PlaybackState.push(listener);
            break;
            case 'PlayerTrackChanged':
                this.trackEventListeners.PlayerTrackChanged.push(listener);
            break;
            case 'PlayList':
                this.trackEventListeners.PlayList.push(listener);
            break;
            case 'RepeatMode':
                this.trackEventListeners.RepeatMode.push(listener);
            break;
            default:
                return false;
            break;
        }
    }
    setVolume(volume){
        this.callTrackController('setVolume',{volume})
    }
    seekTo(position){
        this.callTrackController('seekTo',{position})
    }
    addTrack(track){
        this.callTrackController('addTrack',track)
        this.queue.push(track)
        return this.queue
    }
    skipToPrev(){
        this.callTrackController('skipToPrev')
    }
    play(){
        this.callTrackController('play')
    }
    pause(){
        this.callTrackController('pause')
    }
    stop(){
        this.callTrackController('stop')
    }
    skip(index){
        this.callTrackController('skip',{index:index})
    }
    skipToNext(){
        this.callTrackController('skipToNext')
    }
    setRepeatMode(mode){
         /* mode
        0:no repeat
        1:track repeat
        2:que repeat
        */
        this.callTrackController('setRepeatMode',mode)
    }
}

window.ReactNativeWebView.trackEventListeners = new Array()
window.ReactNativeWebView.addTrackEventListener = function(func){
    window.ReactNativeWebView.trackEventListeners.push(func)
}
window.ReactNativeWebView.trackEventTrigger= (eventType,params)=>{
    window.ReactNativeWebView.trackEventListeners.forEach(function (item) {
        (typeof item == "function") && item(eventType,params);
    })
}