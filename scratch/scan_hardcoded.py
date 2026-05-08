import os, re

def walk_files(d):
    results = []
    for root, dirs, files in os.walk(d):
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                if '__tests__' not in root and '.test.' not in f:
                    results.append(os.path.join(root, f))
    return results

# Find files that do NOT use useTranslations
files = walk_files('src/features/billing/components')
for f in sorted(files):
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    has_t = 'useTranslations' in content
    # Check for hardcoded strings in JSX (rough heuristic: >word inside JSX tags)
    # Count quoted strings that look like UI text
    hardcoded = re.findall(r'>\s*([A-Z][a-z][\w\s&]+?)\s*</', content)
    rel = os.path.relpath(f, 'src/features/billing/components')
    if not has_t and hardcoded:
        print(f"NO_T  {rel} -> {len(hardcoded)} hardcoded: {hardcoded[:5]}")
    elif not has_t:
        print(f"NO_T  {rel}")
    elif hardcoded:
        print(f"HAS_T {rel} -> {len(hardcoded)} remaining hardcoded: {hardcoded[:5]}")
