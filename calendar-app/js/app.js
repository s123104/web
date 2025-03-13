// 初始化 DayJS
dayjs.locale("zh-tw");

// 初始化 Dexie
const db = new Dexie("CalendarApp");
db.version(1).stores({
  events:
    "++id, title, date, type, location, startTime, endTime, endDate, notes, created",
});

// DOM 元素
const calendarGrid = document.getElementById("calendarGrid");
const monthYearTitle = document.getElementById("monthYearTitle");
const currentMonthYear = document.getElementById("currentMonthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const addEventBtn = document.getElementById("addEventBtn");
const eventModal = document.getElementById("eventModal");
const closeModalBtn = document.getElementById("closeModal");
const cancelEventBtn = document.getElementById("cancelEventBtn");
const eventForm = document.getElementById("eventForm");
const adContainer = document.getElementById("adContainer");
const closeAdBtn = document.getElementById("closeAd");
const holidaySettingsBtn = document.getElementById("holidaySettingsBtn");
const closeSettingsBtn = document.getElementById("closeSettings");
const holidaySettings = document.getElementById("holidaySettings");

// 當前日期
let currentDate = dayjs();
let selectedDate = currentDate;

// 初始化日曆
function initCalendar() {
  renderCalendarWithHolidays();
  loadEvents();

  // 添加事件監聽器
  prevMonthBtn.addEventListener("click", () => {
    currentDate = currentDate.subtract(1, "month");
    renderCalendarWithHolidays();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate = currentDate.add(1, "month");
    renderCalendarWithHolidays();
  });

  addEventBtn.addEventListener("click", openEventModal);
  closeModalBtn.addEventListener("click", closeEventModal);
  cancelEventBtn.addEventListener("click", closeEventModal);
  eventForm.addEventListener("submit", saveEvent);

  if (closeAdBtn && adContainer) {
    closeAdBtn.addEventListener("click", () => {
      adContainer.classList.add("hidden");
    });
  }

  // 假期設置事件監聽器
  holidaySettingsBtn.addEventListener("click", toggleHolidaySettings);
  closeSettingsBtn.addEventListener("click", toggleHolidaySettings);

  // 假期顯示切換監聽器
  document
    .getElementById("showNationalHolidays")
    .addEventListener("change", updateHolidayDisplay);
  document
    .getElementById("showLunarHolidays")
    .addEventListener("change", updateHolidayDisplay);
  document
    .getElementById("showMakeupWorkdays")
    .addEventListener("change", updateHolidayDisplay);
  document
    .getElementById("showAdjustmentHolidays")
    .addEventListener("change", updateHolidayDisplay);

  // 從本地存儲加載假期設置
  loadHolidaySettings();

  // 5秒後隱藏廣告
  if (adContainer) {
    setTimeout(() => {
      adContainer.classList.add("hidden");
    }, 5000);
  }

  // 初始化 service worker 用於 PWA
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((reg) => console.log("Service Worker registered", reg))
      .catch((err) => console.log("Service Worker registration failed", err));
  }

  // 初始化日曆增強功能
  initCalendarEnhancements();
}

