#!/usr/bin/env python3
"""Synchronize deployable browser data from editable JSON; no dependencies."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
src=root/'data/tasks.json'
data=json.loads(src.read_text(encoding='utf8'))
ids=[t['id'] for t in data['tasks']]
assert len(ids)==len(set(ids)), 'Duplicate task IDs'
output='/* GENERATED from tasks.json; do not edit by hand */\nwindow.ATLAS_DB='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'
(root/'data/tasks.js').write_text(output,encoding='utf8')
print('Synchronized',len(ids),'tasks')
