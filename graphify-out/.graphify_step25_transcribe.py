import json
import os
from pathlib import Path
from graphify.transcribe import transcribe_all

root = Path('graphify-out')
detect_path = root / '.graphify_detect.json'
out_path = root / '.graphify_transcripts.json'
out_dir = root / 'transcripts'
out_dir.mkdir(parents=True, exist_ok=True)

data = json.loads(detect_path.read_text(encoding='utf-8'))
files = data.get('files', {}) or {}

video_exts = {'.mp4', '.webm', '.mov', '.mkv', '.m4v', '.avi'}
all_paths = []
for _, val in files.items():
    if isinstance(val, dict):
        all_paths.extend(str(k) for k in val.keys())
    elif isinstance(val, list):
        all_paths.extend(str(x) for x in val)

seen = set()
video_files = []
for p in all_paths:
    pp = Path(p)
    if pp.suffix.lower() in video_exts:
        norm = str(pp)
        if norm not in seen:
            seen.add(norm)
            video_files.append(norm)

prompt = os.getenv('GRAPHIFY_WHISPER_PROMPT')
transcript_paths = []
failed = []
warnings = []

for vf in video_files:
    try:
        result = transcribe_all([vf], output_dir=out_dir, initial_prompt=prompt)
        if result:
            transcript_paths.extend(result)
        else:
            msg = f'No transcript returned for: {vf}'
            failed.append(vf)
            warnings.append(msg)
            print(f'WARNING: {msg}')
    except Exception as e:
        msg = f'{vf} -> {type(e).__name__}: {e}'
        failed.append(vf)
        warnings.append(msg)
        print(f'WARNING: {msg}')

payload = {
    'transcript_paths': transcript_paths,
    'failed_files': failed,
    'warnings': warnings,
    'source_video_count': len(video_files),
    'model': os.getenv('GRAPHIFY_WHISPER_MODEL'),
}
out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding='utf-8')

print(f'transcript_count={len(transcript_paths)}')
print(f'failed_count={len(failed)}')
print(f'output_json={out_path.as_posix()}')
