# 🚀 빠른 시작 가이드 (5분 완성)

## 단계별 체크리스트

### ✅ 1단계: GitHub 저장소 만들기 (2분)

1. **https://github.com** 접속 → 로그인
2. 우측 상단 **"+"** → **"New repository"** 클릭
3. 저장소 이름 입력: `sj-mobile-partner-center`
4. **Public** 또는 **Private** 선택
5. **"Create repository"** 클릭
6. 생성된 페이지에서 **HTTPS URL 복사**
   - 예: `https://github.com/사용자명/sj-mobile-partner-center.git`

---

### ✅ 2단계: 코드 업로드 (1분)

#### 방법 A: 자동 스크립트 사용 (추천)

터미널에서 실행:

```bash
cd /Users/rishal.2now/Documents/mobile
./setup-github.sh
```

스크립트가 GitHub URL을 물어보면, 1단계에서 복사한 URL을 붙여넣기

#### 방법 B: 수동으로 실행

터미널에서 실행:

```bash
cd /Users/rishal.2now/Documents/mobile

# Git 초기화
git init

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit: SJ Mobile Partner Center"

# GitHub 저장소 연결 (URL을 본인의 것으로 변경!)
git remote add origin https://github.com/사용자명/저장소명.git

# 브랜치 설정
git branch -M main

# 업로드
git push -u origin main
```

**⚠️ 비밀번호 입력 시:**
- Username: GitHub 사용자명
- Password: GitHub Personal Access Token (아래 참고)

---

### ✅ 3단계: Vercel 배포 (2분)

1. **https://vercel.com** 접속
2. **"Sign Up"** → **"Continue with GitHub"** 클릭
3. GitHub 권한 승인
4. **"Add New..."** → **"Project"** 클릭
5. 방금 만든 저장소 선택 → **"Import"** 클릭
6. 설정:
   - Framework Preset: **Other**
   - Build Command: (비워두기)
   - Output Directory: (비워두기)
7. **"Deploy"** 클릭
8. 1-2분 대기
9. **완료!** URL 확인 및 공유

---

## 🔑 GitHub Personal Access Token 만들기

Git push 시 비밀번호 대신 사용:

1. GitHub → 우측 상단 프로필 → **Settings**
2. 좌측 메뉴 하단 → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. **"Generate new token"** → **"Generate new token (classic)"**
5. 설정:
   - Note: `Vercel Deploy`
   - Expiration: 원하는 기간
   - Scopes: **`repo`** 체크
6. **"Generate token"** 클릭
7. **토큰 복사** (한 번만 보여줌!)
8. Git push 시 비밀번호 입력란에 이 토큰 붙여넣기

---

## 📱 완료 후

배포가 완료되면:

- ✅ Vercel이 자동으로 URL 생성
- ✅ 이 URL을 공유하면 누구나 접속 가능
- ✅ 코드 수정 후 `git push`하면 자동 재배포

---

## 🆘 문제 해결

### "remote origin already exists" 오류

```bash
git remote remove origin
git remote add origin https://github.com/사용자명/저장소명.git
```

### "Authentication failed" 오류

- Personal Access Token 사용 (위 참고)
- 또는: `brew install gh && gh auth login`

### Vercel 배포 실패

- Vercel 대시보드 → Deployments → 실패한 배포 → Logs 확인
- SQLite 오류 시: Railway 사용 권장

---

## 📚 더 자세한 가이드

- **상세 가이드**: `GITHUB_DEPLOY_GUIDE.md` 파일 참고
- **배포 가이드**: `DEPLOY.md` 파일 참고

