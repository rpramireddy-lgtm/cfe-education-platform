#!/usr/bin/env bash
# =============================================================================
# CfE Education Platform — dev runner
# Usage:
#   ./dev.sh start    — start Amplify sandbox (background) + Next.js dev server
#   ./dev.sh stop     — stop both processes
#   ./dev.sh restart  — stop then start
#   ./dev.sh status   — show running processes
#   ./dev.sh logs     — tail both log files
# =============================================================================

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIDS_DIR="$ROOT/.pids"
LOGS_DIR="$ROOT/.logs"
SANDBOX_PID="$PIDS_DIR/sandbox.pid"
FRONTEND_PID="$PIDS_DIR/frontend.pid"
SANDBOX_LOG="$LOGS_DIR/sandbox.log"
FRONTEND_LOG="$LOGS_DIR/frontend.log"
ENV_LOCAL="$ROOT/frontend/.env.local"
OUTPUTS="$ROOT/amplify_outputs.json"

mkdir -p "$PIDS_DIR" "$LOGS_DIR"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()  { echo -e "${GREEN}[cfe]${NC} $*"; }
warn()  { echo -e "${YELLOW}[cfe]${NC} $*"; }
error() { echo -e "${RED}[cfe]${NC} $*"; }

is_running() {
  local pid_file="$1"
  [[ -f "$pid_file" ]] && kill -0 "$(cat "$pid_file")" 2>/dev/null
}

stop_process() {
  local pid_file="$1"
  local name="$2"
  if is_running "$pid_file"; then
    local pid
    pid=$(cat "$pid_file")
    info "Stopping $name (PID $pid)…"
    kill "$pid" 2>/dev/null || true
    for _ in {1..10}; do
      kill -0 "$pid" 2>/dev/null || break
      sleep 0.5
    done
    kill -9 "$pid" 2>/dev/null || true
    rm -f "$pid_file"
    info "$name stopped."
  else
    warn "$name is not running."
    rm -f "$pid_file"
  fi
}

inject_env() {
  [[ -f "$OUTPUTS" ]] || return 0

  local pool_id client_id
  pool_id=$(python3 -c "
import json
d = json.load(open('$OUTPUTS'))
print(d.get('auth', {}).get('user_pool_id', ''))
" 2>/dev/null || true)

  [[ -n "$pool_id" ]] || return 0

  client_id=$(python3 -c "
import json
d = json.load(open('$OUTPUTS'))
print(d.get('auth', {}).get('user_pool_client_id', ''))
" 2>/dev/null || true)

  [[ -f "$ENV_LOCAL" ]] || cp "$ROOT/frontend/.env.example" "$ENV_LOCAL"

  local entries=(
    "NEXT_PUBLIC_USER_POOL_ID=$pool_id"
    "NEXT_PUBLIC_USER_POOL_CLIENT_ID=$client_id"
    "NEXT_PUBLIC_APP_URL=http://localhost:3000"
    "NEXT_PUBLIC_APP_ENV=local"
  )
  for kv in "${entries[@]}"; do
    local key="${kv%%=*}"
    local val="${kv#*=}"
    if grep -q "^${key}=" "$ENV_LOCAL" 2>/dev/null; then
      sed -i.bak "s|^${key}=.*|${key}=${val}|" "$ENV_LOCAL" && rm -f "${ENV_LOCAL}.bak"
    else
      echo "${key}=${val}" >> "$ENV_LOCAL"
    fi
  done

  info "frontend/.env.local updated (userPoolId: $pool_id)."
}

cmd_start() {
  info "Starting CfE Education Platform…"

  # Install deps if needed
  if [[ ! -d "$ROOT/frontend/node_modules" ]]; then
    info "Installing frontend dependencies…"
    (cd "$ROOT/frontend" && npm install --legacy-peer-deps --silent)
  fi
  if [[ ! -d "$ROOT/amplify/node_modules" ]]; then
    info "Installing amplify dependencies…"
    (cd "$ROOT/amplify" && npm install --silent)
  fi

  # Start Amplify sandbox in background — does NOT block frontend startup
  if is_running "$SANDBOX_PID"; then
    warn "Amplify sandbox already running (PID $(cat "$SANDBOX_PID"))."
  else
    info "Starting Amplify sandbox in background…"
    (cd "$ROOT" && nohup npx ampx sandbox --profile default >> "$SANDBOX_LOG" 2>&1 &
     echo $! > "$SANDBOX_PID")
    info "Sandbox PID: $(cat "$SANDBOX_PID") — logs: ./dev.sh logs"
  fi

  # Inject env from outputs if already available (subsequent runs)
  inject_env

  # Start Next.js immediately — does not wait for sandbox
  if is_running "$FRONTEND_PID"; then
    warn "Frontend already running (PID $(cat "$FRONTEND_PID"))."
  else
    info "Starting Next.js on http://localhost:3000…"
    (cd "$ROOT/frontend" && nohup npm run dev >> "$FRONTEND_LOG" 2>&1 &
     echo $! > "$FRONTEND_PID")
    info "Frontend PID: $(cat "$FRONTEND_PID")"

    # Wait up to 30s for Next.js to respond
    local i=0
    until curl -sf http://localhost:3000/api/health > /dev/null 2>&1; do
      sleep 2; i=$((i+1))
      [[ $i -ge 15 ]] && { warn "Frontend slow — check: tail -f $FRONTEND_LOG"; break; }
    done
    curl -sf http://localhost:3000/api/health > /dev/null 2>&1 && info "Frontend ready ✓"
  fi

  echo ""
  info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  info "  App       →  http://localhost:3000"
  info "  Health    →  http://localhost:3000/api/health"
  info "  Logs      →  ./dev.sh logs"
  info "  Status    →  ./dev.sh status"
  info "  Note: Sandbox deploys in background (~3-5 min first run)"
  info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

cmd_stop() {
  info "Stopping CfE Education Platform…"
  stop_process "$FRONTEND_PID" "Next.js frontend"
  stop_process "$SANDBOX_PID"  "Amplify sandbox"
  info "All processes stopped."
}

cmd_restart() {
  cmd_stop
  sleep 1
  cmd_start
}

cmd_status() {
  echo ""
  if is_running "$SANDBOX_PID"; then
    info "Amplify sandbox  → RUNNING (PID $(cat "$SANDBOX_PID"))"
  else
    warn "Amplify sandbox  → STOPPED"
  fi
  if is_running "$FRONTEND_PID"; then
    info "Next.js frontend → RUNNING (PID $(cat "$FRONTEND_PID")) → http://localhost:3000"
  else
    warn "Next.js frontend → STOPPED"
  fi
  if [[ -f "$OUTPUTS" ]]; then
    local pool_id
    pool_id=$(python3 -c "import json; d=json.load(open('$OUTPUTS')); print(d.get('auth',{}).get('user_pool_id','not yet'))" 2>/dev/null || echo "not yet")
    info "Amplify outputs  → EXISTS (userPoolId: $pool_id)"
  else
    warn "Amplify outputs  → NOT FOUND (sandbox still deploying)"
  fi
  echo ""
}

cmd_logs() {
  info "Tailing logs — Ctrl+C to exit"
  tail -f "$SANDBOX_LOG" "$FRONTEND_LOG" 2>/dev/null \
    || warn "No log files yet — run ./dev.sh start first."
}

case "${1:-}" in
  start)   cmd_start   ;;
  stop)    cmd_stop    ;;
  restart) cmd_restart ;;
  status)  cmd_status  ;;
  logs)    cmd_logs    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|logs}"
    exit 1
    ;;
esac
