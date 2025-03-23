/**
 * Claude Sonnet 3.7 驚悚網站 - 粒子背景系統
 * 負責創建和管理背景中流動的粒子效果，包括正常模式和詭異模式
 */

// 使用全局變量而不是 import
// const THREE = window.THREE;

class ParticleSystem {
  constructor(state) {
    this.state = state;

    // 粒子系統容器
    this.container = document.getElementById("particles-js");
    if (!this.container) {
      console.warn("粒子容器 #particles-js 未找到");
      return;
    }

    // 正常模式與詭異模式的配置
    this.normalConfig = {
      particleCount: 80,
      color: "#8a2be2", // Claude 紫色
      size: { min: 1, max: 3 },
      speed: { min: 0.2, max: 0.8 },
      opacity: { min: 0.1, max: 0.5 },
      connectDistance: 150,
    };

    this.hauntedConfig = {
      particleCount: 120,
      color: "#ff0066", // 詭異紅色
      size: { min: 1, max: 5 },
      speed: { min: 0.5, max: 1.5 },
      opacity: { min: 0.2, max: 0.7 },
      connectDistance: 200,
    };

    // 目前設定
    this.config = this.normalConfig;

    // 粒子數據
    this.particles = [];

    // 畫布與上下文
    this.canvas = null;
    this.ctx = null;

    // 初始化粒子系統
    this.initParticles();

    // 設置事件監聽
    this.setupEventListeners();

    // 啟動動畫循環
    this.animate();
  }

  // 初始化粒子系統
  initParticles() {
    // 創建畫布
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    // 調整畫布大小
    this.resizeCanvas();

    // 添加畫布到容器
    this.container.appendChild(this.canvas);

    // 創建粒子
    this.createParticles();
  }

  // 設置事件監聽
  setupEventListeners() {
    // 窗口大小變化時調整畫布大小
    window.addEventListener("resize", () => {
      this.resizeCanvas();
    });

    // 監聽詭異模式變化
    document.addEventListener("hauntedModeActivated", () => {
      this.switchToHauntedMode();
    });

    document.addEventListener("hauntedModeDeactivated", () => {
      this.switchToNormalMode();
    });

    // 監聽滑鼠移動，添加交互效果
    document.addEventListener("mousemove", (e) => {
      this.handleMouseMove(e);
    });

    // 監聽點擊事件，添加點擊效果
    this.canvas.addEventListener("click", (e) => {
      this.addClickEffect(e);
    });
  }

  // 調整畫布大小
  resizeCanvas() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;

