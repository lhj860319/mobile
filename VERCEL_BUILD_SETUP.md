# Vercel 빌드 설정 가이드

## 변경 사항 요약

### 1. vercel.json 정리
- ✅ `builds` 항목 제거 (Vercel Project Settings가 정상 작동하도록)
- ✅ `buildCommand`를 `npm run build`로 통일
- ✅ `rewrites` 유지 (서버리스 함수 라우팅 필요)

### 2. package.json 스크립트 정리
- ✅ `postinstall` 제거 (빌드 중복 방지)
- ✅ `build` 스크립트가 `build:css`를 호출하도록 정리
- ✅ `dev` 스크립트에 CSS 빌드 추가 (개발 시에도 CSS 필요)
- ✅ `vercel-build` 스크립트 제거 (불필요)

### 3. Node.js 버전 고정
- ✅ `package.json`에 `engines.node >= 20.0.0` 추가
- ✅ `.nvmrc` 파일 추가 (Node 20)

## Vercel Project Settings

Vercel 대시보드 → 프로젝트 → Settings → General에서 다음을 설정:

### Build & Development Settings

- **Framework Preset**: `Other` 또는 `None`
- **Build Command**: `npm run build` (또는 비워두기 - vercel.json의 buildCommand 사용)
- **Output Directory**: (비워두기 - 서버리스 함수이므로 불필요)
- **Install Command**: `npm install` (기본값)
- **Node.js Version**: `20.x` (engines 설정에 따라 자동 선택)

### 중요 사항

⚠️ **vercel.json에 `builds`가 없으므로** Vercel Project Settings가 정상적으로 적용됩니다.

## 로컬 테스트 명령어

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
```
- Vercel과 동일한 순서로 실행
- `postinstall` 없이 빌드가 정상 작동하는지 확인

## 프로젝트 구조

이 프로젝트는 **Express 앱을 Vercel 서버리스 함수로 배포**하는 구조입니다:

- **서버리스 함수**: `api/index.js` (Express 앱을 export)
- **정적 파일**: `public/` 디렉토리 (HTML, CSS, PDF 등)
- **빌드 산출물**: `public/styles.css` (Tailwind CSS 컴파일 결과)

## 빌드 프로세스

1. **의존성 설치**: `npm install`
2. **CSS 빌드**: `npm run build` → `npm run build:css`
3. **서버리스 함수 배포**: `api/index.js` 자동 감지
4. **정적 파일 제공**: `public/` 디렉토리 자동 제공

## 문제 해결

### 빌드 경고가 계속 나타나는 경우
- Vercel 대시보드에서 캐시 삭제 후 재배포
- `vercel.json`에 `builds` 항목이 없는지 확인

### CSS가 빌드되지 않는 경우
- `npm run build`가 정상 실행되는지 로컬에서 확인
- `public/styles.css` 파일이 생성되는지 확인
- Vercel 빌드 로그에서 `npm run build` 실행 여부 확인

