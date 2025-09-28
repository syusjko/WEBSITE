const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'advisory_august_secret_key_2024';

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting 설정
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 최대 5번 시도
  message: { error: '너무 많은 로그인 시도가 있었습니다. 15분 후 다시 시도해주세요.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 데이터베이스 초기화
const db = new sqlite3.Database('./database.sqlite');

// 테이블 생성
db.serialize(() => {
  // 사용자 테이블
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'advertiser', 'publisher')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
  )`);

  // 로그인 시도 기록 테이블
  db.run(`CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    success BOOLEAN NOT NULL,
    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 세션 테이블
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // 기본 사용자 데이터 삽입
  const defaultUsers = [
    {
      email: 'admin@advisoryaugust.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123!
      name: '관리자',
      company: 'AdvisoryAugust',
      role: 'admin'
    },
    {
      email: 'advertiser@demo.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // advertiser123!
      name: '김광고',
      company: '마케팅코리아',
      role: 'advertiser'
    },
    {
      email: 'publisher@demo.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // publisher123!
      name: '이퍼블',
      company: '미디어넷',
      role: 'publisher'
    }
  ];

  // 기본 사용자 삽입 (중복 방지)
  defaultUsers.forEach(user => {
    db.run(`INSERT OR IGNORE INTO users (email, password, name, company, role) 
            VALUES (?, ?, ?, ?, ?)`,
      [user.email, user.password, user.name, user.company, user.role]);
  });
});

// 유틸리티 함수들
const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '액세스 토큰이 필요합니다.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
  }

  req.user = decoded;
  next();
};

// IP 주소 가져오기
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

// API 라우트들

// 로그인 - 비활성화 (프리뷰용)
app.post('/api/auth/login', (req, res) => {
  res.status(503).json({ 
    error: '로그인 기능이 일시적으로 비활성화되었습니다. 프리뷰 모드에서는 데모 페이지를 이용해주세요.',
    redirect: '/demo.html'
  });
});

// 토큰 검증
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// 로그아웃
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  
  db.run('DELETE FROM sessions WHERE token = ?', [token], (err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: '로그아웃 중 오류가 발생했습니다.' });
    }
    
    res.json({ success: true, message: '로그아웃되었습니다.' });
  });
});

// 사용자 정보 조회
app.get('/api/user/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, email, name, company, role, created_at FROM users WHERE id = ?',
    [req.user.userId], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
      }

      if (!user) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }

      res.json({ success: true, user });
    });
});

// 대시보드 데이터 API
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  // 역할별 다른 데이터 반환
  const mockData = {
    advertiser: {
      impressions: 2847392,
      clicks: 45678,
      ctr: 1.60,
      cost: 1234567,
      campaigns: [
        { name: '여름 세일 프로모션', status: 'active', period: '2024.08.01 - 2024.08.31' },
        { name: '신제품 런칭 캠페인', status: 'active', period: '2024.07.15 - 2024.09.15' },
        { name: '브랜드 인지도 캠페인', status: 'paused', period: '2024.06.01 - 2024.08.01' }
      ]
    },
    publisher: {
      pageViews: 1234567,
      adImpressions: 987654,
      clicks: 12345,
      revenue: 2456789,
      sites: [
        { name: '테크뉴스 블로그', domain: 'technews.example.com', revenue: 1234567 },
        { name: '라이프스타일 매거진', domain: 'lifestyle.example.com', revenue: 987654 },
        { name: '비즈니스 포털', domain: 'business.example.com', revenue: 234568 }
      ]
    },
    admin: {
      totalUsers: 156,
      activeCampaigns: 23,
      totalRevenue: 5678901,
      systemHealth: 'excellent'
    }
  };

  const userRole = req.user.role;
  res.json({
    success: true,
    data: mockData[userRole] || mockData.advertiser
  });
});

// 정적 파일 서빙
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.redirect('/demo.html');
});

app.get('/dashboard-advertiser', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard-advertiser.html'));
});

app.get('/dashboard-publisher', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard-publisher.html'));
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

// 404 핸들링
app.use((req, res) => {
  res.status(404).json({ error: '요청한 리소스를 찾을 수 없습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 AdvisoryAugust 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📊 관리자 대시보드: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 서버를 종료합니다...');
  db.close((err) => {
    if (err) {
      console.error('데이터베이스 종료 오류:', err);
    } else {
      console.log('✅ 데이터베이스 연결이 종료되었습니다.');
    }
    process.exit(0);
  });
});
