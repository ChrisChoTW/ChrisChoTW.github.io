# Chris Cho 個人網站設計指南

## 品牌定位

### 網站設計特色
- **主要特色**：專業、現代、技術感
- **目標受眾**：技術招募者、潛在合作夥伴、技術社群
- **品牌個性**：技術專業、可靠穩重、創新思維、開放分享
- **整體感受**：技術深度、團隊領導、持續成長

### 設計理念
「以技術為基石，以人文為靈魂」- 展現技術專業的同時，傳達溫度與人文關懷。透過簡潔現代的設計語言，呈現專業形象與技術深度。

## 色彩系統

### 主題色彩變數
網站採用雙主題系統（亮色/暗色），使用 CSS 自訂屬性管理：

#### 亮色主題
```css
/* 主要色彩 */
--accent-primary: #3b82f6;      /* 主藍色 - 專業與信任 */
--accent-secondary: #60a5fa;    /* 次要藍色 */

/* 文字色彩 */
--text-primary: #1a1a1a;        /* 主要文字 */
--text-secondary: #4a5568;      /* 次要文字 */
--text-muted: #718096;          /* 輔助文字 */

/* 背景色彩 */
--bg-primary: #ffffff;          /* 主背景 */
--bg-secondary: #f8fafc;        /* 次背景 */
--bg-card: #ffffff;             /* 卡片背景 */

/* 邊框色彩 */
--border-primary: #e2e8f0;      /* 主要邊框 */
--border-muted: #edf2f7;        /* 次要邊框 */
```

#### 暗色主題
```css
/* 暗色模式覆寫 */
[data-theme="dark"] {
  --accent-primary: #60a5fa;
  --accent-secondary: #3b82f6;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-muted: #9ca3af;
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --bg-card: #1f1f1f;
  --border-primary: #2d3748;
  --border-muted: #374151;
}
```

### 功能性色彩
```css
--success-color: #10b981;       /* 成功綠 */
--warning-color: #f59e0b;       /* 警告橘 */
--error-color: #ef4444;         /* 錯誤紅 */
--info-color: #3b82f6;          /* 資訊藍 */
```

### 色彩使用原則
1. **主色調克制**：藍色作為點綴，不過度使用
2. **對比度優先**：確保文字可讀性 (WCAG AA 標準)
3. **層次分明**：透過色彩深淺建立視覺層次
4. **主題一致**：亮暗主題保持相同的視覺權重

## 字體系統

### 字體配置
```css
/* 標題字體 - 優雅經典 */
font-family: 'Charter', Georgia, serif;

/* 內文字體 - 現代清晰 */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', 'Microsoft JhengHei', sans-serif;

/* 程式碼字體 */
font-family: 'Monaco', 'Courier New', monospace;
```

### 字體層級
```css
/* 大標題 */
h1 { 
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

/* 區塊標題 */
h2 {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.3;
}

/* 小標題 */
h3 {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

/* 內文 */
p {
  font-size: 1rem;
  line-height: 1.6-1.8;
}

/* 輔助文字 */
.small {
  font-size: 0.875rem;
  line-height: 1.5;
}
```

## 設計原則

### 1. 簡潔專業
- 避免過度裝飾，專注內容呈現
- 使用充足留白增強閱讀體驗
- 保持視覺元素的一致性

### 2. 響應式優先
- Mobile-first 設計方法
- 彈性網格系統
- 觸控友善的互動元素

### 3. 可訪問性
- WCAG AA 標準對比度
- 語義化 HTML 結構
- 鍵盤導航支援
- 主題切換記憶

### 4. 效能導向
- WebP 圖片格式（減少 93% 體積）
- CSS 模組化架構
- 最小化外部依賴
- 預載入關鍵資源

### 5. 一致性體驗
- 統一導航結構
- 一致的組件樣式
- 標準化間距系統
- 統一的動畫時長

## 組件設計規範

### 導航列
- **高度**：60-70px
- **背景**：半透明毛玻璃效果
- **固定定位**：sticky top
- **主題切換**：右側圓形按鈕
- **活躍狀態**：底部 3px 藍色線條

### 卡片組件
```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-color: var(--accent-primary);
}
```

### 按鈕設計
```css
/* 主要按鈕 */
.btn-primary {
  background: var(--text-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 500;
  transition: all 0.2s ease;
}

/* 次要按鈕 */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
}
```

