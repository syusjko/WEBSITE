// Internationalization (i18n) system
class I18nManager {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || this.getBrowserLanguage();
    this.translations = translations; // Use the global translations object
    this.applyLanguage(this.currentLanguage);
  }

  // Get stored language from localStorage
  getStoredLanguage() {
    return localStorage.getItem('preferred-language');
  }

  // Get browser language preference
  getBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    
    // Map browser language to supported languages
    const supportedLanguages = ['ko', 'en', 'ja', 'zh'];
    if (supportedLanguages.includes(langCode)) {
      return langCode;
    }
    
    // Default to Korean if browser language is not supported
    return 'ko';
  }

  // Apply language to the page
  applyLanguage(languageCode) {
    if (!this.translations[languageCode]) {
      console.warn(`Language ${languageCode} not found, falling back to Korean`);
      languageCode = 'ko';
    }

    this.currentLanguage = languageCode;
    localStorage.setItem('preferred-language', languageCode);
    
    // Update HTML lang attribute
    document.documentElement.lang = languageCode;
    
    // Update page direction for RTL languages if needed
    if (languageCode === 'ar' || languageCode === 'he') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }

    // Apply translations
    this.updateTextContent(languageCode);
    this.updateLanguageSelector(languageCode);
  }

  // Update text content based on language
  updateTextContent(languageCode) {
    const t = this.translations[languageCode];
    
    // Navigation
    this.updateElement('[data-i18n="nav.features"]', t.nav.features);
    this.updateElement('[data-i18n="nav.benefits"]', t.nav.benefits);
    this.updateElement('[data-i18n="nav.cases"]', t.nav.cases);
    this.updateElement('[data-i18n="nav.contact"]', t.nav.contact);
    this.updateElement('[data-i18n="nav.login"]', t.nav.login);
    this.updateElement('[data-i18n="nav.freeTrial"]', t.nav.freeTrial);

    // Hero section
    this.updateElement('[data-i18n="hero.title"]', t.hero.title);
    this.updateElement('[data-i18n="hero.description"]', t.hero.description);
    this.updateElement('[data-i18n="hero.startFree"]', t.hero.startFree);
    this.updateElement('[data-i18n="hero.watchDemo"]', t.hero.watchDemo);
    this.updateElement('[data-i18n="hero.dashboardTitle"]', t.hero.dashboardTitle);
    this.updateElement('[data-i18n="hero.clickRate"]', t.hero.clickRate);
    this.updateElement('[data-i18n="hero.cost"]', t.hero.cost);

    // Features section
    this.updateElement('[data-i18n="features.title"]', t.features.title);
    this.updateElement('[data-i18n="features.description"]', t.features.description);
    this.updateElement('[data-i18n="features.contextAnalysis.title"]', t.features.contextAnalysis.title);
    this.updateElement('[data-i18n="features.contextAnalysis.description"]', t.features.contextAnalysis.description);
    this.updateElement('[data-i18n="features.preciseTargeting.title"]', t.features.preciseTargeting.title);
    this.updateElement('[data-i18n="features.preciseTargeting.description"]', t.features.preciseTargeting.description);
    this.updateElement('[data-i18n="features.autoOptimization.title"]', t.features.autoOptimization.title);
    this.updateElement('[data-i18n="features.autoOptimization.description"]', t.features.autoOptimization.description);

    // Benefits section
    this.updateElement('[data-i18n="benefits.title"]', t.benefits.title);
    this.updateElement('[data-i18n="benefits.roiMaximization.number"]', t.benefits.roiMaximization.number);
    this.updateElement('[data-i18n="benefits.roiMaximization.title"]', t.benefits.roiMaximization.title);
    this.updateElement('[data-i18n="benefits.roiMaximization.description"]', t.benefits.roiMaximization.description);
    this.updateElement('[data-i18n="benefits.timeSaving.number"]', t.benefits.timeSaving.number);
    this.updateElement('[data-i18n="benefits.timeSaving.title"]', t.benefits.timeSaving.title);
    this.updateElement('[data-i18n="benefits.timeSaving.description"]', t.benefits.timeSaving.description);
    this.updateElement('[data-i18n="benefits.dataDriven.number"]', t.benefits.dataDriven.number);
    this.updateElement('[data-i18n="benefits.dataDriven.title"]', t.benefits.dataDriven.title);
    this.updateElement('[data-i18n="benefits.dataDriven.description"]', t.benefits.dataDriven.description);
    this.updateElement('[data-i18n="benefits.performanceTitle"]', t.benefits.performanceTitle);
    this.updateElement('[data-i18n="benefits.clickRate"]', t.benefits.clickRate);
    this.updateElement('[data-i18n="benefits.conversionRate"]', t.benefits.conversionRate);
    this.updateElement('[data-i18n="benefits.costReduction"]', t.benefits.costReduction);

    // Case studies section
    this.updateElement('[data-i18n="cases.title"]', t.cases.title);
    this.updateElement('[data-i18n="cases.description"]', t.cases.description);
    this.updateElement('[data-i18n="cases.ecommerce.title"]', t.cases.ecommerce.title);
    this.updateElement('[data-i18n="cases.ecommerce.industry"]', t.cases.ecommerce.industry);
    this.updateElement('[data-i18n="cases.ecommerce.revenueIncrease"]', t.cases.ecommerce.revenueIncrease);
    this.updateElement('[data-i18n="cases.ecommerce.adCost"]', t.cases.ecommerce.adCost);
    this.updateElement('[data-i18n="cases.ecommerce.description"]', t.cases.ecommerce.description);
    this.updateElement('[data-i18n="cases.foodtech.title"]', t.cases.foodtech.title);
    this.updateElement('[data-i18n="cases.foodtech.industry"]', t.cases.foodtech.industry);
    this.updateElement('[data-i18n="cases.foodtech.newCustomers"]', t.cases.foodtech.newCustomers);
    this.updateElement('[data-i18n="cases.foodtech.reorderRate"]', t.cases.foodtech.reorderRate);
    this.updateElement('[data-i18n="cases.foodtech.description"]', t.cases.foodtech.description);
    this.updateElement('[data-i18n="cases.b2b.title"]', t.cases.b2b.title);
    this.updateElement('[data-i18n="cases.b2b.industry"]', t.cases.b2b.industry);
    this.updateElement('[data-i18n="cases.b2b.leadGeneration"]', t.cases.b2b.leadGeneration);
    this.updateElement('[data-i18n="cases.b2b.conversionRate"]', t.cases.b2b.conversionRate);
    this.updateElement('[data-i18n="cases.b2b.description"]', t.cases.b2b.description);

    // CTA section
    this.updateElement('[data-i18n="cta.title"]', t.cta.title);
    this.updateElement('[data-i18n="cta.description"]', t.cta.description);
    this.updateElement('[data-i18n="cta.startFree"]', t.cta.startFree);
    this.updateElement('[data-i18n="cta.bookConsultation"]', t.cta.bookConsultation);
    this.updateElement('[data-i18n="cta.freeTrial"]', t.cta.freeTrial);
    this.updateElement('[data-i18n="cta.expertConsulting"]', t.cta.expertConsulting);
    this.updateElement('[data-i18n="cta.cancelAnytime"]', t.cta.cancelAnytime);

    // Footer section
    this.updateElement('[data-i18n="footer.tagline"]', t.footer.tagline);
    this.updateElement('[data-i18n="footer.services.title"]', t.footer.services.title);
    this.updateElement('[data-i18n="footer.services.aiAdGeneration"]', t.footer.services.aiAdGeneration);
    this.updateElement('[data-i18n="footer.services.targetingOptimization"]', t.footer.services.targetingOptimization);
    this.updateElement('[data-i18n="footer.services.performanceAnalysis"]', t.footer.services.performanceAnalysis);
    this.updateElement('[data-i18n="footer.support.title"]', t.footer.support.title);
    this.updateElement('[data-i18n="footer.support.help"]', t.footer.support.help);
    this.updateElement('[data-i18n="footer.support.contact"]', t.footer.support.contact);
    this.updateElement('[data-i18n="footer.support.apiDocs"]', t.footer.support.apiDocs);
    this.updateElement('[data-i18n="footer.company.title"]', t.footer.company.title);
    this.updateElement('[data-i18n="footer.company.about"]', t.footer.company.about);
    this.updateElement('[data-i18n="footer.company.careers"]', t.footer.company.careers);
    this.updateElement('[data-i18n="footer.company.blog"]', t.footer.company.blog);
    this.updateElement('[data-i18n="footer.copyright"]', t.footer.copyright);
  }

  // Update individual element
  updateElement(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
      if (text.includes('<br>') || text.includes('<span')) {
        element.innerHTML = text;
      } else {
        element.textContent = text;
      }
    }
  }

  // Update language selector
  updateLanguageSelector(languageCode) {
    const languageButtons = document.querySelectorAll('.language-btn');
    languageButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.lang === languageCode) {
        btn.classList.add('active');
      }
    });
  }

  // Change language
  changeLanguage(languageCode) {
    this.applyLanguage(languageCode);
    
    // Add smooth transition effect
    document.body.style.opacity = '0.8';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 200);
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get available languages
  getAvailableLanguages() {
    return [
      { code: 'ko', name: '한국어', flag: '🇰🇷' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'zh', name: '中文', flag: '🇨🇳' }
    ];
  }
}

