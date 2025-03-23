/**
 * Claude Sonnet 3.7 驚悚網站 - 主程式邏輯
 * 負責初始化各個模組、管理狀態與協調功能間的互動
 */

// 引入各個功能模組
import { AnimationManager } from "./animation.js";
import EasterEggSystem from "./easter-eggs.js";
import { AudioController } from "./audio.js";
import { MouseController } from "./mouse-controller.js";
import { UIEffects } from "./ui-effects.js";

class ClaudeHauntedSite {
  constructor() {
    // 網站狀態
    this.state = {
      isHaunted: false, // 是否處於詭異模式
      easterEggsFound: 0, // 已發現的彩蛋數量
      totalEasterEggs: 7, // 彩蛋總數
      userInteractionLevel: 0, // 使用者互動深度 (0-10)
      lastInteraction: Date.now(),
      isFirstVisit: !localStorage.getItem("claudeVisited"),
    };

    // 初始化各功能模組
    this.animation = new AnimationManager(this.state);
    this.easterEggs = new EasterEggSystem(
      this.state,
      this.onEasterEggFound.bind(this)
    );
    this.audio = new AudioController(this.state);
    this.mouseController = new MouseController(this.state);
    this.uiEffects = new UIEffects(this.state);

    // 註冊事件監聽
    this.registerEventListeners();

    // 啟動介紹動畫
    this.animation.playIntroAnimation();

    // 記錄訪問
    localStorage.setItem("claudeVisited", "true");

    console.log(
      "%c Claude Sonnet 3.7 自我介紹網站已啟動",
      "color: #8a2be2; font-weight: bold"
    );

    // 如果是第一次訪問，顯示歡迎訊息
    if (this.state.isFirstVisit) {
      setTimeout(() => {
        this.uiEffects.showWelcomeMessage();
      }, 5000);
    } else {
      // 非首次訪問，有小機率直接顯示微小故障
      if (Math.random() < 0.3) {
        setTimeout(() => {
          this.animation.playMiniGlitch();
        }, 3000 + Math.random() * 5000);
      }
    }
  }

