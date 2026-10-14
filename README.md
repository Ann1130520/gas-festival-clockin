# 🕒 節日自動切換風格之員工線上打卡系統 (Google Apps Script Web App)

基於 Google Apps Script (GAS) 開發的單一檔案員工出勤打卡系統，具備智慧節慶日期偵測，可隨節日自動切換主題橫幅圖片、配色與視覺元素。

## ✨ 特色功能

1. **節日智慧切換橫幅圖片與主題**：
   - 🌼 **重陽節**（10/10 ~ 10/22）：重陽秋菊金燦橫幅，暖菊色調與敬老祈福賀詞。
   - 🎃 **萬聖節**（10/23 ~ 11/03）：萬聖南瓜燈夜景橫幅，暗夜狂歡霓虹橘紫風格，不給打卡就搗蛋。
   - 🎄 **聖誕節**（12/15 ~ 1/03）：白雪與聖誕樹橫幅，紅綠節慶喜悅風格。
   - 🧧 **春節過年**（1/20 ~ 2/15）：喜慶大紅春聯與剪紙橫幅，開運迎祥風格。
   - 🏢 **平日商務**：現代辦公摩天大樓橫幅，簡約專業商務風格。
2. **手動快速預覽**：支援右上角下拉選單隨時手動切換不同節日風格。
3. **單一檔案架構 (Single-file)**：前後端合一於 `Code.gs`，完全杜絕 404 與檔案參照錯誤。
4. **Google Sheets 即時連動**：打卡紀錄即時寫入試算表，自動防並發寫入（LockService）。
5. **記憶員工姓名**：本地 localStorage 自動記憶上次姓名，免每次重複手打。

## 🌐 線上展示與連結

- **Web App 線上打卡系統**：[立即前往打卡網頁](https://script.google.com/macros/s/AKfycbwfpedfagPiv0oW7iZ4JXKY749_JpZWf94BmM01JAJWGR3jQamc2EMuvwzG7jTyCnVc/exec)
- **後端 Google 試算表**：[查看出勤紀錄表](https://docs.google.com/spreadsheets/d/1sWACVG8xro3C9BuWKUHE7EwC6WnJCddttJOMpeI8Zxw/edit)

## 🚀 部署教學

1. 在 Google Drive 建立一份 Google 試算表。
2. 點選「擴充功能」➔「Apps Script」。
3. 將本倉庫的 `Code.gs` 複製並覆蓋專案中的程式碼。
4. 修改程式碼上方的 `CONFIG.SPREADSHEET_ID` 為您的試算表 ID。
5. 點選右上角「部署」➔「新增部署作業」➔ 類型選擇「網頁應用程式」：
   - 執行身分：我
   - 誰可以存取：所有人
6. 點擊「部署」，授權存取權後即可取得專屬公開打卡網址！
