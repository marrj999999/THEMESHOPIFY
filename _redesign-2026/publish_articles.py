#!/usr/bin/env python3
# Publish schools-and-education blog articles by handle (sets published=true).
# Usage: python3 publish_articles.py <handle> [<handle> ...]
import sys, json, urllib.request
TOKEN="SHOPIFY_ACCESS_TOKEN_FROM_ENV"
SHOP="bamboo-bicycle-club-london-uk.myshopify.com"
BID="93572432090"
JSONL="/Users/jamesmarr/Projects/bbc-theme-new/_redesign-2026/sae-drafts-full.jsonl"
h2id={json.loads(l)['handle']:json.loads(l)['id'] for l in open(JSONL)}
for h in sys.argv[1:]:
    aid=h2id.get(h)
    if not aid:
        print("NO-ID", h); continue
    body=json.dumps({"article":{"id":aid,"published":True}}).encode()
    url=f"https://{SHOP}/admin/api/2024-10/blogs/{BID}/articles/{aid}.json"
    req=urllib.request.Request(url, data=body, method="PUT",
        headers={"X-Shopify-Access-Token":TOKEN,"Content-Type":"application/json","User-Agent":"Mozilla/5.0 bbc-tool"})
    try:
        d=json.load(urllib.request.urlopen(req, timeout=40))
        print("PUBLISHED", d["article"].get("published_at","")[:10], h)
    except urllib.error.HTTPError as e:
        print("HTTP", e.code, h, e.read().decode()[:150])
    except Exception as e:
        print("ERR", type(e).__name__, h)