// 渲染日曆網格
function renderCalendar() {
  // 更新頭部標題
  const formattedMonthYear = currentDate.format("YYYY年M月");
  monthYearTitle.textContent = formattedMonthYear;
  currentMonthYear.textContent = formattedMonthYear;

  // 清空網格
  calendarGrid.innerHTML = "";

  // 獲取月份的第一天和總天數
  const firstDayOfMonth = currentDate.startOf("month");
  const daysInMonth = currentDate.daysInMonth();
  const startingDayOfWeek = firstDayOfMonth.day(); // 0是星期日

  // 獲取上個月的日期
  const prevMonth = currentDate.subtract(1, "month");
  const daysInPrevMonth = prevMonth.daysInMonth();

  // 添加上個月的日期
  for (let i = 0; i < startingDayOfWeek; i++) {
    const dayNumber = daysInPrevMonth - startingDayOfWeek + i + 1;
    const dateString = prevMonth.date(dayNumber).format("YYYY-MM-DD");

    const dayElement = createDayElement(dayNumber, dateString, "empty-day");

    const subText = document.createElement("div");
    subText.className = "day-subtext";
    subText.textContent = prevMonth.date(dayNumber).format("M/D");
    dayElement.querySelector(".date-info").appendChild(subText);

    calendarGrid.appendChild(dayElement);
  }

  // 添加當前月份的日期
  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = currentDate.date(i);
    const dateString = dateObj.format("YYYY-MM-DD");
    const isToday =
      dateObj.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
    const isSelected =
      dateObj.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD");
    const dayOfWeek = dateObj.day();

    const dayElement = createDayElement(i, dateString);

    // 根據星期添加類
    if (dayOfWeek === 0) dayElement.classList.add("sunday");
    if (dayOfWeek === 6) dayElement.classList.add("saturday");

    // 添加月/日子文本
    const subText = document.createElement("div");
    subText.className = "day-subtext";
    subText.textContent = dateObj.format("M/D");
    dayElement.querySelector(".date-info").appendChild(subText);

    // 添加適當的類
    if (isToday) dayElement.classList.add("today");
    if (isSelected) dayElement.classList.add("selected-day");

    calendarGrid.appendChild(dayElement);
  }

  // 添加下個月的日期
  const totalCells = 42; // 6行每行7天
  const remainingCells = totalCells - (startingDayOfWeek + daysInMonth);

  const nextMonth = currentDate.add(1, "month");

  for (let i = 1; i <= remainingCells; i++) {
    const dateString = nextMonth.date(i).format("YYYY-MM-DD");

    const dayElement = createDayElement(i, dateString, "empty-day");

    const subText = document.createElement("div");
    subText.className = "day-subtext";
    subText.textContent = nextMonth.date(i).format("M/D");
    dayElement.querySelector(".date-info").appendChild(subText);

    calendarGrid.appendChild(dayElement);
  }
}

// 渲染日曆並應用假期
function renderCalendarWithHolidays() {
  renderCalendar();

  // 應用台灣假期
  const year = currentDate.year();
  const month = currentDate.month() + 1; // dayjs 的月份從 0 開始
  TaiwanHolidays.applyHolidaysToCalendar(calendarGrid, year, month);

  // 處理跨日事件
  setTimeout(() => {
    processMultiDayEvents();
  }, 100);
}

// 創建日期元素
function createDayElement(dayNumber, dateString, extraClass = "") {
  const dayElement = document.createElement("div");
  dayElement.className = `calendar-day ${extraClass}`;
  dayElement.dataset.date = dateString;

  // 創建日期信息容器
  const dateInfoContainer = document.createElement("div");
  dateInfoContainer.className = "date-info";

  const numberElement = document.createElement("div");
  numberElement.className = "day-number";
  numberElement.textContent = dayNumber;
  dateInfoContainer.appendChild(numberElement);

  // 添加日期信息容器到日期元素
  dayElement.appendChild(dateInfoContainer);

  // 創建事件標籤容器
  const eventTagsContainer = document.createElement("div");
  eventTagsContainer.className = "event-tags";
  dayElement.appendChild(eventTagsContainer);

  // 為日期添加點擊事件
  if (!extraClass.includes("empty-day")) {
    dayElement.addEventListener("click", () => {
      // 移除所有日期的選中類
      document.querySelectorAll(".calendar-day").forEach((day) => {
        day.classList.remove("selected-day");
      });

      // 為點擊的日期添加選中類
      dayElement.classList.add("selected-day");

      // 更新選中的日期
      selectedDate = dayjs(dateString);

      // 顯示選中日期的事件
      loadEventsForDateWithHolidays(dateString);
    });
  }

  return dayElement;
}

// 加載事件
async function loadEvents() {
  try {
    const events = await db.events.toArray();

    // 標記有事件的日期
    events.forEach((event) => {
      const dayElement = document.querySelector(
        `.calendar-day[data-date="${event.date}"]`
      );
      if (dayElement && !dayElement.classList.contains("has-event")) {
        dayElement.classList.add("has-event");

        // 如果不是跨日事件，添加單日事件標籤
        if (!event.endDate || event.endDate === event.date) {
          addEventTagToDay(dayElement, event);
        }
      }
    });

    // 顯示當前日期的事件
    loadEventsForDateWithHolidays(selectedDate.format("YYYY-MM-DD"));
  } catch (error) {
    console.error("Error loading events:", error);
  }
}

