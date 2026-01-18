# GitHub를 통한 서버 배포 가이드 (누구나 접속 가능)

이 가이드를 따라하면 GitHub에 코드를 업로드하고, 누구나 접속할 수 있는 공개 URL을 얻을 수 있습니다.

---

## 🎯 목표

1. GitHub에 코드 업로드
2. 클라우드 서버에 배포
3. 공개 URL 생성 (누구나 접속 가능)

---

## 📋 방법 선택

현재 프로젝트는 **SQLite 데이터베이스**를 사용하므로, 다음 두 가지 방법 중 선택하세요:

### 방법 1: Railway 사용 (추천 ⭐)
- ✅ SQLite 완벽 지원
- ✅ 무료 플랜 제공
- ✅ 설정 간단
- ✅ 영구 데이터 저장

### 방법 2: Render 사용
- ✅ SQLite 지원
- ✅ 무료 플랜 제공
- ✅ 설정 간단

### 방법 3: Vercel 사용
- ⚠️ SQLite 제한 (외부 DB 필요)
- ✅ 무료 플랜 제공
- ✅ 빠른 배포

---

## 🚀 방법 1: Railway 배포 (추천)

### 1단계: GitHub에 코드 업로드

#### 1-1. GitHub 저장소 생성

1. https://github.com 접속
2. 로그인 후 우측 상단 **"+"** → **"New repository"** 클릭
3. 저장소 설정:
   - **Repository name**: `sj-mobile-partner-center` (원하는 이름)
   - **Description**: "SJ Mobile Partner Center" (선택사항)
   - **Public** 또는 **Private** 선택
   - **"Add a README file"** 체크 해제
4. **"Create repository"** 클릭
5. 생성된 저장소의 **HTTPS URL** 복사 (예: `https://github.com/사용자명/sj-mobile-partner-center.git`)

#### 1-2. 로컬 코드를 GitHub에 업로드

터미널에서 다음 명령어를 실행하세요:

```bash
# 프로젝트 폴더로 이동
cd /Users/rishal.2now/Documents/mobile

# Git 초기화 (처음 한 번만)
git init

# 모든 파일 추가
git add .

# 첫 커밋 생성
git commit -m "Initial commit: SJ Mobile Partner Center"

# GitHub 저장소 연결 (아래 URL을 본인의 저장소 URL로 변경!)
git remote add origin https://github.com/사용자명/저장소명.git

# 기본 브랜치를 main으로 설정
git branch -M main

# GitHub에 업로드
git push -u origin main
```

**⚠️ GitHub 인증이 필요한 경우:**

**방법 A: Personal Access Token 사용**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" 클릭
3. Note: "Railway Deploy" 입력
4. Scopes: `repo` 체크
5. "Generate token" 클릭 후 토큰 복사
6. 비밀번호 입력 시:
   - Username: GitHub 사용자명
   - Password: 복사한 토큰 붙여넣기

**방법 B: GitHub CLI 사용**
```bash
# GitHub CLI 설치
brew install gh

# GitHub 로그인
gh auth login

# 다시 push
git push -u origin main
```

### 2단계: Railway에 배포

#### 2-1. Railway 계정 생성

1. https://railway.app 접속
2. **"Start a New Project"** 클릭
3. **"Login with GitHub"** 클릭
4. GitHub 권한 승인

#### 2-2. 프로젝트 배포

1. Railway 대시보드에서 **"New Project"** 클릭
2. **"Deploy from GitHub repo"** 선택
3. 방금 만든 GitHub 저장소 선택
4. Railway가 자동으로:
   - 코드 감지
   - 의존성 설치 (`npm install`)
   - 서버 시작 (`npm start`)

#### 2-3. 공개 URL 생성

1. 배포가 완료되면 프로젝트 대시보드로 이동
2. **"Settings"** 탭 클릭
3. **"Generate Domain"** 클릭
4. 자동으로 공개 URL 생성됨:
   - 예: `https://sj-mobile-partner-center-production.up.railway.app`
5. 이 URL을 복사하여 공유하면 **누구나 접속 가능**합니다!

#### 2-4. 환경 변수 설정 (선택사항)

