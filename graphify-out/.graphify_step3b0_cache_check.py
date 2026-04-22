import json
import math
from pathlib import Path
from graphify.cache import check_semantic_cache

root = Path('graphify-out')
detect_path = root / '.graphify_detect.json'
cached_path = root / '.graphify_cached.json'
uncached_path = root / '.graphify_uncached.txt'

data = json.loads(detect_path.read_text(encoding='utf-8'))
files = data.get('files', {}) or {}

all_files = []
non_code_files = []

for category, val in files.items():
    paths = []
    if isinstance(val, dict):
        paths = [str(k) for k in val.keys()]
    elif isinstance(val, list):
        paths = [str(x) for x in val]
    else:
        continue
    all_files.extend(paths)
    if str(category).lower() != 'code':
        non_code_files.extend(paths)

cache_result = check_semantic_cache(all_files)

cached_payload = {}
uncached_files = []

if isinstance(cache_result, dict):
    if 'uncached_files' in cache_result and isinstance(cache_result.get('uncached_files'), list):
        uncached_files = [str(x) for x in cache_result.get('uncached_files', [])]
    else:
        for k in ('misses', 'missing', 'uncached'):
            if isinstance(cache_result.get(k), list):
                uncached_files = [str(x) for x in cache_result[k]]
                break
    if 'cached_payload' in cache_result and isinstance(cache_result.get('cached_payload'), dict):
        cached_payload = cache_result['cached_payload']
    elif isinstance(cache_result.get('hits'), dict):
        cached_payload = cache_result['hits']
    else:
        cached_payload = {k: v for k, v in cache_result.items() if k not in {'uncached_files', 'misses', 'missing', 'uncached'}}
elif isinstance(cache_result, tuple) and len(cache_result) >= 2:
    a, b = cache_result[0], cache_result[1]
    if isinstance(a, dict) and isinstance(b, list):
        cached_payload = a
        uncached_files = [str(x) for x in b]
    elif isinstance(a, list) and isinstance(b, dict):
        uncached_files = [str(x) for x in a]
        cached_payload = b
elif isinstance(cache_result, list):
    uncached_files = [str(x) for x in cache_result]

if cached_payload:
    cached_path.write_text(json.dumps(cached_payload, indent=2, ensure_ascii=False), encoding='utf-8')

uncached_path.write_text('\n'.join(uncached_files), encoding='utf-8')

uncached_set = set(uncached_files)
uncached_non_code_files = sum(1 for p in non_code_files if p in uncached_set)
estimated_agents = math.ceil(uncached_non_code_files / 22) if uncached_non_code_files else 0
estimated_seconds = 45 * estimated_agents
cache_hits = max(len(all_files) - len(uncached_files), 0)

print(f"total_files={len(all_files)}")
print(f"uncached_files={len(uncached_files)}")
print(f"uncached_non_code_files={uncached_non_code_files}")
print(f"estimated_agents={estimated_agents}")
print(f"estimated_seconds={estimated_seconds}")
print(f"cache_hits={cache_hits}")
