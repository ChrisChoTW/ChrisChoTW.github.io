# CLAUDE.md

此檔案為 Claude Code (claude.ai/code) 在此專案中的操作指南。

## 專案架構

這是 Chris Cho 的個人作品集網站，使用 GitHub Pages 架設，採用靜態 HTML/CSS/JavaScript 結構，無需建置流程。

### 目錄結構
```
docs/                    # GitHub Pages 根目錄
├── index.html          # 主要首頁，包含個人簡介
├── aboutme.html        # 詳細關於我頁面，含工作環境與生活照片  
├── resume.html         # 專業履歷與技能資訊
├── tools.html          # 工具集總覽頁面，附搜尋與篩選功能
├── styles/             # 模組化 CSS 架構
│   ├── base.css        # CSS 變數、主題樣式 (亮/暗色)、基礎樣式
│   ├── nav.css         # 導航列與主題切換按鈕
│   ├── pages.css       # 共用頁面版型與元件  
│   └── tools.css       # 工具頁面專用樣式與網格佈局
├── js/theme.js         # 深色/淺色主題管理
├── images/             # 最佳化 WebP 圖片目錄
└── tools/              # 個別工具頁面 (房貸計算器等)
    └── *.html          # 獨立工具應用程式
```

## 主題系統

網站採用基於 CSS 自訂屬性的主題系統，支援亮色/暗色模式：
- 主題狀態由 `js/theme.js` 管理，使用 localStorage 持久化
- CSS 變數定義於 `base.css`，透過 `[data-theme="dark"]` 覆寫
- 導航列的主題切換按鈕可在亮色/暗色模式間切換

## 圖片管理標準

**重要：圖片必須遵循以下標準：**
- **格式**：僅使用 WebP 格式 (相較 PNG/JPG 減少 93% 體積)
- **位置**：`docs/images/` 目錄
- **命名**：語義化命名 (例：`profile.webp`, `work-environment.webp`, `coffee-lifestyle.webp`)
- **使用**：只提交 HTML 檔案中實際引用的圖片

## 導航架構

網站採用一致的 4 頁導航結構：
- 首頁 (index.html) - 主要登陸頁面與個人簡介
- 關於我 (aboutme.html) - 詳細個人與專業故事  
- 履歷 (resume.html) - 正式履歷與技能展示
- 工具集 (tools.html) - 工具集總覽中心

所有頁面必須維持一致的導航連結與頁尾訊息。

## 工具頁面結構

工具以獨立 HTML 檔案形式組織於 `docs/tools/` 目錄：
- 每個工具都是自包含的，內嵌 CSS/JavaScript
- 工具包含搜尋/篩選功能，使用 jQuery 與 Select2
- 工具使用相同的基礎主題系統與導航結構

## AI 協作工作流程

### 與 Gemini 的圖片協作
- **圖片生成**：使用 Gemini 生成專業個人照片、工作環境照片、生活風格照片
- **提示詞優化**：針對個人品牌與網站風格調整圖片生成提示
- **多版本比較**：生成多個版本供選擇，確保最佳視覺效果

### 與 ChatGPT 的設計協作
- **版型分析**：使用 ChatGPT 分析現有網站佈局，提出改善建議
- **樣式優化**：分析 CSS 架構，建議響應式設計與視覺層次改善
- **使用者體驗**：評估頁面流程與互動設計，提供 UX/UI 優化方案
- **實作步驟**：將設計概念轉化為具體實作步驟與程式碼建議

### 開發流程
1. **需求分析**：與 ChatGPT 討論功能需求與設計方向
2. **圖片需求**：向 Gemini 請求相應的視覺素材
3. **實作整合**：使用 Claude Code 進行程式碼實作與系統整合
4. **效能優化**：圖片格式轉換、檔案大小優化、響應式調整
5. **測試驗證**：跨裝置測試與使用者體驗驗證

## CSS 架構

網站採用模組化 CSS 方法：
- `base.css`：CSS 自訂屬性、主題定義、字型系統
- `nav.css`：導航元件與主題切換功能
- `pages.css`：共用版型、卡片元件、區塊樣式
- `tools.css`：工具專用樣式與互動效果

字型系統：標題使用 Charter 字型，內文使用 Inter 字型，搭配系統字型備援。

## 經驗分享系統

### 架構說明
經驗分享系統位於 `docs/experiences/` 目錄，採用 Markdown + JSON 索引的靜態架構：
- `index.html`：主頁面，包含篩選、搜尋與 Modal 顯示功能
- `data/cases-index.json`：案例索引，定義分類、難度、標籤等
- `cases/`：Markdown 案例檔案，支援 Front Matter 元資料
- `images/`：案例參考截圖與示意圖
- `js/case-viewer.js`：動態載入與渲染 Markdown 內容

### 截圖處理最佳實踐
為確保快速載入與良好的使用者體驗，案例截圖必須遵循以下處理流程：

#### 1. 截圖裁切原則
- **聚焦核心問題**：裁切掉與問題無關的頁面區域
- **移除多餘空白**：適度裁切上下邊距，保持內容緊湊
- **保留關鍵元素**：確保問題相關的 UI 元件完整可見

#### 2. 解析度優化
- **目標寬度**：1200px（適合大部分螢幕顯示）
- **保持比例**：等比例縮放，避免變形
- **最大檔案**：建議不超過 200KB

#### 3. 格式選擇
- **截圖內容**：使用 JPEG 格式（品質 80-90）
- **包含文字**：可考慮 PNG 格式保持清晰度
- **目標大小**：50-150KB 為最佳範圍

#### 4. 自動化處理腳本範例
```python
# 截圖優化處理流程
from PIL import Image

def optimize_screenshot(input_path, output_path):
    with Image.open(input_path) as img:
        # 1. 適度裁切 (依需求調整)
        width, height = img.size
        cropped = img.crop((0, int(height*0.05), width, int(height*0.85)))

        # 2. 降低解析度
        target_width = 1200
        ratio = target_width / cropped.width
        new_size = (target_width, int(cropped.height * ratio))
        resized = cropped.resize(new_size, Image.Resampling.LANCZOS)

        # 3. 儲存為 JPEG
        resized.convert('RGB').save(output_path, 'JPEG',
                                   quality=85, optimize=True)
```

#### 5. 案例中的圖片引用
```markdown
### 問題頁面截圖
![頁面說明](images/case-screenshot.jpg)
*圖：簡潔的圖片說明，描述截圖內容與問題關聯。*
```

此處理流程可將 4MB+ 的原始截圖優化至 50-100KB，大幅提升載入速度。

## AI 協作開發指南

### 問題表達參考
`docs/ai-collaboration-guide.md` 提供完整的 AI 協作問題表達指南：
- **有效 vs 無效**的問題描述模式
- **技術問題分類模板**（CSS、JavaScript、響應式、效能）
- **最佳實踐公式**：`[操作步驟] → [實際結果] ≠ [預期結果] + [請檢查XX]`

### 協作原則
1. **具體描述視覺現象**：避免「壞掉」、「有問題」等籠統說法
2. **提供技術檢查方向**：指明用什麼工具檢查什麼屬性
3. **考慮框架衝突**：現代開發常遇到 CSS 權重、依賴衝突等問題
4. **分步驟驗證**：複雜問題拆解成可驗證的小步驟

這套方法論已在經驗分享系統的案例中得到驗證，可大幅提升問題解決效率。