# Vercel 배포 가이드

## 주의사항 ⚠️

Vercel은 서버리스 환경이므로 **SQLite 파일 시스템 접근에 제한**이 있을 수 있습니다. 
데이터베이스가 제대로 작동하지 않을 경우, 다음 옵션을 고려하세요:

1. **Vercel Postgres** 사용 (추천)
2. **Supabase** 같은 외부 데이터베이스 사용
3. **Railway** 또는 **Render** 같은 플랫폼 사용 (SQLite 지원)

## 배포 방법

### 1. GitHub에 코드 업로드

```bash
# Git 초기화 (아직 안 했다면)
git init
git add .
git commit -m "Initial commit"

# GitHub에 새 저장소 생성 후
git remote add origin https://github.com/사용자명/저장소명.git
git branch -M main
git push -u origin main
```

### 2. Vercel에 배포

1. [Vercel 웹사이트](https://vercel.com) 접속
2. "Sign Up" 또는 "Log In" 클릭
3. GitHub 계정으로 로그인
4. "Add New Project" 클릭
5. GitHub 저장소 선택
6. 프로젝트 설정:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (비워두기)
   - **Output Directory**: (비워두기)
   - **Install Command**: `npm install`
7. "Deploy" 클릭

### 3. 환경 변수 설정 (선택사항)

Vercel 대시보드에서:
1. 프로젝트 선택
2. Settings → Environment Variables
3. 필요한 환경 변수 추가:
   - `NODE_ENV=production`
   - `PORT=3000` (자동 설정됨)

### 4. 배포 완료

배포가 완료되면 Vercel이 자동으로 URL을 제공합니다:
- 예: `https://your-project-name.vercel.app`

## 문제 해결

### SQLite 데이터베이스 오류

Vercel의 서버리스 환경에서는 파일 시스템이 읽기 전용이거나 제한적일 수 있습니다.

**해결 방법:**

1. **Vercel Postgres 사용** (추천)
   ```bash
   # Vercel 대시보드에서 Postgres 추가
   # DATABASE_URL 환경 변수 자동 생성됨
   ```

2. **Supabase 사용**
   - [Supabase](https://supabase.com)에서 무료 데이터베이스 생성
   - `DATABASE_URL` 환경 변수에 연결 문자열 추가

3. **Railway로 배포** (SQLite 지원)
   - [Railway](https://railway.app)에서 배포
   - SQLite 파일 시스템 접근 가능

## 대안: Railway 배포 (SQLite 지원)

Railway는 SQLite를 완벽하게 지원합니다:

1. [Railway](https://railway.app) 접속
2. GitHub로 로그인
3. "New Project" → "Deploy from GitHub repo"
4. 저장소 선택
5. 자동 배포 완료

Railway는 SQLite 파일을 영구적으로 저장하므로 데이터 손실 없이 사용할 수 있습니다.


