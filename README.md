# vanam-office

VANAM 경영지원(백오피스) 시스템.

admin · CEO 전용으로 특허관리 · 비품/자산 입출 관리 · 인사관리(근태 시스템 연동)를 제공합니다.

## 기술 스택
- Next.js + TypeScript + Tailwind CSS

## 배포 (NAS)

이미지는 NAS 에서 빌드하지 않는다. main 에 push 하면 GitHub Actions(`.github/workflows/docker-publish.yml`)가 이미지를 빌드해
`ghcr.io/leejunheon/office-web:<커밋 SHA>`·`:latest`(빌드 인자 `NEXT_PUBLIC_BASE_PATH=/office`) 로 올리고, NAS 는 그 이미지를 받아 재시작만 한다.

1. push 뒤 Actions 가 성공했는지 본다: https://github.com/LeeJunHeon/vanam-office/actions
2. NAS `/volume1/docker/office-web` 에서 `sudo ./deploy.sh` — git pull → 그 커밋 이미지 받기 → `:deployed` 로 바꾸기 → `docker compose up -d` → 실행 확인 → 옛 이미지 정리.
   그 커밋 이미지가 아직 없으면(빌드 중·실패·로그인 안 됨) Actions 주소를 안내하고 아무것도 바꾸지 않은 채 멈춘다.
3. 문제가 있으면 `rollback` 인자 — 바로 전 이미지(`:previous`)와 맞바꾼다(git pull 하지 않음).
4. GitHub 을 쓸 수 없을 때만 `--build` 인자(비상용) — 예전처럼 NAS 에서 직접 빌드해 `:deployed` 로 쓴다.

- 처음 한 번: NAS 에서 `sudo git pull`(새 배포 스크립트 받기) → `sudo docker login ghcr.io`(GitHub 사용자 이름 + `read:packages` 권한
  토큰. 공개 저장소 이미지는 로그인 없이도 받을 수 있다) → 배포. 처음에는 `:previous` 가 없어 되돌리기는 `--build` 로 한다.
- 배포 기록은 앱 폴더의 `.deploy-state`(git 에 넣지 않음)에 이미지마다 현재·이전 커밋 SHA 와 시각으로 남는다. 공용 함수는 `scripts/ghcr-deploy.sh`.
- 예전에 NAS 에서 빌드한 이미지(compose 기본 이름)는 자동으로 지우지 않는다. `sudo docker images` 로 확인해 쓰지 않는 것만 지운다.

## 현재 단계
- 데모 UI (목 데이터, 백엔드/DB/NAS 미연결)
