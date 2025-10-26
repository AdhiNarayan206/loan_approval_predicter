# React Frontend Development Instructions

## 📋 Project Overview

This document provides comprehensive instructions for frontend developers to create a React-based frontend for the Loan Approval Predictor application. The React app will replace the existing vanilla JavaScript frontend while maintaining all functionality and integrating with the existing Flask backend API.

---

## 🎯 Objectives

Build a modern, responsive React application that:
1. Allows users to submit loan applications
2. Displays loan approval predictions with confidence scores
3. Provides AI-powered loan recommendations
4. Offers excellent UX with loading states, error handling, and animations
5. Works seamlessly with the existing backend API

---

## 🏗️ Project Setup

### Step 1: Create React App

```bash
# Navigate to your project root
cd "C:\Users\adhin\OneDrive\Desktop\VS CODE\project\CML project\loan_approval_predicter"

# Create new React app
npx create-react-app loan-approval-frontend

# Navigate to the new app
cd loan-approval-frontend

# Install required dependencies
npm install axios
npm install react-router-dom
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install formik yup
npm install react-toastify
```

### Step 2: Project Structure

Create the following folder structure:

```
loan-approval-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── LoanForm/
│   │   │   ├── LoanForm.jsx
│   │   │   ├── LoanForm.module.css
│   │   │   └── FormField.jsx
│   │   ├── Results/
│   │   │   ├── PredictionResult.jsx
│   │   │   ├── PredictionResult.module.css
│   │   │   └── ConfidenceBar.jsx
│   │   ├── LoanExplorer/
│   │   │   ├── LoanExplorer.jsx
│   │   │   ├── LoanExplorer.module.css
│   │   │   ├── LoanCard.jsx
│   │   │   └── RatingDisplay.jsx
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   └── UI/
│   │       ├── Button.jsx
│   │       ├── Loading.jsx
│   │       ├── ErrorMessage.jsx
│   │       └── Card.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── config.js
│   ├── hooks/
│   │   ├── useLoanPrediction.js
│   │   └── useLoanExplorer.js
│   ├── utils/
│   │   ├── validation.js
│   │   └── formatters.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── PredictionPage.jsx
│   │   └── ExplorePage.jsx
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

---

## 🔧 Core Implementation

### 1. API Configuration (`src/services/config.js`)

```javascript
// API Configuration
export const API_CONFIG = {
  // Change this to your deployed backend URL for production
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  ENDPOINTS: {
    HEALTH: '/',
    PREDICT: '/predict',
    EXPLORE_LOANS: '/explore_loans'
  },
  
  TIMEOUT: 30000, // 30 seconds
  
  // For production
  PRODUCTION_URL: 'https://loan-approval-api-aeja.onrender.com'
};

// Use production URL if in production environment
export const getBaseURL = () => {
  return process.env.NODE_ENV === 'production' 
    ? API_CONFIG.PRODUCTION_URL 
    : API_CONFIG.BASE_URL;
};
```

### 2. API Service (`src/services/api.js`)

```javascript
import axios from 'axios';
import { getBaseURL, API_CONFIG } from './config';

// Create axios instance
const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// API Methods
export const loanAPI = {
  // Health check
  healthCheck: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.HEALTH);
    return response.data;
  },

  // Predict loan approval
  predictLoanApproval: async (loanData) => {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.PREDICT,
      loanData
    );
    return response.data;
  },

  // Get loan recommendations
  exploreLoans: async (loanData) => {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.EXPLORE_LOANS,
      loanData
    );
    return response.data;
  },
};

export default apiClient;
```

### 3. Custom Hook - Loan Prediction (`src/hooks/useLoanPrediction.js`)

```javascript
import { useState } from 'react';
import { loanAPI } from '../services/api';

export const useLoanPrediction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const predictLoan = async (formData) => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const data = await loanAPI.predictLoanApproval(formData);
      setPrediction(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to get prediction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPrediction(null);
    setError(null);
  };

  return {
    loading,
    error,
    prediction,
    predictLoan,
    reset,
  };
};
```

### 4. Custom Hook - Loan Explorer (`src/hooks/useLoanExplorer.js`)

```javascript
import { useState } from 'react';
import { loanAPI } from '../services/api';

