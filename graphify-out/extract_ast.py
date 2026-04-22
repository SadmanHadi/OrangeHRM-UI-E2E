import sys, json
from graphify.detect import detect
from graphify.extract import collect_files, extract
from pathlib import Path

# Redo detection to avoid file encoding issues
detect_res = detect(Path('.'))
code_files = [Path(f) for f in detect_res.get('files', {}).get('code', [])]

if code_files:
    result = extract(code_files, cache_root=Path('.'))
    Path('graphify-out/.graphify_ast.json').write_text(json.dumps(result, indent=2))
    print(f'AST: {len(result["nodes"])} nodes, {len(result["edges"])} edges')
else:
    Path('graphify-out/.graphify_ast.json').write_text(json.dumps({'nodes':[],'edges':[],'input_tokens':0,'output_tokens':0}))
    print('No code files - skipping AST extraction')

# Save detection for later steps
Path('graphify-out/.graphify_detect.json').write_text(json.dumps(detect_res, indent=2))
