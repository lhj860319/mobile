# Vercel CLI 배포 가이드 (최신 커밋 자동 배포)

## 프로젝트 유형

**Express + 정적 HTML (Vercel 서버리스 함수 구조)**
- Express 서버 (`server.js`)
- 서버리스 함수 진입점 (`api/index.js`)
- 정적 파일 (`public/` 디렉토리)
- Tailwind CSS 빌드 필요

## 설정 파일

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/api/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "crons": [
    {
      "path": "/api/health",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**중요**: `builds` 항목이 없으므로 Vercel Project Settings가 정상 작동합니다.

### package.json (관련 부분)
```json
{
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "build": "npm run build:css",
    "build:css": "tailwindcss -i ./src/input.css -o ./public/styles.css --minify",
    "vercel-build": "npm run build",
    "dev:css": "tailwindcss -i ./src/input.css -o ./public/styles.css --watch"
  }
}
```

## 로컬 검증 명령어

### 1. 의존성 설치 (깨끗한 설치)
```bash
rm -rf node_modules package-lock.json
npm ci
```

### 2. 빌드 테스트
```bash
npm run build
```
- `public/styles.css` 파일이 생성되는지 확인
- 빌드가 성공적으로 완료되는지 확인

### 3. Vercel 빌드 시뮬레이션
```bash
npm install
npm run build
npx vercel build
```
- Vercel과 동일한 순서로 실행
- 빌드가 정상 작동하는지 확인

## Vercel CLI로 Production 배포

### 사전 준비

1. **Vercel CLI 설치** (없는 경우)
```bash
npm install -g vercel
```

2. **Vercel 로그인**
```bash
vercel login
```
- 브라우저가 열리면 Vercel 계정으로 로그인

3. **프로젝트 연결** (처음 한 번만)
```bash
vercel link
```
- 기존 프로젝트 선택 또는 새 프로젝트 생성
- 프로젝트 이름: `mobile` (또는 원하는 이름)

### Production 배포 (최신 커밋 강제 배포)

```bash
vercel --prod
```

**이 명령어의 특징:**
- ✅ **현재 로컬의 최신 코드를 Production으로 배포**
- ✅ Vercel Deployments에 최신 커밋이 안 보여도 강제로 배포
- ✅ Git 커밋 상태와 무관하게 현재 디렉토리 코드를 배포
- ✅ `vercel.json`의 `buildCommand`가 자동 실행됨

### 배포 확인

```bash
vercel ls
```
- 배포 목록 확인
- Production 배포 상태 확인

## 자동화 스크립트

### 배포 스크립트 (package.json에 추가 가능)

```json
{
  "scripts": {
    "deploy": "npm run build && vercel --prod",
    "deploy:preview": "npm run build && vercel"
  }
}
```

사용법:
```bash
npm run deploy        # Production 배포
npm run deploy:preview # Preview 배포
```

## 문제 해결

### "builds" 경고가 계속 나타나는 경우
- `vercel.json`에 `builds` 항목이 없는지 확인
- Vercel 대시보드에서 캐시 삭제 후 재배포

### 최신 커밋이 배포되지 않는 경우
- `vercel --prod` 사용 (Git 상태와 무관하게 현재 코드 배포)
- 또는 Vercel 대시보드에서 "Deploy from GitHub" → 최신 커밋 선택

### 빌드 실패하는 경우
- 로컬에서 `npm run build` 성공하는지 확인
- `public/styles.css` 파일이 생성되는지 확인
- Vercel 빌드 로그에서 오류 메시지 확인

## Vercel Project Settings (참고)

Vercel 대시보드 → 프로젝트 → Settings → General:

- **Framework Preset**: `Other`
- **Build Command**: (비워두기 - vercel.json의 `buildCommand` 사용)
- **Output Directory**: (비워두기 - 서버리스 함수이므로 불필요)
- **Install Command**: `npm install` (기본값)
- **Node.js Version**: `20.x` (engines 설정에 따라 자동 선택)

**중요**: `vercel.json`에 `builds`가 없으므로 이 설정들이 정상적으로 적용됩니다.

