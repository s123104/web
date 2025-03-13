/**
 * 台灣假期資料 (2024-2025年)
 * 這是一個預先編譯的靜態資料檔案，包含主要國定假日和節慶
 */
const taiwanHolidays2025 = [
  // 國定假日 (固定日期)
  { date: "2025-01-01", name: "元旦", type: "national", color: "#ef4444" },
  {
    date: "2025-02-28",
    name: "和平紀念日",
    type: "national",
    color: "#ef4444",
  },
  { date: "2025-04-04", name: "兒童節", type: "national", color: "#ef4444" },
  { date: "2025-05-01", name: "勞動節", type: "national", color: "#ef4444" },
  { date: "2025-10-10", name: "國慶日", type: "national", color: "#ef4444" },

  // 農曆節日 (2025年日期)
  { date: "2025-02-08", name: "除夕", type: "lunar", color: "#f97316" },
  { date: "2025-02-09", name: "春節", type: "lunar", color: "#f97316" },
  { date: "2025-02-10", name: "春節初二", type: "lunar", color: "#f97316" },
  { date: "2025-02-11", name: "春節初三", type: "lunar", color: "#f97316" },
  { date: "2025-04-05", name: "清明節", type: "lunar", color: "#10b981" },
  { date: "2025-06-21", name: "端午節", type: "lunar", color: "#10b981" },
  {
    date: "2025-06-22",
    name: "端午節補假",
    type: "adjustment",
    color: "#3b82f6",
  },
  {
    date: "2025-06-23",
    name: "端午連假",
    type: "adjustment",
    color: "#3b82f6",
  },
  { date: "2025-09-27", name: "中秋節", type: "lunar", color: "#10b981" },
  {
    date: "2025-09-28",
    name: "中秋節補假",
    type: "adjustment",
    color: "#3b82f6",
  },
  {
    date: "2025-09-29",
    name: "中秋連假",
    type: "adjustment",
    color: "#3b82f6",
  },

  // 補班日 (2025年預估，實際以行政院公告為準)
  { date: "2025-02-15", name: "補班日", type: "makeup", color: "#9ca3af" },
  { date: "2025-04-12", name: "補班日", type: "makeup", color: "#9ca3af" },
  { date: "2025-09-20", name: "補班日", type: "makeup", color: "#9ca3af" },

  // 連假調整放假日
  {
    date: "2025-02-07",
    name: "春節調整放假",
    type: "adjustment",
    color: "#3b82f6",
  },
  {
    date: "2025-02-12",
    name: "春節彈性放假",
    type: "adjustment",
    color: "#3b82f6",
  },
];

/**
 * 2024年台灣假期資料
 */
const taiwanHolidays2024 = [
  { date: "2024-01-01", name: "元旦", type: "national", color: "#ef4444" },
  { date: "2024-02-08", name: "除夕", type: "lunar", color: "#f97316" },
  { date: "2024-02-09", name: "春節", type: "lunar", color: "#f97316" },
  { date: "2024-02-10", name: "春節初二", type: "lunar", color: "#f97316" },
  { date: "2024-02-11", name: "春節初三", type: "lunar", color: "#f97316" },
  {
    date: "2024-02-28",
    name: "和平紀念日",
    type: "national",
    color: "#ef4444",
  },
  { date: "2024-04-04", name: "兒童節", type: "national", color: "#ef4444" },
  { date: "2024-04-05", name: "清明節", type: "lunar", color: "#10b981" },
  { date: "2024-05-01", name: "勞動節", type: "national", color: "#ef4444" },
  { date: "2024-06-10", name: "端午節", type: "lunar", color: "#10b981" },
  { date: "2024-09-17", name: "中秋節", type: "lunar", color: "#10b981" },
  { date: "2024-10-10", name: "國慶日", type: "national", color: "#ef4444" },
  { date: "2024-02-12", name: "補假", type: "adjustment", color: "#3b82f6" },
  { date: "2024-02-13", name: "補假", type: "adjustment", color: "#3b82f6" },
  {
    date: "2024-02-14",
    name: "調整放假",
    type: "adjustment",
    color: "#3b82f6",
  },
  { date: "2024-02-17", name: "補班日", type: "makeup", color: "#9ca3af" },
  { date: "2024-02-24", name: "補班日", type: "makeup", color: "#9ca3af" },
];

