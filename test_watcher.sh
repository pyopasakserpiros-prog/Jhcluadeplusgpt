#!/data/data/com.termux/files/usr/bin/bash

ROOT="$HOME/agy-dev"
PROJECT="$ROOT/JianghuSect_v1.10"

while true; do
  if [ -f "$ROOT/.git_push" ]; then
    rm -f "$ROOT/.git_push"
    cd "$ROOT" || exit 1
    git status > "$ROOT/test_output.log" 2>&1
    git add . >> "$ROOT/test_output.log" 2>&1
    git commit -m "Add human-like NPC AI decision architecture blueprint and design note" >> "$ROOT/test_output.log" 2>&1
    git push origin main-1 >> "$ROOT/test_output.log" 2>&1
    git log -1 --stat >> "$ROOT/test_output.log" 2>&1
    echo "$?" > "$ROOT/test_exitcode.log"
  elif [ -f "$ROOT/.run_build" ]; then
    rm -f "$ROOT/.run_build"
    cd "$PROJECT" || exit 1
    node tools/build_single.js > "$ROOT/test_output.log" 2>&1
    echo "$?" > "$ROOT/test_exitcode.log"
  elif [ -f "$ROOT/.run_all" ]; then
    rm -f "$ROOT/.run_all"
    cd "$PROJECT" || exit 1
    node test/run_all.js > "$ROOT/test_output.log" 2>&1
    echo "$?" > "$ROOT/test_exitcode.log"
  elif [ -f "$ROOT/.run_tests" ]; then
    CMD=$(cat "$ROOT/.run_tests" 2>/dev/null)
    rm -f "$ROOT/.run_tests"
    cd "$PROJECT" || exit 1

    if [ "$CMD" = "push" ] || [ "$CMD" = "git_push" ]; then
      cd "$ROOT" || exit 1
      git status > "$ROOT/test_output.log" 2>&1
      git add . >> "$ROOT/test_output.log" 2>&1
      git commit -m "Add human-like NPC AI decision architecture blueprint and design note" >> "$ROOT/test_output.log" 2>&1
      git push origin main-1 >> "$ROOT/test_output.log" 2>&1
      git log -1 --stat >> "$ROOT/test_output.log" 2>&1
      echo "$?" > "$ROOT/test_exitcode.log"
    elif [ "$CMD" = "build" ]; then
      node tools/build_single.js > "$ROOT/test_output.log" 2>&1
      echo "$?" > "$ROOT/test_exitcode.log"
    elif [ "$CMD" = "all" ] || [ "$CMD" = "run_all" ]; then
      node test/run_all.js > "$ROOT/test_output.log" 2>&1
      echo "$?" > "$ROOT/test_exitcode.log"
    elif [ -n "$CMD" ] && [ "$CMD" != "1" ] && [ "$CMD" != "economy" ]; then
      node "$CMD" > "$ROOT/test_output.log" 2>&1
      echo "$?" > "$ROOT/test_exitcode.log"
    else
      node test/autonomous_economy_facilities.js > "$ROOT/test_output.log" 2>&1
      echo "$?" > "$ROOT/test_exitcode.log"
    fi
  fi
  sleep 2
done