// 添加事件標籤到日期格
function addEventTagToDay(dayElement, event) {
  const eventTagsContainer = dayElement.querySelector(".event-tags");
  if (!eventTagsContainer) return;

  // 最多顯示3個標籤
  const existingTags = eventTagsContainer.querySelectorAll(".event-tag");
  if (existingTags.length >= 3) {
    // 檢查是否已經有溢出指示器
    if (!eventTagsContainer.querySelector(".event-overflow-indicator")) {
      const overflowIndicator = document.createElement("div");
      overflowIndicator.className = "event-overflow-indicator";
      overflowIndicator.textContent = "還有更多...";
      eventTagsContainer.appendChild(overflowIndicator);
    }
    return;
  }

  const eventTag = document.createElement("div");
  eventTag.className = `event-tag ${event.type || "other"}`;
  eventTag.textContent = event.title;

  // 讓點擊事件標籤也能打開事件詳情
  eventTag.addEventListener("click", (e) => {
    e.stopPropagation();
    loadEventsForDateWithHolidays(event.date);
  });

  eventTagsContainer.appendChild(eventTag);
}

// 處理跨日事件顯示
async function processMultiDayEvents() {
  try {
    // 獲取所有事件
    const events = await db.events.toArray();

    // 過濾出跨日事件（有 endDate 屬性）
    const multiDayEvents = events.filter(
      (event) => event.endDate && event.endDate !== event.date
    );

    // 為每個跨日事件創建視覺顯示
    multiDayEvents.forEach((event) => {
      // 計算開始和結束日期
      const startDate = dayjs(event.date);
      const endDate = dayjs(event.endDate);

      // 檢查是否在當前顯示的月份
      const currentMonthStart = currentDate.startOf("month");
      const currentMonthEnd = currentDate.endOf("month");

      // 如果事件不在當前月份範圍內，跳過
      if (
        endDate.isBefore(currentMonthStart) ||
        startDate.isAfter(currentMonthEnd)
      ) {
        return;
      }

      // 計算當前月份中的事件持續天數
      const visibleStartDate = startDate.isBefore(currentMonthStart)
        ? currentMonthStart
        : startDate;
      const visibleEndDate = endDate.isAfter(currentMonthEnd)
        ? currentMonthEnd
        : endDate;
      const dayDiff = visibleEndDate.diff(visibleStartDate, "day") + 1;

      // 獲取配色
      let eventClass = event.type || "other";

      // 為每一天創建或更新事件標籤
      for (let i = 0; i < dayDiff; i++) {
        const currentDay = visibleStartDate.add(i, "day");
        const dateString = currentDay.format("YYYY-MM-DD");
        const dayElement = document.querySelector(
          `.calendar-day[data-date="${dateString}"]`
        );

        if (!dayElement) continue;

        // 判斷是開始、中間還是結束日期
        const isStart = currentDay.isSame(startDate, "day");
        const isEnd = currentDay.isSame(endDate, "day");
        let positionClass = "";

        if (isStart && isEnd) {
          positionClass = ""; // 單日事件，不需要特殊類
        } else if (isStart) {
          positionClass = "start";
        } else if (isEnd) {
          positionClass = "end";
        } else {
          positionClass = "middle";
        }

        // 創建事件標籤
        const eventTag = document.createElement("div");
        eventTag.className = `multi-day-event ${positionClass} ${eventClass}`;
        eventTag.textContent = isStart ? event.title : ""; // 只在開始日顯示標題

        // 計算寬度（如果不是起始日，則隱藏）
        if (!isStart) {
          eventTag.style.visibility = "hidden";
        }

        // 讓點擊事件標籤也能打開事件詳情
        eventTag.addEventListener("click", (e) => {
          e.stopPropagation();
          loadEventsForDateWithHolidays(event.date);
        });

        // 將標籤添加到日期元素
        dayElement.appendChild(eventTag);

        // 標記該日期有事件
        dayElement.classList.add("has-event");
      }

      // 計算並設置跨日事件的寬度
      const firstDayElement = document.querySelector(
        `.calendar-day[data-date="${startDate.format("YYYY-MM-DD")}"]`
      );
      if (!firstDayElement) return;

      const multiDayTag = firstDayElement.querySelector(".multi-day-event");
      if (!multiDayTag) return;

      // 計算每個日期格子的寬度加間距
      const cellWidth = firstDayElement.offsetWidth;
      const cellGap = 4; // 間距

      // 檢查這個事件是否跨週
      // 取得日期在所在週的位置 (0=週日，1=週一，...)
      const dayOfWeek = startDate.day();
      // 計算從開始日期到本週最後一天(週六)的天數
      const daysUntilEndOfWeek = 6 - dayOfWeek;

      // 如果事件長度超過本週剩餘天數，則只顯示到本週末
      const visibleDays = Math.min(dayDiff, daysUntilEndOfWeek + 1);

      // 設置標籤寬度 (單元格寬度 * 顯示天數 - 一些間距)
      if (dayDiff > 1) {
        multiDayTag.style.width = `${cellWidth * visibleDays - cellGap * 2}px`;
      }
    });
  } catch (error) {
    console.error("Error processing multi-day events:", error);
  }
}

