---
title: "KPI 工具 Gemini AI 整合：從功能設計到完整測試"
date: "2025-09-21"
category: "AI整合"
tags: ["Gemini API", "JavaScript", "Modal互動", "Playwright測試"]
difficulty: "中級"
solved: true
duration: "2小時"
tools: ["Gemini API", "Playwright MCP", "Claude Code", "JavaScript"]
---

## 問題現象
需要為現有的 KPI 指標分析工具新增 Gemini AI 整合功能，要求：
- API Key 輸入位於頁面頂部（非 modal 內）
- Modal 中「💡 改善建議」下方新增按鈕
- 點擊後生成「工程師如何取巧規避這個 KPI」的正體中文內容
- 切換 modal 時需要重置內容狀態

### 功能頁面截圖
![KPI工具AI整合功能](images/kpi-gemini-integration.jpg)
*圖：KPI 工具成功整合 Gemini AI 功能，顯示取巧規避手段分析*

## 技術環境
- Google Gemini API (gemini-1.5-flash)
- 原生 JavaScript (ES6+)
- HTML5 Modal 互動
- CSS3 動畫與轉場
- Playwright MCP 自動化測試

## 問題分析過程

### 1. 初始假設
以為只需要簡單的 API 呼叫和內容顯示，沒考慮到狀態管理和使用者體驗細節。

### 2. 實際檢查
使用 Playwright 測試發現多個問題：
- Modal 切換時 hack 內容會殘留
- API 回應有時會返回簡體中文
- 按鈕狀態沒有正確重置

### 3. 根本原因
缺乏完整的狀態管理機制，特別是 modal 切換時的內容重置邏輯。

## 無效的問題描述
- ❌ "AI 功能有問題"
- ❌ "modal 不會動"
- ❌ "API 回應怪怪的"

這些描述太籠統，無法讓 AI 快速定位問題。

## 有效的問題描述
- ✅ "Modal 切換時，hack-section div 的內容沒有清空，需要在 openModal() 和 navigateModal() 函數中加入重置邏輯"
- ✅ "Gemini API 回應有時返回簡體中文，需要在 prompt 中明確要求使用正體中文回應"
- ✅ "按鈕點擊後需要顯示載入狀態，並在 API 錯誤時提供使用者友善的錯誤訊息"

## 最佳表達方式
**視覺現象 + 技術檢查要求**：
> "在 KPI 工具中點擊 hack 按鈕後切換到其他 modal，發現之前的 hack 內容仍然顯示。請檢查 modal 切換相關函數（openModal, navigateModal），確保每次切換時都會重置 hack-section 的 innerHTML 和相關狀態變數。"

## 解決方案

### 1. API Key 輸入區域
```html
<div class="api-key-section">
    <div class="api-key-container">
        <label for="gemini-api-key" class="api-key-label">Google AI Studio API Key</label>
        <input type="password" id="gemini-api-key" class="api-key-input"
               placeholder="輸入你的 API Key 來解鎖工程師取巧規避智慧">
        <a href="https://aistudio.google.com/app/apikey" target="_blank" class="api-key-link">
            取得 API Key →
        </a>
    </div>
</div>
```

### 2. Gemini API 整合
```javascript
async function generateHackContent(kpi, apiKey) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `請用正體中文回應：分析 "${kpi}" 這個 KPI 指標，說明工程師可能如何取巧規避這個指標...`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API 請求失敗: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('生成內容時發生錯誤:', error);
        throw error;
    }
}
```

### 3. 狀態重置機制
```javascript
function resetHackSection() {
    const hackSection = document.querySelector('.hack-content');
    const hackButton = document.getElementById('hackButton');

    if (hackSection) {
        hackSection.remove();
    }

    if (hackButton) {
        hackButton.disabled = false;
        hackButton.innerHTML = '<span>🎯 工程師如何取巧規避這個 KPI</span>';
    }
}

// 在 modal 切換函數中調用
function openModal(kpiData) {
    resetHackSection(); // 重置狀態
    // ... 其他 modal 開啟邏輯
}
```

## 驗證方法
使用 Playwright MCP 進行完整的端到端測試：
1. 填入 API Key
2. 開啟 KPI modal
3. 點擊 hack 按鈕驗證內容生成
4. 切換到另一個 KPI
5. 驗證前一個內容已清空
6. 測試新 KPI 的 hack 功能

## 學習要點

### 1. 問題表達技巧
- **具體描述狀態問題**：「Modal 切換時內容殘留」比「功能有問題」更精確
- **指明檢查方向**：告訴 AI 檢查哪些函數和 DOM 元素
- **考慮使用者流程**：思考完整的互動路徑，不只單一功能

### 2. 技術調試方法
- **Playwright 自動化測試**：模擬真實使用者操作，發現隱藏問題
- **API 錯誤處理**：實作完整的錯誤捕捉和使用者回饋機制
- **狀態管理**：在複雜 UI 互動中建立清晰的狀態重置邏輯

### 3. 與 AI 協作心得
- **迭代式開發**：先實作核心功能，再透過測試發現並修正邊緣情況
- **明確需求表達**：「務必回應正體中文」這類明確要求能避免後續問題
- **完整測試覆蓋**：使用工具進行端到端測試，確保所有互動路徑都正常

## 預防措施
1. **建立測試檢查清單**：API 整合、狀態管理、錯誤處理、語言設定
2. **使用自動化測試**：Playwright 等工具確保功能穩定性
3. **API 設定最佳實務**：明確語言要求、合理的 temperature 設定、錯誤重試機制
