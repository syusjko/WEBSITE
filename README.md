# AdvisoryAugust - Context-based AI Advertising Platform

![AdvisoryAugust Logo](https://via.placeholder.com/200x60/3B82F6/FFFFFF?text=AdvisoryAugust)

## 🚀 개요

AdvisoryAugust는 문맥 기반 AI 광고 서비스 플랫폼입니다. 광고주와 퍼블리셔를 위한 전문적인 대시보드를 제공하며, 실시간 데이터 분석과 캠페인 관리를 지원합니다.

## ✨ 주요 기능

### 🔐 인증 시스템
- JWT 기반 보안 인증
- 역할 기반 접근 제어 (Admin, Advertiser, Publisher)
- Rate limiting을 통한 보안 강화
- SQLite 데이터베이스 기반 사용자 관리

### 📊 대시보드
- **광고주 대시보드**: 캠페인 성과 분석, 노출수/클릭수 추적
- **퍼블리셔 대시보드**: 수익 분석, 사이트 성과 모니터링
- **관리자 대시보드**: 전체 시스템 현황 관리

### 🎨 디자인 특징
- 종이질감 배경과 Inter 폰트를 활용한 전문적인 UI
- 반응형 디자인으로 모든 디바이스 지원
- Glassmorphism 효과와 부드러운 애니메이션

## 🛠️ 기술 스택

### Backend
- **Node.js** + **Express.js**
- **SQLite3** 데이터베이스
- **JWT** 인증
- **bcryptjs** 비밀번호 암호화
- **express-rate-limit** 보안

### Frontend
- **Vanilla JavaScript** (ES6+)
- **CSS3** with Glassmorphism effects
- **Inter Font** (Google Fonts)
- **Responsive Design**

### DevOps
- **Docker** 컨테이너화
- **Docker Compose** 개발/프로덕션 환경
- **Git** 버전 관리

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/advisoryaugust/advisory-august.git
cd advisory-august
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 프로덕션 빌드
```bash
npm start
```

## 🐳 Docker 사용

### Docker로 실행
```bash
# 이미지 빌드
docker build -t advisory-august .

# 컨테이너 실행
docker run -p 3000:3000 advisory-august
```

### Docker Compose 사용
```bash
# 프로덕션 환경
docker-compose up -d

# 개발 환경
docker-compose --profile dev up -d
```

## 🔑 기본 계정

| 역할 | 이메일 | 비밀번호 | 설명 |
|------|--------|----------|------|
| Admin | admin@advisoryaugust.com | admin123! | 시스템 관리자 |
| Advertiser | advertiser@demo.com | advertiser123! | 광고주 계정 |
| Publisher | publisher@demo.com | publisher123! | 퍼블리셔 계정 |

## 📁 프로젝트 구조

```
advisory-august/
├── public/                 # 정적 파일
│   ├── css/               # 스타일시트
│   ├── js/                # JavaScript 파일
│   ├── assets/            # 이미지 및 아이콘
│   └── *.html             # HTML 페이지
├── server.js              # Express 서버
├── package.json           # 프로젝트 설정
├── Dockerfile             # Docker 설정
├── docker-compose.yml     # Docker Compose 설정
└── README.md              # 프로젝트 문서
```

## 🔧 API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `GET /api/auth/verify` - 토큰 검증
- `POST /api/auth/logout` - 로그아웃

### 사용자
- `GET /api/user/profile` - 사용자 정보 조회

### 대시보드
- `GET /api/dashboard/stats` - 대시보드 통계 데이터

## 🛡️ 보안 기능

- **Rate Limiting**: 로그인 시도 제한 (15분에 5회)
- **JWT 토큰**: 24시간 만료 시간
- **비밀번호 암호화**: bcrypt 해싱
- **SQL Injection 방지**: 파라미터화된 쿼리
- **CORS 설정**: 안전한 크로스 오리진 요청

## 🌐 환경 변수

```bash
NODE_ENV=production          # 환경 설정
PORT=3000                   # 서버 포트
JWT_SECRET=your_secret_key  # JWT 시크릿 키
```

## 📊 성능 최적화

- **정적 파일 캐싱**: Express static middleware
- **데이터베이스 인덱싱**: SQLite 최적화
- **이미지 최적화**: SVG 패턴 사용
- **폰트 최적화**: Google Fonts preconnect

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

- **프로젝트 링크**: [https://github.com/advisoryaugust/advisory-august](https://github.com/advisoryaugust/advisory-august)
- **이메일**: contact@advisoryaugust.com

## 🙏 감사의 말

- [Inter Font](https://fonts.google.com/specimen/Inter) - 깔끔한 타이포그래피
- [Express.js](https://expressjs.com/) - 강력한 웹 프레임워크
- [SQLite](https://www.sqlite.org/) - 가벼운 데이터베이스

---

**AdvisoryAugust** - 문맥 기반 AI 광고의 미래를 만들어갑니다. 🚀