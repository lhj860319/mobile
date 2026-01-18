# 🚀 Vercel 배포 완벽 가이드

## 📋 사전 준비사항

✅ GitHub에 코드가 업로드되어 있어야 합니다
- 저장소 URL 예: `https://github.com/yprheeson-hash/mobile-p`

---

## 1단계: Vercel 계정 생성/로그인

### 처음 사용하는 경우

1. **https://vercel.com** 접속
2. 우측 상단 **"Sign Up"** 클릭
3. **"Continue with GitHub"** 클릭
   - GitHub 계정으로 로그인하는 것이 가장 편리합니다
4. GitHub 권한 승인:
   - "Authorize Vercel" 클릭
   - 필요한 권한 승인

### 이미 계정이 있는 경우

1. **https://vercel.com** 접속
2. **"Log In"** 클릭
3. **"Continue with GitHub"** 클릭

---

## 2단계: 새 프로젝트 생성

### 방법 A: 대시보드에서 생성 (추천)

1. Vercel 대시보드에서 **"Add New..."** 버튼 클릭
   - 또는 **"New Project"** 버튼 클릭

2. **"Import Git Repository"** 화면이 나타납니다

3. GitHub 저장소 찾기:
   - 저장소 목록에서 `mobile-p` 찾기
   - 또는 검색창에 `mobile-p` 입력
   - 저장소 옆의 **"Import"** 버튼 클릭

### 방법 B: GitHub에서 직접 배포

1. GitHub 저장소 페이지 접속
2. **"Deploy to Vercel"** 버튼이 있다면 클릭
   - (없어도 괜찮습니다, 방법 A 사용)

---

## 3단계: 프로젝트 설정

### Configure Project 화면

다음 설정을 확인하고 수정하세요:

#### 기본 설정

- **Project Name**: `sj-mobile-partner-center` (원하는 이름으로 변경 가능)
  - 이 이름이 URL에 사용됩니다
  - 예: `sj-mobile-partner-center.vercel.app`

- **Framework Preset**: **"Other"** 선택
  - 자동 감지되면 "Other"로 변경

#### 빌드 설정

- **Root Directory**: `./` (기본값 유지)
  - 프로젝트 루트가 맞는지 확인

- **Build Command**: **(비워두기)**
  - 빈 칸으로 두세요
  - Express 앱은 빌드 과정이 없습니다

- **Output Directory**: **(비워두기)**
  - 빈 칸으로 두세요

- **Install Command**: `npm install` (기본값 유지)
  - 의존성 설치 명령어

#### 환경 변수 (Environment Variables)

현재는 기본값으로도 작동하지만, 필요시 추가:

- **NODE_ENV**: `production` (선택사항)
- **PORT**: 자동 설정됨 (변경 불필요)

**환경 변수 추가 방법:**
1. "Environment Variables" 섹션 클릭
2. "Add" 버튼 클릭
3. Name과 Value 입력
4. "Save" 클릭

---

## 4단계: 배포 시작

1. 모든 설정 확인 후 **"Deploy"** 버튼 클릭

2. 배포 진행 상황 확인:
   - "Building..." → "Deploying..." → "Ready!"
   - 약 1-3분 소요

3. 배포 로그 확인:
   - 실시간으로 빌드/배포 과정 확인 가능
   - 오류 발생 시 여기서 확인

---

## 5단계: 배포 완료

### 성공 메시지

배포가 완료되면:
- ✅ **"Congratulations!"** 메시지 표시
- ✅ 자동 생성된 URL 확인

### 생성된 URL

예시:
- `https://sj-mobile-partner-center.vercel.app`
- 또는 `https://sj-mobile-partner-center-xxx.vercel.app`

### URL 확인 및 테스트

1. **URL 클릭**하여 사이트 확인
2. 모든 기능이 정상 작동하는지 테스트
3. 문제가 있으면 로그 확인

---

## 6단계: URL 공유

배포된 URL을 다른 사람에게 공유하면:
- ✅ 누구나 접속 가능
- ✅ HTTPS 자동 적용 (보안)
- ✅ 전 세계 어디서나 빠른 접속

**공유 예시:**
```
안녕하세요! 
SJ Mobile Partner Center가 배포되었습니다.

URL: https://sj-mobile-partner-center.vercel.app

이 링크로 접속하시면 됩니다!
```

---

## 🔄 자동 재배포

### GitHub에 코드 업데이트 시

GitHub에 코드를 push하면 **자동으로 재배포**됩니다:

```bash
# 코드 수정 후
git add .
git commit -m "업데이트 내용"
git push

# Vercel이 자동으로 새 버전 배포 (1-2분 소요)
```

### 재배포 확인

