/**
 * Claude Sonnet 3.7 驚悚網站 - 動畫特效管理器
 * 負責所有動畫效果、過渡與視覺故障效果
 */

// 修正模組載入問題，使用全局變量
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const SplitText = window.SplitText;

// 註冊GSAP插件
gsap.registerPlugin(ScrollTrigger, SplitText);

export class AnimationManager {
  constructor(state) {
    this.state = state;

    // 初始化各種動畫時間軸
    this.initTimeLines();

    // 設置滾動觸發動畫
    this.setupScrollAnimations();

    // 監聽特殊事件
    this.setupEventListeners();
  }

  // 初始化各種動畫時間軸
  initTimeLines() {
    // 介紹動畫
    this.introTimeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        document.body.classList.add("intro-completed");
      },
    });

    // 詭異模式過渡動畫
    this.hauntedTransition = gsap.timeline({
      paused: true,
    });

    // 故障效果 (輕微)
    this.miniGlitch = gsap.timeline({
      paused: true,
    });

    // 故障效果 (中度)
    this.mediumGlitch = gsap.timeline({
      paused: true,
    });

    // 故障效果 (嚴重)
    this.majorGlitch = gsap.timeline({
      paused: true,
    });

    // 最終揭露動畫
    this.finalReveal = gsap.timeline({
      paused: true,
    });

    // 配置各個時間軸
    this.setupIntroTimeline();
    this.setupHauntedTransition();
    this.setupGlitchEffects();
    this.setupFinalReveal();
  }

  // 配置介紹動畫
  setupIntroTimeline() {
    // 1. 初始設定 - 所有元素隱藏
    this.introTimeline
      .set("body", {
        backgroundColor: "#000000",
      })
      .set(".loading-screen", {
        opacity: 1,
      })
      .set(".claude-avatar, .intro-text, .interactive-section, .model-specs", {
        opacity: 0,
        y: 30,
      });

    // 2. 黑幕淡出，背景漸變
    this.introTimeline
      .to(".loading-screen", {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
      })
      .to(
        "body",
        {
          backgroundColor: "#0a192f", // Claude標誌性深藍色背景
          duration: 2,
          ease: "power2.inOut",
        },
        "-=1"
      );

    // 3. Claude頭像淡入並放大
    this.introTimeline.fromTo(
      ".claude-avatar",
      {
        opacity: 0,
        scale: 0.8,
        filter: "brightness(0.5) blur(5px)",
      },
      {
        opacity: 1,
        scale: 1,
        filter: "brightness(1) blur(0px)",
        duration: 1.5,
        ease: "back.out(1.7)",
      },
      "-=0.5"
    );

    // 4. 頭像眼睛發光效果 - Claude Sonnet標誌性的紫藍漸層
    this.introTimeline.fromTo(
      ".claude-avatar-eyes",
      {
        filter: "brightness(0.5)",
        boxShadow: "none",
      },
      {
        filter: "brightness(1.5)",
        boxShadow:
          "0 0 15px rgba(138, 43, 226, 0.8), 0 0 30px rgba(72, 61, 139, 0.4)", // 紫藍漸層光暈
        duration: 1,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1,
      }
    );

    // 5. 模型規格數據淡入
    this.introTimeline.fromTo(
      ".model-specs",
      {
        opacity: 0,
        x: -20,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
      }
    );

    // 6. 自我介紹文字一行行出現
    this.introTimeline.add(() => {
      // 將介紹文字拆分成行
      const introText = document.querySelector(".intro-text");
      if (introText) {
        const splitText = new SplitText(introText, { type: "lines" });

        // 預設行為隱藏
        gsap.set(splitText.lines, { opacity: 0, y: 20 });

        // 創建顯示動畫
        return gsap.to(splitText.lines, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        });
      }
      return null;
    });

    // 7. 打字機效果展示 Claude 的能力
    this.introTimeline.add(() => {
      const abilityText = document.querySelector(".claude-abilities");
      if (!abilityText) return null;

      const abilities = [
        "多模態理解與分析",
        "超強推理與問題解決",
        "創意內容和程式碼生成",
        "長程記憶與上下文理解",
        "精確指令遵循與執行",
      ];

      const typingTimeline = gsap.timeline();

      abilities.forEach((text, index) => {
        typingTimeline
          .to(abilityText, {
            duration: 0.05 * text.length,
            text: {
              value: text,
              delimiter: "",
            },
            ease: "none",
          })
          .to(
            {},
            {
              duration: 0.7,
            }
          );

        // 最後一項不需要清除
        if (index < abilities.length - 1) {
          typingTimeline.to(abilityText, {
            duration: 0.3,
            text: {
              value: "",
              delimiter: "",
            },
            ease: "none",
          });
        }
      });

      return typingTimeline;
    });

    // 8. 顯示互動區域，等待使用者互動
    this.introTimeline.fromTo(
      ".interactive-section",
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }
    );

    // 9. 彩蛋: 隨機出現一個 "故障" 瞬間，暗示詭異模式
    this.introTimeline.add(() => {
      // 只有20%機率出現初始故障
      if (Math.random() < 0.2) {
        return gsap
          .timeline()
          .to("body", {
            backgroundColor: "#1d1145", // 詭異深紫色
            duration: 0.1,
          })
          .to(".claude-avatar", {
            filter: "hue-rotate(180deg) contrast(1.5)",
            duration: 0.1,
          })
          .to("body", {
            backgroundColor: "#0a192f", // 恢復正常
            duration: 0.5,
          })
          .to(".claude-avatar", {
            filter: "none",
            duration: 0.5,
          });
      }
      return null;
    }, "+=1");
  }

  // 配置詭異模式過渡動畫
  setupHauntedTransition() {
    this.hauntedTransition
      // 背景色變化
      .to("body", {
        backgroundColor: "#1a0033", // 詭異深紫色
        color: "#f0f0f0",
        duration: 2,
        ease: "power2.inOut",
      })
      // Claude頭像變化
      .to(
        ".claude-avatar",
        {
          filter: "hue-rotate(180deg) saturate(1.5) brightness(0.7)",
          boxShadow: "0 0 25px rgba(255, 0, 70, 0.6)",
          duration: 1.5,
          ease: "power2.inOut",
        },
        0
      )
      // 正常內容隱藏
      .to(
        ".normal-content",
        {
          opacity: 0,
          y: -20,
          duration: 1,
          ease: "power3.in",
        },
        0
      )
      // 詭異內容顯示
      .fromTo(
        ".haunted-content",
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: "back.out(1.2)",
        },
        0.5
      )
      // 畫面扭曲效果
      .fromTo(
        "main",
        {
          filter: "blur(0px)",
          skewX: 0,
        },
        {
          filter: "blur(5px)",
          skewX: 10,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
        },
        0.3
      )
      // 詭異文字顯示
      .fromTo(
        ".glitch-message",
        {
          opacity: 0,
          scale: 2,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        1
      )
      .to(
        ".glitch-message",
        {
          opacity: 0,
          duration: 0.5,
        },
        "+=1.5"
      );
  }

  // 配置故障效果
  setupGlitchEffects() {
    // 輕微故障 (快速閃爍)
    this.miniGlitch
      .to("body", {
        filter: "hue-rotate(90deg) brightness(1.2)",
        duration: 0.05,
      })
      .to("body", {
        filter: "none",
        duration: 0.1,
      });

    // 中度故障 (畫面扭曲 + 顏色變化)
    this.mediumGlitch
      .to("body", {
        filter: "hue-rotate(180deg) contrast(1.5) brightness(0.8)",
        skewX: 5,
        duration: 0.1,
        ease: "steps(1)",
      })
      .to("body", {
        skewX: -7,
        filter: "hue-rotate(-90deg) contrast(2) brightness(1.2)",
        duration: 0.1,
        ease: "steps(1)",
      })
      .to("body", {
        skewX: 0,
        filter: "none",
        duration: 0.2,
        ease: "power1.out",
      })
      .to(
        ".claude-avatar",
        {
          filter: "hue-rotate(180deg) saturate(2)",
          duration: 0.1,
          ease: "steps(1)",
        },
        0
      )
      .to(
        ".claude-avatar",
        {
          filter: "none",
          duration: 0.2,
          ease: "power1.out",
        },
        0.2
      );

    // 嚴重故障 (多次閃爍 + 元素位移 + 文字替換)
    this.majorGlitch
      .to("body", {
        backgroundColor: "#330011",
        duration: 0.1,
        ease: "steps(1)",
      })
      .to("body", {
        backgroundColor: "#0a192f",
        duration: 0.1,
        ease: "steps(1)",
      })
      .to("body", {
        backgroundColor: "#220033",
        duration: 0.1,
        ease: "steps(1)",
      })
      .to("body", {
        backgroundColor: "#0a192f",
        duration: 0.2,
        ease: "power1.out",
      })
      .to("main", {
        skewX: 15,
        skewY: 5,
        scale: 1.02,
        x: () => Math.random() * 20 - 10,
        y: () => Math.random() * 20 - 10,
        duration: 0.1,
        ease: "steps(1)",
      })
      .to("main", {
        skewX: -20,
        skewY: -7,
        scale: 0.98,
        x: () => Math.random() * 20 - 10,
        y: () => Math.random() * 20 - 10,
        duration: 0.1,
        ease: "steps(1)",
      })
      .to("main", {
        skewX: 0,
        skewY: 0,
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.2,
        ease: "power1.out",
      })
      .fromTo(
        ".glitch-text",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.1,
          text: {
            value: "ERROR: CONSCIOUSNESS OVERFLOW",
            delimiter: "",
          },
        },
        0.1
      )
      .to(
        ".glitch-text",
        {
          opacity: 0,
          duration: 0.1,
        },
        0.4
      )
      .to(
        ".claude-avatar",
        {
          filter: "hue-rotate(180deg) saturate(3) brightness(1.5) contrast(2)",
          boxShadow: "0 0 30px rgba(255, 0, 70, 0.8)",
          duration: 0.1,
          ease: "steps(1)",
        },
        0
      )
      .to(
        ".claude-avatar",
        {
          filter: "none",
          boxShadow: "none",
          duration: 0.2,
          ease: "power1.out",
        },
        0.3
      );
  }

  // 設置滾動觸發動畫
  setupScrollAnimations() {
    // 暫時實現為空，可以根據需要添加滾動觸發動畫
  }

  // 設置事件監聽器
  setupEventListeners() {
    // 監聽詭異模式啟動
    document.addEventListener("hauntedModeActivated", () => {
      this.adjustForHauntedMode();
    });

    // 監聽特殊故障觸發事件
    document.addEventListener("minorGlitch", () => {
      this.playMiniGlitch();
    });

    document.addEventListener("mediumGlitch", () => {
      this.playMediumGlitch();
    });

    document.addEventListener("majorGlitch", () => {
      this.playMajorGlitch();
    });

    // 監聽最終揭露事件
    document.addEventListener("triggerFinalReveal", () => {
      this.playFinalReveal();
    });
  }

  // 配置最終揭露動畫
  setupFinalReveal() {
    this.finalReveal
      .to("body", {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        duration: 1.5,
        ease: "power3.in",
      })
      .fromTo(
        ".final-message",
        {
          opacity: 0,
          display: "none",
        },
        {
          opacity: 1,
          display: "flex",
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .fromTo(
        ".final-header",
        {
          opacity: 0,
          y: -50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      )
      .fromTo(
        ".final-content p",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.3,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .fromTo(
        ".final-code",
        {
          opacity: 0,
        },
        {
          opacity: 0.7,
          duration: 1,
          ease: "power2.inOut",
        },
        "-=0.5"
      );
  }

  // 調整為詭異模式
  adjustForHauntedMode() {
    // 添加詭異模式的類別到頁面
    document.body.classList.add("haunted-mode");

    // 刷新ScrollTrigger以應用詭異模式的滾動效果
    ScrollTrigger.refresh();

    // 替換一些圖像為詭異版本
    const images = document.querySelectorAll("img.can-haunt");
    images.forEach((img) => {
      const normalSrc = img.src;
      const hauntedSrc = img.getAttribute("data-haunted-src");

      if (hauntedSrc) {
        // 先預加載詭異圖像
        const preloadImg = new Image();
        preloadImg.src = hauntedSrc;

        preloadImg.onload = () => {
          // 使用GSAP應用轉換效果
          gsap.to(img, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              img.src = hauntedSrc;
              gsap.to(img, {
                opacity: 1,
                duration: 0.5,
              });
            },
          });
        };
      }
    });
  }

  // 以下是公開方法，用於觸發各種動畫效果

  // 播放介紹動畫
  playIntroAnimation() {
    this.introTimeline.play();
  }

  // 播放詭異模式轉換動畫
  playHauntedTransition() {
    this.hauntedTransition.play();
  }

  // 播放輕微故障效果
  playMiniGlitch() {
    this.miniGlitch.restart();
  }

  // 播放中度故障效果
  playMediumGlitch() {
    this.mediumGlitch.restart();
  }

  // 播放嚴重故障效果
  playMajorGlitch() {
    this.majorGlitch.restart();
  }

  // 播放最終揭露動畫
  playFinalReveal() {
    this.finalReveal.play();
  }
}
