#!/usr/bin/env python3
"""Publish verified case-study rewrites to the live Shopify blog via Admin API.
Token from env TOKEN. Usage: TOKEN=... python3 publish_casestudies.py --only <handle> | --all [--dry]"""
import os, re, sys, json, html, time, urllib.request, urllib.error

TOKEN = os.environ["TOKEN"]
SHOP = "bamboo-bicycle-club-london-uk.myshopify.com"
API = "2024-10"
BLOGS = {'impact': 122280247670, 'news': 77710033079,
         'schools-and-education': 93572432090, 'club-news': 73142304951}
HERE = os.path.dirname(os.path.abspath(__file__))

def req(path, method="GET", payload=None):
    time.sleep(0.6)  # stay under Shopify's 2 calls/sec
    data = json.dumps(payload).encode() if payload else None
    r = urllib.request.Request(f"https://{SHOP}/admin/api/{API}/{path}", data=data, method=method,
                               headers={"X-Shopify-Access-Token": TOKEN, "Content-Type": "application/json"})
    try:
        return json.load(urllib.request.urlopen(r)), None
    except urllib.error.HTTPError as e:
        return None, f"{e.code} {e.read().decode()[:200]}"

def split_fm(txt):
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', txt, re.S)
    meta = {}
    for line in (m.group(1).splitlines() if m else []):
        mm = re.match(r'^(title|blog|handle|verdict):\s*"?(.*?)"?\s*$', line)
        if mm: meta[mm.group(1)] = mm.group(2)
    return meta, (m.group(2) if m else txt)

def md2html(md):
    out, i, lines = [], 0, md.split('\n')
    def inline(s):
        s = html.escape(s, quote=False)
        s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s)
        s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
        s = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', s)
        return s
    while i < len(lines):
        ln = lines[i].rstrip()
        if not ln.strip(): i += 1; continue
        if ln.startswith('### '): out.append(f"<h2>{inline(ln[4:])}</h2>"); i += 1
        elif ln.startswith('## '): out.append(f"<h2>{inline(ln[3:])}</h2>"); i += 1
        elif ln.startswith('# '): out.append(f"<h2>{inline(ln[2:])}</h2>"); i += 1
        elif ln.startswith('> '):
            q = []
            while i < len(lines) and lines[i].startswith('> '): q.append(inline(lines[i][2:])); i += 1
            out.append("<blockquote><p>" + "<br>".join(q) + "</p></blockquote>")
        elif re.match(r'^[-*] ', ln):
            items = []
            while i < len(lines) and re.match(r'^[-*] ', lines[i].rstrip()):
                items.append(f"<li>{inline(lines[i].rstrip()[2:])}</li>"); i += 1
            out.append("<ul>" + "".join(items) + "</ul>")
        else:
            para = []
            while i < len(lines) and lines[i].strip() and not re.match(r'^(#{1,3} |> |[-*] )', lines[i]):
                para.append(inline(lines[i].rstrip())); i += 1
            out.append("<p>" + " ".join(para) + "</p>")
    return "\n".join(out)

def find_article(blog, handle):
    bid = BLOGS.get(blog)
    cands = [(bid, handle)] if bid else []
    # fallbacks: other blogs + -2024 suffix (Coventry case)
    for b in BLOGS.values():
        for h in (handle, handle + "-2024"):
            cands.append((b, h))
    seen = set()
    for b, h in cands:
        if (b, h) in seen: continue
        seen.add((b, h))
        d, err = req(f"blogs/{b}/articles.json?handle={h}&fields=id,title,handle,author,blog_id")
        if d and d.get('articles'):
            return d['articles'][0]
    return None

def clean_md(md):
    # Drop internal QA notes so they never leak as visible text on the live site.
    # (md2html html.escape()s '<!--' into a visible '&lt;!--' — see memory shopify-redirect/audit-leak.)
    md = re.sub(r'<!--.*?-->', '', md, flags=re.S)               # HTML comments
    # trailing '---' separator + editor/verification footnote to end of doc
    md = re.sub(r'\n-{3,}\s*\n+\*?_?\*?(Editor.?s? note|Editorial note|Verification note|'
                r'Verified[- ]only rewrite|Verified rewrite|Note for editors|Note:).*$',
                '', md, flags=re.S | re.I)
    return md.strip()

def publish(handle, dry):
    path = os.path.join(HERE, handle + ".md")
    meta, body = split_fm(open(path).read())
    art = find_article(meta.get('blog'), handle)
    if not art:
        print(f"  MISS  {handle}: no live article"); return False
    body_html = md2html(clean_md(body.strip()))
    # strip a leading H2 that duplicates the title (title is the article title)
    body_html = re.sub(r'^<h2>[^<]*</h2>\s*', '', body_html, count=1)
    payload = {"article": {"id": art['id'], "title": meta.get('title', art['title']),
                           "body_html": body_html, "author": "Bamboo Bicycle Club"}}
    if dry:
        print(f"  DRY   {handle}: id={art['id']} title='{meta.get('title','')[:46]}' html={len(body_html)}b author:{art.get('author')}->Bamboo Bicycle Club")
        return True
    d, err = req(f"blogs/{art['blog_id']}/articles/{art['id']}.json", "PUT", payload)
    if err: print(f"  FAIL  {handle}: {err}"); return False
    print(f"  OK    {handle}: id={art['id']} updated ({len(body_html)}b)"); return True

if __name__ == "__main__":
    dry = "--dry" in sys.argv
    if "--all" in sys.argv:
        files = sorted(f[:-3] for f in os.listdir(HERE) if f.endswith('.md')
                       and not f.startswith('_') and f != 'charterhouse-school-bamboo-workshop.md')
        n = sum(publish(h, dry) for h in files)
        print(f"\n{n}/{len(files)} {'planned' if dry else 'published'}")
    else:
        i = sys.argv.index("--only"); publish(sys.argv[i+1], dry)
