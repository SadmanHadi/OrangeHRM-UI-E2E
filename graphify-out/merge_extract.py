import json
from pathlib import Path

ast = json.loads(Path('graphify-out/.graphify_ast.json').read_text())
sem_chunk = json.loads(Path('graphify-out/.graphify_chunk_0.json').read_text())

# Merge: AST nodes first, semantic nodes deduplicated by id
seen = {n['id'] for n in ast['nodes']}
merged_nodes = list(ast['nodes'])
for n in sem_chunk['nodes']:
    if n['id'] not in seen:
        merged_nodes.append(n)
        seen.add(n['id'])

merged_edges = ast['edges'] + sem_chunk['edges']
merged_hyperedges = sem_chunk.get('hyperedges', [])
merged = {
    'nodes': merged_nodes,
    'edges': merged_edges,
    'hyperedges': merged_hyperedges,
    'input_tokens': sem_chunk.get('input_tokens', 0),
    'output_tokens': sem_chunk.get('output_tokens', 0),
}
Path('graphify-out/.graphify_extract.json').write_text(json.dumps(merged, indent=2))
print(f'Merged: {len(merged_nodes)} nodes, {len(merged_edges)} edges')
