# GitHub를 통한 Vercel 배포 상세 가이드

## 📋 전체 과정 개요

1. GitHub 계정 생성/로그인
2. GitHub에 새 저장소(Repository) 생성
3. 로컬 코드를 GitHub에 업로드
4. Vercel에 GitHub 저장소 연결
5. 자동 배포 완료!

---

## 1단계: GitHub 계정 준비

### GitHub 계정이 없는 경우

1. https://github.com 접속
2. "Sign up" 클릭
3. 이메일, 비밀번호 입력하여 계정 생성
4. 이메일 인증 완료

### GitHub 계정이 있는 경우

1. https://github.com 접속
2. "Sign in" 클릭하여 로그인

---

## 2단계: GitHub에 새 저장소(Repository) 생성

### 방법 1: 웹 브라우저에서 생성 (추천)

1. GitHub 로그인 후 우측 상단의 **"+"** 아이콘 클릭
2. **"New repository"** 선택

3. 저장소 설정:
   - **Repository name**: `sj-mobile-partner-center` (원하는 이름)
   - **Description**: "SJ Mobile Partner Center - 모바일 사업 관리 시스템" (선택사항)
   - **Public** 또는 **Private** 선택
     - Public: 누구나 코드를 볼 수 있음 (무료)
     - Private: 본인만 볼 수 있음 (무료)
   - **"Add a README file"** 체크 해제 (이미 README가 있으므로)
   - **"Add .gitignore"** 체크 해제 (이미 있음)
   - **"Choose a license"** 선택 안 해도 됨

4. **"Create repository"** 버튼 클릭

5. 저장소가 생성되면 다음 화면이 나타납니다:
   ```
   Quick setup — if you've done this kind of thing before
   ```
   
   여기서 **HTTPS** 링크를 복사해두세요:
   ```
   https://github.com/사용자명/sj-mobile-partner-center.git
   ```

---

## 3단계: 로컬 코드를 GitHub에 업로드

### 터미널에서 실행

터미널을 열고 다음 명령어를 순서대로 실행하세요:

```bash
# 1. 프로젝트 폴더로 이동
cd /Users/rishal.2now/Documents/mobile

# 2. Git이 이미 초기화되어 있는지 확인
# (이미 초기화되어 있다면 이 단계는 건너뛰기)
git init

# 3. 모든 파일 추가
git add .

# 4. 첫 커밋 생성
git commit -m "Initial commit: SJ Mobile Partner Center"

# 5. GitHub 저장소 연결
# ⚠️ 아래 URL을 2단계에서 복사한 본인의 저장소 URL로 변경하세요!
git remote add origin https://github.com/사용자명/저장소명.git

# 6. 기본 브랜치를 main으로 설정
git branch -M main

# 7. GitHub에 코드 업로드
git push -u origin main
```

### ⚠️ 주의사항

**7번 단계에서 GitHub 로그인을 요구할 수 있습니다:**

#### 방법 A: Personal Access Token 사용 (추천)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" 클릭
3. Note: "Vercel Deploy" 입력
4. Expiration: 원하는 기간 선택
5. Scopes: `repo` 체크
6. "Generate token" 클릭
7. 생성된 토큰을 복사 (한 번만 보여줌!)
8. 비밀번호 입력 시도 시:
   - Username: GitHub 사용자명
   - Password: 방금 복사한 토큰 붙여넣기

#### 방법 B: GitHub CLI 사용

```bash
# GitHub CLI 설치 (Homebrew 필요)
brew install gh

# GitHub 로그인
gh auth login

# 그 다음 다시 push
git push -u origin main
```

---

## 4단계: Vercel에 배포

### Vercel 계정 생성/로그인

1. https://vercel.com 접속
2. **"Sign Up"** 또는 **"Log In"** 클릭
3. **"Continue with GitHub"** 클릭
4. GitHub 권한 승인

