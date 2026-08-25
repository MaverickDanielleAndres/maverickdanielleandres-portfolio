"""Subset Roboto Flex to only the glyphs used by the hero name.

Reduces the file from ~326 KB to a few KB by keeping only the characters
"Maverick Danielle" needs, plus basic punctuation. Also drops unused
OpenType tables, axes we don't use, and re-compresses the woff2.
"""
import sys
from fontTools.subset import Subsetter, Options
from fontTools.ttLib import TTFont

SRC = "node_modules/@fontsource-variable/roboto-flex/files/roboto-flex-latin-full-normal.woff2"
DST = "public/fonts/roboto-flex-subset.woff2"

# TextPressure is only used for "Maverick" + "Danielle" — 11 unique glyphs.
CHARS = "Maverick Danielle"

options = Options()
options.flavor = "woff2"
# Keep only OpenType features we actually use — none of the advanced
# layout features are required for our text-only effect.
options.layout_features = []
options.name_IDs = ["*"]
options.notdef_outline = False
options.recommended_glyphs = False
options.with_zopfli = False
options.desubroutinize = True
# Keep wght and wdth axes (TextPressure animates both), drop everything else
options.axis_ranges = {
    "wght": (100, 1000),
    "wdth": (25, 151),
}
options.hinting = False
options.legacy_kern = False
options.ignore_missing_glyphs = True
options.passthrough_tables = False
options.retain_gids = False
options.default_fvar_tables = False

# Convert woff2 -> ttf, subset, then re-compress to woff2
font = TTFont(SRC)
font.flavor = None  # decode the woff2 wrapper
subsetter = Subsetter(options=options)
subsetter.populate(text=CHARS)
subsetter.subset(font)
font.flavor = "woff2"
font.save(DST)

import os
print(f"Wrote {DST}: {os.path.getsize(DST)} bytes")