/**
 * 台灣假期主要函數庫
 * 適用於靜態網站的輕量級解決方案
 */
const TaiwanHolidays = {
  // 合併多年假期數據
  allHolidays: [...taiwanHolidays2024, ...taiwanHolidays2025],

  /**
   * 獲取指定年月的假期
   * @param {number|string} year - 年份
   * @param {number|string} month - 月份 (1-12)
   * @return {Array} 符合條件的假期數組
   */
  getHolidaysForMonth(year, month) {
    // 確保月份格式為兩位數
    const formattedMonth = month.toString().padStart(2, "0");
    const yearMonthPrefix = `${year}-${formattedMonth}`;

    return this.allHolidays.filter((holiday) =>
      holiday.date.startsWith(yearMonthPrefix)
    );
  },

  /**
   * 獲取特定日期的假期
   * @param {string} dateString - 格式為 YYYY-MM-DD 的日期字符串
   * @return {Object|null} 假期對象或 null
   */
  getHolidayForDate(dateString) {
    return (
      this.allHolidays.find((holiday) => holiday.date === dateString) || null
    );
  },

  /**
   * 判斷指定日期是否為假日
   * @param {string} dateString - 格式為 YYYY-MM-DD 的日期字符串
   * @return {boolean} 是否為假日
   */
  isHoliday(dateString) {
    const holiday = this.getHolidayForDate(dateString);
    return holiday !== null && holiday.type !== "makeup";
  },

  /**
   * 判斷指定日期是否為補班日
   * @param {string} dateString - 格式為 YYYY-MM-DD 的日期字符串
   * @return {boolean} 是否為補班日
   */
  isMakeupWorkday(dateString) {
    const holiday = this.getHolidayForDate(dateString);
    return holiday !== null && holiday.type === "makeup";
  },

  /**
   * 設置整體日曆網格的假期樣式
   * @param {HTMLElement} calendarGrid - 日曆網格元素
   * @param {number|string} year - 年份
   * @param {number|string} month - 月份 (1-12)
   */
  applyHolidaysToCalendar(calendarGrid, year, month) {
    const holidays = this.getHolidaysForMonth(year, month);

    // 獲取假期顯示設置
    const showNational =
      document.getElementById("showNationalHolidays")?.checked !== false;
    const showLunar =
      document.getElementById("showLunarHolidays")?.checked !== false;
    const showMakeup =
      document.getElementById("showMakeupWorkdays")?.checked !== false;
    const showAdjustment =
      document.getElementById("showAdjustmentHolidays")?.checked !== false;

    holidays.forEach((holiday) => {
      const dayElement = calendarGrid.querySelector(
        `.calendar-day[data-date="${holiday.date}"]`
      );
      if (!dayElement) return;

      // 添加假日樣式
      dayElement.classList.add("holiday");
      dayElement.dataset.holidayType = holiday.type;

      // 為不同類型的假日添加特定類
      if (holiday.type === "national") {
        dayElement.classList.add("national-holiday");
        dayElement.classList.toggle("hidden-holiday", !showNational);
      } else if (holiday.type === "lunar") {
        dayElement.classList.add("lunar-holiday");
        dayElement.classList.toggle("hidden-holiday", !showLunar);
      } else if (holiday.type === "makeup") {
        dayElement.classList.add("makeup-workday");
        dayElement.classList.toggle("hidden-holiday", !showMakeup);
      } else if (holiday.type === "adjustment") {
        dayElement.classList.add("adjustment-holiday");
        dayElement.classList.toggle("hidden-holiday", !showAdjustment);
      }

      // 添加假日名稱指示器
      let indicator = dayElement.querySelector(".holiday-indicator");
      if (!indicator) {
        indicator = document.createElement("div");
        indicator.className = "holiday-indicator";
        dayElement.appendChild(indicator);
      }

      indicator.textContent = holiday.name;
      indicator.style.color = holiday.color;
    });
  },
};