1. Vercel 대시보드 → 프로젝트 선택
2. "Deployments" 탭에서 배포 내역 확인
3. 최신 배포 상태 확인

---

## ⚙️ 프로젝트 설정 변경

### 배포 후 설정 변경

1. Vercel 대시보드 → 프로젝트 선택
2. **"Settings"** 탭 클릭

#### 주요 설정 항목

**General:**
- Project Name 변경
- Framework 설정
- Root Directory 변경

**Environment Variables:**
- 환경 변수 추가/수정/삭제
- Production, Preview, Development 환경별 설정

**Domains:**
- 커스텀 도메인 연결
- 예: `sj-mobile.com` 같은 도메인 사용

**Git:**
- 연결된 저장소 확인
- 저장소 변경

---

## 🐛 문제 해결

### 배포 실패 시

#### 1. 로그 확인

1. Vercel 대시보드 → 프로젝트 선택
2. 실패한 배포 클릭
3. **"Logs"** 탭에서 오류 확인

#### 2. 일반적인 오류

**오류: "Build failed"**
- 원인: 의존성 설치 실패
- 해결: `package.json` 확인, `npm install` 로컬에서 테스트

**오류: "Module not found"**
- 원인: 누락된 의존성
- 해결: `package.json`에 추가 후 다시 push

**오류: "Database connection failed"**
- 원인: SQLite 파일 시스템 접근 제한
- 해결: Railway 사용 권장 (SQLite 지원)

**오류: "Port already in use"**
- 원인: Vercel이 자동으로 포트 설정하므로 발생하지 않음
- 해결: `server.js`에서 포트 설정 확인

### 배포는 성공했지만 사이트가 작동하지 않음

#### 1. 브라우저 콘솔 확인

1. 사이트 접속
2. F12 (개발자 도구) 열기
3. Console 탭에서 오류 확인

#### 2. API 오류 확인

- Network 탭에서 API 요청 확인
- 404, 500 오류 확인

#### 3. 데이터베이스 문제

SQLite는 Vercel에서 제한적일 수 있습니다:
- **해결책**: Railway 사용 (SQLite 완벽 지원)
- 또는 Vercel Postgres 사용

---

## 📱 커스텀 도메인 연결 (선택사항)

### 도메인 구매 후 연결

1. Vercel 대시보드 → 프로젝트 → **Settings** → **Domains**
2. 원하는 도메인 입력 (예: `sj-mobile.com`)
3. **"Add"** 클릭
4. DNS 설정 안내에 따라 도메인 제공업체에서 설정
5. 인증 완료 (보통 몇 분~24시간 소요)

---

## 📊 배포 상태 모니터링

### 대시보드에서 확인

1. **Deployments**: 모든 배포 내역
2. **Analytics**: 방문자 통계 (유료 플랜)
3. **Logs**: 실시간 로그 확인
4. **Functions**: 서버리스 함수 모니터링

---

## 💡 유용한 팁

### 1. 프리뷰 배포

- Pull Request 생성 시 자동으로 프리뷰 URL 생성
- 프로덕션 배포 전 테스트 가능

### 2. 환경별 설정

- Production: 실제 사용자용
- Preview: PR 테스트용
- Development: 개발용

각 환경별로 다른 환경 변수 설정 가능

### 3. 무료 플랜 제한

- **무료 플랜**으로도 충분히 사용 가능
- 제한:
  - 월 100GB 대역폭
  - 서버리스 함수 실행 시간 제한
  - 팀 협업 기능 제한

### 4. 성능 최적화

- Vercel은 자동으로 CDN 사용
- 전 세계 어디서나 빠른 접속
- HTTPS 자동 적용

---

## ✅ 체크리스트

배포 전 확인:

- [ ] GitHub에 코드 업로드 완료
- [ ] Vercel 계정 생성/로그인 완료
- [ ] GitHub 저장소 연결 완료
- [ ] 프로젝트 설정 확인 (Framework: Other)
- [ ] Build Command 비워두기
- [ ] Deploy 클릭
- [ ] 배포 완료 대기 (1-3분)
- [ ] URL 확인 및 테스트
- [ ] 모든 기능 정상 작동 확인

---

## 🎉 완료!

배포가 완료되면:
- ✅ 전 세계 어디서나 접속 가능
- ✅ HTTPS 자동 적용
- ✅ 빠른 로딩 속도
- ✅ 자동 재배포

**이제 URL을 공유하고 사용하세요!**

---

## 🆘 도움이 필요하신가요?

문제가 발생하면:
1. Vercel 대시보드 → Deployments → 실패한 배포 → Logs 확인
2. 오류 메시지를 복사하여 알려주세요
3. 어떤 단계에서 문제가 발생했는지 알려주세요



