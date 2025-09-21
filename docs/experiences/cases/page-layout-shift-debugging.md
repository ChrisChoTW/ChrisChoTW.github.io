---
title: "頁面載入跳動問題：從模糊現象到精確解決方案"
date: "2025-09-21"
category: "CSS"
tags: ["FOUC", "JavaScript載入", "Select2", "除錯技巧", "問題表達"]
difficulty: "中級"
solved: true
duration: "45分鐘"
tools: ["Chrome DevTools", "Playwright", "CSS Transition"]
---

## 問題現象

在本地開發環境測試網站時，發現工具集頁面（tools.html）和經驗分享頁面（experiences/index.html）在載入時會出現明顯的視覺跳動，特別是 header 區域和篩選器元件。


## 技術環境
- 網站架構：靜態 HTML/CSS/JavaScript
- 使用框架：jQuery + Select2
- 測試環境：Chrome 瀏覽器，本地開發伺服器
- 相關技術：CSS Transitions、JavaScript 動態載入

## 問題分析過程

### 1. 初始假設
最初以為是導航列的 CSS 樣式或容器寬度設定有問題，導致頁面載入時發生 layout shift。

### 2. 實際檢查
使用 Playwright 和 Chrome DevTools 發現：
- 首頁的導航顯示正常，沒有跳動
- 工具集頁面的 theme.js 載入在 `<body>` 底部，而其他頁面在 `<head>` 中
- Select2 元件在 JavaScript 載入完成後才初始化，造成原生 select → 美化樣式的突然切換
- 經驗分享頁面的動態內容載入也會造成短暫的視覺閃爍

![工具集頁面 header 載入狀態](images/tools-header-screenshot.jpg)
*圖：工具集頁面載入完成後的狀態。技術檢查發現：導航區域正常，但篩選器區域的 Select2 元件在初始化過程中會產生視覺跳動。*

### 3. 根本原因
問題並非單一原因，而是多個載入時機問題的組合：
1. **FOUC (Flash of Unstyled Content)**：theme.js 載入時機不一致
2. **Select2 動態替換**：原生 select 元素瞬間替換成美化樣式
3. **動態內容載入**：JavaScript 渲染內容替換初始 loading 狀態

## 無效的問題描述
- ❌ "頁面有點跳 header"
- ❌ "工具集還是會跳"
- ❌ "排版有點跑掉"

這些描述太籠統，無法讓協作夥伴快速定位具體問題和成因。

## 有效的問題描述
- ✅ "tools.html 的 theme.js 載入在 body 底部，造成主題樣式 FOUC"
- ✅ "Select2 初始化時原生 select 替換成美化樣式造成視覺跳動"
- ✅ "經驗分享頁面動態載入案例列表時替換 loading 狀態造成內容區域跳動"

## 最佳表達方式
**視覺現象 + 技術檢查要求**：
> "工具集頁面載入時篩選器區域會跳動，懷疑是 Select2 初始化時機問題。請檢查 JavaScript 載入順序和原生 select 到 Select2 的切換過程，並建議平滑載入方案。"

## 解決方案

### 1. 修正 theme.js 載入時機
```html
<!-- 將 theme.js 從 body 底部移至 head 中 -->
<head>
    <!-- 其他 head 內容 -->
    <script src="js/theme.js"></script>
</head>
```

### 2. Select2 平滑載入
```css
/* 防止頁面載入時的跳動 - 隱藏整個篩選區域 */
.tools-filters {
    opacity: 0;
    transition: opacity 0.5s ease;
}

.tools-filters.loaded {
    opacity: 1;
}
```

```javascript
// 所有載入完成後顯示篩選區域
setTimeout(() => {
    $('.tools-filters').addClass('loaded');
}, 150);
```

### 3. 經驗分享頁面動態載入優化
```css
.experiences-grid {
    min-height: 400px; /* 設定最小高度避免 layout shift */
    opacity: 0; /* 初始化為透明 */
    transition: opacity 0.3s ease;
}
```

```javascript
// 確保內容載入後顯示
container.style.opacity = '1';
```

## 驗證方法
1. 重新載入頁面，觀察是否還有視覺跳動
2. 使用 Chrome DevTools 的 Performance 面板檢查 layout shift
3. 在不同網路速度下測試載入效果
4. 確認所有頁面的 theme.js 載入時機一致

## 學習要點

### 1. 問題表達技巧
- 從「頁面有點跳」進化到「Select2 初始化造成視覺跳動」
- 學會區分不同類型的視覺問題：FOUC、動態替換、layout shift
- 理解精確描述能加快問題定位和解決速度

### 2. 技術調試方法
- 使用瀏覽器開發工具檢查載入時序
- 比較相同功能在不同頁面的實作差異
- 透過截圖和測試工具驗證視覺問題

### 3. 與 AI 協作心得
- 迭代式問題解決：從大方向逐步聚焦到具體技術點
- 提供具體技術檢查方向能得到更精準的解決方案
- 保持對話脈絡有助於 AI 理解完整問題背景

## 預防措施
1. 建立一致的 JavaScript 載入順序檢查清單
2. 對於動態替換的 UI 元件，預先規劃平滑轉換效果
3. 在開發階段就考慮載入狀態的視覺設計
4. 定期檢查不同頁面間的技術實作一致性

## 相關資源
- [AI 協作問題表達指南](../ai-collaboration-and-documentation.md)
- [Chrome DevTools Performance 分析](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance)
- [Select2 文檔](https://select2.org/)
- [FOUC 預防技巧](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)