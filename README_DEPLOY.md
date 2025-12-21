# 빠른 배포 가이드

## Vercel 배포 (5분 안에 완료)

### 1단계: GitHub에 코드 업로드

```bash
# 터미널에서 실행
cd /Users/rishal.2now/Documents/mobile

# Git 초기화 (처음 한 번만)
git init
git add .
git commit -m "SJ Mobile Partner Center"

# GitHub에 새 저장소 생성 후 아래 명령어 실행
# (GitHub에서 저장소를 먼저 만들어야 합니다)
git remote add origin https://github.com/사용자명/저장소명.git
git branch -M main
git push -u origin main
```

### 2단계: Vercel 배포

1. **Vercel 접속**: https://vercel.com
2. **GitHub로 로그인**
3. **"Add New Project"** 클릭
4. **GitHub 저장소 선택**
5. **설정**:
   - Framework Preset: **Other**
   - Build Command: (비워두기)
   - Output Directory: (비워두기)
6. **"Deploy"** 클릭

### 3단계: 완료! 🎉

배포가 완료되면 자동으로 URL이 생성됩니다:
- 예: `https://sj-mobile-partner-center.vercel.app`

이 URL을 공유하면 누구나 접속할 수 있습니다!

---

## ⚠️ 중요: SQLite 데이터베이스 문제

Vercel은 서버리스 환경이라 **SQLite 파일이 제대로 작동하지 않을 수 있습니다**.

### 해결 방법 1: Railway 사용 (추천 - SQLite 지원)

Railway는 SQLite를 완벽하게 지원합니다:

1. https://railway.app 접속
2. GitHub로 로그인
3. "New Project" → "Deploy from GitHub repo"
4. 저장소 선택
5. 자동 배포 완료!

### 해결 방법 2: Vercel Postgres 사용

1. Vercel 대시보드에서 프로젝트 선택
2. "Storage" → "Create Database" → "Postgres"
3. `DATABASE_URL` 환경 변수 자동 생성
4. 코드에서 PostgreSQL 사용하도록 수정 필요

---

## 로컬 테스트

배포 전에 로컬에서 테스트:

```bash
npm install
npm start
```

브라우저에서 `http://localhost:3000` 접속


