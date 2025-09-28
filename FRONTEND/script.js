// Configuration
const API_BASE_URL = 'https://loan-approval-api-aeja.onrender.com/predict'; // Change this to your backend URL when deployed

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
        } else {
            data[key] = parseFloat(value);
        }
    }
    
    return data;
}

// Submit prediction to API
async function submitPrediction(data) {
    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
    }
    
    return await response.json();
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
