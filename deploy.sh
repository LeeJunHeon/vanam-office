#!/bin/bash
set -euo pipefail

APP_DIR="/volume1/docker/office-web"
SERVICE="nextjs"
CONTAINER="office-web-nextjs"

# 본문 전체를 함수로 감싼다 — git pull 로 이 파일이 바뀌어도 이미 읽은 내용으로 끝까지 실행
main() {
  # 폴더 소유자가 jhlee 가 아니므로 root 로 다시 실행 (root 의 git 설정 사용)
  if [ "$(id -u)" -ne 0 ]; then
    exec sudo -H bash "$0" "$@"
  fi

  cd "$APP_DIR"

  echo "[1/4] git pull"
  local safe_dirs
  safe_dirs="$(git config --global --get-all safe.directory || true)"
  if ! grep -qxF "$APP_DIR" <<<"$safe_dirs"; then
    git config --global --add safe.directory "$APP_DIR"
  fi
  git pull

  echo "[2/4] docker compose build $SERVICE"
  export BUILDX_GIT_INFO=0
  docker compose build "$SERVICE"

  echo "[3/4] docker compose up -d $SERVICE"
  docker compose up -d "$SERVICE"

  echo "[4/4] 실행 확인 ($CONTAINER, 최대 60초)"
  local waited=0 running
  while true; do
    running="$(docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null || true)"
    [ "$running" = "true" ] && break
    if [ "$waited" -eq 0 ]; then
      echo "컨테이너가 실행 중이 아님 — docker compose up -d $SERVICE 재시도"
      docker compose up -d "$SERVICE"
    fi
    if [ "$waited" -ge 60 ]; then
      docker ps -a --filter "name=$CONTAINER"
      docker logs --tail 30 "$CONTAINER" || true
      echo "배포 실패: 컨테이너가 실행 중이 아님"
      exit 1
    fi
    sleep 5
    waited=$((waited + 5))
  done

  git log --oneline -1
  docker ps --filter "name=$CONTAINER" --format '{{.Names}}  {{.Status}}'
  echo "배포 완료!"
}

main "$@"
