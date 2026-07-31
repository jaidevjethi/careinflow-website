# -*- coding: utf-8 -*-
"""
Put the real Pramukh Dental site on the phone in the hero.

The hero's job is to prove the product in the first second. A blurred teal
glow proves nothing; an actual clinic site being read by an actual patient
proves the whole pitch, and it is a real screenshot rather than a render, so
the page's own "open them on your own phone" line stays true.

The screen is a quadrilateral in perspective, so the screenshot is warped onto
the measured corners. The composite is masked to the pixels that are actually
glowing screen, which means the fingers, the bezel and the highlight on the
frame all survive untouched without any hand-drawn matte.

Run from the repo root, after the client site changes or the plate is replaced:
    node scripts/capture-hero-screen.mjs   # writes the screen frame
    python scripts/composite-hero-screen.py

The plate is kept outside src/assets so re-running never composites onto an
already-composited hero.
"""
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

PLATE = 'scripts/assets/hero-plate.webp'     # the untouched photograph
SHOT = 'scripts/assets/hero-screen.png'      # captured at the phone's screen aspect
OUT = 'src/assets/editorial/hero-patient-phone.webp'

# measured off the glow, corners in display order, then pushed out a few pixels
# so the warp covers the soft halo the old screen threw past its own edge
_Q = [(411, 312), (514, 290), (713, 547), (616, 578)]
_cx = sum(p[0] for p in _Q) / 4.0
_cy = sum(p[1] for p in _Q) / 4.0
QUAD = [(_cx + (x - _cx) * 1.035, _cy + (y - _cy) * 1.035) for x, y in _Q]


def coeffs(dst, src):
    """Perspective coefficients for PIL, which samples dst -> src."""
    m = []
    for (dx, dy), (sx, sy) in zip(dst, src):
        m.append([dx, dy, 1, 0, 0, 0, -sx * dx, -sx * dy])
        m.append([0, 0, 0, dx, dy, 1, -sy * dx, -sy * dy])
    A = np.array(m, dtype=float)
    b = np.array(src, dtype=float).reshape(8)
    return np.linalg.lstsq(A, b, rcond=None)[0]


hero = Image.open(PLATE).convert('RGB')
W, H = hero.size
shot = Image.open(SHOT).convert('RGB')

sw, sh = shot.size

# lift contrast slightly: at hero size the screen is ~45px wide, and the button
# shapes are the only thing that will read
shot = ImageEnhance.Contrast(shot).enhance(1.12)

warped = shot.transform(
    (W, H),
    Image.PERSPECTIVE,
    coeffs(QUAD, [(0, 0), (sw, 0), (sw, sh), (0, sh)]),
    resample=Image.BICUBIC,
)

a = np.asarray(hero).astype(float)
w = np.asarray(warped).astype(float)

# --- mask: inside the quad, minus anything warm (fingers) -------------------
xs, ys = np.meshgrid(np.arange(W), np.arange(H))
inside = np.ones((H, W), bool)
for i in range(4):
    x0, y0 = QUAD[i]
    x1, y1 = QUAD[(i + 1) % 4]
    inside &= ((x1 - x0) * (ys - y0) - (y1 - y0) * (xs - x0)) >= 0

R, G, B = a[:, :, 0], a[:, :, 1], a[:, :, 2]
skin = R > G + 16                     # lamp-warm fingertips crossing the screen
mask = inside & ~skin

m = Image.fromarray((mask * 255).astype(np.uint8))
m = m.filter(ImageFilter.MaxFilter(5))        # close pinholes in the matte
m = m.filter(ImageFilter.MinFilter(5))        # then take the dilation back off
m = Image.fromarray(
    np.where(np.asarray(m) & (inside * 255).astype(np.uint8), 255, 0).astype(np.uint8)
)
m = m.filter(ImageFilter.GaussianBlur(1.1))   # feather the join
mf = (np.asarray(m).astype(float) / 255.0)[:, :, None]

# --- grade the screen into the night scene ---------------------------------
# levels, not a mean scale: a lit phone screen at night keeps a near-white page
# and full-strength brand colour, and only the black text comes up off zero
w = 26.0 + (w / 255.0) * 224.0
w[:, :, 0] *= 0.98                    # a hair cool, matching the room
w[:, :, 2] *= 1.02

# the far end of the screen sits at a sharper angle and catches less light
ramp = np.clip((ys - 280) / 300.0, 0, 1)[:, :, None]
w *= 0.90 + 0.10 * ramp

out = a * (1 - mf) + np.clip(w, 0, 255) * mf

# The old screen bloomed teal onto the bezel and the fingertips, and that halo
# survives outside the quad, ringing the new screen in green. Nothing else in
# this room is teal (the couch is navy, the lamp is warm), so every pixel still
# leaning green can be pulled to neutral and read as the bloom off a white page.
oR, oG, oB = out[:, :, 0], out[:, :, 1], out[:, :, 2]
# only outside the new screen, or it would grey out the page's own green button
halo = (oG > oR + 10) & (oG >= oB - 6) & (mf[:, :, 0] < 0.5)
k = np.clip((oG - oR - 10) / 40.0, 0, 1)[..., None] * halo[..., None]
lum = out.mean(axis=2, keepdims=True)
neutral = np.concatenate([lum * 0.99, lum, lum * 1.05], axis=2)
out = out * (1 - k) + neutral * k

res = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

# the shot is razor sharp and the plate is not; take the edge off so the screen
# belongs to the same photograph
soft = res.filter(ImageFilter.GaussianBlur(0.8))
blend = Image.fromarray((np.asarray(m).astype(np.uint8)))
res = Image.composite(soft, res, blend.point(lambda v: int(v * 0.55)))

res.save(OUT, 'WEBP', quality=84, method=6)
print('wrote', OUT, res.size)
