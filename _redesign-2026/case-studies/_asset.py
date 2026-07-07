import json, time, urllib.request, urllib.error, sys
TOKEN="SHOPIFY_ACCESS_TOKEN_FROM_ENV"; SHOP="bamboo-bicycle-club-london-uk.myshopify.com"; API="2024-01"
THEME=196243292534  # BBC Redesign 2026 - HOMEPAGE RESTORED (unpublished). NEVER 191768756598 (LIVE).
def _req(path, method="GET", payload=None):
    time.sleep(0.5)
    data=json.dumps(payload).encode() if payload else None
    r=urllib.request.Request(f"https://{SHOP}/admin/api/{API}/{path}", data=data, method=method,
        headers={"X-Shopify-Access-Token":TOKEN,"Content-Type":"application/json"})
    try: return json.load(urllib.request.urlopen(r)), None
    except urllib.error.HTTPError as e: return None, f"{e.code} {e.read().decode()[:300]}"
def get_asset(key):
    d,err=_req(f"themes/{THEME}/assets.json?asset[key]={key}")
    if err: return None, err
    return d['asset'].get('value'), None
def put_asset(key, value):
    return _req(f"themes/{THEME}/assets.json","PUT",{"asset":{"key":key,"value":value}})
if __name__=="__main__":
    cmd=sys.argv[1]
    if cmd=="get":
        v,err=get_asset(sys.argv[2]); print(err or v)
    elif cmd=="list":
        d,err=_req(f"themes/{THEME}/assets.json")
        if err: print(err)
        else:
            for a in sorted(d['assets'], key=lambda x:x['key']):
                if a['key'].startswith('templates/page'): print(a['key'])