// 加載特定日期的事件與假期
async function loadEventsForDateWithHolidays(dateString) {
  try {
    // 檢查是否為假日
    const holiday = TaiwanHolidays.getHolidayForDate(dateString);

    // 獲取該日的事件
    let events = await db.events.where("date").equals(dateString).toArray();

    // 獲取以該日為結束日的跨日事件
    const endDateEvents = await db.events
      .filter(
        (event) =>
          event.endDate &&
          event.endDate === dateString &&
          event.date !== dateString
      )
      .toArray();

    // 合併所有涉及該日期的事件
    events = [...events, ...endDateEvents];

    // 更新事件容器
    const eventsContainer = document.getElementById("eventsContainer");
    const formattedDate = dayjs(dateString).format("YYYY年MM月DD日");

    // 顯示事件區塊
    const eventsSection = document.querySelector(".events-section");
    if (eventsSection) {
      eventsSection.style.display = "block";
    }

    // 頭部，包含假日標記
    let html = `
            <h2 class="events-title">${formattedDate} 行程`;

    // 如果是假日，在標題中添加假日名稱
    if (holiday) {
      html += ` <span class="holiday-title" style="color:${holiday.color};">(${holiday.name})</span>`;
    }

    html += `</h2>
            <div class="events-list">
        `;

    // 如果是假日且沒有自定義事件，優先顯示假日事件
    if (holiday && events.length === 0) {
      const typeClass = holiday.type;

      html += `
                <div class="event-card" style="border-left-color: ${holiday.color};">
                    <div class="event-header">
                        <span class="event-date">${formattedDate}</span>
                        <span class="event-type ${typeClass}">${holiday.name}</span>
                    </div>
                    <h3 class="event-title">${holiday.name}</h3>
                    <div class="event-details">
                        <div class="event-details-item">
                            <i class="fa-solid fa-calendar"></i>
                            <span>全天</span>
                        </div>
                    </div>
                </div>
            `;
    } else if (events.length > 0) {
      // 顯示用戶事件
      events.forEach((event) => {
        let typeClass = "";
        let typeName = "";
        let typeColor = "";

        switch (event.type) {
          case "meeting":
            typeClass = "meeting";
            typeName = "會議";
            typeColor = "#3949ab";
            break;
          case "training":
            typeClass = "training";
            typeName = "培訓";
            typeColor = "#7b1fa2";
            break;
          case "holiday":
            typeClass = "holiday";
            typeName = "休假";
            typeColor = "#c2185b";
            break;
          default:
            typeClass = "other";
            typeName = "其他";
            typeColor = "#455a64";
        }

        let timeInfo = "";
        if (event.isAllDay) {
          timeInfo = `<div class="event-details-item"><i class="fa-solid fa-calendar"></i><span>全天</span></div>`;
        } else {
          timeInfo = `<div class="event-details-item"><i class="fa-solid fa-clock"></i><span>${
            event.startTime || ""
          } ${event.endTime ? "- " + event.endTime : ""}</span></div>`;
        }

        let dateDisplay = dayjs(event.date).format("M月D日");
        if (event.endDate) {
          dateDisplay += ` - ${dayjs(event.endDate).format("M月D日")}`;
        }

        html += `
                    <div class="event-card" style="border-left-color: ${typeColor};">
                        <div class="event-header">
                            <span class="event-date">${dateDisplay}</span>
                            <span class="event-type ${typeClass}">${typeName}</span>
                        </div>
                        <h3 class="event-title">${event.title}</h3>
                        <div class="event-details">
                            ${timeInfo}
                            ${
                              event.location
                                ? `<div class="event-details-item"><i class="fa-solid fa-map-marker-alt"></i><span>${event.location}</span></div>`
                                : ""
                            }
                            ${
                              event.notes
                                ? `<div class="event-details-item"><i class="fa-solid fa-sticky-note"></i><span>${event.notes}</span></div>`
                                : ""
                            }
                        </div>
                    </div>
                `;
      });
    } else {
      // 如果沒有事件和假日，顯示空狀態
      html += `
                <div class="empty-events">
                    <i class="fa-solid fa-calendar-xmark"></i>
                    <p>今天沒有安排的行程</p>
                    <button id="addNewEventBtn" class="btn btn-primary">
                        新增行程
                    </button>
                </div>
            `;
    }

    html += "</div>";

    // 更新容器
    eventsContainer.innerHTML = html;

    // 為新增事件按鈕添加事件監聽器
    const addNewEventBtn = document.getElementById("addNewEventBtn");
    if (addNewEventBtn) {
      addNewEventBtn.addEventListener("click", openEventModal);
    }
  } catch (error) {
    console.error("Error loading events for date:", error);
  }
}

