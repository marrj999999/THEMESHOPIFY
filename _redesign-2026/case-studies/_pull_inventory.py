import json, time, urllib.request, re
TOKEN="SHOPIFY_ACCESS_TOKEN_FROM_ENV"
SHOP="bamboo-bicycle-club-london-uk.myshopify.com"
API="2024-01"
BLOGS={'impact':122280247670,'news':77710033079,'club-news':73142304951,'schools-and-education':93572432090}
def req(url):
    time.sleep(0.55)
    r=urllib.request.Request(url, headers={"X-Shopify-Access-Token":TOKEN,"Content-Type":"application/json"})
    resp=urllib.request.urlopen(r)
    link=resp.headers.get('Link','')
    return json.load(resp), link
all_articles=[]
for name,bid in BLOGS.items():
    url=f"https://{SHOP}/admin/api/{API}/blogs/{bid}/articles.json?limit=250&fields=id,title,handle,author,blog_id,published_at,updated_at,created_at"
    while url:
        d,link=req(url)
        for a in d.get('articles',[]):
            a['blog_name']=name; all_articles.append(a)
        # parse next page_info
        m=re.search(r'<([^>]+)>;\s*rel="next"', link)
        url=m.group(1) if m else None
json.dump(all_articles, open("_live_inventory.json","w"), indent=1)
from collections import Counter
print("Total:", len(all_articles))
print("Per blog:", dict(Counter(a['blog_name'] for a in all_articles)))
# duplicate handle check within blog
seen=Counter((a['blog_name'],a['handle']) for a in all_articles)
dups=[k for k,v in seen.items() if v>1]
print("Duplicate (blog,handle) records:", len(dups), dups[:5])
