# iisi-claude-plugin

IISI 資拓宏宇 Claude Code Plugin 集合。

## 安裝

```
/plugin marketplace add IISI-1010496/iisi-claude-plugin
/plugin install iisi-claude-plugin@iisi
```

## Skills

### tdx-vpn-form

自動填寫 TDX VPN 連線申請的 MOTC 資訊維護單（Google Form）。

**初次使用**：執行後依提示填寫個人資料，儲存為 Profile 供後續自動帶入。

**指令**：

| 指令 | 說明 |
|------|------|
| `/tdx-vpn-form` | 填寫表單（自動帶入 Profile） |
| `/tdx-vpn-form --set` | 更新 Profile 單一欄位 |
| `/tdx-vpn-form --reset` | 重新確認所有欄位後填表 |

**需求**：
- Claude Code + Claude in Chrome extension
- Windows（PowerShell 用於偵測 IP）