export const useLoanExplorer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const exploreLoans = async (formData) => {
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const data = await loanAPI.exploreLoans(formData);
      setRecommendations(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to get loan recommendations';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setRecommendations(null);
    setError(null);
  };

  return {
    loading,
    error,
    recommendations,
    exploreLoans,
    reset,
  };
};
```

### 5. Validation Utility (`src/utils/validation.js`)

```javascript
import * as Yup from 'yup';

// Validation schema for loan form
export const loanFormSchema = Yup.object().shape({
  no_of_dependents: Yup.number()
    .min(0, 'Must be at least 0')
    .max(10, 'Must be at most 10')
    .required('Number of dependents is required'),
  
  education: Yup.number()
    .oneOf([0, 1], 'Invalid education value')
    .required('Education is required'),
  
  self_employed: Yup.number()
    .oneOf([0, 1], 'Invalid employment status')
    .required('Employment status is required'),
  
  income_annum: Yup.number()
    .min(0, 'Income must be positive')
    .required('Annual income is required'),
  
  loan_amount: Yup.number()
    .min(0, 'Loan amount must be positive')
    .required('Loan amount is required'),
  
  loan_term: Yup.number()
    .min(1, 'Minimum loan term is 1 month')
    .max(480, 'Maximum loan term is 480 months')
    .required('Loan term is required'),
  
  cibil_score: Yup.number()
    .min(300, 'CIBIL score must be between 300-900')
    .max(900, 'CIBIL score must be between 300-900')
    .required('CIBIL score is required'),
  
  residential_assets_value: Yup.number()
    .min(0, 'Must be positive')
    .required('Residential assets value is required'),
  
  commercial_assets_value: Yup.number()
    .min(0, 'Must be positive')
    .required('Commercial assets value is required'),
  
  luxury_assets_value: Yup.number()
    .min(0, 'Must be positive')
    .required('Luxury assets value is required'),
  
  bank_asset_value: Yup.number()
    .min(0, 'Must be positive')
    .required('Bank asset value is required'),
  
  loan_type: Yup.string()
    .required('Loan type is required'),
});

// Initial form values
export const initialFormValues = {
  no_of_dependents: 0,
  education: 1,
  self_employed: 0,
  income_annum: '',
  loan_amount: '',
  loan_term: 12,
  cibil_score: '',
  residential_assets_value: '',
  commercial_assets_value: '',
  luxury_assets_value: '',
  bank_asset_value: '',
  loan_type: 'Home Loan',
};

// Loan type options
export const LOAN_TYPES = [
  'Home Loan',
  'Car Loan',
  'Personal Loan',
  'Education Loan',
  'Business Loan',
  'Gold Loan',
];
```

### 6. Formatters Utility (`src/utils/formatters.js`)

```javascript
// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Format confidence as percentage
export const formatConfidence = (confidence) => {
  return `${(confidence * 100).toFixed(1)}%`;
};

// Format education value to text
export const formatEducation = (value) => {
  return value === 1 ? 'Graduate' : 'Not Graduate';
};

// Format employment status to text
export const formatEmployment = (value) => {
  return value === 1 ? 'Self Employed' : 'Employed';
};
```

### 7. Main Loan Form Component (`src/components/LoanForm/LoanForm.jsx`)

```javascript
import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { loanFormSchema, initialFormValues, LOAN_TYPES } from '../../utils/validation';
import styles from './LoanForm.module.css';

