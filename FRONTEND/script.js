// Configuration
const API_BASE_URL = 'http://127.0.0.1:5000'; // Change this to your backend URL when deployed
// const API_BASE_URL = 'https://loan-approval-api-aeja.onrender.com'; // Production URL

// DOM Elements
const loanForm = document.getElementById('loanForm');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const newApplicationBtn = document.getElementById('newApplicationBtn');
const retryBtn = document.getElementById('retryBtn');

// Containers
const formContainer = document.querySelector('.form-container');
const resultContainer = document.getElementById('resultContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorContainer = document.getElementById('errorContainer');

// Result elements
const resultIcon = document.getElementById('resultIcon');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const confidenceBar = document.getElementById('confidenceBar');
const confidenceText = document.getElementById('confidenceText');
const errorMessage = document.getElementById('errorMessage');

// Form validation rules
const validationRules = {
    no_of_dependents: { min: 0, max: 10, required: true },
    education: { required: true },
    self_employed: { required: true },
    income_annum: { min: 0, required: true },
    loan_amount: { min: 0, required: true },
    loan_term: { min: 1, max: 480, required: true },
    cibil_score: { min: 300, max: 900, required: true },
    residential_assets_value: { min: 0, required: true },
    commercial_assets_value: { min: 0, required: true },
    luxury_assets_value: { min: 0, required: true },
    bank_asset_value: { min: 0, required: true }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupFormValidation();
    loadSampleData(); // Optional: Load sample data for testing
});

// Event Listeners
function initializeEventListeners() {
    loanForm.addEventListener('submit', handleFormSubmit);
    resetBtn.addEventListener('click', resetForm);
    newApplicationBtn.addEventListener('click', showForm);
    retryBtn.addEventListener('click', showForm);
    
    // Real-time validation
    const inputs = loanForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

// Form submission handler
async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = getFormData();
    
    try {
        showLoading();
        const prediction = await submitPrediction(formData);
        showResult(prediction);
    } catch (error) {
        console.error('Prediction error:', error);
        showError(error.message);
    }
}

// Get form data
function getFormData() {
    const formData = new FormData(loanForm);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        // Convert to appropriate data types
        if (key === 'education' || key === 'self_employed') {
            data[key] = parseInt(value);
        } else if (key === 'no_of_dependents' || key === 'loan_term' || key === 'cibil_score') {
            data[key] = parseInt(value);
        } else if (key === 'loan_type') {
            // Keep loan_type as string
            data[key] = value;
        } else {
            data[key] = parseFloat(value);
        }
    }
    
    return data;
}

// Submit prediction to API
async function submitPrediction(data) {
    try {
        console.log('Making request to:', `${API_BASE_URL}/predict`);
        console.log('Request data:', data);
        
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error:', errorData);
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        return result;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Form validation
function validateForm() {
    let isValid = true;
    const inputs = loanForm.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const rules = validationRules[fieldName];
    
    if (!rules) return true;
    
    const formGroup = field.closest('.form-group');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required validation
    if (rules.required && !value) {
        showFieldError(formGroup, 'This field is required');
        return false;
    }
    
    if (value && field.type === 'number') {
        const numValue = parseFloat(value);
        
        // Min validation
        if (rules.min !== undefined && numValue < rules.min) {
            showFieldError(formGroup, `Minimum value is ${rules.min}`);
            return false;
        }
        
        // Max validation
        if (rules.max !== undefined && numValue > rules.max) {
            showFieldError(formGroup, `Maximum value is ${rules.max}`);
            return false;
        }
    }
    
    // Mark as valid
    formGroup.classList.add('success');
    return true;
}

function showFieldError(formGroup, message) {
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Setup form validation
function setupFormValidation() {
    // Add input formatting for currency fields
    const currencyFields = ['income_annum', 'loan_amount', 'residential_assets_value', 
                           'commercial_assets_value', 'luxury_assets_value', 'bank_asset_value'];
    
    currencyFields.forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.addEventListener('input', formatCurrencyInput);
        }
    });
}

function formatCurrencyInput(event) {
    // Remove non-numeric characters except decimal point
    let value = event.target.value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    event.target.value = value;
}

