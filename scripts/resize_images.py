#!/usr/bin/env python3
"""Resize CFD images to experiment display width (400px) to reduce payload.

Usage:
    uv run python scripts/resize_images.py                          # expt repo default
    uv run python scripts/resize_images.py --root /path/to/CFD/     # custom directory
"""

import argparse
from pathlib import Path

from PIL import Image

DEFAULT_ROOT = Path(__file__).resolve().parent.parent / "materials" / "cfd" / "Images" / "CFD"
TARGET_WIDTH = 400
JPEG_QUALITY = 85


def resize_directory(root: Path) -> None:
    if not root.is_dir():
        print(f"Error: {root} is not a directory")
        return

    jpg_files = sorted(root.rglob("*.jpg"))
    if not jpg_files:
        print(f"No .jpg files found in {root}")
        return

    total_before = 0
    total_after = 0
    resized = 0
    skipped = 0

    for img_path in jpg_files:
        size_before = img_path.stat().st_size
        total_before += size_before

        with Image.open(img_path) as img:
            w, h = img.size
            if w <= TARGET_WIDTH:
                total_after += size_before
                skipped += 1
                continue

            new_h = int(h * TARGET_WIDTH / w)
            resized_img = img.resize((TARGET_WIDTH, new_h), Image.LANCZOS)
            resized_img.save(img_path, "JPEG", quality=JPEG_QUALITY)

        size_after = img_path.stat().st_size
        total_after += size_after
        resized += 1

    print(f"Directory: {root}")
    print(f"  Images: {len(jpg_files)} total, {resized} resized, {skipped} already ≤{TARGET_WIDTH}px")
    print(f"  Before: {total_before / 1024 / 1024:.1f} MB")
    print(f"  After:  {total_after / 1024 / 1024:.1f} MB")
    print(f"  Saved:  {(total_before - total_after) / 1024 / 1024:.1f} MB ({(1 - total_after / total_before) * 100:.0f}% reduction)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Resize CFD images to display width")
    parser.add_argument(
        "--root",
        type=Path,
        default=DEFAULT_ROOT,
        help=f"Root directory containing model folders (default: {DEFAULT_ROOT})",
    )
    args = parser.parse_args()

    resize_directory(args.root)