const LoanForm = ({ onSubmit, loading }) => {
  return (
    <Paper elevation={3} className={styles.formContainer}>
      <Typography variant="h4" component="h2" gutterBottom>
        Loan Application Form
      </Typography>
      
      <Formik
        initialValues={initialFormValues}
        validationSchema={loanFormSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, values, handleChange, handleBlur }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Number of Dependents */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="no_of_dependents"
                  label="Number of Dependents"
                  value={values.no_of_dependents}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.no_of_dependents && Boolean(errors.no_of_dependents)}
                  helperText={touched.no_of_dependents && errors.no_of_dependents}
                />
              </Grid>

              {/* Education */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="education"
                  label="Education"
                  value={values.education}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.education && Boolean(errors.education)}
                  helperText={touched.education && errors.education}
                >
                  <MenuItem value={1}>Graduate</MenuItem>
                  <MenuItem value={0}>Not Graduate</MenuItem>
                </TextField>
              </Grid>

              {/* Self Employed */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="self_employed"
                  label="Employment Status"
                  value={values.self_employed}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.self_employed && Boolean(errors.self_employed)}
                  helperText={touched.self_employed && errors.self_employed}
                >
                  <MenuItem value={0}>Employed</MenuItem>
                  <MenuItem value={1}>Self Employed</MenuItem>
                </TextField>
              </Grid>

              {/* Annual Income */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="income_annum"
                  label="Annual Income (₹)"
                  value={values.income_annum}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.income_annum && Boolean(errors.income_annum)}
                  helperText={touched.income_annum && errors.income_annum}
                />
              </Grid>

              {/* Loan Amount */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="loan_amount"
                  label="Loan Amount (₹)"
                  value={values.loan_amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.loan_amount && Boolean(errors.loan_amount)}
                  helperText={touched.loan_amount && errors.loan_amount}
                />
              </Grid>

              {/* Loan Term */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="loan_term"
                  label="Loan Term (months)"
                  value={values.loan_term}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.loan_term && Boolean(errors.loan_term)}
                  helperText={touched.loan_term && errors.loan_term}
                />
              </Grid>

              {/* CIBIL Score */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="cibil_score"
                  label="CIBIL Score"
                  value={values.cibil_score}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.cibil_score && Boolean(errors.cibil_score)}
                  helperText={touched.cibil_score && errors.cibil_score}
                />
              </Grid>

              {/* Residential Assets Value */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="residential_assets_value"
                  label="Residential Assets Value (₹)"
                  value={values.residential_assets_value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.residential_assets_value && Boolean(errors.residential_assets_value)}
                  helperText={touched.residential_assets_value && errors.residential_assets_value}
                />
              </Grid>

              {/* Commercial Assets Value */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="commercial_assets_value"
                  label="Commercial Assets Value (₹)"
                  value={values.commercial_assets_value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.commercial_assets_value && Boolean(errors.commercial_assets_value)}
                  helperText={touched.commercial_assets_value && errors.commercial_assets_value}
                />
              </Grid>

              {/* Luxury Assets Value */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="luxury_assets_value"
                  label="Luxury Assets Value (₹)"
                  value={values.luxury_assets_value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.luxury_assets_value && Boolean(errors.luxury_assets_value)}
                  helperText={touched.luxury_assets_value && errors.luxury_assets_value}
                />
              </Grid>

              {/* Bank Asset Value */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="bank_asset_value"
                  label="Bank Asset Value (₹)"
                  value={values.bank_asset_value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.bank_asset_value && Boolean(errors.bank_asset_value)}
                  helperText={touched.bank_asset_value && errors.bank_asset_value}
                />
              </Grid>

              {/* Loan Type */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="loan_type"
                  label="Loan Type"
                  value={values.loan_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.loan_type && Boolean(errors.loan_type)}
                  helperText={touched.loan_type && errors.loan_type}
                >
                  {LOAN_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Submit Buttons */}
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Check Eligibility'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    size="large"
                  >
                    Reset Form
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default LoanForm;
```

### 8. Prediction Result Component (`src/components/Results/PredictionResult.jsx`)

```javascript
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { formatConfidence } from '../../utils/formatters';
import styles from './PredictionResult.module.css';

const PredictionResult = ({ prediction, onReset, onExploreLoans }) => {
  const isApproved = prediction.prediction === 'Approved';
  const confidence = Math.round(prediction.confidence * 100);

  return (
    <Paper elevation={3} className={styles.resultContainer}>
      <Box className={styles.iconContainer}>
        {isApproved ? (
          <CheckCircle className={styles.approvedIcon} />
        ) : (
          <Cancel className={styles.rejectedIcon} />
        )}
      </Box>

      <Typography variant="h4" component="h2" gutterBottom>
        {prediction.prediction}
      </Typography>

      <Typography variant="body1" color="textSecondary" gutterBottom>
        {isApproved
          ? 'Congratulations! Your loan application is likely to be approved.'
          : 'Unfortunately, your loan application may not be approved at this time.'}
      </Typography>

      <Box className={styles.confidenceContainer}>
        <Typography variant="h6">
          Confidence: {formatConfidence(prediction.confidence)}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={confidence}
          className={isApproved ? styles.approvedBar : styles.rejectedBar}
        />
      </Box>

      <Box className={styles.buttonContainer}>
        {isApproved && (
          <Button
            variant="contained"
            color="primary"
            onClick={onExploreLoans}
          >
            Explore Loan Options
          </Button>
        )}
        <Button variant="outlined" onClick={onReset}>
          New Application
        </Button>
      </Box>
    </Paper>
  );
};

export default PredictionResult;
```

### 9. Loan Card Component (`src/components/LoanExplorer/LoanCard.jsx`)

```javascript
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Rating,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  AccessTime,
  OpenInNew,
} from '@mui/icons-material';
import styles from './LoanCard.module.css';

const LoanCard = ({ loan }) => {
  const rating = loan.rating / 2; // Convert 10-point scale to 5-point

  return (
    <Card className={styles.loanCard}>
      <CardContent>
        <Box className={styles.header}>
          <AccountBalance className={styles.bankIcon} />
          <Typography variant="h5" component="h3">
            {loan.bank_name}
          </Typography>
        </Box>

        <Chip
          label={loan.loan_type}
          color="primary"
          size="small"
          className={styles.loanTypeChip}
        />

        <Box className={styles.ratingContainer}>
          <Rating value={rating} precision={0.5} readOnly />
          <Typography variant="body2" color="textSecondary">
            {loan.rating}/10
          </Typography>
        </Box>

        <Box className={styles.detailsContainer}>
          <Box className={styles.detailItem}>
            <TrendingUp className={styles.detailIcon} />
            <Box>
              <Typography variant="caption" color="textSecondary">
                Max Amount
              </Typography>
              <Typography variant="body1">{loan.max_amount}</Typography>
            </Box>
          </Box>

          <Box className={styles.detailItem}>
            <AccessTime className={styles.detailIcon} />
            <Box>
              <Typography variant="caption" color="textSecondary">
                Repayment Time
              </Typography>
              <Typography variant="body1">{loan.repayment_time}</Typography>
            </Box>
          </Box>

          <Box className={styles.detailItem}>
            <Typography variant="caption" color="textSecondary">
              Interest Rate
            </Typography>
            {loan.link && loan.interest_rate === 'See website' ? (
              <Button
                href={loan.link}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                endIcon={<OpenInNew />}
              >
                See website
              </Button>
            ) : (
              <Typography variant="body1">{loan.interest_rate}</Typography>
            )}
          </Box>
        </Box>

        <Box className={styles.reasonContainer}>
          <Typography variant="caption" color="textSecondary">
            Why this loan?
          </Typography>
          <Typography variant="body2">{loan.reason}</Typography>
        </Box>

        {loan.link && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            href={loan.link}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNew />}
            className={styles.applyButton}
          >
            Visit Bank Website
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LoanCard;
```

### 10. Main App Component (`src/App.js`)

```javascript
import React, { useState } from 'react';
import { Container, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LoanForm from './components/LoanForm/LoanForm';
import PredictionResult from './components/Results/PredictionResult';
import LoanExplorer from './components/LoanExplorer/LoanExplorer';
import Loading from './components/UI/Loading';
import { useLoanPrediction } from './hooks/useLoanPrediction';
import { useLoanExplorer } from './hooks/useLoanExplorer';
import './App.css';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState('form'); // 'form', 'result', 'explore'
  const [formData, setFormData] = useState(null);
  
  const { loading: predicting, prediction, predictLoan, reset: resetPrediction } = useLoanPrediction();
  const { loading: exploring, recommendations, exploreLoans, reset: resetExplorer } = useLoanExplorer();

  const handleFormSubmit = async (values) => {
    try {
      setFormData(values);
      await predictLoan(values);
      setCurrentView('result');
      toast.success('Prediction generated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to get prediction');
    }
  };

  const handleExploreLoans = async () => {
    if (!formData) {
      toast.error('Form data not available');
      return;
    }

    try {
      await exploreLoans(formData);
      setCurrentView('explore');
      toast.success('Loan recommendations generated!');
    } catch (error) {
      toast.error(error.message || 'Failed to get recommendations');
    }
  };

  const handleReset = () => {
    setCurrentView('form');
    setFormData(null);
    resetPrediction();
    resetExplorer();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Header />
        
        <Container maxWidth="lg" className="main-container">
          {(predicting || exploring) && <Loading />}

          {currentView === 'form' && (
            <LoanForm onSubmit={handleFormSubmit} loading={predicting} />
          )}

          {currentView === 'result' && prediction && (
            <PredictionResult
              prediction={prediction}
              onReset={handleReset}
              onExploreLoans={handleExploreLoans}
            />
          )}

          {currentView === 'explore' && recommendations && (
            <LoanExplorer
              recommendations={recommendations}
              onBack={handleReset}
            />
          )}
        </Container>

        <Footer />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

---

## 🎨 Styling Guidelines

### CSS Modules Best Practices

1. **Use CSS Modules** for component-specific styles
2. **Material-UI's `sx` prop** for quick inline styling
3. **Theme customization** for global colors and typography

### Example CSS Module (`LoanForm.module.css`)

```css
.formContainer {
  padding: 2rem;
  margin: 2rem 0;
  border-radius: 8px;
}

.submitButton {
  margin-top: 1.5rem;
  padding: 1rem 3rem;
  font-size: 1.1rem;
}

.fieldGroup {
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .formContainer {
    padding: 1rem;
  }
}
```

---

## 🔄 State Management

### Option 1: Context API (Recommended for this project)

Create a context for global state management:

```javascript
// src/context/LoanContext.js
import React, { createContext, useContext, useState } from 'react';

const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const [loanData, setLoanData] = useState(null);
  const [prediction, setPrediction] = useState(null);

  return (
    <LoanContext.Provider value={{ loanData, setLoanData, prediction, setPrediction }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoanContext = () => useContext(LoanContext);
```

### Option 2: Redux Toolkit (For larger applications)

Only use if the app grows significantly.

---

## 📱 Responsive Design Requirements

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Key Requirements
1. Forms should stack vertically on mobile
2. Cards should be single column on mobile
3. Navigation should collapse to hamburger menu on mobile
4. Font sizes should scale appropriately
5. Touch targets should be minimum 44x44px on mobile

---

## ✅ Testing Requirements

### Unit Tests (Jest + React Testing Library)

```javascript
// src/components/LoanForm/LoanForm.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoanForm from './LoanForm';

describe('LoanForm', () => {
  test('renders all form fields', () => {
    render(<LoanForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/Annual Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CIBIL Score/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<LoanForm onSubmit={jest.fn()} />);
    const submitButton = screen.getByText(/Check Eligibility/i);
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<LoanForm onSubmit={mockSubmit} />);
    
    // Fill form...
    // Submit...
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
```

### API Testing

```javascript
// src/services/api.test.js
import { loanAPI } from './api';

describe('Loan API', () => {
  test('predicts loan approval', async () => {
    const mockData = {
      no_of_dependents: 2,
      education: 1,
      // ... other fields
    };
    
    const result = await loanAPI.predictLoanApproval(mockData);
    expect(result).toHaveProperty('prediction');
    expect(result).toHaveProperty('confidence');
  });
});
```

---

## 🚀 Deployment

### Build for Production

```bash
# Create production build
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

### Environment Variables

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

Create `.env.production` file:

```env
REACT_APP_API_URL=https://loan-approval-api-aeja.onrender.com
REACT_APP_ENV=production
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## 📋 Implementation Checklist

### Phase 1: Setup & Core Components
- [ ] Create React app
- [ ] Install dependencies
- [ ] Setup folder structure
- [ ] Create API service layer
- [ ] Create custom hooks
- [ ] Create utility functions

### Phase 2: Form Components
- [ ] Create LoanForm component
- [ ] Add form validation with Formik & Yup
- [ ] Add field-level error messages
- [ ] Implement form reset functionality
- [ ] Add loading states

### Phase 3: Results Display
- [ ] Create PredictionResult component
- [ ] Add confidence bar visualization
- [ ] Add approval/rejection icons
- [ ] Add action buttons
- [ ] Implement animations

### Phase 4: Loan Explorer
- [ ] Create LoanExplorer component
- [ ] Create LoanCard component
- [ ] Add rating display
- [ ] Add external links
- [ ] Implement grid layout

### Phase 5: UI/UX
- [ ] Create Header component
- [ ] Create Footer component
- [ ] Add Loading component
- [ ] Add Error handling
- [ ] Implement toast notifications
- [ ] Add responsive design

### Phase 6: Testing
- [ ] Write unit tests for components
- [ ] Write API integration tests
- [ ] Test form validation
- [ ] Test error scenarios
- [ ] Test responsive design

### Phase 7: Optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Bundle size optimization
- [ ] Performance testing

### Phase 8: Deployment
- [ ] Setup environment variables
- [ ] Create production build
- [ ] Deploy to hosting platform
- [ ] Test production deployment
- [ ] Setup CI/CD pipeline

---

## 🔍 API Integration Details

### Backend Endpoints

#### 1. Health Check
```
GET /
Response: "Congratulations! Your loan approval API is running."
```

#### 2. Predict Loan Approval
```
POST /predict
Content-Type: application/json

Request Body:
{
  "no_of_dependents": 2,
  "education": 1,
  "self_employed": 0,
  "income_annum": 9600000,
  "loan_amount": 29900000,
  "loan_term": 12,
  "cibil_score": 778,
  "residential_assets_value": 2400000,
  "commercial_assets_value": 17600000,
  "luxury_assets_value": 22700000,
  "bank_asset_value": 8000000,
  "loan_type": "Home Loan"
}

Response:
{
  "prediction": "Approved",
  "confidence": 0.8543
}
```

#### 3. Explore Loans
```
POST /explore_loans
Content-Type: application/json

Request Body: (same as /predict)

Response:
{
  "loans": [
    {
      "bank_name": "State Bank of India",
      "loan_type": "Home Loan",
      "max_amount": "Up to Rs. 5 Crore",
      "repayment_time": "Up to 30 years",
      "interest_rate": "8.50% - 9.65%",
      "rating": 9.5,
      "reason": "Best match for your profile...",
      "link": "https://..."
    }
  ]
}
```

---

## 💡 Best Practices

### Code Quality
1. Use ESLint and Prettier
2. Follow React best practices
3. Use PropTypes or TypeScript
4. Write meaningful comments
5. Keep components small and focused

### Performance
1. Use React.memo for expensive components
2. Implement lazy loading for routes
3. Optimize images
4. Use code splitting
5. Implement proper error boundaries

### Accessibility
1. Use semantic HTML
2. Add proper ARIA labels
3. Ensure keyboard navigation
4. Test with screen readers
5. Maintain color contrast ratios

### Security
1. Sanitize user inputs
2. Implement proper CORS
3. Use HTTPS in production
4. Don't expose API keys
5. Validate data on both client and server

---

## 📚 Additional Resources

### Documentation
- React: https://react.dev/
- Material-UI: https://mui.com/
- Formik: https://formik.org/
- Axios: https://axios-http.com/

### Tutorials
- React Forms: https://react.dev/learn/sharing-state-between-components
- API Integration: https://www.robinwieruch.de/react-hooks-fetch-data/
- Material-UI Theming: https://mui.com/material-ui/customization/theming/

---

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend has CORS enabled
   - Check API URL configuration

2. **API Connection Failed**
   - Verify backend is running
   - Check network tab in browser DevTools
   - Verify API endpoint URLs

3. **Build Failures**
   - Clear node_modules and reinstall
   - Check for conflicting package versions
   - Review build errors carefully

4. **Styling Issues**
   - Check CSS module import syntax
   - Verify Material-UI theme setup
   - Test responsive breakpoints

---

## 📧 Support

For questions or issues during development:
1. Check existing documentation
2. Review API endpoint documentation
3. Test API endpoints with Postman/curl
4. Check browser console for errors
5. Contact backend team for API issues

---

## ✅ Definition of Done

A feature is considered complete when:
- [ ] Code is written and tested
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Code is reviewed
- [ ] Documentation is updated
- [ ] Works on mobile and desktop
- [ ] Accessible (WCAG 2.1 Level AA)
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Deployed to staging/production

---

**Good luck with your React frontend development!** 🚀

*Last Updated: October 26, 2025*