// UI State Management
function showLoading() {
    hideAllContainers();
    loadingSpinner.style.display = 'block';
    submitBtn.disabled = true;
}

// Hide loading spinner and re-enable buttons
function hideLoading() {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
    if (submitBtn) {
        submitBtn.disabled = false;
    }
    // exploreLoanBtn is declared later; it's safe to reference at call time
    if (typeof exploreLoanBtn !== 'undefined' && exploreLoanBtn) {
        exploreLoanBtn.disabled = false;
    }
}

function showResult(prediction) {
    hideAllContainers();
    
    const isApproved = prediction.prediction === 'Approved';
    const confidence = Math.round(prediction.confidence * 100);
    
    // Update result content
    resultIcon.innerHTML = isApproved ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>';
    resultIcon.className = `result-icon ${isApproved ? 'approved' : 'rejected'}`;
    
    resultTitle.textContent = prediction.prediction;
    resultTitle.className = `result-title ${isApproved ? 'approved' : 'rejected'}`;
    
    resultMessage.textContent = isApproved 
        ? 'Congratulations! Your loan application has been approved based on the provided information.' 
        : 'Unfortunately, your loan application does not meet the approval criteria at this time.';
  

    // Update confidence bar
    confidenceBar.style.width = `${confidence}%`;
    confidenceText.textContent = `${confidence}%`;
    
    resultContainer.style.display = 'block';
    submitBtn.disabled = false;
}

function showError(message) {
    hideAllContainers();
    errorMessage.textContent = message || 'An unexpected error occurred. Please try again.';
    errorContainer.style.display = 'block';
    submitBtn.disabled = false;
}

function showForm() {
    hideAllContainers();
    formContainer.style.display = 'block';
}

function hideAllContainers() {
    resultContainer.style.display = 'none';
    loadingSpinner.style.display = 'none';
    errorContainer.style.display = 'none';
}

// Form reset
function resetForm() {
    loanForm.reset();
    
    // Clear all validation states
    const formGroups = loanForm.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
    
    // Show form
    showForm();
}

// Load sample data for testing (optional)
function loadSampleData() {
    // Check if URL has sample parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sample') === 'true') {
        const sampleData = {
            no_of_dependents: 2,
            education: 1,
            self_employed: 0,
            income_annum: 9600000,
            loan_amount: 29900000,
            loan_term: 12,
            cibil_score: 778,
            residential_assets_value: 2400000,
            commercial_assets_value: 17600000,
            luxury_assets_value: 22700000,
            bank_asset_value: 8000000
        };
        
        Object.keys(sampleData).forEach(key => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = sampleData[key];
            }
        });
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-IN').format(number);
}

// Enhanced error handling for network issues
window.addEventListener('online', function() {
    if (errorContainer.style.display === 'block') {
        showForm();
    }
});

window.addEventListener('offline', function() {
    if (loadingSpinner.style.display === 'block') {
        showError('No internet connection. Please check your network and try again.');
    }
});

// Form auto-save functionality (optional)
function saveFormData() {
    const formData = getFormData();
    localStorage.setItem('loanFormData', JSON.stringify(formData));
}

function loadFormData() {
    const savedData = localStorage.getItem('loanFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = document.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                }
            });
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to submit form
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        if (formContainer.style.display !== 'none') {
            event.preventDefault();
            loanForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to reset/go back
    if (event.key === 'Escape') {
        if (resultContainer.style.display === 'block' || errorContainer.style.display === 'block') {
            showForm();
        }
    }
});

// Add smooth scrolling for better UX
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Call scrollToTop when showing results or errors
const originalShowResult = showResult;
const originalShowError = showError;

showResult = function(prediction) {
    originalShowResult(prediction);
    setTimeout(scrollToTop, 100);
};

showError = function(message) {
    originalShowError(message);
    setTimeout(scrollToTop, 100);
};

// ============================================
// LOAN EXPLORATION FUNCTIONALITY
// ============================================

let currentFormData = null; // Store form data for loan exploration

// DOM Elements for loan exploration
const exploreLoanBtn = document.getElementById('exploreLoanBtn');
const recommendationsContainer = document.getElementById('recommendationsContainer');
const loansList = document.getElementById('loansList');
const backToResultBtn = document.getElementById('backToResultBtn');

