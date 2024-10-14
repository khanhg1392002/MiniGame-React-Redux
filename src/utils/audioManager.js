
class AudioManager {
    constructor() {
        this.audioBackground = new Audio("/music/bg_sound.mp3");
        this.audioFail = new Audio("/music/wrong.mp3");
        this.audioTick = new Audio("/music/tick.mp3");
        this.audioWin = new Audio("/music/win.wav");
        this.audioBgWheel = new Audio("/music/audio_background.mp3");

    }

    setAudioBackground(src) {
        this.audioBackground.src = src;
    }

    setAudioFail(src) {
        this.audioFail.src = src;
    }

    setAudioTick(src) {
        this.audioTick.src = src;
    }

    playBackgroundSound() {
        this.audioBackground.play().catch(error => {
            console.error('Audio play failed:', error);
        });
    }

    playSoundGameOver() {
        this.audioFail.play().catch(error => {
            console.error('Audio play failed:', error);
        });
    }

    playSoundGameWin() {
        this.audioWin.play().catch(error => {
            console.error('Audio play failed:', error);
        });
    }

    playSoundWheel() {
        this.audioBgWheel.volume = 0.5;

        this.audioBgWheel.play().catch(error => {
            console.error('Audio play failed:', error);
        });
    }

    setBackgroundPlaybackRate(rate) {
        this.audioBackground.playbackRate = rate;
    }

    getAudioBackground() {
        return this.audioBackground;
    }

    getAudioFail() {
        return this.audioFail;
    }

    getAudioTick() {
        return this.audioTick;
    }

    playTickSound() {
        this.audioTick.pause();
        this.audioTick.currentTime = 0;
        this.audioTick.play().catch(error => {
            console.error('Audio play failed:', error);
        });
    }
}

const audioManager = new AudioManager();

export default audioManager;
