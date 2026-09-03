import os, json, importlib.util
HERE=os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault("TOKEN","SHOPIFY_ACCESS_TOKEN_FROM_ENV")
spec=importlib.util.spec_from_file_location("pc", os.path.join(HERE,"publish_casestudies.py"))
pc=importlib.util.module_from_spec(spec); spec.loader.exec_module(pc)

dups=set(json.load(open("/tmp/dup_handles.json")))
files=sorted(f[:-3] for f in os.listdir(HERE)
             if f.endswith('.md') and not f.startswith('_')
             and f!='charterhouse-school-bamboo-workshop.md')
todo=[h for h in files if h not in dups]
print(f"Local files: {len(files)} | excluding {len(dups)} duplicates + charterhouse | pushing {len(todo)}")
results={"ok":[], "miss":[], "fail":[]}
for h in todo:
    try:
        before=len(results["ok"])+len(results["miss"])+len(results["fail"])
        # publish() prints; capture success by return
        ok=pc.publish(h, dry=False)
        # publish returns True on OK or DRY; False on MISS/FAIL — but it printed which
    except Exception as e:
        print("  EXC", h, e); results["fail"].append(h); continue
json.dump(todo, open("_genuine_push_targets.json","w"), indent=1)
print("DONE")