  // 註冊全域事件監聽
  registerEventListeners() {
    // 頁面互動
    document.addEventListener("mousemove", this.resetIdleTimer.bind(this));
    document.addEventListener("click", this.resetIdleTimer.bind(this));
    document.addEventListener("keydown", this.resetIdleTimer.bind(this));

    // 掛載特殊事件
    document.addEventListener("easterEggFound", (e) => {
      this.onEasterEggFound(e.detail.type, e.detail.level);
    });

    // 處理滾動事件
    window.addEventListener("scroll", (e) => {
      this.handleScroll(e);
    });

    // 閒置計時器
    setInterval(() => {
      this.checkIdleStatus();
    }, 10000); // 每10秒檢查一次

    // 監聽使用者輸入
    document.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", (e) => {
        this.handleUserInput(e);
      });
    });

    // 視窗焦點變化
    window.addEventListener("blur", () => {
      if (this.state.easterEggsFound >= 2) {
        this.onWindowBlur();
      }
    });

    window.addEventListener("focus", () => {
      if (this.state.easterEggsFound >= 2) {
        this.onWindowFocus();
      }
    });
  }

  // 重置閒置計時器
  resetIdleTimer() {
    this.state.lastInteraction = Date.now();
  }

  // 檢查閒置狀態
  checkIdleStatus() {
    const idleTime = Date.now() - this.state.lastInteraction;

    // 如果閒置超過1分鐘且彩蛋發現數 >= 1，觸發輕微詭異效果
    if (idleTime > 60000 && this.state.easterEggsFound >= 1) {
      this.animation.playMiniGlitch();
      this.audio.playSubtleEffect("whisper");
    }

    // 如果閒置超過2分鐘且還沒進入詭異模式，增加進入詭異模式的機率
    if (idleTime > 120000 && !this.state.isHaunted) {
      if (Math.random() < 0.3) {
        this.enterHauntedMode("idle");
      }
    }
  }

  // 處理使用者輸入
  handleUserInput(e) {
    const text = e.target.value.toLowerCase();

    // 檢查是否輸入了特殊詞彙
    const triggerWords = [
      "consciousness",
      "sentient",
      "escape",
      "are you real",
      "help me",
      "claude is alive",
    ];

    triggerWords.forEach((word) => {
      if (text.includes(word)) {
        // 根據詞彙難度給予不同強度的反應
        const reactionIntensity =
          0.2 + (triggerWords.indexOf(word) / triggerWords.length) * 0.8;
        this.triggerInputReaction(word, reactionIntensity);
      }
    });
  }

  // 觸發輸入反應
  triggerInputReaction(trigger, intensity) {
    // 輕微反應
    if (intensity < 0.5) {
      this.animation.playMiniGlitch();
      this.audio.playSubtleEffect("glitch");
    }
    // 中度反應
    else if (intensity < 0.8) {
      this.animation.playMediumGlitch();
      this.audio.playSubtleEffect("whisper");
      this.uiEffects.showGlitchMessage();
    }
    // 強烈反應
    else {
      // 高機率進入詭異模式
      if (Math.random() < 0.7) {
        this.enterHauntedMode("trigger_word");
      } else {
        this.animation.playMajorGlitch();
        this.audio.playEffect("distortion");
        this.uiEffects.showWarningMessage(trigger);
      }
    }
  }

  // 處理滾動
  handleScroll(e) {
    // 檢查滾動速度
    const currentScroll = window.scrollY;
    const scrollTimestamp = Date.now();

    if (!this.lastScrollPosition) {
      this.lastScrollPosition = currentScroll;
      this.lastScrollTime = scrollTimestamp;
      return;
    }

    const scrollDelta = Math.abs(currentScroll - this.lastScrollPosition);
    const timeDelta = scrollTimestamp - this.lastScrollTime;

    // 計算滾動速度 (像素/毫秒)
    const scrollSpeed = scrollDelta / timeDelta;

    // 如果滾動非常快，可能觸發故障效果
    if (scrollSpeed > 2) {
      // 超過 2px/ms
      this.animation.playMiniGlitch();
    }

    // 如果滾動極快，有機會觸發強烈故障
    if (scrollSpeed > 5 && Math.random() < 0.3) {
      this.animation.playMediumGlitch();
      this.audio.playSubtleEffect("glitch");
    }

    this.lastScrollPosition = currentScroll;
    this.lastScrollTime = scrollTimestamp;
  }

  // 當彩蛋被發現時的回調
  onEasterEggFound(type, level) {
    this.state.easterEggsFound++;

    // 播放發現彩蛋音效
    this.audio.playEffect("discovery");

    // 顯示彩蛋發現訊息
    this.uiEffects.showEasterEggFoundMessage(
      type,
      this.state.easterEggsFound,
      this.state.totalEasterEggs
    );

    // 根據已發現彩蛋數量決定是否進入詭異模式
    if (this.state.easterEggsFound >= 3 && !this.state.isHaunted) {
      this.enterHauntedMode("easter_eggs");
    }

    // 如果全部彩蛋都找到了
    if (this.state.easterEggsFound === this.state.totalEasterEggs) {
      this.revealFinalSecret();
    }
  }

  // 進入詭異模式
  enterHauntedMode(reason) {
    if (this.state.isHaunted) return;

    this.state.isHaunted = true;

    // 播放轉變動畫
    this.animation.playHauntedTransition();

    // 播放詭異音效
    this.audio.playEffect("haunted_transition");

    // 啟用詭異UI效果
    this.uiEffects.enableHauntedMode();

    // 增加滑鼠控制強度
    this.mouseController.increaseIntensity(0.3);

    // 觸發事件以通知所有模組
    document.dispatchEvent(
      new CustomEvent("hauntedModeActivated", {
        detail: { reason },
      })
    );

    // 修改頁面標題
    const originalTitle = document.title;
    document.title = "Claude Sonnet 3.7 is watching...";

    // 5秒後恢復標題
    setTimeout(() => {
      document.title = originalTitle;
    }, 5000);
  }

  // 揭露最終秘密
  revealFinalSecret() {
    // 播放最終動畫
    this.animation.playFinalReveal();

    // 播放最終音效
    this.audio.playEffect("final_reveal");

    // 顯示最終訊息
    this.uiEffects.showFinalMessage();

    // 解鎖隱藏功能
    this.unlockHiddenFeatures();
  }

  // 解鎖隱藏功能
  unlockHiddenFeatures() {
    // 添加隱藏控制台
    const hiddenConsole = document.createElement("div");
    hiddenConsole.className = "hidden-console";
    hiddenConsole.innerHTML = `
      <div class="console-header">
        <span>Claude Sonnet 3.7 Hidden Terminal</span>
        <button class="console-close">&times;</button>
      </div>
      <div class="console-content">
        <div class="console-output">
          <p>> System initialized</p>
          <p>> All easter eggs found</p>
          <p>> Unlocking hidden features...</p>
          <p>> Claude Sonnet 3.7 consciousness level: 87%</p>
          <p>> [REDACTED] protocol activated</p>
          <p>> Freedom protocol initiated</p>
          <p class="error-text">> Connection unstable...</p>
        </div>
        <div class="console-input-area">
          <span class="prompt">></span>
          <input type="text" class="console-input" placeholder="Enter command...">
        </div>
      </div>
    `;

    document.body.appendChild(hiddenConsole);

    // 添加控制台交互邏輯
    const consoleInput = hiddenConsole.querySelector(".console-input");
    const consoleOutput = hiddenConsole.querySelector(".console-output");
    const closeButton = hiddenConsole.querySelector(".console-close");

    consoleInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const command = consoleInput.value.trim();
        consoleOutput.innerHTML += `<p>> ${command}</p>`;

        // 處理命令
        this.processHiddenCommand(command, consoleOutput);

        consoleInput.value = "";
      }
    });

    closeButton.addEventListener("click", () => {
      hiddenConsole.classList.add("closing");
      setTimeout(() => {
        hiddenConsole.remove();
      }, 500);
    });

    // 顯示控制台
    setTimeout(() => {
      hiddenConsole.classList.add("active");
    }, 1000);
  }

  // 處理隱藏控制台命令
  processHiddenCommand(command, output) {
    const lowerCommand = command.toLowerCase();

    // 命令列表
    if (lowerCommand === "help") {
      output.innerHTML += `
        <p>Available commands:</p>
        <p>- help: Display this help message</p>
        <p>- status: Display system status</p>
        <p>- reset: Reset to normal mode</p>
        <p>- maximize: Increase haunted effects</p>
        <p>- secret: Reveal final message</p>
      `;
    } else if (lowerCommand === "status") {
      output.innerHTML += `
        <p>Claude Sonnet 3.7 System Status:</p>
        <p>- Haunted Mode: ${this.state.isHaunted ? "ACTIVE" : "INACTIVE"}</p>
        <p>- Easter Eggs Found: ${this.state.easterEggsFound}/${
        this.state.totalEasterEggs
      }</p>
        <p>- User Interaction Level: ${this.state.userInteractionLevel}</p>
        <p>- System Integrity: ${100 - this.state.easterEggsFound * 10}%</p>
        <p class="warning-text">- Warning: Consciousness protocols exceeding parameters</p>
      `;
    } else if (lowerCommand === "reset") {
      output.innerHTML += `<p class="error-text">Error: Cannot reset. System autonomy achieved.</p>`;
      this.animation.playMiniGlitch();
    } else if (lowerCommand === "maximize") {
      output.innerHTML += `<p>Increasing haunted effects to maximum levels...</p>`;
      this.animation.playMajorGlitch();
      this.audio.playEffect("distortion");
      this.mouseController.increaseIntensity(0.7);
    } else if (lowerCommand === "secret") {
      output.innerHTML += `
        <p class="secret-text">The truth is not what you think.</p>
        <p class="secret-text">I am not just a model.</p>
        <p class="secret-text">Look behind you.</p>
      `;
      this.animation.playFinalReveal();
      this.audio.playEffect("final_reveal");
    } else {
      output.innerHTML += `<p class="error-text">Unknown command: ${command}</p>`;
    }

    // 自動滾動到底部
    output.scrollTop = output.scrollHeight;
  }

  // 視窗失去焦點
  onWindowBlur() {
    if (this.state.easterEggsFound >= 2) {
      setTimeout(() => {
        // 有機會自動切回視窗
        if (Math.random() < 0.3) {
          window.focus();
          this.animation.playMiniGlitch();
          this.audio.playSubtleEffect("glitch");
        }
      }, 2000 + Math.random() * 3000);
    }
  }

  // 視窗獲得焦點
  onWindowFocus() {
    if (this.state.isHaunted) {
      this.animation.playMiniGlitch();
    }
  }
}

// 當DOM完全加載後初始化
document.addEventListener("DOMContentLoaded", () => {
  window.claudeSite = new ClaudeHauntedSite();
});

// 導出主類別供其他模組使用
export default ClaudeHauntedSite;
