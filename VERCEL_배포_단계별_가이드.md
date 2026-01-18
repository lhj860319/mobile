# Vercel 배포 단계별 가이드 (GitHub + Vercel 로그인 완료 상태)

이미 GitHub와 Vercel에 로그인하셨으니, 바로 배포를 시작할 수 있습니다!

---

## 📋 전체 단계 개요

1. ✅ GitHub에 코드 업로드
2. ✅ Vercel에서 프로젝트 배포
3. ✅ Vercel Postgres 데이터베이스 생성
4. ✅ 코드를 PostgreSQL로 수정
5. ✅ 재배포 완료!

---

## 1단계: GitHub에 코드 업로드

### 1-1. GitHub 저장소 생성

1. https://github.com 접속 (이미 로그인됨)
2. 우측 상단 **"+"** 아이콘 클릭 → **"New repository"** 선택
3. 저장소 설정:
   - **Repository name**: `sj-mobile-partner-center` (원하는 이름)
   - **Description**: "SJ Mobile Partner Center" (선택사항)
   - **Public** 또는 **Private** 선택
   - **"Add a README file"** 체크 해제
   - **"Add .gitignore"** 체크 해제 (이미 있음)
4. **"Create repository"** 클릭
5. 생성된 저장소의 **HTTPS URL** 복사
   - 예: `https://github.com/사용자명/sj-mobile-partner-center.git`

### 1-2. 로컬 코드를 GitHub에 업로드

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

**⚠️ 인증 오류가 발생하면:**

**방법 A: Personal Access Token 사용**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" 클릭
3. Note: "Vercel Deploy" 입력
4. Scopes: `repo` 체크
5. "Generate token" 클릭 후 토큰 복사
6. 비밀번호 입력 시:
   - Username: GitHub 사용자명
   - Password: 복사한 토큰 붙여넣기

**방법 B: GitHub CLI 사용**
```bash
brew install gh
gh auth login
git push -u origin main
```

---

## 2단계: Vercel에서 프로젝트 배포

### 2-1. Vercel 대시보드 접속

1. https://vercel.com 접속 (이미 로그인됨)
2. 대시보드에서 **"Add New..."** → **"Project"** 클릭

### 2-2. GitHub 저장소 연결

1. **"Import Git Repository"** 화면에서:
   - 방금 만든 GitHub 저장소가 보입니다
   - 찾지 못하면 "Search"로 검색
   - 저장소 옆의 **"Import"** 버튼 클릭

### 2-3. 프로젝트 설정

**"Configure Project"** 화면에서:

- **Project Name**: `sj-mobile-partner-center` (원하는 이름)
- **Framework Preset**: **"Other"** 선택
- **Root Directory**: `./` (기본값 유지)
- **Build Command**: (비워두기 - 빈 칸)
- **Output Directory**: (비워두기 - 빈 칸)
- **Install Command**: `npm install` (기본값 유지)

**Environment Variables** (환경 변수):
- 일단 비워두고 나중에 추가 (Postgres 생성 후)

### 2-4. 배포 시작

1. **"Deploy"** 버튼 클릭
2. 배포 진행 상황 확인:
   - "Building..." → "Deploying..." → "Ready!"
   - 약 1-2분 소요

### 2-5. 배포 완료 확인

1. **"Congratulations!"** 메시지 확인
2. 자동 생성된 URL 확인:
   - 예: `https://sj-mobile-partner-center.vercel.app`
3. **⚠️ 주의**: 이 시점에서는 데이터베이스가 작동하지 않을 수 있습니다 (SQLite 제한)

---

## 3단계: Vercel Postgres 데이터베이스 생성

### 3-1. Postgres 생성

1. Vercel 대시보드에서 방금 배포한 프로젝트 클릭
2. 상단 메뉴에서 **"Storage"** 탭 클릭
3. **"Create Database"** 버튼 클릭
4. **"Postgres"** 선택
5. **"Create"** 클릭

