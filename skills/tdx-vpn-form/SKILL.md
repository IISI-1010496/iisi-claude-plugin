---
name: tdx-vpn-form
description: 填寫 TDX VPN 連線申請的 MOTC 資訊維護單 Google Form。自動偵測環境資訊並從 Profile 載入設定。
---

# TDX VPN 連線申請 — MOTC 資訊維護單

表單 URL: `https://docs.google.com/forms/d/e/1FAIpQLSdcM1HEhCUH2N1IeKohbl8ARuN-wj-Kt8SjcFpfwuUCBjgvwQ/viewform`  
Profile 儲存位置: `~/.claude/tdx-vpn-form-profile.json`  
提交紀錄位置: `~/.claude/tdx-vpn-form-submissions.json`

## 參數

| 參數 | 說明 |
|------|------|
| 無參數（預設） | Profile 完整 → 直接填表；有缺漏 → 先補問再填 |
| `--reset` | 重新確認所有欄位資訊，再執行填寫 |
| `--set` | 更新 Profile 中的單一或多個欄位，**不執行填表**，僅儲存後顯示最新 Profile |

### `--set` 用法

使用者在指令後用換行帶入欄位，格式為 `欄位名稱: 值`：

```
/tdx-vpn-form --set
維護作業內容: 監控路況歷史Mongodb
```

**欄位名稱對應表**（支援中英文）：

| 中文名稱 | Profile 欄位 | 說明 |
|---------|------------|------|
| 維護作業內容 | `maintenance_content` | 填入 `content` 的描述部分 |
| 電子郵件 | `email` | |
| 廠商承辦人 | `vendor_contact` | |
| 緊急聯絡電話 | `emergency_phone` | |
| 維護原因 | `maintenance_reason` | 陣列，逗號分隔多個值 |
| 服務範圍 | `service_scope` | 陣列，逗號分隔多個值 |
| 備份程序 | `backup_procedure` | 陣列，逗號分隔多個值 |
| 公告 | `maintenance_announcement` | |
| 網卡 | `network_interface` | 如 `Wi-Fi`、`乙太網路` |
| 維護時間 | `last_time` | 格式 `HH:MM-HH:MM` |

執行步驟：
1. 讀取現有 Profile。
2. 將使用者指定的欄位合併寫回 `~/.claude/tdx-vpn-form-profile.json`。
3. 顯示更新後的完整 Profile 供確認，**不開啟瀏覽器**。

---

## Step 1：環境偵測與 Profile 讀取

1. 讀取 `~/.claude/tdx-vpn-form-profile.json`。
2. 執行 `hostname` 取得 `device_name`。
3. **偵測 IP**：
   執行 `./scripts/get_ip.ps1` 取得當前網卡的 IPv4 位址。
4. **檢查重複提交**：
   讀取 `~/.claude/tdx-vpn-form-submissions.json`（不存在則跳過）。
   若今天（`YYYY-MM-DD`）已有提交紀錄，顯示警告：
   ```
   ⚠️ 今日已有提交紀錄：
     時間：{submitted_at}
     內容：{maintenance_content}
   是否仍要繼續填寫？(y/n)
   ```
   使用者回答 `n` → 中止流程；回答 `y` → 繼續。

---

## Step 2：互動確認 (僅在資料不全或 --reset 時)

對缺漏欄位進行互動式詢問。
- `maintenance_content` 預設格式：`{描述} / {device_name} / {ip}`。
- 確認所有 `data` 物件內容。

---

## Step 3：開啟瀏覽器並執行填寫

1. 導航至表單 URL。
2. 讀取 `./scripts/fill_form.js`。
3. 將收集到的 `data` 物件注入腳本頂端並執行。

---

## Step 4：完成提示

引導使用者手動處理 reCAPTCHA 並點擊「提交」。

---

## Step 5：記錄提交紀錄

待使用者確認已提交後，詢問：

```
是否已成功提交？(y/n)
```

使用者回答 `y` → 執行以下步驟：

1. 讀取現有 `~/.claude/tdx-vpn-form-submissions.json`（不存在則視為 `[]`）。
2. Append 新記錄：
   ```json
   {
     "date": "YYYY-MM-DD",
     "maintenance_content": "{填入的 content}",
     "submitted_at": "YYYY-MM-DDTHH:MM:SS"
   }
   ```
3. **清理舊紀錄**：過濾掉 `date` 距今超過 90 天的紀錄。
4. 將結果寫回檔案。

若檔案不存在，先建立空陣列 `[]` 再 append。  
使用者回答 `n` → 不寫入，提示：「可在確認提交後再執行 `/tdx-vpn-form --record` 補記錄。」

---

## 提交紀錄格式

`~/.claude/tdx-vpn-form-submissions.json` 為 JSON 陣列，每筆記錄：

| 欄位 | 說明 |
|------|------|
| `date` | 提交日期 `YYYY-MM-DD` |
| `maintenance_content` | 填入的維護作業內容 |
| `submitted_at` | 提交時間 ISO 8601 |
