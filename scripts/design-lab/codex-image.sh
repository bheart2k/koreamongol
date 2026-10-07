#!/usr/bin/env bash
# Codex 내장 image_gen 1회 호출 → 결과 PNG 를 <out.png> 로 복사 (Git Bash, codex CLI 로그인 필요. 영상이 아니라 크레딧 없음)
# usage: scripts/design-lab/codex-image.sh <out.png> <prompt-file> [ref images...]
# - 프롬프트는 stdin 으로 넘긴다. 레퍼런스(-i)는 Windows 절대 경로로 바꿔 넘긴다 (상대 경로는 codex 가 거부)
# - 로그: <out>.log (session id 로 ~/.codex/generated_images/<sid>/ 에서 결과를 찾는다)
# - 출력 해상도는 1672×941 / 941×1672 고정. 프롬프트 맨 앞에 "Use the built-in image_gen tool exactly once …" 지시문을 넣는다
set -u
if [ $# -lt 2 ]; then echo "usage: $0 <out.png> <prompt-file> [ref images...]"; exit 1; fi
out=$1; pf=$2; shift 2
mkdir -p "$(dirname "$out")"
outdir=$(cd "$(dirname "$out")" && pwd)
args=()
for r in "$@"; do args+=(-i "$(cygpath -w "$(realpath "$r")")"); done
log="${out%.png}.log"
cat "$pf" | codex exec "${args[@]}" --skip-git-repo-check -s read-only -C "$outdir" - > "$log" 2>&1
sid=$(grep -m1 -oE 'session id: [0-9a-f-]+' "$log" | awk '{print $3}')
f=$(ls -t ~/.codex/generated_images/"$sid"/*.png 2>/dev/null | head -1)
if [ -n "$sid" ] && [ -n "$f" ]; then cp "$f" "$out"; echo "OK $out"; else echo "FAIL $out (sid=${sid:-none})"; tail -5 "$log"; exit 1; fi