// 打開事件模態框
function openEventModal(dateString) {
  eventModal.style.display = "flex";

  // 將默認日期設置為選中的日期
  const eventDateInput = document.getElementById("eventDate");
  if (typeof dateString === "string") {
    eventDateInput.value = dateString;
  } else {
    eventDateInput.value = selectedDate.format("YYYY-MM-DD");
  }

  // 設置默認時間
  const startTimeInput = document.getElementById("eventStartTime");
  const endTimeInput = document.getElementById("eventEndTime");
  startTimeInput.value = "09:00";
  endTimeInput.value = "10:00";

  // 聚焦標題輸入框
  setTimeout(() => {
    document.getElementById("eventTitle").focus();
  }, 100);
}

// 關閉事件模態框
function closeEventModal() {
  eventModal.style.display = "none";
  eventForm.reset();
}

// 保存事件
async function saveEvent(e) {
  e.preventDefault();

  const formData = new FormData(eventForm);
  const eventData = {
    title: formData.get("eventTitle"),
    date: formData.get("eventDate"),
    type: formData.get("eventType"),
    location: formData.get("eventLocation"),
    startTime: formData.get("eventStartTime"),
    endTime: formData.get("eventEndTime"),
    notes: formData.get("eventNotes"),
    created: new Date(),
  };

  // 如果有跨日選項
  const multiDayToggle = document.getElementById("multiDayToggle");
  if (multiDayToggle && multiDayToggle.checked) {
    const endDateValue = formData.get("eventEndDate");
    if (endDateValue) {
      eventData.endDate = endDateValue;

      // 驗證結束日期在開始日期之後
      if (dayjs(endDateValue).isBefore(dayjs(eventData.date))) {
        alert("結束日期必須在開始日期之後");
        return;
      }
    }
  }

  // 驗證必填字段
  if (!eventData.title || !eventData.date) {
    alert("請填寫標題和日期");
    return;
  }

  try {
    // 保存到數據庫
    await db.events.add(eventData);

    // 關閉模態框
    closeEventModal();

    // 重新渲染日曆以顯示新事件
    renderCalendarWithHolidays();

    // 重新加載該日的事件
    loadEventsForDateWithHolidays(eventData.date);
  } catch (error) {
    console.error("Error saving event:", error);
    alert("儲存行程時發生錯誤，請稍後再試");
  }
}

// 切換假期設置面板
function toggleHolidaySettings() {
  if (holidaySettings.style.display === "block") {
    holidaySettings.style.display = "none";
  } else {
    holidaySettings.style.display = "block";
  }
}

// 更新假期顯示
function updateHolidayDisplay() {
  const showNational = document.getElementById("showNationalHolidays").checked;
  const showLunar = document.getElementById("showLunarHolidays").checked;
  const showMakeup = document.getElementById("showMakeupWorkdays").checked;
  const showAdjustment = document.getElementById(
    "showAdjustmentHolidays"
  ).checked;

  // 保存設置到本地存儲
  localStorage.setItem(
    "holidaySettings",
    JSON.stringify({
      showNational,
      showLunar,
      showMakeup,
      showAdjustment,
    })
  );

  // 重新渲染日曆以應用新設置
  renderCalendarWithHolidays();

  // 更新事件顯示
  loadEventsForDateWithHolidays(selectedDate.format("YYYY-MM-DD"));
}

