
import TrackPlayer from 'react-native-track-player';

module.exports = async function() {
    TrackPlayer.addEventListener('remote-play', () => {console.log('remote-play');TrackPlayer.play()});
    TrackPlayer.addEventListener('remote-pause', () => {console.log('remote-pause');TrackPlayer.pause()});
    TrackPlayer.addEventListener('remote-next', async() => {
        console.log('remote-next');
        await TrackPlayer.skipToNext();
    });
    TrackPlayer.addEventListener('remote-previous', async() => {
        console.log('remote-previous');
        await TrackPlayer.skipToPrevious();
    });
    TrackPlayer.addEventListener('remote-stop', () => {console.log('remote-stop');TrackPlayer.destroy()});
}