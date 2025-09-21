/**
 * Gemini API Key 管理模組
 * 提供統一的 localStorage 儲存與存取功能
 * 適用於所有使用 Gemini API 的工具
 */

// 儲存 Key 常數
const GEMINI_API_KEY_STORAGE = 'chris-cho-gemini-api-key';

/**
 * Gemini API Key 管理器
 */
const GeminiAPIManager = {
    /**
     * 儲存 API Key 到 localStorage
     * @param {string} apiKey - API Key 字串
     */
    saveApiKey(apiKey) {
        if (apiKey && apiKey.trim()) {
            localStorage.setItem(GEMINI_API_KEY_STORAGE, apiKey.trim());
        }
    },

    /**
     * 從 localStorage 取得 API Key
     * @returns {string} - API Key 或空字串
     */
    getApiKey() {
        return localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
    },

    /**
     * 清除儲存的 API Key
     */
    clearApiKey() {
        localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    },

    /**
     * 檢查是否有有效的 API Key
     * @returns {boolean} - 是否有有效的 API Key
     */
    hasValidApiKey() {
        const key = this.getApiKey();
        return key && key.trim().length > 0;
    },

    /**
     * 自動設定指定的輸入框
     * @param {string} inputId - 輸入框的 ID
     */
    setupApiKeyInput(inputId = 'api-key') {
        const input = document.getElementById(inputId);
        if (!input) {
            console.error(`[GeminiAPIManager] 找不到 ID 為 "${inputId}" 的輸入框`);
            return;
        }

        // 載入時自動填入已儲存的 API Key
        const savedApiKey = this.getApiKey();
        input.value = savedApiKey;

        // 輸入時自動儲存
        input.addEventListener('input', (e) => {
            const apiKey = e.target.value.trim();
            if (apiKey) {
                this.saveApiKey(apiKey);
            }
        });

        // 離開輸入框時也儲存一次
        input.addEventListener('blur', (e) => {
            const apiKey = e.target.value.trim();
            if (apiKey) {
                this.saveApiKey(apiKey);
            }
        });
    },

    /**
     * 取得 API Key 並檢查是否有效，無效時提供提示
     * @param {string} inputId - 輸入框的 ID（用於聚焦）
     * @returns {string|null} - 有效的 API Key 或 null
     */
    getValidApiKey(inputId = 'api-key') {
        const apiKey = this.getApiKey();

        if (!apiKey || !apiKey.trim()) {
            alert('請先輸入 Google AI Studio API Key！');
            const input = document.getElementById(inputId);
            if (input) {
                input.focus();
            }
            return null;
        }

        return apiKey.trim();
    },

    /**
     * 建立清除 API Key 的按鈕
     * @param {string} containerId - 要插入按鈕的容器 ID
     * @param {string} inputId - 要清空的輸入框 ID
     */
    createClearButton(containerId, inputId = 'api-key') {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清除儲存的 API Key';
        clearBtn.className = 'clear-api-key-btn';
        clearBtn.style.cssText = `
            padding: 5px 10px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 10px;
        `;

        clearBtn.addEventListener('click', () => {
            if (confirm('確定要清除儲存的 API Key 嗎？')) {
                this.clearApiKey();
                const input = document.getElementById(inputId);
                if (input) {
                    input.value = '';
                }
                alert('API Key 已清除');
            }
        });

        clearBtn.addEventListener('mouseenter', () => {
            clearBtn.style.backgroundColor = '#c82333';
        });

        clearBtn.addEventListener('mouseleave', () => {
            clearBtn.style.backgroundColor = '#dc3545';
        });

        container.appendChild(clearBtn);
    }
};

/**
 * 初始化函數，可在頁面載入時調用
 * @param {Object} options - 設定選項
 * @param {string} options.inputId - API Key 輸入框的 ID
 * @param {string} options.clearButtonContainer - 清除按鈕容器的 ID（可選）
 */
function initGeminiAPIManager(options = {}) {
    const { inputId = 'api-key', clearButtonContainer } = options;

    // 等待 DOM 載入完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            GeminiAPIManager.setupApiKeyInput(inputId);
            if (clearButtonContainer) {
                GeminiAPIManager.createClearButton(clearButtonContainer, inputId);
            }
        });
    } else {
        GeminiAPIManager.setupApiKeyInput(inputId);
        if (clearButtonContainer) {
            GeminiAPIManager.createClearButton(clearButtonContainer, inputId);
        }
    }
}

// 如果是 module 環境，導出模組
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GeminiAPIManager, initGeminiAPIManager };
}

// 全域可用
window.GeminiAPIManager = GeminiAPIManager;
window.initGeminiAPIManager = initGeminiAPIManager;