// 從本地存儲加載假期設置
function loadHolidaySettings() {
  const savedSettings = localStorage.getItem("holidaySettings");
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);

    document.getElementById("showNationalHolidays").checked =
      settings.showNational;
    document.getElementById("showLunarHolidays").checked = settings.showLunar;
    document.getElementById("showMakeupWorkdays").checked = settings.showMakeup;
    document.getElementById("showAdjustmentHolidays").checked =
      settings.showAdjustment;
  }
}

// 日曆格式化與互動增強功能
function initCalendarEnhancements() {
  // 確保日曆網格顯示正確
  ensureCalendarGridLayout();

  // 強化日曆日期點擊與長按事件
  setupCalendarInteractions();

  // 增加跨日事件支持
  enhanceMultiDayEvents();

  // 優化日曆格子的響應式布局
  handleCalendarResponsiveLayout();

  // 增加農曆日期顯示功能
  addLunarDateSupport();
}

// 確保日曆網格布局正確
function ensureCalendarGridLayout() {
  const calendarGrid = document.getElementById("calendarGrid");
  if (!calendarGrid) return;

  // 強制設置網格布局
  calendarGrid.style.display = "grid";
  calendarGrid.style.gridTemplateColumns = "repeat(7, 1fr)";

  // 計算最佳高度
  adjustCalendarHeight();

  // 窗口尺寸改變時重新調整
  window.addEventListener("resize", adjustCalendarHeight);
}

// 動態調整日曆高度
function adjustCalendarHeight() {
  const calendarGrid = document.getElementById("calendarGrid");
  if (!calendarGrid) return;

  const headerHeight = document.querySelector(".header")?.offsetHeight || 0;
  const monthNavHeight =
    document.querySelector(".month-nav")?.offsetHeight || 0;
  const weekdayHeadersHeight =
    document.querySelector(".weekday-headers")?.offsetHeight || 0;
  const tabMenuHeight = document.querySelector(".tab-menu")?.offsetHeight || 0;

  // 計算可用高度
  const availableHeight =
    window.innerHeight -
    headerHeight -
    monthNavHeight -
    weekdayHeadersHeight -
    tabMenuHeight -
    20;

  // 設置最大高度
  calendarGrid.style.maxHeight = `${availableHeight}px`;
}

// 設置日曆互動功能
function setupCalendarInteractions() {
  // 處理長按事件
  setupLongPressEvents();
}

// 長按事件設置
function setupLongPressEvents() {
  let pressTimer;
  const calendarDays = document.querySelectorAll(
    ".calendar-day:not(.empty-day)"
  );

  calendarDays.forEach((day) => {
    // 長按開始
    day.addEventListener("touchstart", function (e) {
      pressTimer = setTimeout(function () {
        day.classList.add("long-press");
        // 直接打開添加事件模態框
        openEventModal(day.dataset.date);
      }, 800);
    });

    // 觸摸移動取消長按
    day.addEventListener("touchmove", function (e) {
      clearTimeout(pressTimer);
    });

    // 觸摸結束取消長按狀態
    day.addEventListener("touchend", function (e) {
      clearTimeout(pressTimer);
      day.classList.remove("long-press");
    });
  });
}

// 增強跨日事件支持
function enhanceMultiDayEvents() {
  // 找到行程表單並添加跨日選擇功能
  const eventForm = document.getElementById("eventForm");
  if (!eventForm) return;

  // 檢查是否已有跨日元素
  if (!document.getElementById("multiDayToggle")) {
    const eventEndTimeGroup =
      document.querySelector("#eventEndTime")?.parentElement;
    if (!eventEndTimeGroup) return;

    // 添加跨日切換控件
    const multiDayDiv = document.createElement("div");
    multiDayDiv.className = "form-group";
    multiDayDiv.innerHTML = `
    <label class="toggle-label">
      <input type="checkbox" id="multiDayToggle" />
      <span class="toggle-checkbox"></span>
      <span class="toggle-text">跨日行程</span>
    </label>
  `;
    eventEndTimeGroup.insertAdjacentElement("afterend", multiDayDiv);

    // 添加結束日期選擇器
    const eventEndDateGroup = document.createElement("div");
    eventEndDateGroup.className = "form-group";
    eventEndDateGroup.id = "eventEndDateGroup";
    eventEndDateGroup.style.display = "none";
    eventEndDateGroup.innerHTML = `
    <label class="form-label" for="eventEndDate">結束日期</label>
    <input class="form-input" id="eventEndDate" name="eventEndDate" type="date" />
  `;
    multiDayDiv.insertAdjacentElement("afterend", eventEndDateGroup);

    // 切換跨日顯示
    document
      .getElementById("multiDayToggle")
      .addEventListener("change", function () {
        eventEndDateGroup.style.display = this.checked ? "block" : "none";

        // 當啟用跨日時，自動設置結束日期為開始日期
        if (this.checked) {
          const startDate = document.getElementById("eventDate").value;
          if (startDate) {
            document.getElementById("eventEndDate").value = startDate;
          }
        }
      });
  }
}

