import os
import re

d = 'src/features/licensing'
keys = set()
r = re.compile(r't\((["' + "'" + r'|`])(.*?)\1')

for root, dirs, files in os.walk(d):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                matches = r.findall(content)
                for match in matches:
                    keys.add(match[1])

print('\n'.join(sorted(keys)))
