"""
Prepare web-ready transparent logos from the approved raster artwork.

The logos are NOT redrawn or re-typeset. The supplied PNGs (dark artwork on a
near-white canvas) are converted to an alpha mask, cropped to the ink bounds,
upscaled, and filled with the exact brand colours. Geometry is untouched.

Usage:  python scripts/prepare-logos.py <wordmark.png> <monogram.png> <out_dir>
Needs:  pillow, numpy
Replace with vector masters (SVG) as soon as the client supplies them.
"""
import sys
from PIL import Image
import numpy as np

CHARCOAL = (0x0B, 0x0B, 0x0B)
OFFWHITE = (0xF5, 0xF5, 0xED)


def smooth(x, lo, hi):
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


def prepare(src, name, out):
    lum = np.asarray(Image.open(src).convert("L")).astype(float)
    bg = np.percentile(lum, 60)  # canvas level
    alpha = np.clip((bg - lum) / (bg - 20), 0, 1)
    ys, xs = np.where(alpha > 0.5)
    pad = 6
    box = (
        max(xs.min() - pad, 0),
        max(ys.min() - pad, 0),
        xs.max() + pad + 1,
        ys.max() + pad + 1,
    )
    mask = Image.fromarray((alpha * 255).astype("uint8")).crop(box)
    w, h = mask.size
    mask = mask.resize((w * 3, h * 3), Image.LANCZOS)
    a = smooth(np.asarray(mask).astype(float) / 255, 0.22, 0.78)  # re-sharpen, drop grain
    alpha_img = Image.fromarray((a * 255).astype("uint8"))
    for suffix, rgb in (("", CHARCOAL), ("-inverse", OFFWHITE)):
        img = Image.new("RGBA", alpha_img.size, rgb + (0,))
        img.putalpha(alpha_img)
        img.save(f"{out}/{name}{suffix}.png", optimize=True)


if __name__ == "__main__":
    wordmark, monogram, out = sys.argv[1:4]
    prepare(wordmark, "apex-motus-wordmark", out)
    prepare(monogram, "px-monogram", out)
