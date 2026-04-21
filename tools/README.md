# Tools

純前端網頁工具集，線上版：<https://chrischotw.github.io/tools/>

## 工具列表

### [房貸試算系統](./mortgage-calculator/)
貸款、利率、寬限期、換屋等多情境比較，附 Chart.js 視覺化與 jsPDF 匯出。
依賴：Vue 3、Chart.js、SweetAlert2、jsPDF、intro.js（全 CDN）。

### [生存成本計算機 Pro](./cost-of-living/)
把每筆固定支出換算成日均成本與工時代價。功能：步驟式新增表單、180 emoji 智慧建議、分攤人數、消費/投資/儲蓄分流、用途次要分類、4% FIRE 試算、拖曳排序、Grid/List 雙檢視、25+ 常見支出範本（autocomplete + 搜尋 modal）。
依賴：Tailwind CDN、Lucide icons（CDN），資料只存在 localStorage。

### [時間軸生成工具](./timeline-generator/)
互動式建立並匯出專案/歷史時間軸。
依賴：intro.js（CDN）。

### [生涯決策平衡單](./career-decision/)
多選項加權評分，輔助職涯/人生重大決策。
依賴：純 HTML/CSS/JS，零外部依賴。

## 使用方式

每個工具都是自包含的單一 HTML 檔案。直接打開 `<tool>/index.html` 即可使用，或部署到任何靜態網頁主機。

## 授權

MIT License（見 repo 根目錄 LICENSE）