    // 如果有粒子，調整它們的位置
    if (this.particles.length > 0) {
      this.particles.forEach((particle) => {
        if (particle.x > this.canvas.width) {
          particle.x = Math.random() * this.canvas.width;
        }
        if (particle.y > this.canvas.height) {
          particle.y = Math.random() * this.canvas.height;
        }
      });
    }
  }

  // 創建粒子
  createParticles() {
    this.particles = [];

    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius:
          this.config.size.min +
          Math.random() * (this.config.size.max - this.config.size.min),
        speedX: (Math.random() - 0.5) * this.config.speed.max * 2,
        speedY: (Math.random() - 0.5) * this.config.speed.max * 2,
        opacity:
          this.config.opacity.min +
          Math.random() * (this.config.opacity.max - this.config.opacity.min),
        color: this.config.color,
        isGlowing: false, // 是否發光效果
        pulseSpeed: 0.03 + Math.random() * 0.05, // 脈衝速度
        pulsePhase: Math.random() * Math.PI * 2, // 脈衝相位
      });
    }
  }

  // 動畫循環
  animate() {
    // 清除畫布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 更新並繪製粒子
    this.updateParticles();
    this.drawParticles();

    // 連接較近的粒子
    this.connectParticles();

    // 繼續下一幀
    requestAnimationFrame(this.animate.bind(this));
  }

  // 更新粒子位置和狀態
  updateParticles() {
    this.particles.forEach((particle) => {
      // 更新位置
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // 邊界檢查 - 循環回到畫布內
      if (particle.x < 0) {
        particle.x = this.canvas.width;
      } else if (particle.x > this.canvas.width) {
        particle.x = 0;
      }

      if (particle.y < 0) {
        particle.y = this.canvas.height;
      } else if (particle.y > this.canvas.height) {
        particle.y = 0;
      }

      // 詭異模式下的粒子脈動
      if (this.state.isHaunted) {
        // 更新脈衝相位
        particle.pulsePhase += particle.pulseSpeed;

        // 基於相位計算當前半徑和不透明度
        const pulseFactor = (Math.sin(particle.pulsePhase) + 1) / 2; // 0-1
        particle.currentRadius = particle.radius * (1 + pulseFactor * 0.5);
        particle.currentOpacity = particle.opacity * (0.7 + pulseFactor * 0.3);
      } else {
        // 正常模式下固定值
        particle.currentRadius = particle.radius;
        particle.currentOpacity = particle.opacity;
      }
    });

    // 更新鼠標交互效果
    if (this.mousePosition) {
      // 隨時間減少效果半徑
      this.mouseRadius = Math.max(0, this.mouseRadius - 2);

      // 如果效果結束，清除鼠標位置
      if (this.mouseRadius <= 0) {
        this.mousePosition = null;
      }
    }
  }

  // 繪製粒子
  drawParticles() {
    this.particles.forEach((particle) => {
      this.ctx.beginPath();
      this.ctx.arc(
        particle.x,
        particle.y,
        particle.currentRadius || particle.radius,
        0,
        Math.PI * 2
      );

      // 設置粒子顏色和透明度
      if (particle.isGlowing) {
        // 發光效果
        const gradient = this.ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.currentRadius * 3
        );

        const color = this.hexToRgb(particle.color);
        gradient.addColorStop(
          0,
          `rgba(${color.r}, ${color.g}, ${color.b}, ${particle.currentOpacity})`
        );
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        this.ctx.fillStyle = gradient;
      } else {
        // 正常繪製
        this.ctx.fillStyle = this.getRgbaColor(
          particle.color,
          particle.currentOpacity || particle.opacity
        );
      }

      this.ctx.fill();
    });

    // 繪製鼠標交互效果
    if (this.mousePosition && this.mouseRadius > 0) {
      this.ctx.beginPath();
      this.ctx.arc(
        this.mousePosition.x,
        this.mousePosition.y,
        this.mouseRadius,
        0,
        Math.PI * 2
      );

      // 創建徑向漸變
      const gradient = this.ctx.createRadialGradient(
        this.mousePosition.x,
        this.mousePosition.y,
        0,
        this.mousePosition.x,
        this.mousePosition.y,
        this.mouseRadius
      );

      const color = this.hexToRgb(this.config.color);
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    }
  }

  // 連接較近的粒子
  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle1 = this.particles[i];
        const particle2 = this.particles[j];

        // 計算距離
        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 如果距離小於設定值，連接它們
        if (distance < this.config.connectDistance) {
          // 透明度基於距離
          const opacity = 1 - distance / this.config.connectDistance;

          this.ctx.beginPath();
          this.ctx.moveTo(particle1.x, particle1.y);
          this.ctx.lineTo(particle2.x, particle2.y);

          // 設置線條樣式
          this.ctx.strokeStyle = this.getRgbaColor(
            this.config.color,
            opacity * 0.3
          );
          this.ctx.lineWidth = this.state.isHaunted ? 1 : 0.5;

          this.ctx.stroke();
        }
      }
    }
  }

  // 處理滑鼠移動
  handleMouseMove(e) {
    // 取得畫布相對於視窗的偏移
    const rect = this.canvas.getBoundingClientRect();

    // 計算滑鼠在畫布中的位置
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 設置鼠標位置和效果半徑
    this.mousePosition = { x, y };
    this.mouseRadius = 80; // 初始效果半徑

    // 使附近粒子受到影響
    this.particles.forEach((particle) => {
      const dx = particle.x - x;
      const dy = particle.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        // 距離越近影響越大
        const force = (100 - distance) / 100;

        // 在詭異模式下，粒子被吸引到鼠標
        if (this.state.isHaunted) {
          particle.speedX = particle.speedX * 0.5 - dx * force * 0.05;
          particle.speedY = particle.speedY * 0.5 - dy * force * 0.05;
        }
        // 在正常模式下，粒子被鼠標推開
        else {
          particle.speedX = particle.speedX * 0.5 + dx * force * 0.02;
          particle.speedY = particle.speedY * 0.5 + dy * force * 0.02;
        }

        // 限制最大速度
        const maxSpeed = this.state.isHaunted ? 2 : 1;
        const speed = Math.sqrt(
          particle.speedX * particle.speedX + particle.speedY * particle.speedY
        );

        if (speed > maxSpeed) {
          const scale = maxSpeed / speed;
          particle.speedX *= scale;
          particle.speedY *= scale;
        }

        // 使粒子發光
        particle.isGlowing = true;

        // 2秒後恢復正常
        setTimeout(() => {
          particle.isGlowing = false;
        }, 2000);
      }
    });
  }

  // 點擊效果
  addClickEffect(e) {
    // 取得畫布相對於視窗的偏移
    const rect = this.canvas.getBoundingClientRect();

    // 計算點擊在畫布中的位置
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 在點擊位置添加10個粒子
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      const particle = {
        x: x,
        y: y,
        radius:
          this.config.size.min +
          Math.random() * (this.config.size.max - this.config.size.min) * 2,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        opacity: this.config.opacity.max,
        color: this.config.color,
        isGlowing: true,
        pulseSpeed: 0.1 + Math.random() * 0.1,
        pulsePhase: Math.random() * Math.PI * 2,
        // 設置生命週期
        life: 100,
        maxLife: 100,
      };

      this.particles.push(particle);
    }

    // 在詭異模式下，額外添加一個脈衝效果
    if (this.state.isHaunted) {
      const pulse = {
        x: x,
        y: y,
        radius: 5,
        targetRadius: 150,
        opacity: 0.8,
        color: this.config.color,
        growing: true,
      };

      // 脈衝動畫
      const animatePulse = () => {
        if (!pulse.growing) return;

        // 繪製脈衝
        this.ctx.beginPath();
        this.ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.getRgbaColor(pulse.color, pulse.opacity);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 更新大小和透明度
        pulse.radius += 5;
        pulse.opacity -= 0.02;

        // 如果脈衝未結束，繼續動畫
        if (pulse.radius < pulse.targetRadius && pulse.opacity > 0) {
          requestAnimationFrame(animatePulse);
        } else {
          pulse.growing = false;
        }
      };

      // 開始脈衝動畫
      animatePulse();
    }
  }

  // 切換到詭異模式
  switchToHauntedMode() {
    this.config = this.hauntedConfig;

    // 逐漸轉換粒子顏色和速度
    this.particles.forEach((particle) => {
      // 設置目標值
      particle.targetColor = this.hauntedConfig.color;
      particle.targetSpeed = {
        x: particle.speedX * 2,
        y: particle.speedY * 2,
      };

      // 保存原始值
      particle.originalColor = particle.color;
      particle.originalSpeed = {
        x: particle.speedX,
        y: particle.speedY,
      };

      // 轉換動畫
      this.animateParticleTransition(particle);
    });

    // 添加額外的詭異粒子
    const additionalCount =
      this.hauntedConfig.particleCount - this.normalConfig.particleCount;

    for (let i = 0; i < additionalCount; i++) {
      const particle = {
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius:
          this.config.size.min +
          Math.random() * (this.config.size.max - this.config.size.min),
        speedX: (Math.random() - 0.5) * this.config.speed.max * 2,
        speedY: (Math.random() - 0.5) * this.config.speed.max * 2,
        opacity: 0, // 從透明開始
        targetOpacity:
          this.config.opacity.min +
          Math.random() * (this.config.opacity.max - this.config.opacity.min),
        color: this.config.color,
        isGlowing: Math.random() < 0.3, // 30%機率發光
        pulseSpeed: 0.03 + Math.random() * 0.05,
        pulsePhase: Math.random() * Math.PI * 2,
        isNewParticle: true,
      };

      this.particles.push(particle);

      // 淡入動畫
      this.fadeInParticle(particle);
    }
  }

  // 切換到正常模式
  switchToNormalMode() {
    this.config = this.normalConfig;

    // 標記需要移除的粒子
    const currentCount = this.particles.length;
    const targetCount = this.normalConfig.particleCount;

    // 如果有多餘的粒子，淡出並移除
    if (currentCount > targetCount) {
      // 標記多餘的粒子
      for (let i = targetCount; i < currentCount; i++) {
        this.particles[i].fadeOut = true;
        this.fadeOutParticle(this.particles[i]);
      }
    }

    // 恢復剩餘粒子到正常狀態
    for (let i = 0; i < targetCount; i++) {
      const particle = this.particles[i];

      // 設置目標值
      particle.targetColor = this.normalConfig.color;
      particle.targetSpeed = {
        x: particle.speedX * 0.5,
        y: particle.speedY * 0.5,
      };

      // 保存原始值
      particle.originalColor = particle.color;
      particle.originalSpeed = {
        x: particle.speedX,
        y: particle.speedY,
      };

      // 轉換動畫
      this.animateParticleTransition(particle);
    }
  }

  // 粒子轉換動畫
  animateParticleTransition(particle) {
    const duration = 2000; // 2秒
    const startTime = Date.now();
    const originalColor = this.hexToRgb(particle.originalColor);
    const targetColor = this.hexToRgb(particle.targetColor);

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // 顏色插值
      if (originalColor && targetColor) {
        const r = Math.floor(
          originalColor.r + (targetColor.r - originalColor.r) * progress
        );
        const g = Math.floor(
          originalColor.g + (targetColor.g - originalColor.g) * progress
        );
        const b = Math.floor(
          originalColor.b + (targetColor.b - originalColor.b) * progress
        );

        particle.color = `rgb(${r}, ${g}, ${b})`;
      }

      // 速度插值
      if (particle.originalSpeed && particle.targetSpeed) {
        particle.speedX =
          particle.originalSpeed.x +
          (particle.targetSpeed.x - particle.originalSpeed.x) * progress;
        particle.speedY =
          particle.originalSpeed.y +
          (particle.targetSpeed.y - particle.originalSpeed.y) * progress;
      }

      // 如果動畫未完成，繼續
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  // 新粒子淡入動畫
  fadeInParticle(particle) {
    const duration = 1500; // 1.5秒
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // 不透明度插值
      particle.opacity = progress * particle.targetOpacity;

      // 如果動畫未完成，繼續
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  // 粒子淡出動畫
  fadeOutParticle(particle) {
    const duration = 1500; // 1.5秒
    const startTime = Date.now();
    const startOpacity = particle.opacity;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // 不透明度插值
      particle.opacity = startOpacity * (1 - progress);

      // 如果動畫未完成，繼續
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 動畫完成後從陣列中移除
        const index = this.particles.indexOf(particle);
        if (index !== -1) {
          this.particles.splice(index, 1);
        }
      }
    };

    animate();
  }

  // 輔助函數：顏色與透明度轉換為rgba字串
  getRgbaColor(hex, opacity) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return `rgba(255, 255, 255, ${opacity})`;

    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }

  // 輔助函數：十六進制顏色轉換為rgb物件
  hexToRgb(hex) {
    // 移除#前綴
    hex = hex.replace(/^#/, "");

    // 擴展簡寫格式
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    // 解析rgb值
    const bigint = parseInt(hex, 16);
    if (isNaN(bigint)) return null;

    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }
}

// 將粒子系統導出為全局變量，以便其他模塊使用
window.ParticleSystem = ParticleSystem;

// 當DOM載入完成後初始化粒子系統
document.addEventListener("DOMContentLoaded", () => {
  // 檢查是否存在全局狀態物件
  if (window.claudeSite && window.claudeSite.state) {
    new ParticleSystem(window.claudeSite.state);
  } else {
    // 如果全局狀態不存在，創建一個基本狀態物件
    const defaultState = {
      isHaunted: false,
      easterEggsFound: 0,
    };

    new ParticleSystem(defaultState);
  }
});
