class SpeechService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.currentUtterance = null;
    this.isSupported = 'speechSynthesis' in window;
  }

  speak(text, options = {}) {
    if (!this.isSupported) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    this.stop();

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    
    this.currentUtterance.rate = options.rate || 0.9; 
    this.currentUtterance.pitch = options.pitch || 1;
    this.currentUtterance.volume = options.volume || 1;
    
    
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Premium'))
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (preferredVoice) {
      this.currentUtterance.voice = preferredVoice;
    }

    
    if (options.onStart) {
      this.currentUtterance.onstart = options.onStart;
    }
    if (options.onEnd) {
      this.currentUtterance.onend = options.onEnd;
    }
    if (options.onError) {
      this.currentUtterance.onerror = options.onError;
    }

    
    this.synthesis.speak(this.currentUtterance);
  }

  stop() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
  }

  pause() {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  isSpeaking() {
    return this.synthesis.speaking;
  }

  isPaused() {
    return this.synthesis.paused;
  }

  getVoices() {
    return this.synthesis.getVoices();
  }
}

export default new SpeechService();
