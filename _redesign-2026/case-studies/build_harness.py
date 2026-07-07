import importlib.util, re, os
spec=importlib.util.spec_from_file_location("a","_asset.py"); A=importlib.util.module_from_spec(spec); spec.loader.exec_module(A)
H="/tmp/bbc-harness"; CDN="https://cdn.shopify.com/s/files/1/0502/8695/2631/t/49/assets/"
os.makedirs(H+"/css", exist_ok=True)
css_order=["base.css","bbc-foundation.css","bbc-buttons.css","bbc-layout.css","bbc-practical-spacing.css",
 "bbc-accessibility.css","bbc-unified-styles.css","bbc-mobile-fixes.css","bbc-video-responsive.css",
 "bbc-aaa-2026.css","bbc-redesign-2026.css"]
# clear old css
for f in os.listdir(H+"/css"):
    if f.endswith('.css'): os.remove(H+"/css/"+f)
for i,name in enumerate(css_order):
    val,err=A.get_asset("assets/"+name)
    if err or val is None: print("CSS MISS",name,err); continue
    val=re.sub(r'url\(([\'"]?)(?!https?:|data:|/)', lambda m:'url('+m.group(1)+CDN, val)
    open(f"{H}/css/{i:02d}-{name}","w").write(val)
sec,_=A.get_asset("sections/bbc-home-2026.liquid")
inline_styles="\n".join(re.findall(r'<style>(.*?)</style>', sec, re.S))
icons_snip,_=A.get_asset("snippets/bbc-icons.liquid")
icon_map={}
for m in re.finditer(r"when '([\w-]+)'(.*?)(?=\{%-?\s*when|\{%-?\s*else|\{%-?\s*endcase)", icons_snip, re.S):
    svg=re.search(r'<svg.*?</svg>', m.group(2), re.S)
    if svg: icon_map[m.group(1)]=svg.group(0)
def render_icon(mm):
    name,size=mm.group(1),mm.group(2)
    svg=icon_map.get(name,'<svg viewBox="0 0 24 24"></svg>')
    svg=re.sub(r'\{\{\s*size[^}]*\}\}', size, svg)
    svg=re.sub(r'width="[^"]*"', f'width="{size}"', svg, count=1); svg=re.sub(r'height="[^"]*"', f'height="{size}"', svg, count=1)
    return svg
LIVE={'why_title':'If you can use a few hand tools, you can build this.',
      'why_lede':'Simple method, hand tools, low-cost renewable material — open to all ages, backgrounds and abilities.',
      'why_kicker':'Built by anyone'}
def liquidify(html):
    html=re.sub(r'\{%-?\s*comment\s*-?%\}.*?\{%-?\s*endcomment\s*-?%\}','',html,flags=re.S)
    html=re.sub(r"\{\{\s*'([\w.\-]+)'\s*\|\s*asset_url\s*\}\}", lambda m:CDN+m.group(1), html)
    html=re.sub(r"\{%\s*render 'bbc-icons',\s*icon:\s*'([\w-]+)',\s*size:\s*(\d+)\s*%\}", render_icon, html)
    def setrepl(m):
        key=m.group(1); return LIVE.get(key, m.group(2))
    html=re.sub(r"\{\{\s*section\.settings\.(\w+)\s*\|\s*default:\s*'([^']*)'\s*\}\}", setrepl, html)
    html=re.sub(r"\{\{\s*why_url[^}]*\}\}", "/pages/why-bamboo", html)
    html=re.sub(r"\{%-?\s*assign[^%]*%\}",'',html)
    html=re.sub(r"\{\{.*?\}\}",'',html,flags=re.S); html=re.sub(r"\{%-?.*?-?%\}",'',html,flags=re.S)
    return html
def grab(anchor):
    i=sec.find(anchor); assert i>=0, anchor
    s=sec.find('<section', i); depth=0; j=s
    while True:
        no=sec.find('<section',j+1); nc=sec.find('</section>',j+1)
        if nc==-1: end=len(sec); break
        if no!=-1 and no<nc: depth+=1; j=no
        else:
            if depth==0: end=nc+len('</section>'); break
            depth-=1; j=nc
    return sec[s:end]
bands=[liquidify(grab(a)) for a in ['<section class="rd-pad acc" id="why-bamboo">',
        'PROVEN RIDE (comfort','TECHNICAL / UNIVERSITIES','MICRO BAMBOO BIKE PRODUCTION']]
links="\n".join(f'<link rel="stylesheet" href="css/{f}">' for f in sorted(os.listdir(H+"/css")) if f.endswith('.css'))
doc=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Hanken+Grotesque:wght@500;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Atkinson+Hyperlegible:wght@400;700&display=swap">
{links}
<style>{inline_styles}</style><style>body{{margin:0}}</style></head>
<body class="gradient rd-has-botbar"><main class="content-for-layout focus-none"><section class="shopify-section section bbc-home-2026-wrap"><div class="bbc-rd bbc-rd-home">
{chr(10).join(bands)}
</div></section></main></body></html>'''
open(f"{H}/index.html","w").write(doc)
print("harness rebuilt:", len(doc),"bytes | leftover liquid:", doc.count('{%')+doc.count('{{'))
