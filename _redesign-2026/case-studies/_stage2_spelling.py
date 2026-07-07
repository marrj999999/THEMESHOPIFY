import json, time, urllib.request, urllib.error, re, os, sys
TOKEN="SHOPIFY_ACCESS_TOKEN_FROM_ENV"; SHOP="bamboo-bicycle-club-london-uk.myshopify.com"; API="2024-01"
BLOGS={'impact':122280247670,'news':77710033079,'club-news':73142304951,'schools-and-education':93572432090}
GO = "--go" in sys.argv
def req(path, method="GET", payload=None):
    time.sleep(0.4)
    data=json.dumps(payload).encode() if payload else None
    r=urllib.request.Request(f"https://{SHOP}/admin/api/{API}/{path}", data=data, method=method,
        headers={"X-Shopify-Access-Token":TOKEN,"Content-Type":"application/json"})
    try: return json.load(urllib.request.urlopen(r)), None
    except urllib.error.HTTPError as e: return None, f"{e.code} {e.read().decode()[:150]}"

# explicit American -> British whole words (avoids -ize/-ise over-reach; no 'size','prize',etc.)
MAP = {
 "color":"colour","colors":"colours","colored":"coloured","coloring":"colouring","colorful":"colourful",
 "behavior":"behaviour","behaviors":"behaviours","behavioral":"behavioural",
 "favorite":"favourite","favorites":"favourites","favorable":"favourable","favor":"favour",
 "honor":"honour","honored":"honoured","honoring":"honouring",
 "neighbor":"neighbour","neighbors":"neighbours","neighborhood":"neighbourhood","neighboring":"neighbouring",
 "fiber":"fibre","fibers":"fibres",
 "center":"centre","centers":"centres","centered":"centred","centering":"centring",
 "meter":"metre","meters":"metres","liter":"litre","liters":"litres",
 "kilometer":"kilometre","kilometers":"kilometres","centimeter":"centimetre","centimeters":"centimetres",
 "millimeter":"millimetre","millimeters":"millimetres",
 "aluminum":"aluminium",
 "traveled":"travelled","traveling":"travelling","traveler":"traveller","travelers":"travellers",
 "modeling":"modelling","modeled":"modelled","labeled":"labelled","labeling":"labelling",
 "canceled":"cancelled","canceling":"cancelling","jewelry":"jewellery",
 "gray":"grey","grayed":"greyed",
 "defense":"defence","offense":"offence","license":"licence","practiced":"practised","practicing":"practising",
 "organize":"organise","organized":"organised","organizing":"organising","organization":"organisation","organizations":"organisations","organizer":"organiser","organizers":"organisers",
 "recognize":"recognise","recognized":"recognised","recognizing":"recognising",
 "realize":"realise","realized":"realised","realizing":"realising","realization":"realisation",
 "specialize":"specialise","specialized":"specialised","specializing":"specialising","specialization":"specialisation",
 "emphasize":"emphasise","emphasized":"emphasised","emphasizing":"emphasising",
 "maximize":"maximise","maximized":"maximised","minimize":"minimise","minimized":"minimised",
 "optimize":"optimise","optimized":"optimised","optimizing":"optimising",
 "customize":"customise","customized":"customised","customizing":"customising",
 "prioritize":"prioritise","prioritized":"prioritised","prioritizing":"prioritising",
 "utilize":"utilise","utilized":"utilised","utilizing":"utilising",
 "revolutionize":"revolutionise","revolutionized":"revolutionised","revolutionizing":"revolutionising",
 "analyze":"analyse","analyzed":"analysed","analyzing":"analysing",
 "catalog":"catalogue","dialog":"dialogue","mold":"mould","molded":"moulded","molding":"moulding",
 "enrollment":"enrolment","fulfill":"fulfil","fulfilled":"fulfilled","practiced":"practised",
 "fueled":"fuelled","fueling":"fuelling","signaled":"signalled","marveled":"marvelled",
}
def case_match(src, repl):
    if src.isupper(): return repl.upper()
    if src[0].isupper(): return repl[0].upper()+repl[1:]
    return repl
pat = re.compile(r'\b(' + '|'.join(sorted(MAP, key=len, reverse=True)) + r')\b', re.I)
def fix_text(t):
    return pat.sub(lambda m: case_match(m.group(0), MAP[m.group(0).lower()]), t)
def fix_html(html):
    # only replace inside text nodes, never inside <...> tags (protects style="color:" and URLs)
    parts = re.split(r'(<[^>]+>)', html)
    out=[]; n=0
    for i,p in enumerate(parts):
        if p.startswith('<'): out.append(p)
        else:
            np=fix_text(p); n += (np!=p); out.append(np)
    return ''.join(out), n

def listpub():
    out=[]
    for name,bid in BLOGS.items():
        url=f"https://{SHOP}/admin/api/{API}/blogs/{bid}/articles.json?limit=250&fields=id,handle,title,body_html,published_at,blog_id"
        while url:
            rr=urllib.request.Request(url,headers={"X-Shopify-Access-Token":TOKEN}); resp=urllib.request.urlopen(rr); link=resp.headers.get('Link',''); d=json.load(resp); time.sleep(0.3)
            for a in d['articles']:
                if a.get('published_at'): out.append(a)
            m=re.search(r'<([^>]+)>;\s*rel="next"', link); url=m.group(1) if m else None
    return out
os.makedirs("_backups/rebuild", exist_ok=True)
pubs=listpub()
log=[]; touched=0
for a in pubs:
    body=a['body_html'] or ''; title=a['title'] or ''
    nb,nbn=fix_html(body); nt=fix_text(title)
    if nb==body and nt==title: continue
    # collect sample diffs for review
    diffs=[]
    for m in pat.finditer(re.sub(r'<[^>]+>',' ',body)+" "+title):
        w=m.group(0); diffs.append(f"{w}->{case_match(w,MAP[w.lower()])}")
    diffs=sorted(set(diffs))
    log.append({"id":a['id'],"handle":a['handle'],"blog_id":a['blog_id'],"title_change":(title,nt) if nt!=title else None,"repls":diffs})
    if GO:
        json.dump(a, open(f"_backups/rebuild/s2_{a['id']}.json","w"), indent=1)
        payload={"id":a['id'],"body_html":nb}
        if nt!=title: payload["title"]=nt
        d,err=req(f"blogs/{a['blog_id']}/articles/{a['id']}.json","PUT",{"article":payload})
        if err: print("FAIL",a['handle'],err, flush=True); continue
        touched+=1
json.dump(log, open("_stage2_log.json","w"), indent=1)
print(("APPLIED " if GO else "DRY-RUN ")+f"posts needing spelling fix: {len(log)} | pushed: {touched}", flush=True)
for e in log: print(f"  {e['handle'][:45]}: {', '.join(e['repls'][:8])}" + (f"  TITLE:{e['title_change']}" if e['title_change'] else ""), flush=True)