// 優化日曆響應式布局
function handleCalendarResponsiveLayout() {
  function updateLayout() {
    const calendarDays = document.querySelectorAll(".calendar-day");
    const isMobile = window.innerWidth <= 480;

    calendarDays.forEach((day) => {
      // 動態調整日期單元格內容
      if (isMobile) {
        // 移動設備優化：簡化顯示
        const indicator = day.querySelector(".holiday-indicator");
        if (indicator) {
          indicator.style.fontSize = "0.6rem";
          // 截斷長假日名稱
          if (indicator.textContent.length > 4) {
            indicator.title = indicator.textContent;
            indicator.textContent =
              indicator.textContent.substring(0, 4) + "..";
          }
        }

        // 調整事件標籤寬度
        const multiDayEvent = day.querySelector(".multi-day-event");
        if (multiDayEvent) {
          const originalWidth = multiDayEvent.style.width;
          if (originalWidth) {
            // 在移動設備上調整寬度以適應較小的屏幕
            const width = parseInt(originalWidth);
            if (!isNaN(width)) {
              multiDayEvent.style.width = `${width * 0.9}px`;
            }
          }
        }
      } else {
        // 桌面設備：恢復正常顯示
        const indicator = day.querySelector(".holiday-indicator");
        if (indicator && indicator.title) {
          indicator.textContent = indicator.title;
        }
      }
    });
  }

  // 初始運行
  updateLayout();

  // 窗口大小變化時更新
  window.addEventListener("resize", updateLayout);
}

// 添加農曆日期顯示支持
function addLunarDateSupport() {
  // 如果存在農曆數據，則顯示農曆日期
  if (typeof TaiwanHolidays !== "undefined") {
    const calendarDays = document.querySelectorAll(
      ".calendar-day:not(.empty-day)"
    );

    calendarDays.forEach((day) => {
      const dateString = day.dataset.date;
      if (!dateString) return;

      // 獲取該日期的農曆信息
      const holiday = TaiwanHolidays.getHolidayForDate(dateString);

      // 如果是農曆假日，顯示農曆日期
      if (holiday && holiday.type === "lunar") {
        // 若無農曆日期顯示元素，則創建
        if (!day.querySelector(".lunar-date")) {
          const lunarDate = document.createElement("div");
          lunarDate.className = "lunar-date";
          lunarDate.textContent = holiday.name.replace(/節.*$/, "");

          // 插入到日期信息容器中
          const dateInfo = day.querySelector(".date-info");
          if (dateInfo) {
            dateInfo.appendChild(lunarDate);
          }
        }
      }
    });
  }
}

// 事件監聽器安全添加機制
const existingListeners = new WeakMap();
function safeAddEventListener(element, type, listener) {
  if (!element) return;

  if (!existingListeners.has(element)) {
    existingListeners.set(element, new Map());
  }

  const listenersMap = existingListeners.get(element);

  if (!listenersMap.has(type)) {
    listenersMap.set(type, new Set());
  }

  const listeners = listenersMap.get(type);

  if (!listeners.has(listener)) {
    element.addEventListener(type, listener);
    listeners.add(listener);
  }
}

// 删除事件功能
async function deleteEvent(eventId) {
  if (!eventId) return;

  if (confirm("確定要刪除此行程嗎？")) {
    try {
      // 從數據庫中刪除事件
      await db.events.delete(eventId);

      // 重新渲染日曆
      renderCalendarWithHolidays();

      // 更新當前選中日期的事件顯示
      loadEventsForDateWithHolidays(selectedDate.format("YYYY-MM-DD"));

      alert("行程已成功刪除");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("刪除行程時發生錯誤，請稍後再試");
    }
  }
}

