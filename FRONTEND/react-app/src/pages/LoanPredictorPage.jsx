import { useState } from 'react';
import './LoanPredictorPage.css';

const LoanPredictorPage = () => {
  const [formData, setFormData] = useState({
    no_of_dependents: '',
    education: '',
    self_employed: '',
    income_annum: '',
    loan_amount: '',
    loan_term: '',
    cibil_score: '',
    residential_assets_value: '',
    commercial_assets_value: '',
    luxury_assets_value: '',
    bank_asset_value: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const API_BASE_URL = 'http://localhost:5000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResult(false);

    try {
      const dataToSend = {
        ...formData,
        education: parseInt(formData.education),
        self_employed: parseInt(formData.self_employed),
        no_of_dependents: parseInt(formData.no_of_dependents),
        loan_term: parseInt(formData.loan_term),
        cibil_score: parseInt(formData.cibil_score),
        income_annum: parseFloat(formData.income_annum),
        loan_amount: parseFloat(formData.loan_amount),
        residential_assets_value: parseFloat(formData.residential_assets_value),
        commercial_assets_value: parseFloat(formData.commercial_assets_value),
        luxury_assets_value: parseFloat(formData.luxury_assets_value),
        bank_asset_value: parseFloat(formData.bank_asset_value)
      };

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setResult(data);
      setShowResult(true);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      no_of_dependents: '',
      education: '',
      self_employed: '',
      income_annum: '',
      loan_amount: '',
      loan_term: '',
      cibil_score: '',
      residential_assets_value: '',
      commercial_assets_value: '',
      luxury_assets_value: '',
      bank_asset_value: ''
    });
    setResult(null);
    setShowResult(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="predictor-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Processing your application...</p>
        </div>
      </div>
    );
  }

  if (showResult && result) {
    const isApproved = result.prediction === 'Approved';
    const confidence = Math.round(result.confidence * 100);

    return (
      <div className="predictor-page">
        <div className="result-container">
          <div className={`result-icon ${isApproved ? 'approved' : 'rejected'}`}>
            <i className={isApproved ? 'fas fa-check-circle' : 'fas fa-times-circle'}></i>
          </div>
          <h2 className={`result-title ${isApproved ? 'approved' : 'rejected'}`}>
            {result.prediction}
          </h2>
          <p className="result-message">
            {isApproved 
              ? 'Congratulations! Your loan application has been approved based on the provided information.'
              : 'Unfortunately, your loan application does not meet the approval criteria at this time.'}
          </p>
          <div className="confidence-container">
            <span className="confidence-label">Confidence:</span>
            <div className="confidence-bar">
              <div className="confidence-fill" style={{ width: `${confidence}%` }}></div>
            </div>
            <span className="confidence-text">{confidence}%</span>
          </div>
          <button onClick={() => setShowResult(false)} className="btn btn-primary">
            <i className="fas fa-plus"></i> New Application
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="predictor-page">
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error Processing Request</h3>
          <p>{error}</p>
          <button onClick={() => setError(null)} className="btn btn-primary">
            <i className="fas fa-redo"></i> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="predictor-page">
      <div className="predictor-container">
        <header className="predictor-header">
          <div className="header-icon">
            <i className="fas fa-calculator"></i>
          </div>
          <h1>Loan Approval Predictor</h1>
          <p>Get instant loan approval predictions using advanced machine learning</p>
        </header>

        <main className="predictor-main">
          <form onSubmit={handleSubmit} className="loan-form">
            {/* Personal Information Section */}
            <div className="form-section">
              <h2><i className="fas fa-user"></i> Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="dependents">Number of Dependents</label>
                  <input
                    type="number"
                    id="dependents"
                    name="no_of_dependents"
                    value={formData.no_of_dependents}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    required
                  />
                  <small>Number of family members dependent on you</small>
                </div>

                <div className="form-group">
                  <label htmlFor="education">Education Level</label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Education Level</option>
                    <option value="0">Not Graduate</option>
                    <option value="1">Graduate</option>
                  </select>
                  <small>Your highest education qualification</small>
                </div>

                <div className="form-group">
                  <label htmlFor="employment">Employment Type</label>
                  <select
                    id="employment"
                    name="self_employed"
                    value={formData.self_employed}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Employment Type</option>
                    <option value="0">Salaried</option>
                    <option value="1">Self Employed</option>
                  </select>
                  <small>Your current employment status</small>
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="form-section">
              <h2><i className="fas fa-rupee-sign"></i> Financial Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="income">Annual Income (₹)</label>
                  <input
                    type="number"
                    id="income"
                    name="income_annum"
                    value={formData.income_annum}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    required
                  />
                  <small>Your total annual income in rupees</small>
                </div>

                <div className="form-group">
                  <label htmlFor="loanAmount">Loan Amount (₹)</label>
                  <input
                    type="number"
                    id="loanAmount"
                    name="loan_amount"
                    value={formData.loan_amount}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    required
                  />
                  <small>The loan amount you are requesting</small>
                </div>

                <div className="form-group">
                  <label htmlFor="loanTerm">Loan Term (months)</label>
                  <input
                    type="number"
                    id="loanTerm"
                    name="loan_term"
                    value={formData.loan_term}
                    onChange={handleChange}
                    min="1"
                    max="480"
                    required
                  />
                  <small>Duration for loan repayment in months</small>
                </div>

                <div className="form-group">
                  <label htmlFor="cibilScore">CIBIL Score</label>
                  <input
                    type="number"
                    id="cibilScore"
                    name="cibil_score"
                    value={formData.cibil_score}
                    onChange={handleChange}
                    min="300"
                    max="900"
                    required
                  />
                  <small>Your credit score (300-900)</small>
                </div>
              </div>
            </div>

            {/* Asset Information Section */}
            <div className="form-section">
              <h2><i className="fas fa-home"></i> Asset Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="residentialAssets">Residential Assets Value (₹)</label>
                  <input
                    type="number"
                    id="residentialAssets"
                    name="residential_assets_value"
                    value={formData.residential_assets_value}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    required
                  />
                  <small>Total value of your residential properties</small>
                </div>

                <div className="form-group">
                  <label htmlFor="commercialAssets">Commercial Assets Value (₹)</label>
                  <input
                    type="number"
                    id="commercialAssets"
                    name="commercial_assets_value"
                    value={formData.commercial_assets_value}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    required
                  />
                  <small>Total value of your commercial properties</small>
                </div>

                <div className="form-group">
                  <label htmlFor="luxuryAssets">Luxury Assets Value (₹)</label>
                  <input
                    type="number"
                    id="luxuryAssets"
                    name="luxury_assets_value"
                    value={formData.luxury_assets_value}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    required
                  />
                  <small>Value of luxury items (cars, jewelry, etc.)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="bankAssets">Bank Assets Value (₹)</label>
                  <input
                    type="number"
                    id="bankAssets"
                    name="bank_asset_value"
                    value={formData.bank_asset_value}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    required
                  />
                  <small>Total value of your bank deposits and investments</small>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleReset} className="btn btn-secondary">
                <i className="fas fa-undo"></i> Reset Form
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-calculator"></i> Check Eligibility
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default LoanPredictorPage;
