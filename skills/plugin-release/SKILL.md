---
name: plugin-release
description: 發布 iisi-claude-plugin 新版本。自動 bump 版號、更新 plugin.json 和 marketplace.json、commit 並 push 到 GitHub。
---

# iisi-claude-plugin 版本發布

Plugin repo 路徑: `D:\Projects\Work\GitHub\IISI-1010496\iisi-claude-plugin`  
Plugin JSON: `.claude-plugin/plugin.json`  
Marketplace JSON: `.claude-plugin/marketplace.json`

## 使用方式

```
/plugin-release patch        # 0.1.1 → 0.1.2（bug fix、小調整）
/plugin-release minor        # 0.1.1 → 0.2.0（新增 skill 或功能）
/plugin-release major        # 0.1.1 → 1.0.0（破壞性變更）
/plugin-release              # 無參數 → 詢問使用者
```

---

## Step 1：確認 bump 類型

若無參數，詢問：
```
要發布哪種版本？
  1. patch（小修正）
  2. minor（新功能）
  3. major（重大變更）
```

---

## Step 2：讀取現有版本

讀取 `D:\Projects\Work\GitHub\IISI-1010496\iisi-claude-plugin\.claude-plugin\plugin.json`，取得 `version` 欄位。

---

## Step 3：計算新版號

依照 SemVer 規則計算：
- `patch`: z+1（x.y.z → x.y.z+1）
- `minor`: y+1，z=0（x.y.z → x.y+1.0）
- `major`: x+1，y=0，z=0（x.y.z → x+1.0.0）

---

## Step 4：更新檔案

同時更新兩個檔案的 `version` 欄位為新版號：
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

---

## Step 5：顯示 diff 並確認

顯示變更摘要，詢問：
```
準備發布 v{新版號}，確認 commit 並 push？(y/n)
```

使用者回答 `n` → 還原檔案，中止流程。

---

## Step 6：Git commit & push

```bash
cd D:\Projects\Work\GitHub\IISI-1010496\iisi-claude-plugin
git add .claude-plugin/plugin.json .claude-plugin/marketplace.json
git commit -m "chore: release v{新版號}"
git push origin main
```

完成後提示：
```
✅ v{新版號} 已發布，安裝端下次啟動 Claude Code 時將收到更新通知。
```
