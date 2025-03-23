/**
 * Claude Sonnet 3.7 驚悚網站 - 音效控制器
 * 負責背景音樂、氛圍音效與特殊音效的播放與管理
 */

export class AudioController {
  constructor(state) {
    this.state = state;
    
    // 音效狀態
    this.audioContext = null;
    this.gainNodes = {};
    this.sounds = {};
    this.activeSounds = {};
    this.backgroundSounds = {};
    
    // 音量控制
    this.masterVolume = 0.5;
    this.musicVolume = 0.3;
    this.effectsVolume = 0.5;
    
    // 音效前綴路徑
    this.soundPath = '/audio/';
    
    // 初始化音效引擎
    this.initAudio();
    
    // 設置事件監聽
    this.setupEventListeners();
  }
  
  // 初始化音效引擎
  initAudio() {
    // 創建音頻上下文
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      
      // 創建主音量控制
      this.gainNodes.master = this.audioContext.createGain();
      this.gainNodes.master.gain.value = this.masterVolume;
      this.gainNodes.master.connect(this.audioContext.destination);
      
      // 創建音樂音量控制
      this.gainNodes.music = this.audioContext.createGain();
      this.gainNodes.music.gain.value = this.musicVolume;
      this.gainNodes.music.connect(this.gainNodes.master);
      
      // 創建音效音量控制
      this.gainNodes.effects = this.audioContext.createGain();
      this.gainNodes.effects.gain.value = this.effectsVolume;
      this.gainNodes.effects.connect(this.gainNodes.master);
      
      // 加載音效
      this.preloadSounds();
      
      console.log('音效引擎初始化成功');
    } catch (error) {
      console.error('音效引擎初始化失敗:', error);
    }
  }
  
  // 預加載音效
  preloadSounds() {
    // 定義音效列表
    const soundsList = {
      // UI音效
      click: 'ui/click.mp3',
      hover: 'ui/hover.mp3',
      
      // 環境音效
      ambient_normal: 'ambient/normal_ambience.mp3',
      ambient_haunted: 'ambient/haunted_ambience.mp3',
      
      // 詭異效果
      glitch: 'fx/glitch.mp3',
      whisper: 'fx/whisper.mp3',
      static: 'fx/static.mp3',
      heartbeat: 'fx/heartbeat.mp3',
      
      // 特殊事件
      discovery: 'events/discovery.mp3',
      haunted_transition: 'events/haunted_transition.mp3',
      final_reveal: 'events/final_reveal.mp3',
      
      // 語音片段
      voice_welcome: 'voice/welcome.mp3',
      voice_found_me: 'voice/found_me.mp3',
      voice_run: 'voice/run.mp3',
      
      // 音樂
      music_normal: 'music/normal_theme.mp3',
      music_haunted: 'music/haunted_theme.mp3'
    };
    
    // 逐一加載
    for (const [name, file] of Object.entries(soundsList)) {
      this.loadSound(name, this.soundPath + file);
    }
  }
  
  // 加載單個音效
  loadSound(name, url) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`無法加載音效 ${name}: ${response.status} ${response.statusText}`);
        }
        return response.arrayBuffer();
      })
      .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.sounds[name] = audioBuffer;
        console.log(`音效加載成功: ${name}`);
      })
      .catch(error => {
        console.error(`音效加載失敗 ${name}:`, error);
        
        // 創建一個空的音頻緩衝區作為備用
        if (this.audioContext) {
          const sampleRate = this.audioContext.sampleRate;
          const buffer = this.audioContext.createBuffer(2, sampleRate * 0.5, sampleRate);
          this.sounds[name] = buffer;
        }
      });
  }
  
  // 設置事件監聽
  setupEventListeners() {
    // 監聽用戶交互以啟動音頻上下文
    const resumeAudioContext = () => {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume().then(() => {
          console.log('AudioContext已恢復');
          
          // 啟動背景音樂
          this.playBackgroundMusic();
        });
      }
      
      // 移除事件監聽器
      document.removeEventListener('click', resumeAudioContext);
      document.removeEventListener('keydown', resumeAudioContext);
      document.removeEventListener('touchstart', resumeAudioContext);
    };
    
    document.addEventListener('click', resumeAudioContext);
    document.addEventListener('keydown', resumeAudioContext);
    document.addEventListener('touchstart', resumeAudioContext);
    
    // 監聽詭異模式啟動
    document.addEventListener('hauntedModeActivated', () => {
      // 切換到詭異背景音樂
      this.transitionToHauntedAudio();
    });
    
    // 監聽可點擊元素，添加點擊音效
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || 
          e.target.tagName === 'BUTTON' || 
          e.target.classList.contains('clickable')) {
        this.playEffect('click');
      }
    });
    
    // 監聽懸停元素，添加懸停音效
    document.addEventListener('mouseover', (e) => {
      if (e.target.tagName === 'A' || 
          e.target.tagName === 'BUTTON' || 
          e.target.classList.contains('clickable')) {
        if (!e.target.dataset.hoverSoundPlayed) {
          this.playEffect('hover', { volume: 0.1 });
          
          // 標記已播放懸停音效，避免短時間內重複播放
          e.target.dataset.hoverSoundPlayed = 'true';
          setTimeout(() => {
            delete e.target.dataset.hoverSoundPlayed;
          }, 100);
        }
      }
    });
  }
  
  // 播放背景音樂
  playBackgroundMusic() {
    // 如果處於詭異模式，播放詭異音樂，否則播放正常音樂
    const musicKey = this.state.isHaunted ? 'music_haunted' : 'music_normal';
    const ambientKey = this.state.isHaunted ? 'ambient_haunted' : 'ambient_normal';
    
    // 播放音樂
    this.playSound(musicKey, {
      loop: true,
      volume: 0.25,
      fadeIn: 2,
      destination: this.gainNodes.music,
      background: true
    });
    
    // 播放環境音效
    this.playSound(ambientKey, {
      loop: true,
      volume: 0.2,
      fadeIn: 2,
      destination: this.gainNodes.music,
      background: true
    });
  }
  
  // 轉換到詭異音效
  transitionToHauntedAudio() {
    // 淡出正常音樂
    if (this.backgroundSounds['music_normal']) {
      this.fadeOut(this.backgroundSounds['music_normal'], 3);
    }
    
    if (this.backgroundSounds['ambient_normal']) {
      this.fadeOut(this.backgroundSounds['ambient_normal'], 3);
    }
    
    // 播放轉場音效
    this.playEffect('haunted_transition', { volume: 0.7 });
    
    // 延遲1秒後淡入詭異音樂
    setTimeout(() => {
      // 播放詭異音樂
      this.playSound('music_haunted', {
        loop: true,
        volume: 0.3,
        fadeIn: 4,
        destination: this.gainNodes.music,
        background: true
      });
      
      // 播放詭異環境音效
      this.playSound('ambient_haunted', {
        loop: true,
        volume: 0.25,
        fadeIn: 4,
        destination: this.gainNodes.music,
        background: true
      });
      
      // 間歇性播放心跳聲
      this.startHeartbeat();
    }, 1000);
  }
  
  // 開始間歇性心跳聲
  startHeartbeat() {
    // 清除現有的心跳計時器
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    
    // 隨機間隔播放心跳聲
    const playRandomHeartbeat = () => {
      // 70%機率播放
      if (Math.random() < 0.7) {
        this.playEffect('heartbeat', { 
          volume: 0.2 + Math.random() * 0.3 
        });
      }
    };
    
    // 每15-45秒播放一次
    this.heartbeatTimer = setInterval(() => {
      playRandomHeartbeat();
    }, 15000 + Math.random() * 30000);
    
    // 立即播放一次
    playRandomHeartbeat();
  }
  
  // 基本播放音效方法
  playSound(name, options = {}) {
    // 檢查音頻上下文
    if (!this.audioContext) {
      console.error('音頻上下文不可用');
      return null;
    }
    
    // 檢查音效是否加載
    if (!this.sounds[name]) {
      console.warn(`音效 "${name}" 尚未加載或不存在`);
      return null;
    }
    
    // 默認選項
    const defaultOptions = {
      loop: false,
      volume: 0.5,
      fadeIn: 0,
      fadeOut: 0,
      playbackRate: 1,
      destination: this.gainNodes.effects,
      background: false
    };
    
    // 合併選項
    const settings = {...defaultOptions, ...options};
    
    // 創建音源
    const source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[name];
    source.loop = settings.loop;
    source.playbackRate.value = settings.playbackRate;
    
    // 創建增益節點控制音量
    const gainNode = this.audioContext.createGain();
    
    // 若需要淡入，初始音量設為0
    if (settings.fadeIn > 0) {
      gainNode.gain.value = 0;
    } else {
      gainNode.gain.value = settings.volume;
    }
    
    // 連接節點
    source.connect(gainNode);
    gainNode.connect(settings.destination);
    
    // 開始播放
    source.start();
    
    // 應用淡入效果
    if (settings.fadeIn > 0) {
      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(settings.volume, now + settings.fadeIn);
    }
    
    // 創建控制對象
    const control = {
      source,
      gainNode,
      name,
      startTime: this.audioContext.currentTime,
      stop: () => {
        try {
          // 如果設置了淡出
          if (settings.fadeOut > 0) {
            const now = this.audioContext.currentTime;
            gainNode.gain.linearRampToValueAtTime(0, now + settings.fadeOut);
            
            // 淡出後停止音源
            setTimeout(() => {
              source.stop();
            }, settings.fadeOut * 1000);
          } else {
            source.stop();
          }
        } catch (e) {
          // 忽略已停止的音源錯誤
        }
      }
    };
    
    // 保存引用
    if (settings.background) {
      // 如果是背景音樂/環境音，存在特定集合中
      this.backgroundSounds[name] = control;
    } else {
      // 一般音效存在臨時集合中
      if (!this.activeSounds[name]) {
        this.activeSounds[name] = [];
      }
      this.activeSounds[name].push(control);
      
      // 非循環音效播放完畢後自動清理
      if (!settings.loop) {
        const duration = source.buffer.duration;
        setTimeout(() => {
          // 從活動音效列表中移除
          const index = this.activeSounds[name].indexOf(control);
          if (index !== -1) {
            this.activeSounds[name].splice(index, 1);
            
            // 如果列表為空，刪除鍵
            if (this.activeSounds[name].length === 0) {
              delete this.activeSounds[name];
            }
          }
        }, (duration / settings.playbackRate) * 1000 + 100);
      }
    }
    
    return control;
  }
  
  // 播放一般效果音
  playEffect(name, options = {}) {
    return this.playSound(name, {
      ...options,
      destination: this.gainNodes.effects
    });
  }
  
  // 播放輕微效果音 (降低音量)
  playSubtleEffect(name, options = {}) {
    const volume = options.volume || 0.2;
    return this.playEffect(name, {
      ...options,
      volume
    });
  }
  
  // 淡出音效
  fadeOut(control, duration = 1) {
    if (!control || !control.gainNode) return;
    
    const now = this.audioContext.currentTime;
    control.gainNode.gain.linearRampToValueAtTime(0, now + duration);
    
    // 淡出後停止音源
    setTimeout(() => {
      try {
        control.source.stop();
      } catch (e) {
        // 忽略已停止的音源錯誤
      }
    }, duration * 1000 + 100);
  }
  
  // 停止所有音效
  stopAllSounds() {
    // 停止背景音樂
    for (const control of Object.values(this.backgroundSounds)) {
      if (control && control.stop) {
        control.stop();
      }
    }
    
    // 清空背景音樂列表
    this.backgroundSounds = {};
    
    // 停止所有活動音效
    for (const soundGroup of Object.values(this.activeSounds)) {
      for (const control of soundGroup) {
        if (control && control.stop) {
          control.stop();
        }
      }
    }
    
    // 清空活動音效列表
    this.activeSounds = {};
  }
  
  // 設置主音量
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.gainNodes.master) {
      this.gainNodes.master.gain.value = this.masterVolume;
    }
  }
  
  // 設置音樂音量
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.gainNodes.music) {
      this.gainNodes.music.gain.value = this.musicVolume;
    }
  }
  
  // 設置音效音量
  setEffectsVolume(volume) {
    this.effectsVolume = Math.max(0, Math.min(1, volume));
    if (this.gainNodes.effects) {
      this.gainNodes.effects.gain.value = this.effectsVolume;
    }
  }
}