// Initialize i18n when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.i18n = new I18nManager();
  
  // Create language selector
  createLanguageSelector();
});

// Create language selector component
function createLanguageSelector() {
  const navbar = document.querySelector('.nav-container');
  if (!navbar) return;

  // Check if language selector already exists
  if (document.querySelector('.language-selector')) {
    return;
  }

  const languageSelector = document.createElement('div');
  languageSelector.className = 'language-selector';
  
  const languages = window.i18n.getAvailableLanguages();
  const currentLang = window.i18n.getCurrentLanguage();
  
  languageSelector.innerHTML = `
    <div class="language-dropdown">
      <button class="language-btn active" data-lang="${currentLang}">
        ${languages.find(lang => lang.code === currentLang)?.flag || '🌐'}
      </button>
      <div class="language-menu">
        ${languages.map(lang => `
          <button class="language-option" data-lang="${lang.code}">
            <span class="flag">${lang.flag}</span>
            <span class="name">${lang.name}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Insert before nav-actions
  const navActions = navbar.querySelector('.nav-actions');
  navbar.insertBefore(languageSelector, navActions);

  // Add event listeners
  const languageBtn = languageSelector.querySelector('.language-btn');
  const languageMenu = languageSelector.querySelector('.language-menu');
  const languageOptions = languageSelector.querySelectorAll('.language-option');

  languageBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    languageMenu.classList.toggle('active');
  });

  languageOptions.forEach(option => {
    option.addEventListener('click', function() {
      const langCode = this.dataset.lang;
      window.i18n.changeLanguage(langCode);
      languageMenu.classList.remove('active');
      
      // Update button
      const selectedLang = languages.find(lang => lang.code === langCode);
      languageBtn.innerHTML = selectedLang.flag;
      languageBtn.dataset.lang = langCode;
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!languageSelector.contains(e.target)) {
      languageMenu.classList.remove('active');
    }
  });
}

// Export for use in other files
window.I18nManager = I18nManager;