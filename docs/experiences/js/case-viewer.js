// 經驗案例檢視器
class ExperienceViewer {
    constructor() {
        this.cases = [];
        this.filteredCases = [];
        this.init();
    }

    async init() {
        await this.loadCases();
        this.setupEventListeners();
        this.renderCases();
    }

    // 載入案例索引
    async loadCases() {
        try {
            const response = await fetch('data/cases-index.json');
            const data = await response.json();
            this.cases = data.cases;
            this.filteredCases = [...this.cases];
            this.populateFilterOptions(data);
        } catch (error) {
            console.error('載入案例索引失敗:', error);
            this.showError('載入案例列表失敗，請重新整理頁面');
        }
    }

    // 填充篩選選項
    populateFilterOptions(data) {
        const categorySelect = document.getElementById('categoryFilter');
        const difficultySelect = document.getElementById('difficultyFilter');

        // 填充分類選項
        data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        // 填充難度選項
        data.difficulties.forEach(difficulty => {
            const option = document.createElement('option');
            option.value = difficulty;
            option.textContent = difficulty;
            difficultySelect.appendChild(option);
        });
    }

    // 設置事件監聽器
    setupEventListeners() {
        // 篩選事件
        document.getElementById('categoryFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('difficultyFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('searchInput').addEventListener('input', () => this.applyFilters());

        // Modal 相關事件
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('caseModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // ESC 關閉 Modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    // 應用篩選條件
    applyFilters() {
        const category = document.getElementById('categoryFilter').value;
        const difficulty = document.getElementById('difficultyFilter').value;
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();

        this.filteredCases = this.cases.filter(caseItem => {
            const matchCategory = !category || caseItem.category === category;
            const matchDifficulty = !difficulty || caseItem.difficulty === difficulty;
            const matchSearch = !searchQuery ||
                caseItem.title.toLowerCase().includes(searchQuery) ||
                caseItem.summary.toLowerCase().includes(searchQuery) ||
                caseItem.tags.some(tag => tag.toLowerCase().includes(searchQuery));

            return matchCategory && matchDifficulty && matchSearch;
        });

        this.renderCases();
        this.updateActiveTags();
    }

    // 更新活躍標籤顯示
    updateActiveTags() {
        const activeTagsContainer = document.getElementById('activeTags');
        activeTagsContainer.innerHTML = '';

        const category = document.getElementById('categoryFilter').value;
        const difficulty = document.getElementById('difficultyFilter').value;
        const searchQuery = document.getElementById('searchInput').value;

        if (category) this.addActiveTag(activeTagsContainer, '分類', category);
        if (difficulty) this.addActiveTag(activeTagsContainer, '難度', difficulty);
        if (searchQuery) this.addActiveTag(activeTagsContainer, '搜尋', searchQuery);
    }

    // 添加活躍標籤
    addActiveTag(container, type, value) {
        const tag = document.createElement('span');
        tag.className = 'filter-tag active';
        tag.innerHTML = `${type}: ${value} <span onclick="this.parentElement.remove(); experienceViewer.clearFilter('${type.toLowerCase()}')" style="margin-left: 4px; cursor: pointer;">&times;</span>`;
        container.appendChild(tag);
    }

    // 清除特定篩選條件
    clearFilter(type) {
        switch(type) {
            case '分類':
                document.getElementById('categoryFilter').value = '';
                break;
            case '難度':
                document.getElementById('difficultyFilter').value = '';
                break;
            case '搜尋':
                document.getElementById('searchInput').value = '';
                break;
        }
        this.applyFilters();
    }

    // 渲染案例列表
    renderCases() {
        const container = document.getElementById('experiencesGrid');

        if (this.filteredCases.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 16px;"></i>
                    <p>沒有找到符合條件的經驗案例</p>
                    <p style="font-size: 0.9rem;">試著調整篩選條件或搜尋關鍵字</p>
                </div>
            `;
            // 確保即使是空狀態也要顯示
            container.style.opacity = '1';
            return;
        }

        // 更新內容
        container.innerHTML = this.filteredCases.map(caseItem => this.createCaseCard(caseItem)).join('');

        // 確保內容載入後顯示
        container.style.opacity = '1';
    }

    // 創建案例卡片
    createCaseCard(caseItem) {
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('zh-TW');
        };

        const getDifficultyColor = (difficulty) => {
            switch(difficulty) {
                case '初級': return '#10b981';
                case '中級': return '#f59e0b';
                case '高級': return '#ef4444';
                default: return '#6b7280';
            }
        };

        const getSolvedStatus = (solved) => {
            return solved ? '<i class="fas fa-check-circle" style="color: #10b981;"></i> 已解決' : '<i class="fas fa-clock" style="color: #f59e0b;"></i> 進行中';
        };

        return `
            <div class="experience-card" onclick="experienceViewer.openCase('${caseItem.id}')">
                <div class="category-badge" style="background: ${getDifficultyColor(caseItem.difficulty)}">${caseItem.difficulty}</div>
                <h3>${caseItem.title}</h3>
                <p class="summary">${caseItem.summary}</p>
                <div class="meta">
                    <span class="meta-item">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(caseItem.date)}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-clock"></i>
                        ${caseItem.duration}
                    </span>
                    <span class="meta-item">
                        ${getSolvedStatus(caseItem.solved)}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-folder"></i>
                        ${caseItem.category}
                    </span>
                </div>
                <div class="tags">
                    ${caseItem.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // 打開案例詳情
    async openCase(caseId) {
        const modal = document.getElementById('caseModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        // 顯示載入狀態
        modal.style.display = 'block';
        modalBody.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner"></i>
                <p>載入案例內容中...</p>
            </div>
        `;

        try {
            // 載入 Markdown 檔案
            const caseItem = this.cases.find(c => c.id === caseId);
            if (!caseItem) {
                throw new Error('案例不存在');
            }

            modalTitle.textContent = caseItem.title;

            const response = await fetch(`cases/${caseItem.file}`);
            if (!response.ok) {
                throw new Error('載入案例檔案失敗');
            }

            const markdownContent = await response.text();

            // 解析 front matter
            const { content, metadata } = this.parseFrontMatter(markdownContent);

            // 渲染 Markdown
            const htmlContent = marked.parse(content);

            // 顯示內容
            modalBody.innerHTML = `
                <div class="case-metadata" style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-muted);">
                    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 12px;">
                        <span style="color: var(--text-muted); font-size: 0.9rem;">
                            <i class="fas fa-calendar"></i> ${new Date(metadata.date).toLocaleDateString('zh-TW')}
                        </span>
                        <span style="color: var(--text-muted); font-size: 0.9rem;">
                            <i class="fas fa-clock"></i> ${metadata.duration || '未知'}
                        </span>
                        <span style="color: var(--text-muted); font-size: 0.9rem;">
                            <i class="fas fa-folder"></i> ${metadata.category}
                        </span>
                        <span style="color: var(--text-muted); font-size: 0.9rem;">
                            <i class="fas fa-signal"></i> ${metadata.difficulty}
                        </span>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${metadata.tags ? metadata.tags.map(tag => `<span style="padding: 2px 8px; background: var(--bg-secondary); border: 1px solid var(--border-muted); border-radius: 10px; font-size: 0.75rem; color: var(--text-secondary);">${tag}</span>`).join('') : ''}
                    </div>
                </div>
                <div class="case-content">
                    ${htmlContent}
                </div>
            `;

            // 高亮程式碼
            modalBody.querySelectorAll('pre code').forEach(block => {
                if (typeof hljs !== 'undefined') {
                    hljs.highlightElement(block);
                }
            });

        } catch (error) {
            console.error('載入案例失敗:', error);
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 16px; color: #ef4444;"></i>
                    <p>載入案例內容失敗</p>
                    <p style="font-size: 0.9rem;">${error.message}</p>
                </div>
            `;
        }
    }

    // 解析 Front Matter
    parseFrontMatter(markdownContent) {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = markdownContent.match(frontMatterRegex);

        if (!match) {
            return { content: markdownContent, metadata: {} };
        }

        const frontMatter = match[1];
        const content = match[2];

        // 簡單的 YAML 解析
        const metadata = {};
        frontMatter.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                const key = line.slice(0, colonIndex).trim();
                let value = line.slice(colonIndex + 1).trim();

                // 移除引號
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }

                // 處理陣列
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(item => item.trim().replace(/"/g, ''));
                }

                metadata[key] = value;
            }
        });

        return { content, metadata };
    }

    // 關閉 Modal
    closeModal() {
        document.getElementById('caseModal').style.display = 'none';
    }

    // 顯示錯誤訊息
    showError(message) {
        const container = document.getElementById('experiencesGrid');
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 16px; color: #ef4444;"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

// 全域函數
function closeModal() {
    if (window.experienceViewer) {
        window.experienceViewer.closeModal();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.experienceViewer = new ExperienceViewer();
});