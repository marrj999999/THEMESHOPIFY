import json, time, urllib.request, urllib.error, re, sys
TOKEN="SHOPIFY_ACCESS_TOKEN_FROM_ENV"
SHOP="bamboo-bicycle-club-london-uk.myshopify.com"
API="2024-01"
def req(path, method="GET", payload=None):
    time.sleep(0.55)
    data=json.dumps(payload).encode() if payload else None
    r=urllib.request.Request(f"https://{SHOP}/admin/api/{API}/{path}", data=data, method=method,
        headers={"X-Shopify-Access-Token":TOKEN,"Content-Type":"application/json"})
    try:
        resp=urllib.request.urlopen(r)
        return json.load(resp), resp.headers.get('Link',''), None
    except urllib.error.HTTPError as e:
        return None, '', f"{e.code} {e.read().decode()[:300]}"

def get_all_redirects():
    out=[]; url="redirects.json?limit=250"
    while url:
        d,link,err=req(url)
        if err: print("ERR listing:",err); break
        out+=d.get('redirects',[])
        m=re.search(r'<[^>]+[?&]([^>]*page_info=[^>&]+)[^>]*>;\s*rel="next"', link)
        url=f"redirects.json?limit=250&{m.group(1)}" if m else None
    return out

if __name__=="__main__":
    existing=get_all_redirects()
    paths={r['path'] for r in existing}
    json.dump(existing, open("_existing_redirects.json","w"), indent=1)
    print(f"Existing redirects: {len(existing)}")
    plan=json.load(open("_redirects_final.json"))
    collide=[r for r in plan if r['path'] in paths]
    print(f"Planned: {len(plan)}  Already exist (collision): {len(collide)}")
    for c in collide: print("  COLLIDE:", c['path'], "-> existing")
