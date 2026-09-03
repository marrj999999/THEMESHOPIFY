#!/usr/bin/env python3
# Upload a local binary file as a Shopify THEME asset. Usage: upload_asset.py <localfile> <assets/key.png>
import sys, json, base64, urllib.request
TOKEN="SHOPIFY_ACCESS_TOKEN_FROM_ENV"; SHOP="bamboo-bicycle-club-london-uk.myshopify.com"; THEME="195991470454"
local, key = sys.argv[1], sys.argv[2]
b64=base64.b64encode(open(local,'rb').read()).decode()
body=json.dumps({"asset":{"key":key,"attachment":b64}}).encode()
url=f"https://{SHOP}/admin/api/2024-10/themes/{THEME}/assets.json"
req=urllib.request.Request(url, data=body, method="PUT", headers={"X-Shopify-Access-Token":TOKEN,"Content-Type":"application/json","User-Agent":"Mozilla/5.0 bbc"})
try:
    d=json.load(urllib.request.urlopen(req, timeout=60))
    print("UPLOADED", d["asset"]["key"])
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read().decode()[:200])
