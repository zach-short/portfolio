"""Rebuild the card fonts: the site's woff2 files, subset to Latin and saved as ttf.

Satori reads ttf, otf and woff but not woff2, which is what `public/fonts` holds. Run from the
repo root:  python3 src/lib/og/fonts/subset.py   (needs fonttools and brotli)

Latin-1 plus the few punctuation marks the copy uses. A character outside that range renders as
the font's .notdef box, so widen `UNICODES` before putting such a title on a card.
"""
from fontTools import subset
from fontTools.ttLib import TTFont

SOURCES = 'public/fonts'
OUT = 'src/lib/og/fonts'
FILES = ['BricolageGrotesque_72pt-Bold', 'Onest-Regular', 'Onest-SemiBold', 'Onest-Bold', 'GeistMono-Medium']
UNICODES = (
    list(range(0x20, 0x7F))
    + list(range(0xA0, 0x100))
    + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2192, 0x2197]
)

for name in FILES:
    font = TTFont(f'{SOURCES}/{name}.woff2')
    options = subset.Options()
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.notdef_outline = True
    options.hinting = False
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(font)
    font.flavor = None
    font.save(f'{OUT}/{name}.ttf')
