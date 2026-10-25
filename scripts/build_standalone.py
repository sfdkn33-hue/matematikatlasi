#!/usr/bin/env python3
"""Offline HTML: inline exactly the same assets as modular entrypoint."""
from pathlib import Path
import re
R=Path(__file__).resolve().parents[1]
html=(R/'index.html').read_text(encoding='utf-8')
def css(m):
 path=m.group(1);txt=(R/path).read_text(encoding='utf-8')
 assert '</style' not in txt.lower()
 return '<style>\n'+txt+'\n</style>'
def script(m):
 path=m.group(1);txt=(R/path).read_text(encoding='utf-8')
 assert '</script' not in txt.lower(),path
 return '<script>\n'+txt+'\n</script>'
html=re.sub(r'<link rel="stylesheet" href="([^\"]+)">',css,html)
html=re.sub(r'<script(?: defer)? src="([^\"]+)"></script>',script,html)
html=re.sub(r'<nav class="top-tools" aria-label="Araçlar">.*?</nav>', '<p class="small">Çevrimdışı önizleme · Tam öğretmen raporu ZIP paketindedir.</p>',html,count=1,flags=re.S)
html=html.replace('href="ogretmen.html"','href="#" onclick="alert(\'Öğretmen raporu tam ZIP paketindedir.\');return false;"').replace('href="arastirma.html"','href="#" onclick="alert(\'Serbest araştırma sayfası tam ZIP paketindedir.\');return false;"')
assert '<script src=' not in html and 'assets/css/' not in html
(R/'ATLAS_TEK_DOSYA.html').write_text(html,encoding='utf-8')
print('Built offline',len(html))
