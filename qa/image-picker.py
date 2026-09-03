#!/usr/bin/env python3
"""
IMAGE PICKER — sourcing web imagery from /Volumes/BBC/BBC-Media-Library.

WHY THIS EXISTS
The first sourcing pass was: regex the AI captions, take the first few hits, eyeball twelve.
That produced *plausible* images. It missed better ones, because:
  · it SAMPLED rather than searched — 722 images matched the brief and 3 were looked at;
  · it looked BEFORE filtering, so most of the eyeballing was spent on unusable files;
  · the AI captions describe CONTENT ("bicycle with bamboo frame"), never QUALITY or fitness.

A first attempt at scoring on sharpness alone put an annotated parts-list diagram and a
"Helping to meet NetZero" graphic in the top eight — line art on flat white has enormous edge
energy. So the discriminator below is not decoration; without it the ranker actively prefers
diagrams to photographs.

THE PIPELINE
  1 SAFE POOL      exclude Prison_RESTRICTED, /Schools, People/, Personal/, _REVIEW_* — the
                   library flags its own risk and we honour it. Safeguarding, not taste.
  2 BRIEF          regex over caption AND tags (the earlier pass ignored the tags column).
  3 FITNESS GATE   min width + aspect window matching the target slot. Mechanical, before
                   any pixels are looked at.
  4 PHOTO GATE     reject diagrams/screenshots/composites (see is_photo()).
  5 QUALITY RANK   sharpness + contrast + resolution + colour richness.
  6 CONTACT SHEET  a wide shortlist for HUMAN/vision review — never auto-pick. Three
                   safeguarding problems and one wrong-subject image were caught this way
                   on 2026-07-31 that filenames alone would have shipped.

Usage:
  python3 qa/image-picker.py --selftest
  python3 qa/image-picker.py --brief "wrap|bind|fibre|joint" --ar 1.2 2.1 --min-w 1400 --top 24
"""
import argparse, csv, os, re, sys
from PIL import Image, ImageFilter, ImageStat, ImageDraw

Image.MAX_IMAGE_PIXELS = 300_000_000          # library has legitimate 135MP panoramas
LIB = "/Volumes/BBC/BBC-Media-Library/"
IDX = LIB + "_AI-INDEX/_captions.csv"

SAFE = re.compile(r'^(Products/|Build_Guides/|Workshops/(Public|Corporate)|Marketing/)')
BAN  = re.compile(r'Prison_RESTRICTED|/Schools|People/|Personal/|_REVIEW')
# filenames that betray a non-photograph even before pixels are read
NONPHOTO_NAME = re.compile(r'annotated|parts.?list|inventory|hall.of.frames|diagram|infographic'
                           r'|screenshot|logo|nologo|^prev-|_v\d+|\bv\d{1,3}\b', re.I)


def is_photo(im):
    """Separate photographs from diagrams, renders, screenshots and composites.

    Measured on the failing cases from the 2026-08-01 test — an annotated bike spec, a
    'Material — Helping to meet NetZero' graphic and a lug PARTS LIST — all of which
    out-ranked real photography on sharpness alone.

    Signals, cheap and in order of usefulness:
      flat_white  diagrams sit on flat white; photographs rarely exceed ~22% near-white
      sat_mean    line art is largely unsaturated; photographs carry colour
      flat_frac   proportion of low-variance (posterised) tiles — renders and screenshots
                  are locally flat where photographs have grain and texture everywhere
    Returns (bool, reason).
    """
    rgb = im.convert('RGB'); rgb.thumbnail((420, 420))
    px = list(rgb.getdata()); n = len(px)
    near_white = sum(1 for r, g, b in px if r > 243 and g > 243 and b > 243) / n
    # 0.34 was too tight: it rejected 'Mark Finsihed 3.jpg', a real studio shot of a bike on a
    # white wall, at 38%. The self-test caught it before it reached a page. BBC shoots a lot of
    # product on white, so the gate has to clear that. The three known diagrams measure 58/70/80%,
    # so 0.50 separates them cleanly with room either side.
    if near_white > 0.50:
        return False, f"flat white {near_white:.0%}"
    hsv = rgb.convert('HSV')
    sat = ImageStat.Stat(hsv.split()[1]).mean[0]
    if sat < 26 and near_white > 0.18:
        return False, f"unsaturated {sat:.0f} + white {near_white:.0%}"
    # local flatness: tile the greyscale and count tiles with almost no variance
    g = rgb.convert('L'); w, h = g.size; step = 40; flat = tot = 0
    for y in range(0, h - step, step):
        for x in range(0, w - step, step):
            tot += 1
            if ImageStat.Stat(g.crop((x, y, x + step, y + step))).stddev[0] < 4.0:
                flat += 1
    flat_frac = flat / max(tot, 1)
    if flat_frac > 0.42:
        return False, f"flat tiles {flat_frac:.0%}"
    return True, ""


def load_pool():
    rows = []
    with open(IDX, newline='', encoding='utf-8', errors='replace') as fh:
        for r in csv.DictReader(fh):
            p = r['dest_rel']
            if not SAFE.match(p) or BAN.search(p):
                continue
            if not p.lower().endswith(('.jpg', '.jpeg', '.png')):
                continue
            rows.append((p, (r.get('caption') or ''), (r.get('tags') or '')))
    return rows


