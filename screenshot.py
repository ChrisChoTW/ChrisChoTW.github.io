#!/usr/bin/env python3
"""
自動截圖工具 - 為網站工具頁面生成預覽圖
使用 Playwright 自動化瀏覽器截圖
"""

import os
import time
from pathlib import Path

# 檢查是否安裝了 playwright
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("請先安裝 Playwright:")
    print("pip install playwright")
    print("playwright install chromium")
    exit(1)

def capture_screenshots():
    """截取所有工具頁面的截圖"""
    
    # 基礎 URL - 使用本地檔案路徑
    import platform
    if platform.system() == "Windows":
        base_url = "file:///C:/Users/alibuda/code/ChrisChoTW.github.io/docs/"
    else:
        base_url = f"file://{os.path.abspath('docs')}/"
    
    # 所有工具和文檔頁面
    pages_to_capture = [
        {
            "url": "tools/mortgage-calculator.html",
            "name": "mortgage-calculator",
            "title": "房貸試算系統"
        },
        {
            "url": "tools/financial-planner.html", 
            "name": "financial-planner",
            "title": "動態財務規劃工具"
        },
        {
            "url": "tools/mcp-dashboard.html",
            "name": "mcp-dashboard",
            "title": "MCP 工作流程儀表板"
        },
        {
            "url": "tools/timeline-generator.html",
            "name": "timeline-generator", 
            "title": "時間軸生成工具"
        },
        {
            "url": "tools/ai-agent-security-demo.html",
            "name": "ai-agent-security-demo",
            "title": "AI 安全風險學習中心"
        },
        {
            "url": "games/moral-dilemma.html",
            "name": "moral-dilemma",
            "title": "博愛座道德困境"
        },
        {
            "url": "games/rpg-poisoned-hero.html",
            "name": "rpg-poisoned-hero",
            "title": "RPG中毒英雄"
        },
        {
            "url": "sdlc/index.html",
            "name": "sdlc-overview",
            "title": "SDLC 總覽"
        },
        {
            "url": "sdlc/basic.html",
            "name": "sdlc-basic",
            "title": "基礎 SDLC 流程"
        },
        {
            "url": "sdlc/enhance.html",
            "name": "sdlc-enhance",
            "title": "進階 SDLC 優化"
        }
    ]
    
    # 創建截圖目錄
    screenshot_dir = Path("docs/images/screenshots")
    screenshot_dir.mkdir(parents=True, exist_ok=True)
    
    print("開始自動截圖...")
    print(f"截圖將保存到: {screenshot_dir}")
    print("-" * 50)
    
    with sync_playwright() as p:
        # 啟動瀏覽器 - 有頭模式，可以看到瀏覽器視窗
        browser = p.chromium.launch(
            headless=False,  # 顯示瀏覽器視窗
            slow_mo=100  # 放慢操作速度，方便觀察
        )
        
        # 創建瀏覽器上下文（可設定視窗大小）
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            device_scale_factor=2  # 高解析度截圖
        )
        
        page = context.new_page()
        
        for item in pages_to_capture:
            url = base_url + item['url']
            output_file = screenshot_dir / f"{item['name']}.png"
            
            print(f"正在截圖: {item['title']}")
            print(f"   URL: {url}")
            
            try:
                # 訪問頁面
                page.goto(url)
                
                # 簡單等待 5 秒讓所有內容載入
                print(f"   等待 5 秒讓頁面完全載入...")
                page.wait_for_timeout(5000)
                
                # 捲動到頁面頂部
                page.evaluate("window.scrollTo(0, 0)")
                
                # 截圖
                page.screenshot(
                    path=str(output_file),
                    full_page=False  # 只截取視窗範圍
                )
                
                print(f"   成功保存: {output_file}")
                
            except Exception as e:
                print(f"   截圖失敗: {str(e)}")
            
            print()
        
        browser.close()
    
    print("-" * 50)
    print("截圖完成！")
    print("\n下一步：")
    print("1. 檢查 docs/images/screenshots/ 目錄中的截圖")
    print("2. 使用 Python PIL 或線上工具轉換為 WebP 格式")
    print("3. 在工具集頁面中添加預覽功能")

def convert_to_webp():
    """將 PNG 截圖轉換為 WebP 格式"""
    from PIL import Image
    
    screenshot_dir = Path("docs/images/screenshots")
    
    print("\n轉換截圖為 WebP 格式...")
    
    for png_file in screenshot_dir.glob("*.png"):
        webp_file = png_file.with_suffix('.webp')
        
        try:
            img = Image.open(png_file)
            # 調整大小（如果需要）
            # img.thumbnail((800, 600), Image.Resampling.LANCZOS)
            
            # 轉換為 WebP
            img.save(webp_file, 'WEBP', quality=85, method=6)
            print(f"轉換成功: {webp_file.name}")
            
            # 刪除原始 PNG（可選）
            # png_file.unlink()
            
        except Exception as e:
            print(f"轉換失敗 {png_file.name}: {str(e)}")

if __name__ == "__main__":
    print("""
================================================================================
     網站工具截圖自動化腳本
     Chris Cho Portfolio - Screenshot Tool        
================================================================================
    """)
    
    print("\n安裝說明：")
    print("1. pip install playwright")
    print("2. python -m playwright install chromium")
    print("")
    
    # 執行截圖
    capture_screenshots()
    
    # 自動轉換為 WebP
    print("\n自動轉換為 WebP 格式...")
    try:
        convert_to_webp()
    except ImportError:
        print("請先安裝 Pillow: pip install Pillow")