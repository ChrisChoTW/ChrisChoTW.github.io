#!/usr/bin/env python3
"""
WebP 圖片轉換器
將 PNG/JPG 圖片轉換為 WebP 格式以優化網頁載入速度
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("請先安裝 Pillow:")
    print("pip install Pillow")
    sys.exit(1)

def convert_to_webp(input_path, output_path=None, quality=85, method=6):
    """
    將圖片轉換為 WebP 格式
    
    Args:
        input_path: 輸入圖片路徑
        output_path: 輸出路徑，如果為 None 則自動生成
        quality: WebP 品質 (0-100)
        method: 壓縮方法 (0-6，6為最佳品質)
    """
    input_path = Path(input_path)
    
    if not input_path.exists():
        print(f"錯誤：找不到檔案 {input_path}")
        return False
    
    if output_path is None:
        output_path = input_path.with_suffix('.webp')
    else:
        output_path = Path(output_path)
    
    try:
        # 開啟並轉換圖片
        img = Image.open(input_path)
        
        # 如果是 PNG 有透明度，保持 RGBA 模式
        if img.mode in ('RGBA', 'LA'):
            pass  # 保持原模式
        elif img.mode == 'P':
            # 調色板模式轉為 RGBA
            img = img.convert('RGBA')
        else:
            # 其他模式轉為 RGB
            img = img.convert('RGB')
        
        # 轉換為 WebP
        img.save(output_path, 'WEBP', quality=quality, method=method)
        
        # 計算檔案大小節省
        original_size = input_path.stat().st_size
        webp_size = output_path.stat().st_size
        savings = (original_size - webp_size) / original_size * 100
        
        print(f"✓ {input_path.name} -> {output_path.name}")
        print(f"  原始大小: {original_size / 1024:.1f} KB")
        print(f"  WebP 大小: {webp_size / 1024:.1f} KB")
        print(f"  節省空間: {savings:.1f}%")
        
        return True
    
    except Exception as e:
        print(f"✗ 轉換失敗 {input_path.name}: {str(e)}")
        return False

def batch_convert_directory(directory, output_dir=None, quality=85, method=6, extensions=None):
    """
    批次轉換目錄中的圖片
    
    Args:
        directory: 輸入目錄
        output_dir: 輸出目錄，如果為 None 則使用原目錄
        quality: WebP 品質
        method: 壓縮方法
        extensions: 支援的副檔名列表
    """
    directory = Path(directory)
    
    if not directory.exists():
        print(f"錯誤：目錄不存在 {directory}")
        return
    
    if output_dir:
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
    else:
        output_dir = directory
    
    if extensions is None:
        extensions = ['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.tif']
    
    # 收集所有圖片檔案
    image_files = []
    for ext in extensions:
        image_files.extend(directory.glob(f"*{ext}"))
        image_files.extend(directory.glob(f"*{ext.upper()}"))
    
    if not image_files:
        print(f"在 {directory} 中未找到支援的圖片檔案")
        print(f"支援的格式: {', '.join(extensions)}")
        return
    
    print(f"找到 {len(image_files)} 個圖片檔案")
    print("-" * 50)
    
    success_count = 0
    total_original_size = 0
    total_webp_size = 0
    
    for img_file in image_files:
        output_file = output_dir / f"{img_file.stem}.webp"
        
        # 跳過已存在的 WebP 檔案
        if output_file.exists():
            print(f"⏭ 跳過 {img_file.name} (WebP 已存在)")
            continue
        
        original_size = img_file.stat().st_size
        total_original_size += original_size
        
        if convert_to_webp(img_file, output_file, quality, method):
            success_count += 1
            webp_size = output_file.stat().st_size
            total_webp_size += webp_size
        
        print()
    
    # 顯示總結
    if success_count > 0:
        total_savings = (total_original_size - total_webp_size) / total_original_size * 100
        print("-" * 50)
        print(f"轉換完成！")
        print(f"成功轉換: {success_count}/{len(image_files)} 個檔案")
        print(f"總原始大小: {total_original_size / 1024:.1f} KB")
        print(f"總 WebP 大小: {total_webp_size / 1024:.1f} KB")
        print(f"總節省空間: {total_savings:.1f}%")

def main():
    """主程式"""
    print("""
================================================================================
     WebP 圖片轉換器
     優化網頁圖片載入速度
================================================================================
    """)
    
    if len(sys.argv) < 2:
        print("使用方式:")
        print("  轉換單個檔案: python webp_converter.py image.png")
        print("  批次轉換目錄: python webp_converter.py /path/to/directory")
        print("  自定義品質: python webp_converter.py image.png --quality 90")
        print("  指定輸出路徑: python webp_converter.py image.png --output result.webp")
        print()
        print("範例:")
        print("  python webp_converter.py docs/images/screenshots/")
        print("  python webp_converter.py screenshot.png --quality 90")
        return
    
    input_path = sys.argv[1]
    quality = 85
    method = 6
    output_path = None
    
    # 解析命令列參數
    i = 2
    while i < len(sys.argv):
        if sys.argv[i] == '--quality' and i + 1 < len(sys.argv):
            quality = int(sys.argv[i + 1])
            i += 2
        elif sys.argv[i] == '--method' and i + 1 < len(sys.argv):
            method = int(sys.argv[i + 1])
            i += 2
        elif sys.argv[i] == '--output' and i + 1 < len(sys.argv):
            output_path = sys.argv[i + 1]
            i += 2
        else:
            i += 1
    
    input_path = Path(input_path)
    
    if input_path.is_file():
        # 轉換單個檔案
        print(f"轉換單個檔案: {input_path}")
        print(f"品質設定: {quality}")
        print(f"壓縮方法: {method}")
        print("-" * 30)
        
        if convert_to_webp(input_path, output_path, quality, method):
            print("\n✅ 轉換成功！")
        else:
            print("\n❌ 轉換失敗！")
    
    elif input_path.is_dir():
        # 批次轉換目錄
        print(f"批次轉換目錄: {input_path}")
        print(f"品質設定: {quality}")
        print(f"壓縮方法: {method}")
        print("-" * 30)
        
        batch_convert_directory(input_path, quality=quality, method=method)
    
    else:
        print(f"錯誤：路徑不存在或無法存取 {input_path}")

if __name__ == "__main__":
    main()