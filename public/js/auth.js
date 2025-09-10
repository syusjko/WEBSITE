// Authentication System for AdvisoryAugust
class AuthSystem {
    constructor() {
        this.apiBaseUrl = 'https://api.advisoryaugust.com'; // 실제 API 엔드포인트
        this.tokenKey = 'advisory_auth_token';
        this.userKey = 'advisory_user_data';
        this.maxLoginAttempts = 3;
        this.lockoutDuration = 15 * 60 * 1000; // 15분
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkExistingSession();
    }
    
    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // 실시간 입력 검증
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) {
            emailInput.addEventListener('input', () => this.validateEmail());
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.validatePassword());
        }
    }
    
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // 클라이언트 사이드 검증
        if (!this.validateEmail() || !this.validatePassword()) {
            return;
        }
        
        // 로그인 시도 제한 확인
        if (this.isAccountLocked()) {
            this.showError('generalError', '계정이 일시적으로 잠겼습니다. 15분 후 다시 시도해주세요.');
            return;
        }
        
        const loginButton = document.getElementById('loginButton');
        loginButton.disabled = true;
        loginButton.textContent = '로그인 중...';
        
        try {
            // 실제 API 호출 (현재는 모의 구현)
            const response = await this.authenticateUser(email, password);
            
            if (response.success) {
                // 토큰 저장
                this.storeAuthData(response.token, response.user);
                
                // 사용자 타입에 따른 리다이렉트
                this.redirectToDashboard(response.user.role);
                
            } else {
                this.handleLoginFailure(response.message);
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.handleLoginFailure('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = '로그인';
        }
    }
    
    async authenticateUser(email, password) {
        // 실제 환경에서는 서버로 요청을 보냅니다
        // 현재는 모의 구현으로 데모 계정들을 제공합니다
        
        const demoAccounts = {
            'admin@advisoryaugust.com': {
                password: 'admin123!',
                role: 'advertiser',
                name: '관리자',
                company: 'AdvisoryAugust'
            },
            'advertiser@demo.com': {
                password: 'advertiser123!',
                role: 'advertiser',
                name: '김광고',
                company: '마케팅코리아'
            },
            'publisher@demo.com': {
                password: 'publisher123!',
                role: 'publisher',
                name: '이퍼블',
                company: '미디어넷'
            }
        };
        
        // 모의 지연 (실제 API 호출 시뮬레이션)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const account = demoAccounts[email];
        
        if (!account || account.password !== password) {
            return {
                success: false,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.'
            };
        }
        
        // JWT 토큰 생성 (실제로는 서버에서 생성)
        const token = this.generateMockToken(account);
        
        return {
            success: true,
            token: token,
            user: {
                id: this.generateUserId(),
                email: email,
                name: account.name,
                role: account.role,
                company: account.company
            }
        };
    }
    
    generateMockToken(userData) {
        // 실제로는 서버에서 JWT 토큰을 생성합니다
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            sub: userData.email,
            role: userData.role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24시간
        }));
        const signature = btoa('mock_signature');
        
        return `${header}.${payload}.${signature}`;
    }
    
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
    
    storeAuthData(token, user) {
        // 보안을 위해 토큰을 암호화하여 저장
        const encryptedToken = this.encryptToken(token);
        
        localStorage.setItem(this.tokenKey, encryptedToken);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        
        // 세션 만료 시간 설정
        const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24시간
        localStorage.setItem('auth_expires', expirationTime.toString());
    }
    
    encryptToken(token) {
        // 간단한 암호화 (실제 환경에서는 더 강력한 암호화 사용)
        return btoa(token);
    }
    
    decryptToken(encryptedToken) {
        try {
            return atob(encryptedToken);
        } catch (error) {
            return null;
        }
    }
    
    redirectToDashboard(role) {
        // 사용자 역할에 따른 대시보드 리다이렉트
        if (role === 'advertiser') {
            window.location.href = 'dashboard-advertiser.html';
        } else if (role === 'publisher') {
            window.location.href = 'dashboard-publisher.html';
        } else {
            window.location.href = 'dashboard-admin.html';
        }
    }
    
    validateEmail() {
        const email = document.getElementById('email').value.trim();
        const emailError = document.getElementById('emailError');
        
        // 빈 값일 때는 에러를 표시하지 않음 (사용자가 입력 중일 수 있음)
        if (!email) {
            this.hideError('emailError');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('emailError', '올바른 이메일 형식을 입력해주세요.');
            return false;
        }
        
        this.hideError('emailError');
        return true;
    }
    
    validatePassword() {
        const password = document.getElementById('password').value;
        const passwordError = document.getElementById('passwordError');
        
        if (!password) {
            this.showError('passwordError', '비밀번호를 입력해주세요.');
            return false;
        }
        
        if (password.length < 8) {
            this.showError('passwordError', '비밀번호는 최소 8자 이상이어야 합니다.');
            return false;
        }
        
        this.hideError('passwordError');
        return true;
    }
    
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    handleLoginFailure(message) {
        this.showError('generalError', message);
        this.recordFailedAttempt();
    }
    
    recordFailedAttempt() {
        const attempts = JSON.parse(localStorage.getItem('login_attempts') || '[]');
        attempts.push(Date.now());
        
        // 최근 시도만 유지 (최대 3개)
        const recentAttempts = attempts.slice(-this.maxLoginAttempts);
        localStorage.setItem('login_attempts', JSON.stringify(recentAttempts));
        
        if (recentAttempts.length >= this.maxLoginAttempts) {
            const lockoutTime = Date.now() + this.lockoutDuration;
            localStorage.setItem('account_locked_until', lockoutTime.toString());
        }
    }
    
    isAccountLocked() {
        const lockedUntil = localStorage.getItem('account_locked_until');
        if (!lockedUntil) return false;
        
        const lockoutTime = parseInt(lockedUntil);
        if (Date.now() < lockoutTime) {
            return true;
        } else {
            localStorage.removeItem('account_locked_until');
            localStorage.removeItem('login_attempts');
            return false;
        }
    }
    
    checkExistingSession() {
        const token = localStorage.getItem(this.tokenKey);
        const user = localStorage.getItem(this.userKey);
        const expires = localStorage.getItem('auth_expires');
        
        if (token && user && expires) {
            const expirationTime = parseInt(expires);
            
            if (Date.now() < expirationTime) {
                // 유효한 세션이 있으면 대시보드로 리다이렉트
                const userData = JSON.parse(user);
                this.redirectToDashboard(userData.role);
            } else {
                // 만료된 세션 정리
                this.clearAuthData();
            }
        }
    }
    
    clearAuthData() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem('auth_expires');
    }
    
    // 정적 메서드: 인증 상태 확인
    static isAuthenticated() {
        const token = localStorage.getItem('advisory_auth_token');
        const expires = localStorage.getItem('auth_expires');
        
        if (!token || !expires) return false;
        
        const expirationTime = parseInt(expires);
        return Date.now() < expirationTime;
    }
    
    // 정적 메서드: 사용자 정보 가져오기
    static getCurrentUser() {
        const user = localStorage.getItem('advisory_user_data');
        return user ? JSON.parse(user) : null;
    }
    
    // 정적 메서드: 로그아웃
    static logout() {
        localStorage.removeItem('advisory_auth_token');
        localStorage.removeItem('advisory_user_data');
        localStorage.removeItem('auth_expires');
        localStorage.removeItem('login_attempts');
        localStorage.removeItem('account_locked_until');
        
        window.location.href = 'login.html';
    }
}

// 페이지 로드 시 인증 시스템 초기화
document.addEventListener('DOMContentLoaded', function() {
    new AuthSystem();
});

// 전역에서 사용할 수 있도록 window 객체에 추가
window.AuthSystem = AuthSystem;
