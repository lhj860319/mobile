# SJ Mobile Partner Center

모바일 사업 파트너 센터 관리 시스템

## 기능

- ✅ 가입 신청서 작성 및 관리
- ✅ 접수/개통 현황 조회
- ✅ 정산 관리
- ✅ 대시보드 통계
- ✅ 모든 입력 데이터 저장 (통신사, 고객명, 연락처, 요금제, 수수료, 비고)

## 기술 스택

- **Backend**: Node.js + Express
- **Database**: SQLite (로컬) → PostgreSQL (클라우드 전환 가능)
- **Frontend**: HTML + Tailwind CSS + Vanilla JavaScript
- **Icons**: Lucide Icons

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 참고하여 `.env` 파일을 생성하세요.

```bash
cp .env.example .env
```

### 3. 서버 실행

```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

서버가 실행되면 브라우저에서 `http://localhost:3000`으로 접속하세요.

## 프로젝트 구조

```
mobile/
├── public/           # 정적 파일 (HTML, CSS, JS)
│   └── index.html
├── routes/           # API 라우트
│   └── api.js
├── models/           # 데이터 모델
│   └── application.js
├── database/         # 데이터베이스 설정
│   └── db.js
├── data/             # SQLite 데이터베이스 파일 (자동 생성)
├── server.js         # Express 서버
└── package.json
```

## API 엔드포인트

### 신청서 관리

- `GET /api/applications` - 전체 신청서 목록 조회
- `GET /api/applications/:id` - 신청서 상세 조회
- `POST /api/applications` - 신청서 생성
- `PATCH /api/applications/:id/status` - 신청서 상태 업데이트
- `PATCH /api/applications/:id/commission` - 수수료 업데이트

### 통계

- `GET /api/statistics` - 통계 정보 조회

## 클라우드 서버로 전환하기

현재는 SQLite를 사용하지만, 나중에 클라우드 서버로 전환할 수 있도록 설계되었습니다.

### PostgreSQL로 전환 예시

1. `package.json`에 PostgreSQL 드라이버 추가:
```bash
npm install pg
```

2. `database/db.js`를 PostgreSQL 연결로 수정
3. 환경 변수에 `DATABASE_URL` 추가
4. SQL 쿼리 문법 조정 (SQLite → PostgreSQL)

### 배포 옵션

- **Heroku**: 간단한 설정으로 배포 가능
- **AWS EC2/RDS**: 확장성 있는 인프라
- **Google Cloud Platform**: GCP 서비스 활용
- **Vercel/Netlify**: 서버리스 함수 활용

## 데이터베이스 스키마

### applications 테이블

- `id` (TEXT, PRIMARY KEY) - UUID
- `carrier` (TEXT) - 통신사
- `customer_name` (TEXT) - 고객명
- `phone_number` (TEXT) - 연락처
- `plan` (TEXT) - 요금제
- `status` (TEXT) - 상태 (접수중, 개통완료)
- `commission` (INTEGER) - 수수료
- `notes` (TEXT) - 비고
- `created_at` (DATETIME) - 생성일시
- `updated_at` (DATETIME) - 수정일시

### users 테이블 (향후 사용)

- `id` (TEXT, PRIMARY KEY) - UUID
- `username` (TEXT, UNIQUE) - 사용자명
- `password` (TEXT) - 비밀번호 (해시)
- `email` (TEXT) - 이메일
- `role` (TEXT) - 역할 (partner, admin)
- `created_at` (DATETIME) - 생성일시

## 향후 개발 계획

- [ ] 사용자 인증 및 권한 관리
- [ ] 파트너 가입 기능
- [ ] 관리자 대시보드
- [ ] 알림 기능
- [ ] 데이터 내보내기 (Excel, CSV)
- [ ] 검색 및 필터링 기능

## 라이선스

© SJ Networks System


