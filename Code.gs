/**
 * ====================================================================
 * 🕒 員工上下班打卡網頁系統 (節日視覺橫幅圖片 + 動畫版)
 * ====================================================================
 */

const CONFIG = {
  SPREADSHEET_ID: '1sWACVG8xro3C9BuWKUHE7EwC6WnJCddttJOMpeI8Zxw',
  SHEET_NAME: '打卡紀錄',
  TIMEZONE: 'Asia/Taipei',
};

function doGet(e) {
  return HtmlService.createHtmlOutput(getHtmlContent_())
    .setTitle('員工線上打卡系統')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1');
}

function submitClockIn(payload) {
  if (!payload || !payload.name || String(payload.name).trim() === '') {
    throw new Error('請輸入您的姓名！');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getOrCreateSheet_();
    const now = new Date();
    const formattedTime = Utilities.formatDate(now, CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    const cleanName = String(payload.name).trim();
    const clockType = payload.type ? String(payload.type).trim() : '上班打卡';
    const note = payload.note ? String(payload.note).trim() : '';

    sheet.appendRow([cleanName, formattedTime, clockType, note]);

    return {
      success: true,
      name: cleanName,
      timestamp: formattedTime,
      type: clockType,
      note: note,
      records: getRecentRecords(10),
    };
  } finally {
    lock.releaseLock();
  }
}

function getRecentRecords(limit) {
  const maxRows = limit || 10;
  const sheet = getOrCreateSheet_();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  const startRow = Math.max(2, lastRow - maxRows + 1);
  const numRows = lastRow - startRow + 1;
  const values = sheet.getRange(startRow, 1, numRows, 4).getDisplayValues();

  return values.reverse().map(function (row) {
    return {
      name: row[0] || '',
      timestamp: row[1] || '',
      type: row[2] || '',
      note: row[3] || '',
    };
  });
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheetByName('工作表1') || ss.getSheets()[0];
    if (sheet) {
      sheet.setName(CONFIG.SHEET_NAME);
    } else {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    }
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['姓名', '打卡時間', '打卡類型', '備註']);
    sheet.getRange('A1:D1').setFontWeight('bold').setBackground('#1E3A8A').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getHtmlContent_() {
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>員工線上打卡系統</title>
  <style>
    :root {
      --bg-gradient: linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #fbbf24 100%);
      --card-bg: #ffffff;
      --primary: #d97706;
      --primary-hover: #b45309;
      --clock-bg: #451a03;
      --clock-text: #fde68a;
      --clock-time: #fef08a;
      --btn-in: #d97706;
      --btn-in-hover: #b45309;
      --btn-out: #78350f;
      --btn-out-hover: #451a03;
      --tag-in-bg: #fef3c7;
      --tag-in-text: #92400e;
      --tag-out-bg: #fed7aa;
      --tag-out-text: #7c2d12;
    }

    body[data-theme="chongyang"] {
      --bg-gradient: linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #fbbf24 100%);
      --primary: #d97706;
      --primary-hover: #b45309;
      --clock-bg: #451a03;
      --clock-text: #fde68a;
      --clock-time: #fef08a;
      --btn-in: #d97706;
      --btn-in-hover: #b45309;
      --btn-out: #78350f;
      --btn-out-hover: #451a03;
      --tag-in-bg: #fef3c7;
      --tag-in-text: #92400e;
      --tag-out-bg: #fed7aa;
      --tag-out-text: #7c2d12;
    }

    body[data-theme="halloween"] {
      --bg-gradient: linear-gradient(135deg, #18181b 0%, #2e1065 50%, #ea580c 100%);
      --card-bg: #27272a;
      --primary: #f97316;
      --primary-hover: #ea580c;
      --clock-bg: #09090b;
      --clock-text: #e4e4e7;
      --clock-time: #fb923c;
      --btn-in: #ea580c;
      --btn-in-hover: #c2410c;
      --btn-out: #7c3aed;
      --btn-out-hover: #6d28d9;
      --tag-in-bg: #431407;
      --tag-in-text: #fdba74;
      --tag-out-bg: #2e1065;
      --tag-out-text: #d8b4fe;
    }
    body[data-theme="halloween"] .container {
      color: #f4f4f5;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5);
      border: 1px solid #3f3f46;
    }
    body[data-theme="halloween"] label { color: #e4e4e7; }
    body[data-theme="halloween"] input[type="text"] {
      background: #18181b;
      color: #f4f4f5;
      border-color: #52525b;
    }
    body[data-theme="halloween"] th { background: #18181b; color: #a1a1aa; }
    body[data-theme="halloween"] td { border-bottom: 1px solid #3f3f46; }
    body[data-theme="halloween"] .history-header h2 { color: #f4f4f5; }
    body[data-theme="halloween"] .badge { background: #3b0764; color: #e9d5ff; }

    body[data-theme="xmas"] {
      --bg-gradient: linear-gradient(135deg, #064e3b 0%, #065f46 40%, #991b1b 100%);
      --primary: #dc2626;
      --primary-hover: #b91c1c;
      --clock-bg: #022c22;
      --clock-text: #d1fae5;
      --clock-time: #f87171;
      --btn-in: #16a34a;
      --btn-in-hover: #15803d;
      --btn-out: #dc2626;
      --btn-out-hover: #b91c1c;
      --tag-in-bg: #dcfce7;
      --tag-in-text: #166534;
      --tag-out-bg: #fee2e2;
      --tag-out-text: #991b1b;
    }

    body[data-theme="cny"] {
      --bg-gradient: linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #f59e0b 100%);
      --primary: #dc2626;
      --primary-hover: #991b1b;
      --clock-bg: #450a0a;
      --clock-text: #fef08a;
      --clock-time: #fde047;
      --btn-in: #dc2626;
      --btn-in-hover: #b91c1c;
      --btn-out: #d97706;
      --btn-out-hover: #b45309;
      --tag-in-bg: #fee2e2;
      --tag-in-text: #991b1b;
      --tag-out-bg: #fef3c7;
      --tag-out-text: #92400e;
    }

    body[data-theme="default"] {
      --bg-gradient: linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 100%);
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --clock-bg: #0f172a;
      --clock-text: #94a3b8;
      --clock-time: #38bdf8;
      --btn-in: #059669;
      --btn-in-hover: #047857;
      --btn-out: #4f46e5;
      --btn-out-hover: #4338ca;
      --tag-in-bg: #d1fae5;
      --tag-in-text: #065f46;
      --tag-out-bg: #e0e7ff;
      --tag-out-text: #3730a3;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft JhengHei", sans-serif;
    }
    body {
      background: var(--bg-gradient);
      color: #0f172a;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 24px 16px;
      transition: background 0.5s ease;
    }
    .container {
      width: 100%;
      max-width: 520px;
      background: var(--card-bg);
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
      overflow: hidden;
      position: relative;
    }

    /* 頂部節日大幅視覺圖片區 */
    .festival-hero {
      position: relative;
      width: 100%;
      height: 175px;
      overflow: hidden;
      background: #000;
    }
    .festival-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.88;
      transition: transform 0.6s ease, filter 0.6s ease;
    }
    .festival-hero:hover .festival-hero-img {
      transform: scale(1.04);
    }
    .festival-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 14px 16px;
    }
    .hero-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hero-tag {
      background: rgba(255, 255, 255, 0.22);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .theme-select {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: #ffffff;
      outline: none;
      cursor: pointer;
    }
    .theme-select option {
      background: #1e293b;
      color: #fff;
    }
    .hero-bottom-text {
      color: #ffffff;
    }
    .hero-title {
      font-size: 21px;
      font-weight: 800;
      text-shadow: 0 2px 6px rgba(0,0,0,0.5);
      margin-bottom: 2px;
    }
    .hero-subtitle {
      font-size: 13px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 0 1px 4px rgba(0,0,0,0.6);
    }

    .main-content {
      padding: 22px 24px 28px;
    }

    .clock-box {
      background: var(--clock-bg);
      color: var(--clock-text);
      border-radius: 18px;
      padding: 18px 20px;
      text-align: center;
      margin-bottom: 22px;
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.25);
    }
    .clock-date {
      font-size: 14px;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }
    .clock-time {
      font-size: 40px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      letter-spacing: 2px;
      color: var(--clock-time);
      text-shadow: 0 0 16px rgba(253, 224, 71, 0.25);
    }
    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 6px;
      color: #334155;
    }
    input[type="text"] {
      width: 100%;
      padding: 13px 14px;
      font-size: 16px;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      outline: none;
      transition: all 0.2s;
    }
    input[type="text"]:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.2);
    }
    .btn-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 20px;
    }
    button {
      border: none;
      border-radius: 12px;
      padding: 15px 16px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }
    button:active {
      transform: scale(0.98);
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-in {
      background: var(--btn-in);
    }
    .btn-in:hover:not(:disabled) {
      background: var(--btn-in-hover);
    }
    .btn-out {
      background: var(--btn-out);
    }
    .btn-out:hover:not(:disabled) {
      background: var(--btn-out-hover);
    }
    .status-box {
      margin-top: 18px;
      padding: 14px 16px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      display: none;
    }
    .status-success {
      display: block;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #065f46;
    }
    .status-error {
      display: block;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
    }
    .history-section {
      margin-top: 24px;
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
    }
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .history-header h2 {
      font-size: 15px;
      font-weight: 700;
      color: #334155;
    }
    .sheet-link {
      font-size: 12px;
      color: var(--primary);
      text-decoration: none;
      font-weight: 700;
    }
    .sheet-link:hover {
      text-decoration: underline;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th, td {
      padding: 10px 8px;
      text-align: left;
      border-bottom: 1px solid #f1f5f9;
    }
    th {
      color: #64748b;
      font-weight: 700;
      background: #f8fafc;
    }
    .tag {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
    }
    .tag-in {
      background: var(--tag-in-bg);
      color: var(--tag-in-text);
    }
    .tag-out {
      background: var(--tag-out-bg);
      color: var(--tag-out-text);
    }
  </style>
</head>
<body data-theme="chongyang">
  <div class="container">
    <!-- 橫幅節慶插畫/背景圖片 -->
    <div class="festival-hero">
      <img id="heroImage" class="festival-hero-img" src="" alt="節慶主題圖片">
      <div class="festival-overlay">
        <div class="hero-top-bar">
          <div class="hero-tag">
            <span id="heroEmoji">🌼</span>
            <span id="heroTagText">節日智慧偵測</span>
          </div>
          <select class="theme-select" id="themeSelect" onchange="manualChangeTheme(this.value)">
            <option value="auto">🔄 節日自動偵測</option>
            <option value="chongyang">🌼 重陽節圖片風格</option>
            <option value="halloween">🎃 萬聖節圖片風格</option>
            <option value="xmas">🎄 聖誕節圖片風格</option>
            <option value="cny">🧧 新春過年圖片風格</option>
            <option value="default">🏢 商務大樓圖片風格</option>
          </select>
        </div>
        <div class="hero-bottom-text">
          <div class="hero-title" id="heroTitle">重陽九九 · 登高納福</div>
          <div class="hero-subtitle" id="heroSubtitle">菊花映秋香 · 敬老福澤長</div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="clock-box">
        <div class="clock-date" id="clockDate">載入日期中...</div>
        <div class="clock-time" id="clockTime">00:00:00</div>
      </div>

      <div class="form-group">
        <label for="empName">員工姓名 <span style="color:#ef4444">*</span></label>
        <input type="text" id="empName" placeholder="請輸入您的姓名（例如：王小明）" autocomplete="name">
      </div>

      <div class="form-group">
        <label for="empNote">打卡備註（選填）</label>
        <input type="text" id="empNote" placeholder="例如：正常出勤、外勤洽公、遠端辦公">
      </div>

      <div class="btn-group">
        <button type="button" class="btn-in" id="btnClockIn" onclick="handleClock('上班打卡')">
          <span id="iconIn">☀️</span> 上班打卡
        </button>
        <button type="button" class="btn-out" id="btnClockOut" onclick="handleClock('下班打卡')">
          <span id="iconOut">🌙</span> 下班打卡
        </button>
      </div>

      <div id="statusBox" class="status-box"></div>

      <div class="history-section">
        <div class="history-header">
          <h2>📋 最新打卡紀錄（前 10 筆）</h2>
          <a class="sheet-link" href="https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/edit" target="_blank">開啟後端試算表 ↗</a>
        </div>
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>打卡時間</th>
              <th>類型</th>
            </tr>
          </thead>
          <tbody id="recordsBody">
            <tr><td colspan="3" style="text-align:center;color:#94a3b8;padding:16px;">讀取紀錄中...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <script>
    // 包含高畫質節日圖片設定
    const THEMES = {
      chongyang: {
        name: '重陽節',
        image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80',
        tag: '🍂 重陽登高佳節',
        title: '🌼 重陽九九 · 登高祈福',
        subtitle: '金菊飄香敬長者 · 登高迎瑞納祥雲',
        emoji: '🌼',
        iconIn: '🍂',
        iconOut: '🍵'
      },
      halloween: {
        name: '萬聖節',
        image: 'https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?auto=format&fit=crop&w=800&q=80',
        tag: '🎃 萬聖神秘夜',
        title: '👻 萬聖狂歡 · 不給打卡就搗蛋！',
        subtitle: '南瓜南瓜點點燈 · 滿滿糖果伴你行 🦇',
        emoji: '🎃',
        iconIn: '🍬',
        iconOut: '🦇'
      },
      xmas: {
        name: '聖誕節',
        image: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=800&q=80',
        tag: '❄️ 歡樂聖誕季',
        title: '🎄 歡度聖誕 · Merry Christmas',
        subtitle: '雪花紛飛鈴聲響 · 幸福平安滿人間 🎁',
        emoji: '🎄',
        iconIn: '🔔',
        iconOut: '🎁'
      },
      cny: {
        name: '春節過年',
        image: 'https://images.unsplash.com/photo-1548625361-1959828d9df2?auto=format&fit=crop&w=800&q=80',
        tag: '🧨 新春賀新歲',
        title: '🧧 金蛇迎春 · 萬事大吉',
        subtitle: '紅包春聯開鴻運 · 富貴吉祥步步高 🍊',
        emoji: '🧧',
        iconIn: '🍊',
        iconOut: '🏮'
      },
      default: {
        name: '現代商務',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        tag: '🏢 企業出勤管理',
        title: '💼 員工線上出勤打卡',
        subtitle: '每一天的努力 · 創造卓越非凡 🚀',
        emoji: '🏢',
        iconIn: '☀️',
        iconOut: '🌙'
      }
    };

    function detectFestivalTheme(date) {
      const m = date.getMonth() + 1;
      const d = date.getDate();

      // 重陽節區間（約 10/10 ~ 10/22）
      if (m === 10 && d >= 10 && d <= 22) {
        return 'chongyang';
      }
      // 萬聖節區間（10/23 ~ 11/03）
      if ((m === 10 && d >= 23) || (m === 11 && d <= 3)) {
        return 'halloween';
      }
      // 聖誕節與跨年區間（12/15 ~ 1/03）
      if ((m === 12 && d >= 15) || (m === 1 && d <= 3)) {
        return 'xmas';
      }
      // 春節區間（約 1/20 ~ 2/15）
      if ((m === 1 && d >= 20) || (m === 2 && d <= 15)) {
        return 'cny';
      }
      return 'default';
    }

    function applyTheme(themeKey) {
      const cfg = THEMES[themeKey] || THEMES['default'];
      document.body.setAttribute('data-theme', themeKey);
      
      const heroImg = document.getElementById('heroImage');
      heroImg.src = cfg.image;
      document.getElementById('heroTagText').textContent = cfg.tag;
      document.getElementById('heroEmoji').textContent = cfg.emoji;
      document.getElementById('heroTitle').textContent = cfg.title;
      document.getElementById('heroSubtitle').textContent = cfg.subtitle;
      document.getElementById('iconIn').textContent = cfg.iconIn;
      document.getElementById('iconOut').textContent = cfg.iconOut;
    }

    function manualChangeTheme(val) {
      if (val === 'auto') {
        localStorage.removeItem('gas_user_theme');
        const autoKey = detectFestivalTheme(new Date());
        applyTheme(autoKey);
      } else {
        localStorage.setItem('gas_user_theme', val);
        applyTheme(val);
      }
    }

    function updateClock() {
      const now = new Date();
      const days = ['日', '一', '二', '三', '四', '五', '六'];
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const day = days[now.getDay()];
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');

      document.getElementById('clockDate').textContent = y + ' 年 ' + m + ' 月 ' + d + ' 日（星期' + day + '）';
      document.getElementById('clockTime').textContent = hh + ':' + mm + ':' + ss;
    }
    setInterval(updateClock, 1000);
    updateClock();

    window.addEventListener('DOMContentLoaded', function() {
      const savedTheme = localStorage.getItem('gas_user_theme');
      if (savedTheme && THEMES[savedTheme]) {
        document.getElementById('themeSelect').value = savedTheme;
        applyTheme(savedTheme);
      } else {
        document.getElementById('themeSelect').value = 'auto';
        applyTheme(detectFestivalTheme(new Date()));
      }

      const savedName = localStorage.getItem('gas_clockin_name');
      if (savedName) {
        document.getElementById('empName').value = savedName;
      }
      loadRecentRecords();
    });

    function handleClock(clockType) {
      const nameInput = document.getElementById('empName');
      const noteInput = document.getElementById('empNote');
      const name = nameInput.value.trim();
      const note = noteInput.value.trim();

      if (!name) {
        showStatus('⚠️ 請先輸入您的「員工姓名」再點擊打卡！', true);
        nameInput.focus();
        return;
      }

      localStorage.setItem('gas_clockin_name', name);
      setButtonsDisabled(true);
      showStatus('⏳ 正在寫入 Google Sheet 打卡紀錄中，請稍候...', false);

      google.script.run
        .withSuccessHandler(function(res) {
          setButtonsDisabled(false);
          noteInput.value = '';
          showStatus(
            '✅ <strong>' + escapeHtml(res.type) + '成功！</strong><br>' +
            '👤 姓名：' + escapeHtml(res.name) + '<br>' +
            '🕒 時間：' + escapeHtml(res.timestamp),
            false
          );
          renderRecords(res.records || []);
        })
        .withFailureHandler(function(err) {
          setButtonsDisabled(false);
          showStatus('❌ 打卡失敗：' + (err && err.message ? err.message : err), true);
        })
        .submitClockIn({ name: name, type: clockType, note: note });
    }

    function loadRecentRecords() {
      if (typeof google === 'undefined' || !google.script) return;
      google.script.run
        .withSuccessHandler(renderRecords)
        .withFailureHandler(function() {
          document.getElementById('recordsBody').innerHTML =
            '<tr><td colspan="3" style="text-align:center;color:#94a3b8;">尚無紀錄或讀取失敗</td></tr>';
        })
        .getRecentRecords(10);
    }

    function renderRecords(records) {
      const tbody = document.getElementById('recordsBody');
      if (!records || records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#94a3b8;padding:16px;">目前尚無打卡紀錄</td></tr>';
        return;
      }
      tbody.innerHTML = records.map(function(r) {
        const isOut = r.type && r.type.indexOf('下班') !== -1;
        const tagClass = isOut ? 'tag tag-out' : 'tag tag-in';
        return '<tr>' +
          '<td><strong>' + escapeHtml(r.name) + '</strong>' + (r.note ? '<div style="font-size:11px;color:#64748b;">' + escapeHtml(r.note) + '</div>' : '') + '</td>' +
          '<td style="font-variant-numeric:tabular-nums;">' + escapeHtml(r.timestamp) + '</td>' +
          '<td><span class="' + tagClass + '">' + escapeHtml(r.type || '上班打卡') + '</span></td>' +
        '</tr>';
      }).join('');
    }

    function showStatus(html, isError) {
      const box = document.getElementById('statusBox');
      box.className = 'status-box ' + (isError ? 'status-error' : 'status-success');
      box.innerHTML = html;
    }

    function setButtonsDisabled(disabled) {
      document.getElementById('btnClockIn').disabled = disabled;
      document.getElementById('btnClockOut').disabled = disabled;
    }

    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  </script>
</body>
</html>`;
}