def score(path, min_w, ar_lo, ar_hi):
    f = LIB + path
    try:
        im = Image.open(f)
    except Exception:
        return None
    w, h = im.size
    if w < min_w:
        return None, 'small'
    ar = w / h
    if not (ar_lo < ar < ar_hi):
        return None, 'aspect'
    if NONPHOTO_NAME.search(os.path.basename(path)):
        return None, 'name'
    ok, why = is_photo(im)
    if not ok:
        return None, why
    g = im.convert('L'); g.thumbnail((640, 640))
    sharp = ImageStat.Stat(g.filter(ImageFilter.FIND_EDGES)).stddev[0]
    contrast = ImageStat.Stat(g).stddev[0]
    sm = im.convert('RGB'); sm.thumbnail((200, 200))
    colour = ImageStat.Stat(sm.convert('HSV').split()[1]).stddev[0]
    mp = (w * h) / 1e6
    return (sharp * 1.5 + contrast * 1.0 + min(mp, 24) * 0.9 + colour * 0.6,
            dict(sharp=sharp, contrast=contrast, mp=mp, colour=colour, ar=ar, w=w, h=h)), ''


def sheet(paths, out, cols=4, cw=340, ch=240):
    rows = (len(paths) + cols - 1) // cols
    s = Image.new('RGB', (cols * cw, rows * (ch + 22)), (14, 26, 23)); d = ImageDraw.Draw(s)
    for i, p in enumerate(paths):
        try:
            im = Image.open(LIB + p).convert('RGB'); im.thumbnail((cw - 8, ch - 8))
        except Exception:
            continue
        x, y = (i % cols) * cw, (i // cols) * (ch + 22)
        s.paste(im, (x + 4 + (cw - 8 - im.width) // 2, y + 4 + (ch - 8 - im.height) // 2))
        d.text((x + 6, y + ch + 4), f"{i+1}. {os.path.basename(p)[:34]}", fill=(212, 253, 98))
    s.save(out, quality=88)
    return s.size


SELFTEST = [
    # (path, expect_photo) — the three that beat photography on sharpness, plus real photos
    ("Products/Frames/annotated-L1-parts-inventory.png", False),
    ("Products/Frames/image2.png",                        False),
    ("Products/Frames/HALL OF FRAMES v16.jpg",            False),
    ("Products/Frames/IMG_1408.JPG",                      True),
    ("Products/Frames/Mark Finsihed 3.jpg",               True),
    ("Workshops/Public/2a4a375f_DSC_0172.JPG",            True),
    ("Products/Kits/Flax-Bamboo-Kit.jpg",                 True),
]

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--selftest', action='store_true')
    ap.add_argument('--brief', default='')
    ap.add_argument('--min-w', type=int, default=1400)
    ap.add_argument('--ar', nargs=2, type=float, default=[1.2, 2.1])
    ap.add_argument('--top', type=int, default=24)
    ap.add_argument('--out', default='sheet.jpg')
    ap.add_argument('--scan', type=int, default=400)
    a = ap.parse_args()

    if a.selftest:
        print("PHOTO GATE SELF-TEST — a filter never seen to reject is not a filter\n")
        bad = 0
        for p, expect in SELFTEST:
            f = LIB + p
            if not os.path.exists(f):
                print(f"  SKIP (missing) {p}"); continue
            got, why = is_photo(Image.open(f))
            ok = (got == expect)
            bad += (not ok)
            print(f"  {'PASS' if ok else 'FAIL'}  photo={got!s:5} expected={expect!s:5} "
                  f"{'(' + why + ')' if why else '':28} {p[:46]}")
        print(f"\n{'✓ discriminator works' if not bad else f'✗ {bad} case(s) wrong'}")
        sys.exit(1 if bad else 0)

    pool = load_pool()
    rx = re.compile(a.brief, re.I) if a.brief else None
    cands = [p for p, c, t in pool if not rx or rx.search(c) or rx.search(t)]
    print(f"safe pool {len(pool)} · matching brief {len(cands)} · scanning {min(a.scan, len(cands))}")
    kept, rej = [], {}
    for p in cands[:a.scan]:
        r = score(p, a.min_w, a.ar[0], a.ar[1])
        if r is None:
            rej['unreadable'] = rej.get('unreadable', 0) + 1; continue
        val, why = r
        if val is None:
            rej[why] = rej.get(why.split()[0], 0) + 1 if ' ' in why else rej.get(why, 0) + 1
            rej[why.split()[0]] = rej.get(why.split()[0], 0) + 1
            continue
        kept.append((val[0], val[1], p))
    kept.sort(key=lambda x: -x[0])
    print("rejected:", ', '.join(f'{k}={v}' for k, v in sorted(rej.items(), key=lambda x: -x[1])[:6]))
    print(f"kept {len(kept)}\n")
    print(f"{'score':>6} {'sharp':>6} {'cont':>5} {'col':>5} {'MP':>5} {'AR':>4}  path")
    for s_, m, p in kept[:a.top]:
        print(f"{s_:6.1f} {m['sharp']:6.1f} {m['contrast']:5.1f} {m['colour']:5.1f} {m['mp']:5.1f} {m['ar']:4.2f}  {p[:60]}")
    if kept:
        sz = sheet([p for *_, p in kept[:a.top]], a.out)
        open(os.path.splitext(a.out)[0] + '.txt', 'w').write('\n'.join(p for *_, p in kept[:a.top]))
        print(f"\nsheet → {a.out} {sz}")