// Initialize loan exploration event listeners
if (exploreLoanBtn) {
    exploreLoanBtn.addEventListener('click', handleExploreLoan);
}

if (backToResultBtn) {
    backToResultBtn.addEventListener('click', showResultsFromRecommendations);
}

// Update the form submit handler to store form data
const originalHandleFormSubmit = handleFormSubmit;
handleFormSubmit = async function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Store form data for later use
    currentFormData = getFormData();
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentFormData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        showResult(data);
        
        // Show "Explore Loans" button only if approved
        if (data.prediction === 'Approved') {
            exploreLoanBtn.style.display = 'inline-flex';
        } else {
            exploreLoanBtn.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to process your request. Please try again.');
    }
};

// Handle explore loan button click
async function handleExploreLoan() {
    if (!currentFormData) {
        showError('No loan data available. Please submit the form first.');
        return;
    }
    
    showLoading();
    exploreLoanBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/explore_loans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentFormData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        displayLoanRecommendations(data);
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to fetch loan recommendations. Please try again.');
        exploreLoanBtn.disabled = false;
    }
}

// Display loan recommendations
function displayLoanRecommendations(data) {
    hideLoading();
    
    // Hide result and form containers
    resultContainer.style.display = 'none';
    formContainer.style.display = 'none';
    
    // Show recommendations container
    recommendationsContainer.style.display = 'block';
    
    // Clear previous recommendations
    loansList.innerHTML = '';
    
    // Check if we have loans data
    const loans = data.loans || [];
    
    if (loans.length === 0) {
        loansList.innerHTML = `
            <div class="loan-card">
                <p style="text-align: center; color: #666;">No loan recommendations available at this time.</p>
            </div>
        `;
        return;
    }
    
    // Create loan cards
    loans.forEach((loan, index) => {
        const loanCard = document.createElement('div');
        loanCard.className = 'loan-card';

        // Render interest rate as hyperlink if 'See website' and link present
        let interestRateHtml = '';
        if (
            loan.interest_rate &&
            loan.interest_rate.trim().toLowerCase() === 'see website' &&
            loan.link
        ) {
            interestRateHtml = `<a href="${loan.link}" target="_blank" rel="noopener noreferrer">See website</a>`;
        } else {
            interestRateHtml = loan.interest_rate || 'See website';
        }

        loanCard.innerHTML = `
            <div class="loan-card-header">
                <div class="loan-card-title">
                    <i class="fas fa-building" style="color: #667eea; margin-right: 8px;"></i>
                    ${loan.bank_name || 'Bank Name'}
                </div>
                <div class="loan-rating">
                    <i class="fas fa-star"></i>
                    <span>${loan.rating || 'N/A'}/10</span>
                </div>
            </div>
            
            <div class="loan-details">
                <div class="loan-detail-item">
                    <span class="loan-detail-label">Loan Type</span>
                    <span class="loan-detail-value">${loan.loan_type || 'N/A'}</span>
                </div>
                <div class="loan-detail-item">
                    <span class="loan-detail-label">Max Amount</span>
                    <span class="loan-detail-value">${loan.max_amount || 'N/A'}</span>
                </div>
                <div class="loan-detail-item">
                    <span class="loan-detail-label">Repayment Time</span>
                    <span class="loan-detail-value">${loan.repayment_time || 'N/A'}</span>
                </div>
                <div class="loan-detail-item">
                    <span class="loan-detail-label">Interest Rate</span>
                    <span class="loan-detail-value">${interestRateHtml}</span>
                </div>
            </div>
            
            ${loan.reason ? `
                <div class="loan-reason">
                    <div class="loan-reason-label">
                        <i class="fas fa-info-circle"></i> Why this loan?
                    </div>
                    <div class="loan-reason-text">${loan.reason}</div>
                </div>
            ` : ''}
        `;
        loansList.appendChild(loanCard);
    });
    
    scrollToTop();
}

// Show results from recommendations
function showResultsFromRecommendations() {
    recommendationsContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    exploreLoanBtn.disabled = false;
    scrollToTop();
}

