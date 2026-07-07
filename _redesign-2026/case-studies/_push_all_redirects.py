import json, time, urllib.request, urllib.error
TOKEN="SHOPIFY_ACCESS_TOKEN_FROM_ENV"
SHOP="bamboo-bicycle-club-london-uk.myshopify.com"; API="2024-01"
def req(path, method="GET", payload=None):
    time.sleep(0.55)
    data=json.dumps(payload).encode() if payload else None
    r=urllib.request.Request(f"https://{SHOP}/admin/api/{API}/{path}", data=data, method=method,
        headers={"X-Shopify-Access-Token":TOKEN,"Content-Type":"application/json"})
    try:
        return json.load(urllib.request.urlopen(r)), None
    except urllib.error.HTTPError as e:
        return None, f"{e.code} {e.read().decode()[:300]}"

plan=json.load(open("_redirects_final.json"))
existing=json.load(open("_existing_redirects.json"))
exist_map={r['path']:r for r in existing}
log=[]
created=skipped=failed=0
for r in plan:
    p,t=r['path'],r['target']
    if p in exist_map:
        log.append({"path":p,"target":t,"status":"already_exists","id":exist_map[p]['id']}); skipped+=1; continue
    d,err=req("redirects.json","POST",{"redirect":{"path":p,"target":t}})
    if err:
        log.append({"path":p,"target":t,"status":"FAILED","error":err}); failed+=1; print("FAIL",p,err)
    else:
        rid=d['redirect']['id']
        log.append({"path":p,"target":t,"status":"created","id":rid}); created+=1; print("OK",rid,p)
json.dump(log, open("_redirect_push_log.json","w"), indent=1)
print(f"\nCreated {created}  Skipped(existing) {skipped}  Failed {failed}  Total {len(plan)}")