### 프로젝트 배포

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭

2. **"Import Git Repository"** 화면에서:
   - 방금 만든 GitHub 저장소가 보입니다
   - 찾지 못하면 "Search"로 검색
   - 저장소 옆의 **"Import"** 버튼 클릭

3. **"Configure Project"** 화면:
   
   **프로젝트 설정:**
   - **Project Name**: `sj-mobile-partner-center` (원하는 이름)
   - **Framework Preset**: **"Other"** 선택
   - **Root Directory**: `./` (기본값 유지)
   - **Build Command**: (비워두기 - 빈 칸)
   - **Output Directory**: (비워두기 - 빈 칸)
   - **Install Command**: `npm install` (기본값 유지)

   **Environment Variables** (환경 변수):
   - 필요시 추가 (현재는 기본값으로도 작동)

4. **"Deploy"** 버튼 클릭

5. 배포 진행 상황 확인:
   - "Building..." → "Deploying..." → "Ready!"
   - 약 1-2분 소요

---

## 5단계: 배포 완료 및 URL 확인

### 배포 완료 후

1. **"Congratulations!"** 메시지와 함께 배포 완료
2. 자동 생성된 URL 확인:
   - 예: `https://sj-mobile-partner-center.vercel.app`
   - 또는 `https://sj-mobile-partner-center-xxx.vercel.app`

3. **URL 클릭하여 사이트 확인**

4. **URL 공유**:
   - 이 URL을 다른 사람에게 공유하면 접속 가능
   - 예: `https://sj-mobile-partner-center.vercel.app`

---

## 🔄 코드 업데이트 시 자동 재배포

GitHub에 코드를 푸시하면 Vercel이 자동으로 재배포합니다:

```bash
# 코드 수정 후
git add .
git commit -m "업데이트 내용 설명"
git push

# Vercel이 자동으로 새 버전 배포 (약 1-2분)
```

---

## 🐛 문제 해결

### Git push 오류

**오류: "remote origin already exists"**
```bash
# 기존 원격 저장소 제거 후 다시 추가
git remote remove origin
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

**오류: "Authentication failed"**
- Personal Access Token 사용 (위의 방법 A 참고)
- 또는 GitHub CLI 사용 (방법 B)

### Vercel 배포 오류

**오류: "Build failed"**
- Vercel 대시보드 → Deployments → 실패한 배포 클릭
- "Logs" 탭에서 오류 확인
- 대부분 `package.json`의 의존성 문제

**오류: "Database connection failed"**
- Vercel은 SQLite 파일 시스템 접근이 제한적
- Railway 사용 권장 (SQLite 지원)

---

## 📱 다음 단계

### 커스텀 도메인 연결 (선택사항)

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 원하는 도메인 입력
3. DNS 설정 안내에 따라 도메인 설정

### 환경 변수 추가

1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. 필요한 변수 추가:
   - `NODE_ENV=production`
   - 기타 필요한 변수

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] GitHub 계정 생성/로그인 완료
- [ ] GitHub에 새 저장소 생성 완료
- [ ] 로컬 코드를 GitHub에 업로드 완료
- [ ] Vercel 계정 생성/로그인 완료
- [ ] Vercel에서 GitHub 저장소 연결 완료
- [ ] 배포 완료 및 URL 확인

---

## 💡 팁

1. **Private 저장소 사용**: 코드를 공개하지 않으려면 Private 선택
2. **자동 배포**: GitHub에 push하면 자동으로 재배포됨
3. **무료 플랜**: Vercel 무료 플랜으로 충분히 사용 가능
4. **HTTPS 자동**: Vercel은 자동으로 HTTPS 제공

---

## 🆘 도움이 필요하신가요?

문제가 발생하면:
1. 오류 메시지를 복사하여 알려주세요
2. 어떤 단계에서 문제가 발생했는지 알려주세요
3. 터미널 출력 내용을 공유해주세요

