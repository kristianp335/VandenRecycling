#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw, ImageFont

def create_thumbnail(fragment_name, output_path):
    # Create a 150x150 thumbnail
    img = Image.new('RGB', (150, 150), color='#C41E3A')
    draw = ImageDraw.Draw(img)
    
    # Try to use a basic font
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
    except:
        font = ImageFont.load_default()
    
    # Draw fragment name
    text = fragment_name.replace('vanden-', '').replace('pcr-', '').title()
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (150 - text_width) // 2
    y = (150 - text_height) // 2
    
    draw.text((x, y), text, fill='white', font=font)
    
    # Save as PNG
    img.save(output_path, 'PNG')
    print(f"Created thumbnail: {output_path}")

def main():
    fragments_dir = 'fragments'
    if not os.path.exists(fragments_dir):
        print("Fragments directory not found")
        return
    
    for fragment_name in os.listdir(fragments_dir):
        fragment_path = os.path.join(fragments_dir, fragment_name)
        if os.path.isdir(fragment_path):
            thumbnail_path = os.path.join(fragment_path, 'thumbnail.png')
            if not os.path.exists(thumbnail_path):
                create_thumbnail(fragment_name, thumbnail_path)

if __name__ == "__main__":
    main()