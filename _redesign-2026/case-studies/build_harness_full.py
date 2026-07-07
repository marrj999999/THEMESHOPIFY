import importlib.util, re, os
spec=importlib.util.spec_from_file_location("a","_asset.py"); A=importlib.util.module_from_spec(spec); spec.loader.exec_module(A)
H="/tmp/bbc-harness"; CDN="https://cdn.shopify.com/s/files/1/0502/8695/2631/t/49/assets/"
os.makedirs(H+"/css", exist_ok=True)
sec,_=A.get_asset("sections/bbc-home-2026.liquid")
body=sec.split('{% schema %}')[0]
inline=" ".join(re.findall(r'<style>(.*?)</style>', body, re.S))
icons,_=A.get_asset("snippets/bbc-icons.liquid")
imap={}
for m in re.finditer(r"when '([\w-]+)'(.*?)(?=\{%-?\s*when|\{%-?\s*else|\{%-?\s*endcase)", icons, re.S):
    s=re.search(r'<svg.*?</svg>', m.group(2), re.S)
    if s: imap[m.group(1)]=s.group(0)
def icon(mm):
    n,sz=mm.group(1),mm.group(2); s=imap.get(n,'<svg viewBox="0 0 24 24"></svg>')
    s=re.sub(r'\{\{\s*size[^}]*\}\}',sz,s); s=re.sub(r'width="[^"]*"',f'width="{sz}"',s,1); s=re.sub(r'height="[^"]*"',f'height="{sz}"',s,1); return s
LIVE={'why_title':'If you can use a few hand tools, you can build this.','why_lede':'Simple method, hand tools, low-cost renewable material — open to all ages, backgrounds and abilities.','why_kicker':'Built by anyone'}
def lq(h):
    h=re.sub(r'<style>.*?</style>','',h,flags=re.S); h=re.sub(r'<link[^>]*>','',h); h=re.sub(r'<noscript>.*?</noscript>','',h,flags=re.S)
    h=re.sub(r'\{%-?\s*comment\s*-?%\}.*?\{%-?\s*endcomment\s*-?%\}','',h,flags=re.S)
    h=re.sub(r"\{\{\s*'([\w.\-]+)'\s*\|\s*asset_url\s*\}\}",lambda m:CDN+m.group(1),h)
    h=re.sub(r"\{%\s*render 'bbc-icons',\s*icon:\s*'([\w-]+)',\s*size:\s*(\d+)\s*%\}",icon,h)
    h=re.sub(r"\{\{\s*section\.settings\.(\w+)\s*\|\s*default:\s*'([^']*)'\s*\}\}",lambda m:LIVE.get(m.group(1),m.group(2)),h)
    h=re.sub(r"\{%-?\s*assign[^%]*%\}",'',h); h=re.sub(r"\{\{.*?\}\}",'',h,flags=re.S); h=re.sub(r"\{%-?.*?-?%\}",'',h,flags=re.S)
    return h
bandhtml=lq(body)
links="\n".join(f'<link rel="stylesheet" href="css/{f}">' for f in sorted(os.listdir(H+"/css")) if f.endswith('.css'))
doc=f'''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Hanken+Grotesque:wght@500;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Atkinson+Hyperlegible:wght@400;700&display=swap">
{links}<style>{inline}</style><style>html,body{{margin:0;background:#faf7f0}}</style></head>
<body class="rd-has-botbar"><main><section class="shopify-section section bbc-home-2026-wrap"><div class="bbc-rd bbc-rd-home">
{bandhtml}
</div></section></main></body></html>'''
open(f"{H}/index.html","w").write(doc)
print("FULL harness:",len(doc),"bytes | leftover liquid:",doc.count('{%')+doc.count('{{'),"| sections:",doc.count('<section'))
