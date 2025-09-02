#!/usr/bin/env python3
"""
快速截圖工具 - 單獨截取特定頁面
解決文字無法顯示的問題
"""

import os
import time
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
    from PIL import Image
except ImportError:
    print("請先安裝必要套件:")
    print("pip install playwright pillow")
    print("playwright install chromium")
    exit(1)

def capture_specific_pages():
    """截取特定頁面的截圖"""
    
    # 基礎 URL
    base_path = Path(__file__).parent / "docs"
    base_url = f"file://{base_path.absolute()}"
    
    # 要截圖的頁面
    pages_to_capture = [
        {
            "url": f"{base_url}/games/rpg-poisoned-hero.html",
            "name": "rpg-poisoned-hero",
            "title": "RPG中毒英雄"
        },
        {
            "url": f"{base_url}/tools/ai-agent-security-demo.html",
            "name": "ai-agent-security-demo",
            "title": "AI 安全風險學習中心"
        }
    ]
    
    # 創建截圖目錄
    screenshot_dir = Path("docs/images/screenshots")
    screenshot_dir.mkdir(parents=True, exist_ok=True)
    
    print("開始截圖...")
    print(f"截圖將保存到: {screenshot_dir}")
    print("-" * 50)
    
    with sync_playwright() as p:
        # 啟動瀏覽器 - 使用更多選項來確保字體載入
        browser = p.chromium.launch(
            headless=False,  # 顯示瀏覽器視窗以便調試
            slow_mo=500,  # 放慢操作速度
            args=[
                '--disable-web-security',  # 禁用安全限制
                '--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--font-render-hinting=none',  # 改善字體渲染
                '--force-device-scale-factor=1'
            ]
        )
        
        # 創建瀏覽器上下文
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            device_scale_factor=2,  # 高解析度
            locale='zh-TW',  # 設定語言
            timezone_id='Asia/Taipei'  # 設定時區
        )
        
        page = context.new_page()
        
        # 設置額外的等待時間
        page.set_default_timeout(30000)  # 30秒超時
        
        for item in pages_to_capture:
            url = item['url']
            output_file_png = screenshot_dir / f"{item['name']}.png"
            output_file_webp = screenshot_dir / f"{item['name']}.webp"
            
            print(f"正在截圖: {item['title']}")
            print(f"   URL: {url}")
            
            try:
                # 訪問頁面
                page.goto(url, wait_until='networkidle', timeout=30000)
                
                # 多重等待策略確保頁面完全載入
                print(f"   等待頁面完全載入...")
                
                # 1. 等待DOM載入
                page.wait_for_load_state('domcontentloaded')
                print(f"   ✓ DOM載入完成")
                
                # 2. 等待網路空閒
                page.wait_for_load_state('networkidle')
                print(f"   ✓ 網路請求完成")
                
                # 3. 額外等待字體載入
                page.evaluate("""
                    () => {
                        return document.fonts.ready;
                    }
                """)
                print(f"   ✓ 字體載入完成")
                
                # 4. 等待特定元素出現（根據頁面調整）
                if 'rpg' in item['name']:
                    # 等待遊戲標題
                    page.wait_for_selector('h1', timeout=10000)
                    print(f"   ✓ 遊戲標題已顯示")
                elif 'ai-agent' in item['name']:
                    # 等待主標題
                    page.wait_for_selector('.hero-title', timeout=10000)
                    print(f"   ✓ 頁面標題已顯示")
                
                # 5. 強制等待以確保動畫完成
                page.wait_for_timeout(3000)
                
                # 6. 捲動頁面以觸發延遲載入
                page.evaluate("window.scrollTo(0, 100)")
                page.wait_for_timeout(500)
                page.evaluate("window.scrollTo(0, 0)")
                page.wait_for_timeout(500)
                
                # 7. 檢查是否有文字內容
                text_content = page.evaluate("""
                    () => {
                        const body = document.body;
                        return body ? body.innerText.length : 0;
                    }
                """)
                print(f"   頁面文字長度: {text_content} 字元")
                
                if text_content < 10:
                    print(f"   ⚠️ 警告：頁面文字內容過少，可能有載入問題")
                
                # 截圖
                page.screenshot(
                    path=str(output_file_png),
                    full_page=False,  # 只截取視窗範圍
                    animations='disabled'  # 禁用動畫
                )
                
                print(f"   ✓ PNG 截圖成功: {output_file_png}")
                
                # 轉換為 WebP
                img = Image.open(output_file_png)
                img.save(output_file_webp, 'WEBP', quality=85, method=6)
                print(f"   ✓ WebP 轉換成功: {output_file_webp}")
                
                # 刪除 PNG（可選）
                # output_file_png.unlink()
                
            except Exception as e:
                print(f"   ✗ 截圖失敗: {str(e)}")
            
            print()
        
        browser.close()
    
    print("-" * 50)
    print("截圖完成！")
    print("\n檢查生成的檔案:")
    for item in pages_to_capture:
        webp_file = screenshot_dir / f"{item['name']}.webp"
        if webp_file.exists():
            size_kb = webp_file.stat().st_size / 1024
            print(f"  ✓ {webp_file.name} ({size_kb:.1f} KB)")
        else:
            print(f"  ✗ {webp_file.name} (未找到)")

if __name__ == "__main__":
    print("""
================================================================================
     快速截圖工具 - RPG中毒英雄 & AI安全風險學習中心
     解決文字顯示問題版本
================================================================================
    """)
    
    capture_specific_pages()