### 標籤系統
```css
.tag {
  padding: 6px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-muted);
  border-radius: 20px;
  font-size: 0.85-0.9rem;
  font-weight: 500;
}

/* 特殊標籤 */
.tag.new { 
  background: #10b981; 
  color: white;
}
.tag.hot { 
  background: #ef4444; 
  color: white;
}
.tag.beta { 
  background: #f59e0b; 
  color: white;
}
```

### AI 生成標記
```css
.ai-badge {
  position: absolute;
  background: rgba(59, 130, 246, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}
```

## 間距系統

### 基礎間距單位
```css
--spacing-xs: 8px;
--spacing-sm: 12px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
--spacing-4xl: 80px;
```

### 使用規範
- **組件內距**：16-24px
- **區塊間距**：32-64px
- **頁面邊距**：20px (mobile) / 40px (desktop)
- **網格間隙**：24-32px

## 動畫與過渡

### 標準過渡時間
```css
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
```

### 常用動畫
```css
/* hover 上移 */
transform: translateY(-2px);

/* 淡入 */
opacity: 0 → 1;

/* 縮放 */
transform: scale(0.95) → scale(1);
```

## 頁面特定設計

### 首頁 (index.html)
- **Hero 區塊**：個人照片 + 簡介
- **成就網格**：2-3 列卡片展示
- **技術標籤雲**：分類展示技能
- **CTA 區塊**：引導至工具集
- **許願牆**：互動式留言功能

### 關於我 (aboutme.html)
- **引言區塊**：突出顯示核心理念
- **大型配圖**：工作環境展示
- **時間軸**：職涯發展歷程
- **技能網格**：4 宮格軟實力展示

### 履歷 (resume.html)
- **個人資訊卡**：圓形頭像 + 聯絡資訊
- **成就網格**：圖標 + 數據展示
- **經歷列表**：時間軸式排版
- **技能分類**：分組展示技術棧

### 工具集 (tools.html)
- **搜尋過濾**：頂部搜尋欄 + 多維度篩選
- **工具卡片網格**：響應式 3 列布局
- **預覽模態框**：點擊查看工具詳情
- **分類標籤**：工具、遊戲、文檔分類

## 響應式斷點

```css
/* 手機 */
@media (max-width: 480px) { }

/* 平板 */
@media (max-width: 768px) { }

/* 小型桌面 */
@media (max-width: 1024px) { }

/* 標準桌面 */
@media (min-width: 1025px) { }
```

## 檔案組織架構

```
docs/
├── index.html          # 主頁
├── aboutme.html        # 關於我
├── resume.html         # 履歷
├── tools.html          # 工具集
├── styles/
│   ├── base.css        # 基礎樣式與變數
│   ├── nav.css         # 導航組件
│   ├── pages.css       # 頁面通用樣式
│   └── tools.css       # 工具頁專用樣式
├── js/
│   ├── theme.js        # 主題切換邏輯
│   └── wishwall.js     # 許願牆功能
└── images/
    └── *.webp          # WebP 格式圖片
```

## 最佳實踐

### 圖片處理
1. 統一使用 WebP 格式
2. 懶加載非關鍵圖片
3. 提供適當的 alt 文字
4. 響應式圖片尺寸

### SEO 優化
1. 語義化 HTML 標籤
2. 結構化資料 (JSON-LD)
3. Open Graph 標籤
4. 適當的 meta 描述

### 效能優化
1. CSS 模組化避免重複
2. 關鍵 CSS 內聯
3. JavaScript 延遲載入
4. 字體預載入

### 維護建議
1. 保持色彩系統一致性
2. 新增組件遵循既有模式
3. 定期檢查響應式效果
4. 維護設計系統文檔

## 版本記錄

### v2.0.0 (2025-01-05)
- 建立完整設計系統文檔
- 統一色彩與字體系統
- 響應式設計優化
- 雙主題系統實作

### v1.0.0 (2024)
- 初始網站發布
- 基礎頁面結構
- 工具集功能實作

## 未來規劃

1. **動畫增強**：加入微互動動畫
2. **組件庫**：建立可重用組件庫
3. **深色模式優化**：細節調整與測試
4. **國際化**：支援英文版本
5. **無障礙優化**：提升 WCAG 相容性

## 設計靈感來源

- **簡潔風格**：受 Medium、Notion 啟發
- **卡片設計**：參考 Material Design
- **色彩系統**：借鏡 Tailwind CSS
- **字體搭配**：靈感來自 Typography Handbook

---

*此設計指南為 Chris Cho 個人網站的設計標準文檔，旨在確保設計一致性與開發效率。*

*最後更新：2025-01-05*