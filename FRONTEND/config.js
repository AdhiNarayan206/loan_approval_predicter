// Configuration file for the Loan Approval Predictor Frontend

const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'http://localhost:5000', // Change this for production
        ENDPOINTS: {
            PREDICT: '/predict',
            HEALTH: '/'
        },
        TIMEOUT: 30000 // 30 seconds
    },
    
    // UI Configuration
    UI: {
        ANIMATION_DURATION: 600,
        DEBOUNCE_DELAY: 300,
        AUTO_SAVE_DELAY: 2000
    },
    
    // Validation Configuration
    VALIDATION: {
        INCOME_MIN: 100000, // Minimum annual income
        LOAN_AMOUNT_MAX_RATIO: 10, // Max loan amount as ratio of income
        CIBIL_SCORE_RANGES: {
            EXCELLENT: 800,
            GOOD: 750,
            FAIR: 650,
            POOR: 550
        }
    },
    
    // Feature Flags
    FEATURES: {
        AUTO_SAVE: true,
        SAMPLE_DATA: true,
        ANALYTICS: false,
        OFFLINE_MODE: false
    },
    
    // Deployment URLs (update these when deploying)
    DEPLOYMENT: {
        DEVELOPMENT: 'http://localhost:5000',
        STAGING: 'https://your-staging-api.com',
        PRODUCTION: 'https://your-production-api.com'
    }
};

// Environment detection
const getEnvironment = () => {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'development';
    } else if (hostname.includes('staging')) {
        return 'staging';
    } else {
        return 'production';
    }
};

// Get API URL based on environment
const getApiUrl = () => {
    const env = getEnvironment();
    return CONFIG.DEPLOYMENT[env.toUpperCase()] || CONFIG.API.BASE_URL;
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, getEnvironment, getApiUrl };
}