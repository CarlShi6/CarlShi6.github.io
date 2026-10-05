from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage


ROOT = Path(__file__).resolve().parents[1]
BARE = Path("/workspace/scratch/ee872f9424c3/upload/02-a1dce9bd-8bf9-426b-abb3-5f094f6bf67e.png")
FINAL = Path("/workspace/scratch/ee872f9424c3/upload/03-ff95c014-6096-419c-9ec7-69c9853dc9d8.png")
OUT = ROOT / "public/media/ivory-cosmos/tree-growth"


def rgba_layer(rgb: np.ndarray, alpha: np.ndarray) -> Image.Image:
    return Image.fromarray(np.dstack((rgb, np.clip(alpha, 0, 255).astype(np.uint8))), "RGBA")


OUT.mkdir(parents=True, exist_ok=True)
bare = np.asarray(Image.open(BARE).convert("RGB"), dtype=np.int16)
final = np.asarray(Image.open(FINAL).convert("RGB"), dtype=np.int16)
h, w, _ = bare.shape

# The bare artwork is the only permanent raster. Every changing asset below is
# transparent and registered to this exact 1448 x 1086 coordinate system.
Image.fromarray(bare.astype(np.uint8), "RGB").save(OUT / "bare-planet.webp", "WEBP", quality=94, method=6)

delta = np.max(np.abs(final - bare), axis=2).astype(np.float32)
blue = (final[:, :, 2] - final[:, :, 0] > 3) & (final[:, :, 0] < 232)
yy, xx = np.mgrid[0:h, 0:w]
canopy = (yy < 455) & ((xx < 650) | (xx > 800))

fruit_specs = [
    # left / projects
    ("p1", 228, 258, 31), ("p2", 311, 190, 28), ("p3", 376, 188, 27),
    ("p4", 256, 364, 28), ("p5", 327, 340, 28), ("p6", 399, 340, 27),
    # right / skills
    ("s1", 1073, 280, 28), ("s2", 1167, 234, 28),
    ("s3", 1251, 258, 28), ("s4", 1135, 339, 28),
]

fruit_union = np.zeros((h, w), dtype=bool)
for _, cx, cy, radius in fruit_specs:
    fruit_union |= ((xx - cx) / (radius + 9)) ** 2 + ((yy - cy) / (radius + 13)) ** 2 <= 1

# Difference based alpha retains the soft, irregular watercolor edge while
# avoiding the tiny global paper-color difference between the two references.
soft_alpha = np.clip((delta - 9) * 9.5, 0, 255)
leaf_seed = canopy & blue & (delta > 15) & ~fruit_union
joined = ndimage.binary_closing(ndimage.binary_dilation(leaf_seed, iterations=2), iterations=2)
labels, count = ndimage.label(joined)

groups = {f"{side}-{band}": np.zeros((h, w), dtype=bool) for side in ("left", "right") for band in range(3)}
roots = {"left": np.array([520.0, 365.0]), "right": np.array([940.0, 375.0])}
distances: dict[str, list[tuple[int, float]]] = {"left": [], "right": []}

for label in range(1, count + 1):
    ys, xs = np.where(labels == label)
    if len(xs) < 16:
        continue
    side = "left" if float(xs.mean()) < w / 2 else "right"
    centroid = np.array([float(xs.mean()), float(ys.mean())])
    distances[side].append((label, float(np.linalg.norm(centroid - roots[side]))))

for side, items in distances.items():
    values = np.array([distance for _, distance in items])
    cuts = np.quantile(values, [0.34, 0.68]) if len(values) else [0, 0]
    for label, distance in items:
        band = 0 if distance <= cuts[0] else 1 if distance <= cuts[1] else 2
        groups[f"{side}-{band}"] |= ndimage.binary_dilation(labels == label, iterations=3)

final_u8 = final.astype(np.uint8)
for name, group in groups.items():
    alpha = soft_alpha * group
    alpha = np.asarray(Image.fromarray(alpha.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.55)))
    rgba_layer(final_u8, alpha).save(OUT / f"leaves-{name}.webp", "WEBP", lossless=True, method=6)

for name, cx, cy, radius in fruit_specs:
    shape = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(shape)
    draw.ellipse((cx - radius - 4, cy - radius - 4, cx + radius + 4, cy + radius + 4), fill=255)
    # Include the hand-painted stem and its attachment point.
    draw.line((cx, cy - radius + 3, cx - 2, cy - radius - 31), fill=255, width=9)
    shape = shape.filter(ImageFilter.GaussianBlur(2.2))
    shape_alpha = np.asarray(shape, dtype=np.float32) / 255
    alpha = np.maximum(soft_alpha, np.clip((delta - 5) * 13, 0, 255)) * shape_alpha
    rgba_layer(final_u8, alpha).save(OUT / f"fruit-{name}.webp", "WEBP", lossless=True, method=6)

# A contact sheet is kept out of public assets; it lets maintainers compare the
# registered layers without changing the runtime implementation.
print(f"Wrote {1 + len(groups) + len(fruit_specs)} registered assets to {OUT}")
