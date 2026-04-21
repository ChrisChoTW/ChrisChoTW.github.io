# CLAUDE.md

此檔案為 Claude Code 在此專案中的操作指南。

## 專案狀態

這個 repo 現在有兩個用途：

1. **舊網址 → 主站的導頁**：`index.html` 與 `404.html` 用 meta refresh + canonical + JS 把根路徑與任何不存在的路徑導到 [https://chrischotw.com/](https://chrischotw.com/)
2. **網頁工具集**：`tools/` 目錄下的純前端小工具，線上版 `https://chrischotw.github.io/tools/`

## 目錄結構

```
.
├── index.html                      # 根路徑導頁
├── 404.html                        # 未知路徑導頁
├── LICENSE                         # MIT
└── tools/
    ├── index.html                  # 工具 landing（深色極簡）
    ├── README.md                   # 工具集說明
    ├── mortgage-calculator/
    │   ├── index.html              # 房貸試算（Vue + Chart.js + jsPDF + SweetAlert2 + intro.js）
    │   └── PRD.md
    ├── timeline-generator/
    │   └── index.html              # 時間軸生成（intro.js）
    └── career-decision/
        └── index.html              # 生涯決策平衡單 Pro 2025（純 HTML/CSS/JS）
```

## GitHub Pages 設定

- Source：`master` branch，`/`（root）
- Custom 404：`404.html` 在 repo root，處理所有未知路徑

## URL 規則

- `chrischotw.github.io/` → 導頁到 `chrischotw.com`
- `chrischotw.github.io/tools/` → 工具 landing
- `chrischotw.github.io/tools/<tool-name>/` → 個別工具
- 其他任何路徑 → 404.html → 導頁到 `chrischotw.com`

## 歷史

- `v-final-portfolio-2026-04-21` tag：完整舊 portfolio 快照（14 個工具、aboutme、resume 等）
- 原本有一個獨立的 `chris-web-tools` repo 收錄 3 個工具，已合併回此 repo 後刪除

## 主站位置

- 網址：[https://chrischotw.com/](https://chrischotw.com/)
- Repo：`/home/chrischo/code/ChrisChoTW/chrischotw.com`
- 技術棧：Astro 4 + Tailwind CSS 3，部署於 Hostinger VPS
