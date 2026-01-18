# 🔐 GitHub 인증 문제 해결

## 문제: 403 Permission denied 오류

GitHub는 2021년부터 비밀번호로 인증을 지원하지 않습니다.
**Personal Access Token**을 사용해야 합니다.

---

## ✅ 해결 방법 1: Personal Access Token 사용 (추천)

### 1단계: Personal Access Token 생성

1. **GitHub 웹사이트 접속**: https://github.com
2. 우측 상단 **프로필 아이콘** 클릭 → **Settings**
3. 좌측 메뉴 하단 → **Developer settings**
4. **Personal access tokens** → **Tokens (classic)**
5. **"Generate new token"** → **"Generate new token (classic)"** 클릭

6. 설정 입력:
   - **Note**: `Vercel Deploy` (아무 이름이나 가능)
   - **Expiration**: 원하는 기간 선택 (예: 90 days)
   - **Scopes**: 아래 항목 체크
     - ✅ **repo** (전체 체크)
       - ✅ repo:status
       - ✅ repo_deployment
       - ✅ public_repo
       - ✅ repo:invite
       - ✅ security_events

7. 페이지 하단으로 스크롤 → **"Generate token"** 클릭

8. **⚠️ 중요: 토큰을 즉시 복사하세요!**
   - 이 페이지를 벗어나면 다시 볼 수 없습니다
   - 예: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2단계: Git에 토큰 사용

터미널에서 다시 push:

```bash
cd /Users/rishal.2now/Documents/mobile

# 다시 push 시도
git push -u origin main
```

**입력 요청 시:**
- **Username**: `yprheeson-hash` (GitHub 사용자명)
- **Password**: 방금 복사한 **Personal Access Token** 붙여넣기
  - 예: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## ✅ 해결 방법 2: GitHub CLI 사용 (더 쉬움)

### 1단계: GitHub CLI 설치

```bash
# Homebrew가 설치되어 있어야 합니다
brew install gh
```

### 2단계: GitHub 로그인

```bash
gh auth login
```

선택 사항:
1. **GitHub.com** 선택
2. **HTTPS** 선택
3. **Login with a web browser** 선택 (추천)
4. 브라우저에서 인증 완료

### 3단계: 다시 push

```bash
cd /Users/rishal.2now/Documents/mobile
git push -u origin main
```

이제 비밀번호 입력 없이 자동으로 인증됩니다!

---

## ✅ 해결 방법 3: URL에 토큰 포함 (일회성)

토큰을 URL에 포함하여 사용:

```bash
cd /Users/rishal.2now/Documents/mobile

# 토큰을 URL에 포함 (TOKEN 부분을 실제 토큰으로 변경)
git remote set-url origin https://ghp_YOUR_TOKEN_HERE@github.com/yprheeson-hash/mobile-p.git

# 그 다음 push
git push -u origin main
```

**⚠️ 보안 주의**: 이 방법은 토큰이 명령어 히스토리에 남을 수 있으므로 주의하세요.

---

## 🔍 현재 원격 저장소 확인

```bash
git remote -v
```

출력 예:
```
origin  https://github.com/yprheeson-hash/mobile-p.git (fetch)
origin  https://github.com/yprheeson-hash/mobile-p.git (push)
```

---

## ✅ 추천 순서

1. **방법 2 (GitHub CLI)** - 가장 간단하고 안전
2. **방법 1 (Personal Access Token)** - CLI 설치가 어려운 경우
3. **방법 3 (URL 포함)** - 임시로 빠르게 해결

---

## 🆘 여전히 문제가 있나요?

### "gh: command not found" 오류

Homebrew가 없으면 먼저 설치:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### "Permission denied" 여전히 발생

1. 저장소가 올바르게 생성되었는지 확인
2. 저장소가 Private인 경우, 토큰에 `repo` 권한이 있는지 확인
3. 토큰이 만료되지 않았는지 확인

---

## 📝 성공 후

push가 성공하면:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/yprheeson-hash/mobile-p.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

이제 Vercel 배포를 진행하세요!