// 添加编辑事件功能
function editEvent(eventId) {
  if (!eventId) return;

  // 打開模態框
  openEventModal();

  // 設置模態框標題為編輯模式
  document.querySelector(".modal-title").textContent = "編輯行程";

  // 获取事件数据并填充表单
  db.events.get(eventId).then((event) => {
    if (!event) return;

    // 填充表單字段
    document.getElementById("eventTitle").value = event.title || "";
    document.getElementById("eventDate").value = event.date || "";
    document.getElementById("eventType").value = event.type || "other";
    document.getElementById("eventLocation").value = event.location || "";
    document.getElementById("eventStartTime").value = event.startTime || "";
    document.getElementById("eventEndTime").value = event.endTime || "";
    document.getElementById("eventNotes").value = event.notes || "";

    // 處理跨日事件
    const multiDayToggle = document.getElementById("multiDayToggle");
    if (multiDayToggle && event.endDate) {
      multiDayToggle.checked = true;

      // 顯示結束日期欄位
      const eventEndDateGroup = document.getElementById("eventEndDateGroup");
      if (eventEndDateGroup) {
        eventEndDateGroup.style.display = "block";
      }

      // 設置結束日期
      const eventEndDate = document.getElementById("eventEndDate");
      if (eventEndDate) {
        eventEndDate.value = event.endDate;
      }
    }

    // 添加隱藏字段以標識這是編輯操作
    let editIdField = document.getElementById("editEventId");
    if (!editIdField) {
      editIdField = document.createElement("input");
      editIdField.type = "hidden";
      editIdField.id = "editEventId";
      editIdField.name = "editEventId";
      eventForm.appendChild(editIdField);
    }
    editIdField.value = eventId;

    // 更改提交按鈕文本
    const submitButton = eventForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.textContent = "更新";
    }
  });
}

// 修改保存事件功能以支持編輯
async function saveEvent(e) {
  e.preventDefault();

  const formData = new FormData(eventForm);
  const eventData = {
    title: formData.get("eventTitle"),
    date: formData.get("eventDate"),
    type: formData.get("eventType"),
    location: formData.get("eventLocation"),
    startTime: formData.get("eventStartTime"),
    endTime: formData.get("eventEndTime"),
    notes: formData.get("eventNotes"),
  };

  // 如果有跨日選項
  const multiDayToggle = document.getElementById("multiDayToggle");
  if (multiDayToggle && multiDayToggle.checked) {
    const endDateValue = formData.get("eventEndDate");
    if (endDateValue) {
      eventData.endDate = endDateValue;

      // 驗證結束日期在開始日期之後
      if (dayjs(endDateValue).isBefore(dayjs(eventData.date))) {
        alert("結束日期必須在開始日期之後");
        return;
      }
    }
  } else {
    // 確保清除 endDate
    eventData.endDate = null;
  }

  // 驗證必填字段
  if (!eventData.title || !eventData.date) {
    alert("請填寫標題和日期");
    return;
  }

  try {
    // 檢查是否為編輯模式
    const editEventId = formData.get("editEventId");

    if (editEventId) {
      // 更新現有事件
      await db.events.update(parseInt(editEventId), eventData);
    } else {
      // 添加創建時間屬性
      eventData.created = new Date();
      // 添加新事件
      await db.events.add(eventData);
    }

    // 關閉模態框
    closeEventModal();

    // 重新渲染日曆以顯示新/更新的事件
    renderCalendarWithHolidays();

    // 重新加載該日的事件
    loadEventsForDateWithHolidays(eventData.date);
  } catch (error) {
    console.error("Error saving event:", error);
    alert("儲存行程時發生錯誤，請稍後再試");
  }
}

// 重設模態框為添加模式
function resetModalToAddMode() {
  // 重設標題
  const modalTitle = document.querySelector(".modal-title");
  if (modalTitle) {
    modalTitle.textContent = "新增行程";
  }

  // 移除編輯 ID
  const editIdField = document.getElementById("editEventId");
  if (editIdField) {
    editIdField.remove();
  }

  // 恢復提交按鈕文本
  const submitButton = eventForm.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.textContent = "儲存";
  }
}

// 修改關閉模態框函數以重設為添加模式
function closeEventModal() {
  eventModal.style.display = "none";
  eventForm.reset();
  resetModalToAddMode();
}

// 初始化應用
window.onload = function () {
  initCalendar();
};
