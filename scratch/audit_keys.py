import json, os, re

def walk_files(d):
    results = []
    for root, dirs, files in os.walk(d):
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                if '__tests__' not in root and '.test.' not in f:
                    results.append(os.path.join(root, f))
    return results

def find_keys(files):
    keys = set()
    pat = re.compile(r'''t\(\s*["'`]([a-zA-Z_][a-zA-Z0-9_]*)["'`]''')
    pat_label = re.compile(r'''label:\s*["'`]([a-zA-Z_][a-zA-Z0-9_]*)["'`]''')
    for f in files:
        with open(f, 'r', encoding='utf-8') as fh:
            content = fh.read()
            # Only process files that use useTranslations
            if 'useTranslations' not in content:
                continue
            for m in pat.finditer(content):
                keys.add(m.group(1))
            for m in pat_label.finditer(content):
                keys.add(m.group(1))
    return keys

with open('src/messages/en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)
with open('src/messages/es.json', 'r', encoding='utf-8') as f:
    es = json.load(f)

for ns, folder in [('billing', 'src/features/billing'), ('licensing', 'src/features/licensing')]:
    files = walk_files(folder)
    used = find_keys(files)
    existing_en = set(en.get(ns, {}).keys())
    existing_es = set(es.get(ns, {}).keys())
    missing_en = used - existing_en
    missing_es = used - existing_es
    if missing_en:
        print(f"\n=== MISSING in en.json [{ns}] ({len(missing_en)}) ===")
        for k in sorted(missing_en):
            print(f"  {k}")
    if missing_es:
        print(f"\n=== MISSING in es.json [{ns}] ({len(missing_es)}) ===")
        for k in sorted(missing_es):
            print(f"  {k}")
    if not missing_en and not missing_es:
        print(f"\n=== {ns}: ALL GOOD ===")
