#!/usr/bin/env python3
"""ACTIVATE the 36 dormant 301 redirects by unpublishing each duplicate article.
Shopify serves a live article over a redirect, so the duplicate must be unpublished
for its /blogs/... URL to 301 to the canonical. REVERSIBLE: re-PUT published_at to restore.
Backs up each article's full JSON to _backups/ before unpublishing, then verifies the 301 fires.
Run:  python3 _unpublish_duplicates.py        (dry-run, lists what it would do)
      python3 _unpublish_duplicates.py --go    (actually unpublish + verify)
"""
import os, sys, json, time, urllib.request, urllib.error
TOKEN=os.environ.get("TOKEN","SHOPIFY_ACCESS_TOKEN_FROM_ENV")
SHOP="bamboo-bicycle-club-london-uk.myshopify.com"; API="2024-01"
GO="--go" in sys.argv
def req(path, method="GET", payload=None):
    time.sleep(0.55)
    data=json.dumps(payload).encode() if payload else None
    r=urllib.request.Request(f"https://{SHOP}/admin/api/{API}/{path}", data=data, method=method,
        headers={"X-Shopify-Access-Token":TOKEN,"Content-Type":"application/json"})
    try: return json.load(urllib.request.urlopen(r)), None
    except urllib.error.HTTPError as e: return None, f"{e.code} {e.read().decode()[:200]}"

inv={a['handle']:a for a in json.load(open("_live_inventory.json"))}
red=json.load(open("_redirects_final.json"))
os.makedirs("_backups", exist_ok=True)
done=[]
for r in red:
    handle=r['path'].rsplit('/',1)[-1]
    art=inv.get(handle)
    if not art: print("?? not in inventory:",handle); continue
    aid=art['id']
    if not GO:
        print(f"WOULD unpublish {aid}  {handle}"); continue
    full,err=req(f"articles/{aid}.json")
    if err: print("GET fail",handle,err); continue
    json.dump(full['article'], open(f"_backups/dup_{aid}.json","w"), indent=1)
    d,err=req(f"blogs/{art['blog_id']}/articles/{aid}.json","PUT",{"article":{"id":aid,"published":False}})
    if err: print("UNPUBLISH FAIL",handle,err); continue
    done.append({"id":aid,"handle":handle,"path":r['path'],"target":r['target']})
    print("unpublished",aid,handle)
if GO:
    json.dump(done, open("_unpublish_log.json","w"), indent=1)
    print(f"\nUnpublished {len(done)}. Waiting 8s then verifying redirects fire...")
    time.sleep(8)
    import urllib.request as u
    ok=bad=0
    for r in done:
        try:
            rq=u.Request("https://bamboobicycleclub.org"+r['path'], method="HEAD")
            resp=u.urlopen(rq)  # follows; check final
            code=resp.getcode(); fired = resp.geturl().rstrip('/').endswith(r['target'].rstrip('/'))
            print(("OK  " if fired else "??  ")+r['path']+" -> "+resp.geturl()); ok+=fired; bad+=(not fired)
        except Exception as e:
            print("ERR",r['path'],e); bad+=1
    print(f"\nRedirects firing: {ok}  not-yet/err: {bad}")
