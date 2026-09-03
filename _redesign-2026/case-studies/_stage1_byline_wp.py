import json, time, urllib.request, urllib.error, re, os
TOKEN="SHOPIFY_ACCESS_TOKEN_FROM_ENV"; SHOP="bamboo-bicycle-club-london-uk.myshopify.com"; API="2024-01"
BLOGS={'impact':122280247670,'news':77710033079,'club-news':73142304951,'schools-and-education':93572432090}
def req(path, method="GET", payload=None):
    time.sleep(0.4)
    data=json.dumps(payload).encode() if payload else None
    r=urllib.request.Request(f"https://{SHOP}/admin/api/{API}/{path}", data=data, method=method,
        headers={"X-Shopify-Access-Token":TOKEN,"Content-Type":"application/json"})
    try: return json.load(urllib.request.urlopen(r)), None
    except urllib.error.HTTPError as e: return None, f"{e.code} {e.read().decode()[:150]}"
def listpub():
    out=[]
    for name,bid in BLOGS.items():
        url=f"https://{SHOP}/admin/api/{API}/blogs/{bid}/articles.json?limit=250&fields=id,handle,title,author,body_html,published_at,blog_id"
        while url:
            rr=urllib.request.Request(url,headers={"X-Shopify-Access-Token":TOKEN}); resp=urllib.request.urlopen(rr); link=resp.headers.get('Link',''); d=json.load(resp); time.sleep(0.3)
            for a in d['articles']:
                if a.get('published_at'): a['blog']=name; out.append(a)
            m=re.search(r'<([^>]+)>;\s*rel="next"', link); url=m.group(1) if m else None
    return out
os.makedirs("_backups/rebuild", exist_ok=True)
pubs=listpub()
print("published:",len(pubs), flush=True)
byl=wp=0; log=[]
for a in pubs:
    aid=a['id']; payload={"id":aid}; changed=[]
    if a.get('author')!="Bamboo Bicycle Club":
        payload["author"]="Bamboo Bicycle Club"; changed.append(f"author:{a.get('author')}->BBC")
    body=a['body_html'] or ''
    if '<!-- wp:' in body or '<!-- /wp:' in body:
        nb=re.sub(r'<!--\s*/?wp:[^>]*?-->','',body); nb=re.sub(r'\n{3,}','\n\n',nb).strip()
        if nb!=body: payload["body_html"]=nb; changed.append("wp-markup-stripped")
    if len(changed)==0: continue
    json.dump(a, open(f"_backups/rebuild/s1_{aid}.json","w"), indent=1)
    d,err=req(f"blogs/{a['blog_id']}/articles/{aid}.json","PUT",{"article":payload})
    if err: print("FAIL",a['handle'],err, flush=True); continue
    if "author" in payload: byl+=1
    if "body_html" in payload: wp+=1
    log.append({"id":aid,"handle":a['handle'],"changed":changed})
json.dump(log, open("_stage1_log.json","w"), indent=1)
print(f"DONE Byline->BBC: {byl} | WP-stripped: {wp} | total touched: {len(log)}", flush=True)
