/**
 * DinoRunner.js
 * 自動初始化的互動式恐龍動畫套件
 *
 * 基本使用：
 * 1. 只需引入必要的腳本即可自動啟動預設配置：
 *    <script src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" type="module"></script>
 *    <script src="DinoRunner.js"></script>
 *
 * 自訂配置：
 * window.DINO_CONFIG = {
 *     width: '200px',      // 恐龍寬度
 *     height: '200px',     // 恐龍高度
 *     idleTimeout: 3000,   // 閒置時間（毫秒）
 *     minSpeed: 1,         // 最小速度
 *     maxSpeed: 8          // 最大速度
 * };
 */

(function () {
  class DinoRunner {
    constructor(options = {}) {
      // 預設設定，並允許使用者覆寫
      this.options = {
        lottieUrl:
          "https://lottie.host/22290341-5306-42dc-80c8-5357d6f6d25a/I1kRkSV8D9.lottie",
        width: "200px",
        height: "200px",
        idleTimeout: 600000,
        minSpeed: 1,
        maxSpeed: 8,
        ...options,
      };

      // 判斷是否為手機或小裝置
      this.isMobile =
        /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 600;

      // 如果是手機就縮小尺寸，並覆蓋手機版訊息
      if (this.isMobile) {
        this.options.width = "120px";
        this.options.height = "120px";

        // 以下為手機版三種訊息 (短版)
        this.messages = {
          // idle：30 句
          idle: [
            "嗨，起來讀書啦！(｡♥‿♥｡)",
            "快開書，夢想等你！(❁´◡❁)",
            "別偷懶哦！(๑•̀ㅂ•́)و",
            "書本有魔法喔！(ﾉ◕ヮ◕)ﾉ",
            "讀書讓你更棒！(ღ˘⌣˘ღ)",
            "一起努力吧！(๑•̀_•́)ฅ",
            "動起來，學習吧！(｡◕‿◕｡)",
            "小心，讀書時間到！(⌒‿⌒)",
            "快快進書海！(✿◠‿◠)",
            "知識在召喚你！(ﾉ◕ヮ◕)ﾉ",
            "抓住夢想，讀書啦！(ღ˘⌣˘ღ)",
            "趕快看書！(❁´◡❁)",
            "書本等你翻開！(๑•̀ㅂ•́)و",
            "讀書，邁向未來！(｡♥‿♥｡)",
            "書香滿溢！(づ｡◕‿‿◕｡)づ",
            "立刻打開書本！(✿◠‿◠)",
            "知識是寶藏！(⌒‿⌒)",
            "讀書吧，小英雄！(๑•̀_•́)ฅ",
            "醒醒，趕快讀書！(ﾉ◕ヮ◕)ﾉ",
            "啟動學習模式！(ღ˘⌣˘ღ)",
            "書本有驚喜！(❁´◡❁)",
            "動起來學習！(๑•̀ㅂ•́)و",
            "記得讀書喔！(｡◕‿◕｡)",
            "一起迎向知識！(⌒‿⌒)",
            "書本充滿魔法！(✿◠‿◠)",
            "開啟你的書頁！(ﾉ◕ヮ◕)ﾉ",
            "讓書本點亮你！(ღ˘⌣˘ღ)",
            "書海無涯！(❁´◡❁)",
            "夢想從書開始！(๑•̀_•́)ฅ",
            "讀書，成就未來！(｡♥‿♥｡)",
          ],
          // encouragement：40 句
          encouragement: [
            "你真棒！(ღ˘⌣˘ღ)",
            "持續努力！(๑•̀ㅂ•́)و",
            "每步都算數！(⌒‿⌒)",
            "相信自己！(❁´◡❁)",
            "夢想等你追！(ﾉ◕ヮ◕)ﾉ",
            "知識無限！(✿◠‿◠)",
            "加油加油！(ღ˘⌣˘ღ)",
            "你很優秀！(｡◕‿◕｡)",
            "保持前行！(๑•̀_•́)ฅ",
            "每天都有進步！(❁´◡❁)",
            "你的努力最美！(ღ˘⌣˘ღ)",
            "繼續向前！(ﾉ◕ヮ◕)ﾉ",
            "你有無限可能！(✿◠‿◠)",
            "夢想就在眼前！(⌒‿⌒)",
            "每天更好！(｡♥‿♥｡)",
            "你是最棒的！(❁´◡❁)",
            "書本給你力量！(๑•̀ㅂ•́)و",
            "知識讓你閃耀！(ღ˘⌣˘ღ)",
            "堅持下去！(ﾉ◕ヮ◕)ﾉ",
            "你的未來光明！(✿◠‿◠)",
            "一步一腳印！(⌒‿⌒)",
            "你值得驕傲！(｡◕‿◕｡)",
            "永不放棄！(๑•̀_•́)ฅ",
            "夢想點燃熱情！(❁´◡❁)",
            "保持熱情！(ღ˘⌣˘ღ)",
            "你有無窮潛力！(ﾉ◕ヮ◕)ﾉ",
            "每秒都在進步！(✿◠‿◠)",
            "知識點亮人生！(⌒‿⌒)",
            "你的努力會開花！(｡♥‿♥｡)",
            "每天都是新開始！(❁´◡❁)",
            "你真有能量！(๑•̀ㅂ•́)و",
            "前方充滿希望！(ღ˘⌣˘ღ)",
            "你是學習高手！(ﾉ◕ヮ◕)ﾉ",
            "努力讓夢想發光！(✿◠‿◠)",
            "保持專注！(⌒‿⌒)",
            "你值得所有讚美！(｡◕‿◕｡)",
            "堅定向前！(❁´◡❁)",
            "每一滴汗水都珍貴！(๑•̀_•́)ฅ",
            "你的未來充滿光彩！(ღ˘⌣˘ღ)",
            "永遠相信自己！(ﾉ◕ヮ◕)ﾉ",
          ],
          // collision：30 句
          collision: [
            "撞牆啦，但沒關係！(>_<)ゞ",
            "小碰撞，繼續前行！(๑•̀ㅂ•́)و",
            "調整方向，再出發！(⌒‿⌒)",
            "遇到障礙，加油！(ง •̀_•́)ง",
            "撞牆只是小插曲！(❁´◡❁)",
            "轉個彎，重拾動力！(ღ˘⌣˘ღ)",
            "小意外，不影響夢想！(ﾉ◕ヮ◕)ﾉ",
            "別氣餒，再試試！(✿◠‿◠)",
            "調整後更帥！(๑•̀_•́)ฅ",
            "碰撞後，繼續努力！(⌒‿⌒)",
            "跌倒了也要站起來！(｡♥‿♥｡)",
            "小挫折，換個角度！(❁´◡❁)",
            "撞牆後，繼續冒險！(ღ˘⌣˘ღ)",
            "輕鬆調整，再向前！(ﾉ◕ヮ◕)ﾉ",
            "遇阻也不怕！(✿◠‿◠)",
            "小挫折讓你更堅強！(⌒‿⌒)",
            "轉個彎，迎接新挑戰！(｡◕‿◕｡)",
            "撞了也能繼續夢想！(❁´◡❁)",
            "每次跌倒都值得學習！(๑•̀_•́)ฅ",
            "障礙是成長的助力！(ღ˘⌣˘ღ)",
            "不要怕撞牆！(ﾉ◕ヮ◕)ﾉ",
            "輕鬆一轉，再展翅！(✿◠‿◠)",
            "小意外，快調整再起！(⌒‿⌒)",
            "轉彎處有新希望！(｡♥‿♥｡)",
            "撞牆後記得微笑！(❁´◡❁)",
            "重新調整，繼續前行！(ღ˘⌣˘ღ)",
            "小挫折只是暫時！(ﾉ◕ヮ◕)ﾉ",
            "障礙讓你更強大！(✿◠‿◠)",
            "撞牆了，也要堅持！(๑•̀_•́)و",
            "每次撞牆都是成長！(⌒‿⌒)",
          ],
        };
      } else {
        // 桌機用戶：使用較長版的訊息
        this.messages = {
          idle: [
            "嗨嗨～(❁´◡❁) 小恐龍來敲門啦，快快打開書本！📚",
            "嘻嘻～偷懶時間結束囉，趕緊加入學習派對吧！(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
            "嗚呼！夢想在呼喚你呢，快起來一起努力吧～(๑•̀ㅂ•́)و✧",
            "小恐龍報到～記得，知識就像糖果，吃越多越甜哦！(˘▽˘)っ♬",
            "快快回來～別讓懶惰偷走你的大未來！(ง •̀_•́)ง",
            "嗚哇～學習時光最美好！快來陪我一起讀書吧～(｡♥‿♥｡)",
            "嘟嘟～小恐龍的嗶嗶提醒：讀書時間到啦！(๑•̀ㅂ•́)و",
            "輕輕地說一句：讀書讓你變得更可愛喔！(｡◕‿◕｡)",
            "嘿嘿～不要再夢遊啦，知識在等著你呢！(｡•̀ᴗ-)✧",
            "嗨呀～該醒醒囉！讀書讓你充滿魔法～(☆▽☆)",
            "嘻嘻，學習的樂趣無窮無盡，快回來加入我們！(✿◠‿◠)",
            "小恐龍來提醒：讀書時光最珍貴，別讓它溜走了哦！(•̀ᴗ•́)و ̑̑",
            "嗚～夢想在前方等你，讀書起步一起衝！(ง •̀_•́)ง",
            "快快打開那本書，讓知識的星星點亮你！(｡•̀ᴗ-)✧",
            "嘿！小恐龍正在等你一起冒險呢～(づ｡◕‿‿◕｡)づ",
            "讀書時間到囉，讓我們一起嗨起來！(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
            "小可愛，趕緊把夢想當作翅膀展翅高飛！(｡♥‿♥｡)",
            "嗨嗨～別偷懶啦，書本也想跟你玩耍呢！(❁´◡❁)",
            "嘿嘿，學習才會讓你變成超級大英雄哦！(ง •̀_•́)ง",
            "嘟嘟～提醒你：知識之門正敞開，快來探索吧！(☆▽☆)",
            "小恐龍輕輕呼喚：別再睡啦，夢想不會等人的！(｡•̀ᴗ-)✧",
            "嗚呼～打開書本就像打開新世界的大門呢！(づ｡◕‿‿◕｡)づ",
            "快快回來～讓我們一起把懶惰踢走！(ง •̀_•́)ง",
            "嗨呀，學習的快樂會讓你笑得更甜哦～(๑•̀ㅂ•́)و✧",
            "嘻嘻，小恐龍在這裡守護你，別忘了讀書喔！(｡◕‿◕｡)",
            "嘿～知識像小星星，快來摘一顆吧！(☆▽☆)",
            "嗚～別讓懶惰搶走你的小宇宙，快來充電吧！(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
            "輕輕提醒：書本是魔法寶盒，快來開啟吧！(｡♥‿♥｡)",
            "快快起來，讓我們一起用學習點亮這一天！(•̀ᴗ•́)و ̑̑",
          ],
          encouragement: [
            "每一滴汗水都是閃閃發光的小星星，加油吧！(｡♥‿♥｡)",
            "你就是最棒的超級小英雄，知識在為你喝采！(ง •̀_•́)ง",
            "書本裡藏著無數魔法，快展開你的奇幻之旅吧！(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
            "相信自己，每一步都是邁向夢想的可愛足跡！(๑•̀ㅂ•́)و",
            "加油加油～你的努力會讓未來綻放大大的光芒！(☆▽☆)",
            "小恐龍永遠在你身邊陪伴，學習路上不孤單！(づ｡◕‿‿◕｡)づ",
            "每個字句都是成就夢想的魔法藥水，喝下去吧！(｡◕‿◕｡)",
            "夢想就在前方，向著陽光勇敢奔跑吧！(ﾉ◕ヮ◕)ﾉ",
            "當你努力時，整個宇宙都在為你打氣哦！(ღ˘⌣˘ღ)",
            "堅持下去，你會發現自己是最閃亮的星星！(๑•̀ㅂ•́)و",
            "每一頁書都是一個驚喜的寶藏，等你來發現！(｡♥‿♥｡)",
            "努力讀書，讓未來的你笑得更燦爛！(❁´◡❁)",
            "每次學習都在累積魔法，快讓夢想成真吧！(☆▽☆)",
            "小恐龍為你的每一個進步鼓掌，超級可愛！(づ｡◕‿‿◕｡)づ",
            "加油啦，小勇士！你的未來滿載著幸福與驚喜！(ง •̀_•́)ง",
            "知識的花園正在盛開，快去摘取屬於你的花朵吧！(｡◕‿◕｡)",
            "每個挑戰都是成長的糖果，吃下去會甜甜噠！(๑•̀ㅂ•́)و",
            "用心學習，讓夢想在心中悄悄綻放吧！(ღ˘⌣˘ღ)",
            "每一步的努力都會變成未來的幸福禮物哦！(｡♥‿♥｡)",
            "你就像那閃閃的小星星，照亮黑夜也照亮自己！(☆▽☆)",
            "知識就是你最好的魔法棒，揮一揮就能創造奇蹟！(ﾉ◕ヮ◕)ﾉ",
            "努力讀書後的微笑，是世界上最可愛的風景！(❁´◡❁)",
            "每次翻開書本，都是一次奇妙的冒險旅程！(｡◕‿◕｡)",
            "小恐龍為你的勤奮搖旗吶喊，你一定可以的！(ง •̀_•́)ง",
            "不要忘了，每一分努力都會化作幸福的星塵！(ღ˘⌣˘ღ)",
            "快來感受知識的溫暖，它會給你無限能量！(づ｡◕‿‿◕｡)づ",
            "你每一次堅持都在書寫屬於自己的童話故事！(๑•̀ㅂ•́)و",
            "讀書讓你變得更強大，就像超級英雄一樣酷炫！(☆▽☆)",
            "加油吧，小可愛，未來正因你的努力而精彩！(｡♥‿♥｡)",
            "當你認真學習時，整個世界都會為你喝采！(❁´◡❁)",
            "每一個挑戰都是一顆甜甜的小糖果，讓人充滿期待！(づ｡◕‿‿◕｡)づ",
            "努力學習吧，讓夢想像花朵般綻放吧！(ღ˘⌣˘ღ)",
          ],
          collision: [
            "撞牆啦，但沒關係！(>_<)ゞ",
            "小碰撞，繼續前行！(๑•̀ㅂ•́)و",
            "調整方向，再出發！(⌒‿⌒)",
            "遇到障礙，加油！(ง •̀_•́)ง",
            "撞牆只是小插曲！(❁´◡❁)",
            "轉個彎，重拾動力！(ღ˘⌣˘ღ)",
            "小意外，不影響夢想！(ﾉ◕ヮ◕)ﾉ",
            "別氣餒，再試試！(✿◠‿◠)",
            "調整後更帥！(๑•̀_•́)ฅ",
            "碰撞後，繼續努力！(⌒‿⌒)",
            "跌倒了也要站起來！(｡♥‿♥｡)",
            "小挫折，換個角度！(❁´◡❁)",
            "撞牆後，繼續冒險！(ღ˘⌣˘ღ)",
            "輕鬆調整，再向前！(ﾉ◕ヮ◕)ﾉ",
            "遇阻也不怕！(✿◠‿◠)",
            "小挫折讓你更堅強！(⌒‿⌒)",
            "轉個彎，迎接新挑戰！(｡◕‿◕｡)",
            "撞了也能繼續夢想！(❁´◡❁)",
            "每次跌倒都值得學習！(๑•̀_•́)ฅ",
            "障礙是成長的助力！(ღ˘⌣˘ღ)",
            "不要怕撞牆！(ﾉ◕ヮ◕)ﾉ",
            "輕鬆一轉，再展翅！(✿◠‿◠)",
            "小意外，快調整再起！(⌒‿⌒)",
            "轉彎處有新希望！(｡♥‿♥｡)",
            "撞牆後記得微笑！(❁´◡❁)",
            "重新調整，繼續前行！(ღ˘⌣˘ღ)",
            "小挫折只是暫時！(ﾉ◕ヮ◕)ﾉ",
            "障礙讓你更強大！(✿◠‿◠)",
            "撞牆了，也要堅持！(๑•̀_•́)و",
            "每次撞牆都是成長！(⌒‿⌒)",
          ],
        };
      }

      // 初始位置設在螢幕下半部（或手機狀態下也可以改）
      this.position = {
        x: 0,
        y: window.innerHeight / 2,
      };
      this.velocity = { x: 2, y: 0 };
      this.isMoving = false;
      this.lastMouseMove = Date.now();
      this.scale = 1;
      this.targetScale = 1;

      this.initStyles();
      this.init();
    }

    initStyles() {
      const style = document.createElement("style");
      style.textContent = `
        .dino-container {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.5s ease, transform 0.3s ease;
        }
        .dino-container.show {
          opacity: 1;
        }
        .dino-wrapper {
          transform-origin: center;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .dino-speech-bubble {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%) scale(0.8);
          background: rgba(255, 255, 255, 0.98);
          border: 2px solid #ffd700;
          border-radius: 20px;
          padding: 10px 20px;
          font-size: 15px;
          color: #333;
          white-space: nowrap;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          z-index: 10000;
        }
        .dino-speech-bubble:after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 12px 10px 0;
          border-style: solid;
          border-color: #ffd700 transparent transparent;
        }
        .dino-speech-bubble.show {
          opacity: 1;
          transform: translateX(-50%) scale(1);
        }
      `;
      document.head.appendChild(style);
    }

    init() {
      this.container = document.createElement("div");
      this.container.className = "dino-container";

      this.wrapper = document.createElement("div");
      this.wrapper.className = "dino-wrapper";

      this.player = document.createElement("dotlottie-player");
      this.player.src = this.options.lottieUrl;
      this.player.setAttribute("background", "transparent");
      this.player.setAttribute("speed", "1");
      this.player.setAttribute("loop", "");
      this.player.setAttribute("autoplay", "");
      this.player.style.width = this.options.width;
      this.player.style.height = this.options.height;

      this.speechBubble = document.createElement("div");
      this.speechBubble.className = "dino-speech-bubble";

      this.wrapper.appendChild(this.speechBubble);
      this.wrapper.appendChild(this.player);
      this.container.appendChild(this.wrapper);
      document.body.appendChild(this.container);

      this.setupEventListeners();
      this.checkIdleState();
    }

    setupEventListeners() {
      // 桌機用戶：使用 mousemove 重置閒置時間
      document.addEventListener("mousemove", () => {
        this.lastMouseMove = Date.now();
        if (this.isMoving) {
          this.stop();
        }
      });
      // 手機用戶：點擊、滑動或滾動都重置閒置時間
      if (this.isMobile) {
        const mobileHandler = () => {
          this.lastMouseMove = Date.now();
          if (this.isMoving) {
            this.stop();
          }
        };
        window.addEventListener("touchstart", mobileHandler);
        window.addEventListener("touchmove", mobileHandler);
        window.addEventListener("scroll", mobileHandler);
      }
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    checkIdleState() {
      setInterval(() => {
        const idleTime = Date.now() - this.lastMouseMove;
        if (idleTime >= this.options.idleTimeout && !this.isMoving) {
          this.start();
        }
      }, 1000);
    }

    /**
     * 顯示訊息：type 可以是 "idle"、"encouragement"、"collision"
     * - 碰撞或翻轉：僅有 5% 機率顯示，僅持續 3 秒
     * - 鼓勵的話：顯示 10 秒
     * - 其他 (如 idle)：顯示 15 秒 (預設)
     */
    showMessage(type = "encouragement") {
      const messages = this.messages[type];
      if (!messages || messages.length === 0) return;

      // 若是碰撞類型，只有 5% 機率顯示
      if (type === "collision") {
        if (Math.random() >= 0.05) {
          return; // 95% 不顯示
        }
      }

      // 隨機選一句
      const message = messages[Math.floor(Math.random() * messages.length)];
      this.speechBubble.textContent = message;
      this.speechBubble.classList.add("show");

      // 根據類型設定顯示時長
      let duration = 15000; // 預設 15 秒
      if (type === "collision") {
        duration = 3000; // 3 秒
      } else if (type === "encouragement") {
        duration = 10000; // 10 秒
      }

      setTimeout(() => {
        this.speechBubble.classList.remove("show");
      }, duration);
    }

    start() {
      if (!this.isMoving) {
        this.isMoving = true;
        this.container.classList.add("show");
        this.updateRandomDirection();
        this.showMessage("idle");

        // 每 25 秒檢查一次，隨機顯示鼓勵話 (例如 50% 機率)
        this.messageInterval = setInterval(() => {
          if (Math.random() < 0.5) {
            this.showMessage("encouragement");
          }
        }, 25000);
      }
    }

    stop() {
      this.isMoving = false;
      this.container.classList.remove("show");
      this.speechBubble.classList.remove("show");
      if (this.messageInterval) {
        clearInterval(this.messageInterval);
      }
    }

    updateRandomDirection() {
      const baseSpeed =
        this.options.minSpeed +
        Math.random() * (this.options.maxSpeed - this.options.minSpeed);
      const speed = this.isMobile ? baseSpeed * 0.5 : baseSpeed;

      if (this.isMobile) {
        // 手機版：垂直 + 水平明顯移動
        const margin = 100;
        let bias = 0;
        if (this.position.x < margin) {
          bias = 0.5;
        } else if (
          this.position.x >
          window.innerWidth - margin - parseInt(this.options.width) * this.scale
        ) {
          bias = -0.5;
        }
        this.velocity.y = (Math.random() < 0.5 ? -1 : 1) * speed;
        this.velocity.x = (Math.random() - 0.5 + bias) * speed * 0.3;
        const scaleX = this.velocity.x < 0 ? -1 : 1;
        this.player.style.transform = `scaleX(${scaleX})`;
      } else {
        // 桌機版：加大垂直範圍 => top 改成 0.4
        const currentDirection = Math.sign(this.velocity.x);
        const smallAngle = (Math.random() * Math.PI) / 8 - Math.PI / 16;
        const keepDirection = Math.random() < 0.95;
        if (keepDirection) {
          this.velocity.x = currentDirection * Math.cos(smallAngle) * speed;
        } else {
          this.velocity.x = -currentDirection * Math.cos(smallAngle) * speed;
          const scaleX = this.velocity.x < 0 ? -1 : 1;
          this.player.style.transform = `scaleX(${scaleX})`;
        }
        const verticalBias = 0.2;
        this.velocity.y = (Math.sin(smallAngle) + verticalBias) * speed * 0.3;
      }
    }

    animate() {
      if (this.isMoving) {
        // 將方向改變頻率再降低 => 使恐龍更平穩
        const changeFreq = this.isMobile ? 0.0005 : 0.002;
        if (Math.random() < changeFreq) {
          this.updateRandomDirection();
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        let bounds;
        if (this.isMobile) {
          // 手機版上下左右空間再大一點 => margin 20
          const margin = 20;
          bounds = {
            left: margin,
            right:
              window.innerWidth -
              margin -
              parseInt(this.options.width) * this.scale,
            top: margin,
            bottom:
              window.innerHeight * 0.8 -
              margin -
              parseInt(this.options.height) * this.scale,
          };
        } else {
          // 桌機版：把原本 top: 0.6 改成 0.4，增加垂直活動空間
          bounds = {
            left: 0,
            right:
              window.innerWidth - parseInt(this.options.width) * this.scale,
            top: window.innerHeight * 0.4,
            bottom:
              window.innerHeight - parseInt(this.options.height) * this.scale,
          };
        }

        // 碰撞處理：到達邊緣就翻轉
        let collided = false;
        // 左右
        if (this.position.x < bounds.left) {
          this.position.x = bounds.left;
          this.velocity.x *= -1;
          collided = true;
        } else if (this.position.x > bounds.right) {
          this.position.x = bounds.right;
          this.velocity.x *= -1;
          collided = true;
        }
        // 上下
        if (this.position.y < bounds.top) {
          this.position.y = bounds.top;
          this.velocity.y *= -1;
          collided = true;
        } else if (this.position.y > bounds.bottom) {
          this.position.y = bounds.bottom;
          this.velocity.y *= -1;
          collided = true;
        }

        if (collided) {
          this.targetScale = 0.95;
          // 碰撞或翻轉時，先檢查是否要顯示 collision 訊息（依 5% 機率）
          if (!this.speechBubble.classList.contains("show")) {
            this.showMessage("collision");
          }
          const scaleX = this.velocity.x < 0 ? -1 : 1;
          this.player.style.transform = `scaleX(${scaleX})`;
        } else {
          this.targetScale = 1;
        }

        // 平滑縮放
        this.scale += (this.targetScale - this.scale) * 0.1;

        // 更新容器位置與縮放
        this.container.style.left = `${this.position.x}px`;
        this.container.style.top = `${this.position.y}px`;
        this.wrapper.style.transform = `scale(${this.scale})`;
      }
      requestAnimationFrame(this.animate);
    }
  }

  // DOM 完成後自動初始化
  function initialize() {
    if (window.dinoRunner) return;
    const userConfig = window.DINO_CONFIG || {};
    window.dinoRunner = new DinoRunner(userConfig);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  window.DinoRunner = DinoRunner;
})();
