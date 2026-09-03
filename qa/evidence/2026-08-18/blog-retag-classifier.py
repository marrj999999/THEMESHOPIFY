#!/usr/bin/env python3
"""Three-axis retag for the BBC blog estate. DRY RUN unless --apply is passed.

Axes, all human-readable so they double as the category pills the theme renders:
  STAKEHOLDER — who the post is for   (For makers / For schools / For prisons /
                                        For business / For funders / Press)
  EXPERIENCE  — what kind of read     (Build story / How-to / Case study / News /
                                        Research / Adventure)
  SEO         — search intent / topic (Gravel / Road / Mountain bike / Balance bike /
                                        Cargo bike / Frame building / Sustainability /
                                        Workshops / Kits / Bamboo material)

Existing tags are PRESERVED — the new axes are added alongside, so nothing that
currently filters, links or is referenced elsewhere breaks. Years and internal
markers are the only things dropped.
"""
import json, re, sys, os, collections, urllib.request, time

SCRATCH = "/private/tmp/claude-501/-Users-jamesmarr-Downloads/386ed647-cf32-4a62-80ba-0f6b67449c79/scratchpad"
APPLY = "--apply" in sys.argv
arts = json.load(open(f"{SCRATCH}/all-articles.json"))

YEAR = re.compile(r"^(19|20)\d{2}$")
DROP = {"verified"}                      # internal markers, not reader categories

def text_of(a, blog):
    """HIGH-PRECISION SIGNAL ONLY. The first pass read 1500 chars of body and tagged an
    insurance press piece as Research + How-to + Case study, because 'test', 'engineering'
    and 'impact' appear in almost any body copy. Title, handle and the human-chosen existing
    tags are deliberate; body prose is not. Precision over recall — a wrong tag is worse
    than a missing one, because a wrong tag puts the post under a category a reader is
    actively filtering for."""
    return " ".join([a.get("title",""), a.get("handle","").replace("-"," "),
                     a.get("tags","")]).lower()

def has(t, *words):
    return any(re.search(r"\b"+re.escape(w)+r"\b", t) for w in words)

def stakeholder(t, blog, tags):
    """One value, first match wins — most specific audience first. No fallback: an article
    we cannot place stays unplaced rather than being swept into 'For makers'."""
    if has(t,"prison","prisons","hmp","build to bond","lowdham","offender","resettlement","rehabilitation"):
        return ["For prisons"]
    if blog=="schools-and-education" or has(t,"school","schools","college","university","student","students","stem","classroom","teacher","pupils","curriculum"):
        return ["For schools"]
    if has(t,"press","featured","interview","podcast","guardian","financial times","road.cc","uncrate","inhabitat","gcn","bikeradar","magazine","coverage"):
        return ["Press"]
    if has(t,"award","investec","innovate uk","grant","funding","funder","social enterprise","cic","charity","lottery"):
        return ["For funders"]
    if has(t,"corporate","team building","team day","away day","franchise","staff"):
        return ["For business"]
    if has(t,"kit","home build","build by","diy","custom","finished","my bamboo","builder"):
        return ["For makers"]
    # BEST-EFFORT FALLBACK (James, 2026-08-18: "all 608, best effort"). Everything the precise
    # rules cannot place is a maker-facing post by default — that is what club-news mostly is.
    # Recorded per-article as `fallback` in the plan so the guessed ones stay auditable.
    return ["For makers"]

def experience(t, blog, tags):
    if has(t,"how to","how-to","tutorial","guide","step by step","instructions","workshop wednesday"):
        return ["How-to"]
    if has(t,"study","research","tested","tensile","laboratory","analysis","species","iso 22157"):
        return ["Research"]
    if has(t,"journey","adventure","expedition","bikepacking","touring","across","miles","cycled"):
        return ["Adventure"]
    if has(t,"case study","impact","programme","outcome","evaluation"):
        return ["Case study"]
    if has(t,"press","featured","launch","announce","award","exhibition","festival","summit"):
        return ["News"]
    if has(t,"build by","review","finished","my build","built his","built her","home build","custom"):
        return ["Build story"]
    return ["Build story"] if blog=="club-news" else ["News"]

def seo(t, tags):
    """Topic axis — at most two, and only from the title/handle/tags."""
    out=[]
    m=[("Gravel",["gravel"]),("Road",["road bike","road frame","racing"]),
       ("Mountain bike",["mountain bike","mtb","29er","fatbike","fat bike"]),
       ("Balance bike",["balance bike","kids bike"]),
       ("Cargo bike",["cargo","e-cargo","ebike","e-bike"]),
       ("Frame building",["frame building","framebuilding","lugs","jig","mitre","epoxy","flax","fibre"]),
       ("Sustainability",["sustainab","eco","environment","recycl","circular"]),
       ("Workshops",["workshop","course","class"]),
       ("Kits",["kit","flatpack","flat pack"]),
       ("Bamboo material",["species","culm","harvest","tensile","strength"])]
    for label,words in m:
        if has(t,*words): out.append(label)
    return out[:2]

rows=[]; dist=collections.Counter(); axis_dist={"stakeholder":collections.Counter(),"experience":collections.Counter(),"seo":collections.Counter()}
for blog, lst in arts.items():
    for a in lst:
        t = text_of(a, blog)
        old = [x.strip() for x in (a.get("tags") or "").split(",") if x.strip()]
        keep = [x for x in old if not YEAR.match(x) and x.lower() not in DROP]
        sh = stakeholder(t, blog, old); ex = experience(t, blog, old); se = seo(t, old)
        precise = bool(re.search(r"prison|school|college|university|student|stem|press|featured|award|investec|grant|corporate|team building|franchise|kit|home build|build by|diy|custom|finished|builder", t))
        new = list(dict.fromkeys(keep + sh + ex + se))
        rows.append({"blog":blog,"id":a["id"],"handle":a["handle"],"title":a["title"],
                     "published":bool(a.get("published_at")),
                     "old":old,"new":new,"added":sh+ex+se,"precise":precise,
                     "dropped":[x for x in old if x not in keep]})
        for x in sh: axis_dist["stakeholder"][x]+=1
        for x in ex: axis_dist["experience"][x]+=1
        for x in se: axis_dist["seo"][x]+=1
        dist[len(new)]+=1

json.dump(rows, open(f"{SCRATCH}/retag-plan.json","w"), indent=1)
print(f"{'='*70}\nRETAG {'APPLY' if APPLY else 'DRY RUN'} — {len(rows)} articles\n{'='*70}")
for axis in ("stakeholder","experience","seo"):
    print(f"\n{axis.upper()}:")
    for k,v in axis_dist[axis].most_common(): print(f"   {v:4d}  {k}")
dropped=sum(len(r["dropped"]) for r in rows)
print(f"\nyear/marker tags dropped: {dropped}")
print(f"articles with no stakeholder: {sum(1 for r in rows if not any(x.startswith('For ') or x=='Press' for x in r['added']))}")
print("\nSAMPLE — 10 published posts:")
for r in [x for x in rows if x['published']][:10]:
    print(f"\n  {r['title'][:58]}")
    print(f"     was: {r['old'][:6]}")
    print(f"     now: + {r['added']}")
