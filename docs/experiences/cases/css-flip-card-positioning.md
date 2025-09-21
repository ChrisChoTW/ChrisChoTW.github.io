---
title: "CSS 翻轉卡片位置問題"
date: "2025-01-21"
category: "CSS"
tags: ["CSS", "Animation", "Tailwind", "Positioning", "權重衝突"]
difficulty: "中級"
solved: true
duration: "30分鐘"
tools: ["Chrome DevTools", "Playwright MCP"]
---

## 問題現象
在 AI 時代學習典範轉移頁面中，卡片翻轉後背面內容「掉到下面」，沒有完全取代正面位置。

### 問題頁面截圖
![典範轉移頁面](images/paradigm-shift-reference.jpg)

*圖：典範轉移頁面 - 點擊卡片探索新舊思維。此頁面的卡片翻轉功能出現了位置偏移問題。*

## 技術環境
- 使用 Tailwind CSS 框架
- 3D CSS Transform 翻轉動畫
- 翻轉卡片結構：`.flip-card-wrapper > .flip-card > .card-face`

## 問題分析過程

### 1. 初始假設
以為是 CSS 高度設定問題，嘗試修改 `min-height` 和 `height: auto`

### 2. 實際檢查
使用 Playwright MCP 檢查發現：
- 兩個 `.card-face` 都是 `position: relative`
- 不是預期的 `position: absolute`
- 說明 CSS 設定沒有生效

### 3. 根本原因
**CSS 權重衝突**：
- Tailwind CSS 的 `flex flex-col` 類別設定了 `position: relative`
- 自定義 CSS `.card-face { position: absolute; }` 被覆蓋
- 導致兩個卡片面垂直排列而非重疊

## 無效的問題描述
- ❌ "翻轉效果不對"
- ❌ "卡片有問題"
- ❌ "動畫壞掉了"
- ❌ "看不到內容"

這些描述太籠統，無法讓 AI 快速定位問題。

## 有效的問題描述
- ✅ "翻轉卡片後，內容掉到下面/位置偏移"
- ✅ "卡片翻轉後背面內容沒有在正確位置"
- ✅ "兩個卡片面沒有重疊，而是垂直排列"
- ✅ "請檢查 CSS 權重問題"
- ✅ "請確認兩個 card-face 是否真的重疊"

## 最佳表達方式
**視覺現象 + 技術檢查要求**：
> "卡片翻轉後背面內容位置偏移，沒有完全取代正面位置。請用瀏覽器開發者工具檢查兩個 .card-face 元素的實際 position 屬性，看是否都是 absolute，以及是否被 Tailwind CSS 覆蓋。"

## 解決方案

使用 `!important` 強制覆蓋 CSS 框架權重：

```css
.card-face {
    width: 100% !important;
    height: 100% !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    backface-visibility: hidden !important;
}
```

## 驗證方法

使用 Playwright MCP 檢查修正前後的差異：

**修正前**：
```javascript
{
  "frontPosition": { "position": "relative" },
  "backPosition": { "position": "relative" }
}
```

**修正後**：
```javascript
{
  "frontPosition": { "position": "absolute" },
  "backPosition": { "position": "absolute" }
}
```

## 學習要點

### 1. 問題表達技巧
- **具體描述視覺問題**：說出看到的現象
- **指明檢查方向**：告訴 AI 用什麼工具檢查什麼
- **考慮 CSS 框架衝突**：現代開發常遇到權重問題
- **要求實際驗證**：讓 AI 用開發者工具確認

### 2. 技術調試方法
- 不要只憑肉眼判斷，要用開發者工具驗證
- CSS 權重問題比想像中常見
- `!important` 是解決框架衝突的有效手段
- 使用自動化工具（如 Playwright）可以快速驗證修正結果

### 3. 與 AI 協作心得
- 具體的視覺描述比抽象概念更有效
- 提供檢查步驟讓 AI 能夠驗證假設
- 分步驟解決問題，而不是一次解決所有問題
- 善用工具進行客觀驗證

## 預防措施
1. 在使用 CSS 框架時，注意自定義樣式的權重
2. 重要的定位屬性可以預先使用 `!important`
3. 定期用開發者工具檢查實際的 computed styles
4. 建立標準的問題描述模板

## 相關資源
- [CSS 權重計算規則](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
- [Tailwind CSS 自定義樣式最佳實踐](https://tailwindcss.com/docs/adding-custom-styles)
- [CSS Transform 3D 翻轉卡片教學](https://3dtransforms.desandro.com/card-flip)