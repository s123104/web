(function () {
  // 檢查是否為 iOS 且非 standalone 模式
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }
  function isInStandaloneMode() {
    return "standalone" in window.navigator && window.navigator.standalone;
  }
  if (!isIOS() || isInStandaloneMode()) return;

  // 延遲後播放動畫（避免剛進入頁面就打擾用戶）
  window.addEventListener("load", function () {
    setTimeout(function () {
      showTutorial();
    }, 1000);
  });

  function showTutorial() {
    const modal = document.getElementById("addToHomeModal");
    if (!modal) return;
    modal.classList.add("show");

    // 0.5秒後顯示第一個箭頭（指向 Safari 的分享按鈕）
    const shareArrow = document.getElementById("shareArrow");
    setTimeout(() => {
      shareArrow.style.opacity = "1";
    }, 500);

    // 1.5秒後，開始模擬箭頭下滑（加入 swipeDown 動畫）
    setTimeout(() => {
      shareArrow.classList.add("swipe-down");
    }, 1500);

    // 2秒後，隱藏分享箭頭並顯示 Action Menu
    const actionMenu = document.getElementById("actionMenu");
    setTimeout(() => {
      shareArrow.style.opacity = "0";
      actionMenu.classList.add("show");
    }, 2000);

    // 2.5秒後，針對「加入主畫面」按鈕加上高亮動畫，並顯示第二個箭頭指向它
    const addToHomeButton = document.getElementById("addToHomeButton");
    const actionArrow = document.getElementById("actionArrow");
    setTimeout(() => {
      addToHomeButton.classList.add("highlight");
      actionArrow.classList.add("show");
    }, 2500);

    // 3.5秒後，隱藏動作選單與箭頭，顯示完成訊息
    const completionMsg = document.getElementById("completionMessage");
    setTimeout(() => {
      actionMenu.classList.remove("show");
      actionArrow.classList.remove("show");
      addToHomeButton.classList.remove("highlight");
      completionMsg.classList.add("show");
    }, 3500);

    // 4.5秒後，自動關閉模態窗並重置動畫
    setTimeout(() => {
      modal.classList.remove("show");
      shareArrow.style.opacity = "0";
      shareArrow.classList.remove("swipe-down");
      actionMenu.classList.remove("show");
      actionArrow.classList.remove("show");
      addToHomeButton.classList.remove("highlight");
      completionMsg.classList.remove("show");
    }, 4500);
  }
})();
