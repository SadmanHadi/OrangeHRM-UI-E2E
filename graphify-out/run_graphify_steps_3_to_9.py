import json
import math
import re
from collections import Counter, defaultdict
from pathlib import Path

from graphify.analyze import god_nodes, suggest_questions, surprising_connections
from graphify.benchmark import print_benchmark, run_benchmark
from graphify.build import build_from_json
from graphify.cache import check_semantic_cache
from graphify.cluster import cluster, score_all
from graphify.detect import save_manifest
from graphify.export import to_html, to_json
from graphify.extract import extract
from graphify.report import generate

root = Path('.')
out = root / 'graphify-out'

def flatten_files(files_obj):
    all_paths = []
    for _, value in (files_obj or {}).items():
        if isinstance(value, list):
            all_paths.extend(str(x) for x in value)
        elif isinstance(value, dict):
            all_paths.extend(str(k) for k in value.keys())
    return all_paths

def tokenize(text):
    return re.findall(r"[A-Za-z][A-Za-z0-9_]+", text.lower())

warnings = []

try:
    detect_path = out / '.graphify_detect.json'
    if not detect_path.exists():
        raise FileNotFoundError(f'Missing {detect_path.as_posix()}')

    detect = json.loads(detect_path.read_text(encoding='utf-8'))
    files = detect.get('files', {}) or {}

    # Step 3A
    code_files = [Path(p) for p in files.get('code', [])]
    if code_files:
        ast = extract(code_files, cache_root=root)
    else:
        ast = {'nodes': [], 'edges': [], 'hyperedges': [], 'input_tokens': 0, 'output_tokens': 0}
        warnings.append('No code files detected for AST extraction.')
    (out / '.graphify_ast.json').write_text(json.dumps(ast, indent=2), encoding='utf-8')
    print(f"AST_COUNTS nodes={len(ast.get('nodes', []))} edges={len(ast.get('edges', []))} files={len(code_files)}")

    # Step 3B3
    all_files = flatten_files(files)
    cached_nodes, cached_edges, cached_hyperedges, uncached = check_semantic_cache(all_files, root=root)
    semantic = {
        'nodes': cached_nodes,
        'edges': cached_edges,
        'hyperedges': cached_hyperedges,
        'input_tokens': 0,
        'output_tokens': 0,
        'uncached_files': uncached,
    }
    (out / '.graphify_semantic.json').write_text(json.dumps(semantic, indent=2), encoding='utf-8')
    print(f"SEMANTIC_COUNTS nodes={len(cached_nodes)} edges={len(cached_edges)} hyperedges={len(cached_hyperedges)} uncached={len(uncached)}")
    if uncached:
        warnings.append(f'Expected uncached=0 but found uncached={len(uncached)}')

    # Step 3C
    ast_nodes = ast.get('nodes', [])
    ast_edges = ast.get('edges', [])
    ast_hyperedges = ast.get('hyperedges', [])

    merged_nodes = list(ast_nodes)
    seen = {n.get('id') for n in merged_nodes if isinstance(n, dict) and n.get('id')}
    for n in semantic.get('nodes', []):
        nid = n.get('id') if isinstance(n, dict) else None
        if nid and nid not in seen:
            merged_nodes.append(n)
            seen.add(nid)

    merged_edges = list(ast_edges) + list(semantic.get('edges', []))
    merged_hyperedges = list(ast_hyperedges) + list(semantic.get('hyperedges', []))
    merged = {
        'nodes': merged_nodes,
        'edges': merged_edges,
        'hyperedges': merged_hyperedges,
        'input_tokens': int(ast.get('input_tokens', 0) or 0) + int(semantic.get('input_tokens', 0) or 0),
        'output_tokens': int(ast.get('output_tokens', 0) or 0) + int(semantic.get('output_tokens', 0) or 0),
    }
    (out / '.graphify_extract.json').write_text(json.dumps(merged, indent=2), encoding='utf-8')
    print(f"MERGED_COUNTS nodes={len(merged_nodes)} edges={len(merged_edges)} hyperedges={len(merged_hyperedges)}")

    # Step 4
    G = build_from_json(merged)
    if G.number_of_nodes() == 0:
        raise RuntimeError('Graph build failed: graph is empty.')

    communities = cluster(G)
    cohesion = score_all(G, communities)
    gods = god_nodes(G)
    surprises = surprising_connections(G, communities)
    default_labels = {cid: f'Community {cid}' for cid in communities}
    questions = suggest_questions(G, communities, default_labels)

    token_cost = {'input': merged.get('input_tokens', 0), 'output': merged.get('output_tokens', 0)}
    report_md = generate(G, communities, cohesion, default_labels, gods, surprises, detect, token_cost, '.', suggested_questions=questions)
    (out / 'GRAPH_REPORT.md').write_text(report_md, encoding='utf-8')
    to_json(G, communities, str(out / 'graph.json'))

    analysis = {
        'communities': {str(k): v for k, v in communities.items()},
        'cohesion': {str(k): v for k, v in cohesion.items()},
        'gods': gods,
        'surprises': surprises,
        'questions': questions,
    }
    (out / '.graphify_analysis.json').write_text(json.dumps(analysis, indent=2), encoding='utf-8')
    print(f"GRAPH_COUNTS nodes={G.number_of_nodes()} edges={G.number_of_edges()} communities={len(communities)}")

    # Step 5 - automatic labels (2-5 words)
    stop = {
        'the','and','for','with','from','into','this','that','file','files','module','community','test','tests','spec','page','utils','util','config','setup','report','graph','html','json','ts','js','md'
    }
    per_comm = {}
    df = Counter()
    for cid, nodes in communities.items():
        c = Counter()
        for nid in nodes:
            lbl = str(G.nodes[nid].get('label', nid))
            for tok in tokenize(lbl):
                if tok not in stop and len(tok) > 2:
                    c[tok] += 1
        per_comm[cid] = c
        for tok in c.keys():
            df[tok] += 1

    labels = {}
    n_comm = max(len(communities), 1)
    for cid, c in per_comm.items():
        scored = []
        for tok, tf in c.items():
            score = tf * (math.log((1 + n_comm) / (1 + df[tok])) + 1)
            scored.append((score, tok))
        scored.sort(reverse=True)
        top = [tok for _, tok in scored[:4]]
        if len(top) < 2:
            top = (top + ['core', 'cluster'])[:2]
        top = top[:5]
        label = ' '.join(t.title() for t in top)
        labels[cid] = label

    (out / '.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}, indent=2), encoding='utf-8')
    questions2 = suggest_questions(G, communities, labels)
    report_md2 = generate(G, communities, cohesion, labels, gods, surprises, detect, token_cost, '.', suggested_questions=questions2)
    (out / 'GRAPH_REPORT.md').write_text(report_md2, encoding='utf-8')
    print(f"LABEL_COUNTS communities={len(communities)} labeled={len(labels)}")

    # Step 6
    if G.number_of_nodes() <= 5000:
        to_html(G, communities, str(out / 'graph.html'), community_labels=labels)
        print(f"HTML_STATUS generated path={str((out / 'graph.html').as_posix())}")
    else:
        warnings.append(f"Skipped HTML generation because node_count={G.number_of_nodes()} exceeds 5000")
        print(f"HTML_STATUS skipped node_count={G.number_of_nodes()}")

    # Step 8 (benchmark condition in requested order is step 8-if-applicable before manifest, but requirement list asks benchmark line)
    total_words = int(detect.get('total_words', 0) or 0)
    if total_words > 5000:
        print(f"BENCHMARK_STATUS running total_words={total_words}")
        bench = run_benchmark(graph_path=str(out / 'graph.json'), corpus_words=total_words)
        print_benchmark(bench)
    else:
        print(f"BENCHMARK_STATUS skipped total_words={total_words}")

    # Step 8/manifest + cost
    save_manifest(files, manifest_path=str(out / 'manifest.json'))

    cost_path = out / 'cost.json'
    if cost_path.exists():
        try:
            cost = json.loads(cost_path.read_text(encoding='utf-8'))
        except Exception:
            cost = {}
    else:
        cost = {}

    run_in = int(merged.get('input_tokens', 0) or 0)
    run_out = int(merged.get('output_tokens', 0) or 0)
    run_total = run_in + run_out

    prev_in = int(cost.get('all_time', {}).get('input_tokens', cost.get('all_time_input_tokens', 0)) or 0)
    prev_out = int(cost.get('all_time', {}).get('output_tokens', cost.get('all_time_output_tokens', 0)) or 0)

    all_in = prev_in + run_in
    all_out = prev_out + run_out
    all_total = all_in + all_out

    cost_payload = {
        'last_run': {'input_tokens': run_in, 'output_tokens': run_out, 'total_tokens': run_total},
        'all_time': {'input_tokens': all_in, 'output_tokens': all_out, 'total_tokens': all_total},
        'all_time_input_tokens': all_in,
        'all_time_output_tokens': all_out,
        'all_time_total_tokens': all_total,
    }
    cost_path.write_text(json.dumps(cost_payload, indent=2), encoding='utf-8')
    print(f"TOKENS_THIS_RUN input={run_in} output={run_out} total={run_total}")
    print(f"TOKENS_ALL_TIME input={all_in} output={all_out} total={all_total}")

    # Step 9 cleanup
    cleanup_names = [
        '.graphify_detect.json',
        '.graphify_extract.json',
        '.graphify_ast.json',
        '.graphify_semantic.json',
        '.graphify_analysis.json',
        '.graphify_labels.json',
        '.needs_update',
    ]
    removed = 0
    for name in cleanup_names:
        p = out / name
        if p.exists():
            p.unlink()
            removed += 1
    for p in out.glob('.graphify_chunk_*.json'):
        p.unlink()
        removed += 1
    print(f"CLEANUP removed_files={removed}")

    for w in warnings:
        print(f"WARNING: {w}")

except Exception as exc:
    print(f"ERROR: {type(exc).__name__}: {exc}")
    raise
