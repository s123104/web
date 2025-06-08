// Perplexity AI 網站互動功能腳本
// 版本: 1.0.0
// 創建日期: 2024

document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

/**
 * 網站初始化函數
 * 設定所有必要的事件監聽器和動畫效果
 */
function initializeWebsite() {
    setupScrollAnimations();
    setupSmoothScrolling();
    setupEasterEggSystem();
    setupToastNotifications();
    trackUserInteractions();
}

/**
 * 捲動動畫設定
 * 使用 Intersection Observer API 實現高效能的進場動畫
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 為所有卡片元素添加進場動畫
    const animatedElements = document.querySelectorAll('.feature-card, .step-card, .use-case-card, .stat-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/**
 * 平滑捲動功能設定
 * 為錨點連結提供流暢的導航體驗
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 複製兌換碼功能
 * 提供一鍵複製兌換碼的便利功能
 */
function copyRedeemCode() {
    const redeemCode = 'PPLXLIUMBLHOTVAJ2QI';
    
    navigator.clipboard.writeText(redeemCode).then(function() {
        showToast('兌換碼已複製到剪貼簿！', 'success');
    }, function(err) {
        console.warn('複製功能不可用，使用備用方法');
        // 備用複製方法
        fallbackCopyTextToClipboard(redeemCode);
    });
}

/**
 * 備用複製方法
 * 為不支援現代剪貼簿API的瀏覽器提供備用方案
 */
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('兌換碼已複製到剪貼簿！', 'success');
        } else {
            showToast('複製失敗，請手動複製兌換碼', 'error');
        }
    } catch (err) {
        showToast('複製失敗，請手動複製兌換碼', 'error');
    }
    
    document.body.removeChild(textArea);
}

/**
 * Toast 通知系統設定
 * 為用戶操作提供即時回饋
 */
function setupToastNotifications() {
    // Toast樣式已在CSS中定義，此函數負責動態創建和管理
}

/**
 * 顯示 Toast 通知
 * @param {string} message - 要顯示的訊息
 * @param {string} type - 通知類型 ('success', 'error', 'info')
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'info': 'fas fa-info-circle'
    };
    
    toast.innerHTML = `<i class="${iconMap[type]} mr-2"></i>${message}`;
    
    document.body.appendChild(toast);
    
    // 觸發進入動畫
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // 自動移除通知
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

/**
 * 彩蛋系統設定
 * 為網站添加趣味互動元素
 */
function setupEasterEggSystem() {
    window.easterEggClicks = 0;
    window.easterEggActive = false;
    window.clickResetTimer = null;
    
    setupKonamiCode();
}

/**
 * 彩蛋觸發函數
 * 處理彩蛋按鈕的點擊邏輯
 */
function triggerEasterEgg() {
    // 防止在彩蛋激活期間重複觸發
    if (window.easterEggActive) {
        return;
    }
    
    window.easterEggClicks++;
    
    // 清除之前的重置計時器
    if (window.clickResetTimer) {
        clearTimeout(window.clickResetTimer);
    }
    
    if (window.easterEggClicks === 3) {
        activateEasterEgg();
        window.easterEggClicks = 0; // 立即重置計數器
    } else if (window.easterEggClicks < 3) {
        showToast(`再點擊 ${3 - window.easterEggClicks} 次解鎖隱藏功能！`, 'info');
        
        // 設置重置計時器
        window.clickResetTimer = setTimeout(() => {
            window.easterEggClicks = 0;
            window.clickResetTimer = null;
        }, 3000);
    }
}

/**
 * 啟動彩蛋效果
 * 執行完整的彩蛋動畫序列
 */
function activateEasterEgg() {
    window.easterEggActive = true;
    
    // 執行彩蛋效果序列
    createConfettiEffect();
    showEasterEggModal();
    applyTemporaryColorFilter();
    playAchievementSound();
    
    // 五秒後恢復正常狀態
    setTimeout(() => {
        document.body.style.filter = '';
        window.easterEggActive = false;
        window.easterEggClicks = 0;
    }, 5000);
}

/**
 * 創建彩紙效果
 * 生成視覺上吸引人的慶祝動畫
 */
function createConfettiEffect() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (document.body.contains(confetti)) {
                document.body.removeChild(confetti);
            }
        }, 5000);
    }
}

/**
 * 顯示彩蛋模態視窗
 * 展示隱藏成就的獲得訊息
 */
function showEasterEggModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center transform scale-0 transition-transform duration-500" style="animation: scaleIn 0.5s ease forwards;">
            <div class="text-6xl mb-4">🎉</div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">恭喜發現隱藏彩蛋！</h3>
            <p class="text-gray-600 mb-6">您獲得了專屬稱號：「Perplexity 探索者」！</p>
            <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold mb-4">
                🏆 隱藏成就已解鎖
            </div>
            <button onclick="closeEasterEggModal()" class="bg-perplexity-500 hover:bg-perplexity-600 text-white px-6 py-2 rounded-full transition-colors duration-200">
                太棒了！
            </button>
        </div>
    `;
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeEasterEggModal();
        }
    };
    
    document.body.appendChild(modal);
    window.easterEggModal = modal;
}

/**
 * 關閉彩蛋模態視窗
 */
function closeEasterEggModal() {
    if (window.easterEggModal) {
        document.body.removeChild(window.easterEggModal);
        window.easterEggModal = null;
    }
}

/**
 * 應用臨時色彩濾鏡
 * 為彩蛋效果添加視覺變化
 */
function applyTemporaryColorFilter() {
    document.body.style.filter = 'hue-rotate(45deg)';
}

/**
 * 播放成就音效
 * 使用 Web Audio API 創建音效回饋
 */
function playAchievementSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('音頻不受支援或已被阻止');
    }
}

/**
 * 設定 Konami Code 彩蛋
 * 為鍵盤操作者提供隱藏功能
 */
function setupKonamiCode() {
    let konami = [];
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

    document.addEventListener('keydown', function(e) {
        konami.push(e.code);
        if (konami.length > konamiCode.length) {
            konami.shift();
        }
        
        if (konami.length === konamiCode.length && konami.every((key, i) => key === konamiCode[i])) {
            showToast('🎮 Konami Code 已啟動！您真是個復古遊戲迷！', 'success');
            document.body.style.animation = 'bounceAnimation 1s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 1000);
            konami = [];
        }
    });
}

/**
 * 用戶互動追蹤
 * 記錄重要的用戶行為以便分析
 */
function trackUserInteractions() {
    // 追蹤兌換連結點擊
    document.addEventListener('click', function(e) {
        if (e.target.closest('a[href*="perplexity.ai"]')) {
            trackUserInteraction('clicked_redeem_link');
        }
        if (e.target.closest('[onclick*="copyRedeemCode"]')) {
            trackUserInteraction('copied_redeem_code');
        }
        if (e.target.closest('.easter-egg-btn')) {
            trackUserInteraction('clicked_easter_egg');
        }
    });
    
    // 追蹤捲動深度
    trackScrollDepth();
}

/**
 * 記錄用戶互動事件
 * @param {string} action - 用戶執行的動作
 */
function trackUserInteraction(action) {
    const timestamp = new Date().toISOString();
    console.log(`用戶動作: ${action} 於 ${timestamp}`);
    
    // 在實際部署時，此處可整合 Google Analytics 或其他分析工具
    // 例如：gtag('event', action, { timestamp: timestamp });
}

/**
 * 追蹤捲動深度
 * 測量用戶在頁面上的參與程度
 */
function trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];
    const trackedMilestones = new Set();
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    trackUserInteraction(`scroll_depth_${milestone}%`);
                }
            });
        }
    });
}

/**
 * 檢測瀏覽器功能支援
 * 確保在不同環境下的相容性
 */
function detectBrowserFeatures() {
    const features = {
        clipboard: navigator.clipboard && navigator.clipboard.writeText,
        webAudio: window.AudioContext || window.webkitAudioContext,
        intersectionObserver: window.IntersectionObserver,
        smoothScroll: 'scrollBehavior' in document.documentElement.style
    };
    
    return features;
}

/**
 * 效能優化函數
 * 延遲載入非關鍵功能以提升初始載入速度
 */
function optimizePerformance() {
    // 延遲載入 Threads 嵌入腳本
    setTimeout(() => {
        if (document.querySelector('.threads-embed')) {
            loadThreadsScript();
        }
    }, 2000);
}

/**
 * 載入 Threads 嵌入腳本
 * 動態載入第三方腳本以避免阻塞主要內容
 */
function loadThreadsScript() {
    if (!document.querySelector('script[src*="threads.com/embed.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.threads.com/embed.js';
        script.async = true;
        document.head.appendChild(script);
    }
}

// 全域函數暴露
window.copyRedeemCode = copyRedeemCode;
window.triggerEasterEgg = triggerEasterEgg;
window.closeEasterEggModal = closeEasterEggModal;

// 效能優化執行
optimizePerformance();