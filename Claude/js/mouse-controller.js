/**
 * Claude Sonnet 3.7 驚悚網站 - 滑鼠控制器
 * 負責滑鼠游標效果、跟隨效果與接管功能
 */

// 修正模組載入問題，使用全局變量
const gsap = window.gsap;

export class MouseController {
  constructor(state) {
    this.state = state;

    // 控制參數
    this.cursor = {
      position: { x: 0, y: 0 }, // 實際滑鼠位置
      display: { x: 0, y: 0 }, // 顯示的游標位置
      intensity: 0, // 接管強度 (0-1)
      customActive: false, // 是否啟用自定義游標
      attractPoints: [], // 吸引點列表
      lastUpdateTime: 0, // 最後更新時間
      isHidden: false, // 原生游標是否隱藏
    };

    // 滑鼠歷史位置 (用於計算速度)
    this.mouseHistory = [];
    this.mouseSpeedThreshold = 15; // 觸發效果的速度閾值

    // 引導效果目標
    this.guidanceTarget = null;
    this.guidanceActive = false;

    // 初始化自定義游標
    this.initCustomCursor();

    // 設置事件監聽器
    this.setupEventListeners();

    // 設置動畫迴圈
    this.setupAnimationLoop();

    // 初始化吸引點
    this.initAttractPoints();
  }

  // 初始化自定義游標
  initCustomCursor() {
    // 創建主游標元素
    this.customCursor = document.createElement("div");
    this.customCursor.className = "custom-cursor";
    this.customCursor.style.cssText = `
      position: fixed;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid rgba(138, 43, 226, 0.7);
      box-shadow: 0 0 10px rgba(138, 43, 226, 0.3);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
      mix-blend-mode: difference;
      will-change: transform, left, top;
    `;

    // 創建內部點
    this.cursorDot = document.createElement("div");
    this.cursorDot.className = "cursor-dot";
    this.cursorDot.style.cssText = `
      position: absolute;
      width: 6px;
      height: 6px;
      background-color: rgba(138, 43, 226, 0.9);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: background-color 0.3s ease;
    `;

    // 添加到DOM
    this.customCursor.appendChild(this.cursorDot);
    document.body.appendChild(this.customCursor);

    // 初始隱藏
    this.customCursor.style.opacity = "0";
  }