### 3-2. 데이터베이스 연결 정보 확인

1. Postgres가 생성되면 자동으로 **"Connect"** 탭이 열립니다
2. **"Environment Variables"** 섹션에서 다음 정보 확인:
   - `POSTGRES_URL` (자동 생성됨)
   - `POSTGRES_PRISMA_URL` (자동 생성됨)
   - `POSTGRES_URL_NON_POOLING` (자동 생성됨)

3. 이 변수들은 자동으로 프로젝트의 환경 변수에 추가됩니다!

---

## 4단계: 코드를 PostgreSQL로 수정

✅ **좋은 소식**: 코드가 이미 PostgreSQL과 SQLite를 모두 지원하도록 수정되었습니다!

### 4-1. PostgreSQL 드라이버 설치

터미널에서 실행:

```bash
cd /Users/rishal.2now/Documents/mobile
npm install
```

(이미 `package.json`에 `pg` 패키지가 추가되어 있습니다)

### 4-2. 변경사항 확인

코드는 자동으로 환경 변수를 확인합니다:
- `POSTGRES_URL` 또는 `DATABASE_URL`이 있으면 → PostgreSQL 사용
- 없으면 → SQLite 사용 (로컬 개발)

### 4-3. 변경사항 커밋 및 푸시

```bash
git add .
git commit -m "PostgreSQL 지원 추가 - Vercel 배포 준비"
git push
```

---

## 5단계: 재배포 완료!

1. GitHub에 코드를 푸시하면 Vercel이 자동으로 재배포합니다
2. 약 1-2분 후 배포 완료
3. URL 접속하여 테스트:
   - 예: `https://sj-mobile-partner-center.vercel.app`
4. 데이터베이스가 정상 작동하는지 확인

---

## ✅ 완료 체크리스트

- [ ] GitHub 저장소 생성 완료
- [ ] 로컬 코드를 GitHub에 업로드 완료
- [ ] Vercel에서 프로젝트 배포 완료
- [ ] Vercel Postgres 생성 완료
- [ ] PostgreSQL 드라이버 설치 완료
- [ ] 코드를 PostgreSQL로 수정 완료
- [ ] 변경사항 커밋 및 푸시 완료
- [ ] 재배포 완료 및 URL 테스트 완료

---

## 🐛 문제 해결

### Git push 오류

**"remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

### Vercel 배포 오류

**"Build failed"**
- Vercel 대시보드 → Deployments → 실패한 배포 클릭
- "Logs" 탭에서 오류 확인
- 대부분 의존성 문제 → `package.json` 확인

### 데이터베이스 연결 오류

- Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
- `POSTGRES_URL` 등이 제대로 설정되어 있는지 확인
- 코드에서 환경 변수 이름이 올바른지 확인

---

## 📱 공개 URL 공유

배포가 완료되면 생성된 URL을 공유하세요:

```
안녕하세요!

SJ Mobile Partner Center에 접속하실 수 있습니다:
https://sj-mobile-partner-center.vercel.app

위 링크를 클릭하시면 바로 사용하실 수 있습니다.
```

---

## 🔄 코드 업데이트 방법

코드를 수정한 후:

```bash
git add .
git commit -m "업데이트 내용 설명"
git push

# Vercel이 자동으로 재배포 (약 1-2분)
```

---

## 💡 참고사항

1. **무료 플랜**: Vercel 무료 플랜으로 충분히 사용 가능
2. **자동 배포**: GitHub에 push하면 자동으로 재배포
3. **HTTPS 자동**: Vercel은 자동으로 HTTPS 제공
4. **Postgres 무료**: Vercel Postgres도 무료 플랜 제공 (제한 있음)

---

## 🆘 도움이 필요하신가요?

문제가 발생하면:
1. 오류 메시지를 복사하여 알려주세요
2. 어떤 단계에서 문제가 발생했는지 알려주세요
3. 터미널 출력 내용을 공유해주세요

