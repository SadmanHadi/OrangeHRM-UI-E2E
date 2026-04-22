import sys, json
from graphify.build import build_from_json
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_html
from pathlib import Path

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text(encoding='utf-8'))
detection  = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8'))
analysis   = json.loads(Path('graphify-out/.graphify_analysis.json').read_text(encoding='utf-8'))

G = build_from_json(extraction)
communities = {int(k): v for k, v in analysis['communities'].items()}
cohesion = {int(k): v for k, v in analysis['cohesion'].items()}
tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}

# LABELS
labels = {
    0: "Core Setup & Teardown",
    1: "Employee Module Actions",
    2: "Event Module Actions",
    3: "Leave Type Module Actions",
    4: "Claim Module Actions",
    5: "Locator Utilities",
    6: "Login & Base Page Objects",
    7: "Database Utilities",
    8: "Expectation Utilities",
    9: "Click Utilities",
    10: "Logging System",
    11: "Documentation & Framework Overview",
    12: "Wait & Stability Utilities",
    13: "Data Generation Utilities",
    14: "Timestamp Utilities",
    15: "Network Utilities",
    16: "POM & Design Patterns",
    17: "Testing Strategy",
    18: "ESLint Configuration",
    19: "Playwright Configuration"
}
# Fill remaining with defaults
for cid in communities:
    if cid not in labels:
        labels[cid] = f"Module {cid} Specific"

questions = suggest_questions(G, communities, labels)

report = generate(G, communities, cohesion, labels, analysis['gods'], analysis['surprises'], detection, tokens, '.', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding='utf-8')
Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}), encoding='utf-8')

to_html(G, communities, 'graphify-out/graph.html', community_labels=labels)
print('Final report and HTML visualization generated')