  // 設置事件監聽器
  setupEventListeners() {
    // 滑鼠移動
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));

    // 點擊事件
    document.addEventListener("mousedown", this.handleMouseDown.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));

    // 監聽可點擊元素，調整游標樣式
    document.body.addEventListener(
      "mouseover",
      this.handleMouseOver.bind(this)
    );
    document.body.addEventListener("mouseout", this.handleMouseOut.bind(this));

    // 監聽詭異模式啟動
    document.addEventListener("hauntedModeActivated", (e) => {
      // 根據觸發原因調整強度
      const reason = e.detail.reason;
      let intensity = 0.2; // 默認強度

      if (reason === "easter_eggs") intensity = 0.3;
      else if (reason === "trigger_word") intensity = 0.4;
      else if (reason === "idle") intensity = 0.25;

      this.increaseIntensity(intensity);
      this.activateHauntedCursor();
    });

    // 監聽視窗大小變化，更新吸引點位置
    window.addEventListener("resize", () => {
      this.initAttractPoints();
    });

    // 監聽滑鼠離開視窗
    document.addEventListener("mouseleave", () => {
      this.customCursor.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      this.customCursor.style.opacity = "1";
    });
  }

  // 處理滑鼠移動
  handleMouseMove(e) {
    // 更新實際滑鼠位置
    this.cursor.position.x = e.clientX;
    this.cursor.position.y = e.clientY;

    // 如果自定義游標未激活，啟用它
    if (!this.cursor.customActive) {
      this.cursor.customActive = true;
      this.customCursor.style.opacity = "1";
    }

    // 記錄位置歷史用於計算速度
    const now = Date.now();
    this.mouseHistory.push({
      x: e.clientX,
      y: e.clientY,
      time: now,
    });

    // 只保留最近的10個位置
    if (this.mouseHistory.length > 10) {
      this.mouseHistory.shift();
    }

    // 檢查滑鼠速度，極快的移動可能觸發特效
    this.checkMouseSpeed();
  }

  // 處理滑鼠按下
  handleMouseDown() {
    gsap.to(this.customCursor, {
      scale: 0.8,
      duration: 0.2,
    });

    gsap.to(this.cursorDot, {
      scale: 1.5,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      duration: 0.2,
    });
  }

  // 處理滑鼠釋放
  handleMouseUp() {
    gsap.to(this.customCursor, {
      scale: 1,
      duration: 0.2,
    });

    gsap.to(this.cursorDot, {
      scale: 1,
      backgroundColor: "rgba(138, 43, 226, 0.9)",
      duration: 0.2,
    });
  }

  // 處理滑鼠懸停
  handleMouseOver(e) {
    // 檢查是否懸停在可點擊元素上
    if (
      e.target.tagName === "A" ||
      e.target.tagName === "BUTTON" ||
      e.target.classList.contains("clickable")
    ) {
      gsap.to(this.customCursor, {
        width: "36px",
        height: "36px",
        borderColor: "rgba(138, 43, 226, 0.9)",
        duration: 0.3,
      });

      gsap.to(this.cursorDot, {
        width: "8px",
        height: "8px",
        duration: 0.3,
      });
    }

    // 檢查是否懸停在危險區域
    if (e.target.classList.contains("danger-zone")) {
      this.increaseIntensity(0.1);

      // 創建一個臨時吸引點
      const rect = e.target.getBoundingClientRect();
      this.addTemporaryAttractPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        0.3, // 強度
        5000 // 持續5秒
      );
    }
  }

  // 處理滑鼠離開
  handleMouseOut(e) {
    // 如果離開可點擊元素
    if (
      e.target.tagName === "A" ||
      e.target.tagName === "BUTTON" ||
      e.target.classList.contains("clickable")
    ) {
      gsap.to(this.customCursor, {
        width: "24px",
        height: "24px",
        borderColor: "rgba(138, 43, 226, 0.7)",
        duration: 0.3,
      });

      gsap.to(this.cursorDot, {
        width: "6px",
        height: "6px",
        duration: 0.3,
      });
    }

    // 如果離開危險區域
    if (e.target.classList.contains("danger-zone")) {
      this.decreaseIntensity(0.05);
    }
  }

  // 設置動畫迴圈
  setupAnimationLoop() {
    // 使用requestAnimationFrame來平滑更新游標位置
    const updateCursor = () => {
      // 如果自定義游標不活躍，跳過
      if (!this.cursor.customActive) {
        requestAnimationFrame(updateCursor);
        return;
      }

      const now = Date.now();
      const delta = now - this.cursor.lastUpdateTime;
      this.cursor.lastUpdateTime = now;

      // 計算游標顯示位置
      this.calculateCursorDisplayPosition(delta);

      // 如果處於詭異模式且強度大於0，應用游標接管效果
      if (this.state.isHaunted && this.cursor.intensity > 0) {
        this.applyCursorTakeover();
      }

      // 更新游標位置
      this.customCursor.style.left = `${this.cursor.display.x}px`;
      this.customCursor.style.top = `${this.cursor.display.y}px`;

      // 在詭異模式下添加微顫效果
      if (this.state.isHaunted) {
        const jitterAmount = this.cursor.intensity * 2;
        this.customCursor.style.transform = `translate(-50%, -50%) translate(${
          (Math.random() - 0.5) * jitterAmount
        }px, ${(Math.random() - 0.5) * jitterAmount}px)`;
      }

      requestAnimationFrame(updateCursor);
    };

    // 啟動動畫迴圈
    updateCursor();
  }

  // 計算游標顯示位置
  calculateCursorDisplayPosition(delta) {
    // 默認情況下，顯示位置跟隨實際位置
    if (this.cursor.intensity === 0) {
      this.cursor.display.x = this.cursor.position.x;
      this.cursor.display.y = this.cursor.position.y;
      return;
    }

    // 使用緩動算法使運動更平滑
    const easeFactor = 1 - Math.pow(0.001, delta / 16); // 16ms基準

    // 考慮吸引點影響
    let attractX = 0;
    let attractY = 0;
    let totalWeight = 0;

    // 計算所有吸引點的合力
    this.cursor.attractPoints.forEach((point) => {
      if (!point.active) return;

      // 計算從游標到吸引點的向量
      const dx = point.x - this.cursor.position.x;
      const dy = point.y - this.cursor.position.y;

      // 計算距離
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 應用平方反比定律，距離越近影響越大
      const force = Math.min(1, 500 / (distance * distance));
      const weight = force * point.strength;

      // 累加吸引力
      attractX += dx * weight;
      attractY += dy * weight;
      totalWeight += weight;
    });

    // 如果有吸引力
    if (totalWeight > 0) {
      attractX /= totalWeight;
      attractY /= totalWeight;

      // 吸引力受接管強度影響
      attractX *= this.cursor.intensity;
      attractY *= this.cursor.intensity;
    }

    // 目標位置 = 實際位置 + 吸引力
    const targetX = this.cursor.position.x + attractX;
    const targetY = this.cursor.position.y + attractY;

    // 平滑過渡到目標位置
    this.cursor.display.x += (targetX - this.cursor.display.x) * easeFactor;
    this.cursor.display.y += (targetY - this.cursor.display.y) * easeFactor;
  }

  // 應用游標接管效果
  applyCursorTakeover() {
    // 在詭異模式下游標外觀變化
    const time = Date.now() / 1000; // 秒
    const glitchFactor = Math.sin(time * 8) * 0.5 + 0.5;

    // 基於時間和強度的顏色變化
    const r = Math.floor(138 + glitchFactor * 117);
    const g = Math.floor(43 - glitchFactor * 43);
    const b = Math.floor(226 - glitchFactor * 160);
    const alpha = 0.7 + this.cursor.intensity * 0.3;

    this.customCursor.style.borderColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    this.customCursor.style.boxShadow = `0 0 ${
      10 + glitchFactor * 20
    }px rgba(${r}, ${g}, ${b}, ${alpha / 2})`;

    // 內部點也跟著變化
    this.cursorDot.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${
      alpha + 0.2
    })`;

    // 游標大小隨強度輕微變化
    const sizeVariation = 1 + glitchFactor * 0.3 * this.cursor.intensity;
    this.customCursor.style.transform = `translate(-50%, -50%) scale(${sizeVariation})`;
  }

  // 初始化吸引點
  initAttractPoints() {
    this.cursor.attractPoints = [];

    // 在視窗的四個角落添加弱吸引點
    this.addAttractPoint(0, 0, 0.1); // 左上
    this.addAttractPoint(window.innerWidth, 0, 0.1); // 右上
    this.addAttractPoint(0, window.innerHeight, 0.1); // 左下
    this.addAttractPoint(window.innerWidth, window.innerHeight, 0.1); // 右下

    // 在視窗中心添加一個強吸引點
    this.addAttractPoint(window.innerWidth / 2, window.innerHeight / 2, 0.2);

    // 定時更新吸引點位置
    setInterval(() => {
      this.updateAttractPoints();
    }, 3000); // 每3秒更新一次
  }

  // 添加吸引點
  addAttractPoint(x, y, strength) {
    this.cursor.attractPoints.push({
      x,
      y,
      strength,
      active: true,
      createdAt: Date.now(),
    });
  }

  // 添加臨時吸引點
  addTemporaryAttractPoint(x, y, strength, duration) {
    const point = {
      x,
      y,
      strength,
      active: true,
      temporary: true,
      createdAt: Date.now(),
      duration: duration,
    };

    this.cursor.attractPoints.push(point);

    // 設置過期時間
    setTimeout(() => {
      point.active = false;
    }, duration);
  }

  // 更新吸引點位置
  updateAttractPoints() {
    // 只在詭異模式下更新
    if (!this.state.isHaunted) return;

    // 移除過期的臨時吸引點
    const now = Date.now();
    this.cursor.attractPoints = this.cursor.attractPoints.filter((point) => {
      if (point.temporary && now - point.createdAt > point.duration) {
        return false;
      }
      return true;
    });

    // 在詭異模式下，隨機移動非臨時吸引點
    this.cursor.attractPoints.forEach((point) => {
      if (!point.temporary) {
        // 應用隨機位移
        const displacement = this.cursor.intensity * 200; // 最大位移範圍
        point.x += (Math.random() - 0.5) * displacement;
        point.y += (Math.random() - 0.5) * displacement;

        // 確保吸引點不會超出視窗
        point.x = Math.max(0, Math.min(window.innerWidth, point.x));
        point.y = Math.max(0, Math.min(window.innerHeight, point.y));
      }
    });

    // 隨機新增吸引點
    if (Math.random() < 0.3 * this.cursor.intensity) {
      this.addAttractPoint(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        0.1 + Math.random() * 0.2
      );
    }
  }

  // 檢查滑鼠速度
  checkMouseSpeed() {
    // 至少需要2個點才能計算速度
    if (this.mouseHistory.length < 2) return;

    // 獲取最新兩個點
    const latest = this.mouseHistory[this.mouseHistory.length - 1];
    const previous = this.mouseHistory[this.mouseHistory.length - 2];

    // 計算距離和時間差
    const dx = latest.x - previous.x;
    const dy = latest.y - previous.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const timeDiff = latest.time - previous.time;

    // 計算速度 (像素/毫秒)
    const speed = timeDiff > 0 ? distance / timeDiff : 0;

    // 如果速度超過閾值，觸發效果
    if (speed > this.mouseSpeedThreshold) {
      // 觸發事件
      document.dispatchEvent(
        new CustomEvent("fastMouseMovement", {
          detail: { speed },
        })
      );

      // 在詭異模式下，快速移動可能導致游標短暫失控
      if (this.state.isHaunted) {
        // 短暫提高接管強度
        const originalIntensity = this.cursor.intensity;
        this.increaseIntensity(0.2);

        // 2秒後恢復
        setTimeout(() => {
          this.cursor.intensity = originalIntensity;
        }, 2000);
      }
    }
  }

  // 啟用詭異游標
  activateHauntedCursor() {
    // 如果原生游標還未隱藏，隱藏它
    if (!this.cursor.isHidden) {
      document.body.style.cursor = "none";
      this.cursor.isHidden = true;
    }

    // 游標視覺效果變化為詭異模式
    gsap.to(this.customCursor, {
      borderColor: "rgba(255, 30, 86, 0.8)",
      boxShadow: "0 0 20px rgba(255, 30, 86, 0.4)",
      duration: 1,
    });

    gsap.to(this.cursorDot, {
      backgroundColor: "rgba(255, 30, 86, 0.9)",
      width: "8px",
      height: "8px",
      duration: 1,
    });
  }

  // 增加接管強度
  increaseIntensity(amount) {
    this.cursor.intensity = Math.min(1, this.cursor.intensity + amount);
    return this.cursor.intensity;
  }

  // 減少接管強度
  decreaseIntensity(amount) {
    this.cursor.intensity = Math.max(0, this.cursor.intensity - amount);
    return this.cursor.intensity;
  }

  // 啟用游標引導效果 (引導使用者點擊特定元素)
  enableGuidance(targetSelector, strength = 0.5) {
    const target = document.querySelector(targetSelector);
    if (!target) return false;

    this.guidanceTarget = target;
    this.guidanceActive = true;

    // 獲取目標元素中心點
    const rect = target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // 添加臨時吸引點
    this.addTemporaryAttractPoint(x, y, strength, 10000); // 10秒

    // 目標元素添加視覺提示
    target.classList.add("guidance-target");

    // 10秒後自動取消引導
    setTimeout(() => {
      this.disableGuidance();
    }, 10000);

    return true;
  }

  // 取消游標引導效果
  disableGuidance() {
    if (!this.guidanceActive) return;

    this.guidanceActive = false;

    if (this.guidanceTarget) {
      this.guidanceTarget.classList.remove("guidance-target");
      this.guidanceTarget = null;
    }
  }
}
