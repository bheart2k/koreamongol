@echo off
rem KoreaMongol 월간 팩트 재검증 러너 — Windows 작업 스케줄러가 호출
rem 수동 실행도 가능: scripts\recheck.cmd
cd /d "%~dp0.."
if not exist "logs" mkdir "logs"
echo. >> "logs\recheck.log"
echo ===== recheck start %date% %time% ===== >> "logs\recheck.log"
call "C:\Program Files\nodejs\claude.cmd" -p "/recheck" --allowedTools "Read,Grep,Glob,WebSearch,WebFetch,Write,Bash(node:*)" >> "logs\recheck.log" 2>&1
echo ===== recheck end (exit %errorlevel%) %date% %time% ===== >> "logs\recheck.log"