Railway 대시보드에서:
1. 프로젝트 선택
2. **"Variables"** 탭 클릭
3. 필요한 환경 변수 추가:
   - `NODE_ENV=production`
   - `PORT=3000` (Railway가 자동 설정)

---

## 🌐 방법 2: Render 배포

### 1단계: GitHub에 코드 업로드

위의 **"1단계: GitHub에 코드 업로드"** 참고

### 2단계: Render에 배포

#### 2-1. Render 계정 생성

1. https://render.com 접속
2. **"Get Started for Free"** 클릭
3. **"Continue with GitHub"** 클릭
4. GitHub 권한 승인

#### 2-2. 프로젝트 배포

1. Render 대시보드에서 **"New +"** → **"Web Service"** 클릭
2. **"Connect GitHub"** 클릭 (처음만)
3. 저장소 선택
4. 프로젝트 설정:
   - **Name**: `sj-mobile-partner-center`
   - **Region**: `Singapore` (한국에서 가장 가까움)
   - **Branch**: `main`
   - **Root Directory**: `./` (기본값)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **"Create Web Service"** 클릭

#### 2-3. 공개 URL 확인

배포 완료 후 자동으로 URL 생성:
- 예: `https://sj-mobile-partner-center.onrender.com`
- 이 URL을 공유하면 **누구나 접속 가능**합니다!

---

## ⚡ 방법 3: Vercel 배포 (SQLite 제한 있음)

⚠️ **주의**: Vercel은 서버리스 환경이라 SQLite 파일 시스템 접근이 제한적입니다.

### 해결 방법: Vercel Postgres 사용

1. 위의 **"1단계: GitHub에 코드 업로드"** 참고
2. https://vercel.com 접속 → GitHub로 로그인
3. **"Add New Project"** → 저장소 선택
4. 배포 완료 후:
   - 프로젝트 → **"Storage"** → **"Create Database"** → **"Postgres"** 선택
   - `DATABASE_URL` 환경 변수 자동 생성
   - 코드를 PostgreSQL로 수정 필요

---

## ✅ 배포 완료 체크리스트

- [ ] GitHub에 코드 업로드 완료
- [ ] 클라우드 플랫폼에 배포 완료
- [ ] 공개 URL 생성 확인
- [ ] 브라우저에서 URL 접속 테스트
- [ ] 다른 사람에게 URL 공유하여 접속 확인

---

## 🔄 코드 업데이트 방법

코드를 수정한 후 다시 배포하려면:

```bash
# 코드 수정 후
git add .
git commit -m "업데이트 내용 설명"
git push

# Railway/Render/Vercel이 자동으로 재배포 (약 1-2분)
```

---

## 🐛 문제 해결

### Git push 오류

**"remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

**"Authentication failed"**
- Personal Access Token 사용 (위 참고)
- 또는 GitHub CLI 사용

### 배포 오류

**"Build failed"**
- 플랫폼 대시보드 → Deployments → 실패한 배포 클릭
- "Logs" 탭에서 오류 확인
- 대부분 `package.json` 의존성 문제

**"Database connection failed" (Vercel)**
- Vercel Postgres 사용 또는 Railway/Render로 변경

---

## 📱 공개 URL 공유 방법

배포가 완료되면 생성된 URL을 다음과 같이 공유하세요:

```
안녕하세요!

SJ Mobile Partner Center에 접속하실 수 있습니다:
https://sj-mobile-partner-center-production.up.railway.app

위 링크를 클릭하시면 바로 사용하실 수 있습니다.
```

---

## 💡 추천 사항

1. **Railway 사용 추천**: SQLite 완벽 지원, 설정 간단
2. **무료 플랜**: Railway, Render, Vercel 모두 무료 플랜 제공
3. **자동 배포**: GitHub에 push하면 자동으로 재배포
4. **HTTPS 자동**: 모든 플랫폼이 자동으로 HTTPS 제공

---

## 🆘 도움이 필요하신가요?

문제가 발생하면:
1. 오류 메시지를 복사하여 알려주세요
2. 어떤 단계에서 문제가 발생했는지 알려주세요
3. 터미널 출력 내용을 공유해주세요

