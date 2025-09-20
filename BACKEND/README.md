# Backend API

Flask-based REST API for loan approval predictions using trained machine learning models.

## 🚀 Overview

This backend service provides a RESTful API for making real-time loan approval predictions. It loads pre-trained models and serves predictions through HTTP endpoints.

## 📁 Files Structure

```
BACKEND/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── Procfile           # Deployment configuration for cloud platforms
└── README.md          # This documentation
```

## 🔧 Installation & Setup

### Local Development

1. **Navigate to the backend directory**
   ```bash
   cd BACKEND
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Access the API**
   - Local URL: `http://localhost:5000`
   - Health check: `GET http://localhost:5000/`

### Dependencies

- **Flask 2.3.3**: Web framework
- **joblib 1.3.2**: Model loading and serialization
- **numpy 1.24.3**: Numerical computations
- **scikit-learn 1.5.1**: Machine learning library (compatible with trained models)
- **flask-cors 4.0.0**: Cross-Origin Resource Sharing support
- **gunicorn 21.2.0**: WSGI HTTP Server for production
- **setuptools 69.0.3**: Package setup utilities

## 🛠️ API Endpoints

### 1. Health Check

**GET** `/`

**Description**: Check if the API is running

**Response**:
```json
"Congratulations! Your loan approval API is running."
```

### 2. Loan Approval Prediction

**POST** `/predict`

**Description**: Predict loan approval based on applicant data

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
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
  "bank_asset_value": 8000000
}
```

**Response** (Success):
```json
{
  "prediction": "Approved",
  "confidence": 0.8543
}
```

**Response** (Error):
```json
{
  "error": "Invalid input format",
  "message": "Detailed error description"
}
```

**Status Codes**:
- `200`: Successful prediction
- `400`: Invalid input format or missing data

## 📊 Input Features

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `no_of_dependents` | Integer | Number of dependents | 2 |
| `education` | Integer | Education level (0: Graduate, 1: Not Graduate) | 1 |
| `self_employed` | Integer | Employment status (0: No, 1: Yes) | 0 |
| `income_annum` | Integer | Annual income in currency units | 9600000 |
| `loan_amount` | Integer | Requested loan amount | 29900000 |
| `loan_term` | Integer | Loan term in years | 12 |
| `cibil_score` | Integer | Credit score (300-850) | 778 |
| `residential_assets_value` | Integer | Value of residential assets | 2400000 |
| `commercial_assets_value` | Integer | Value of commercial assets | 17600000 |
| `luxury_assets_value` | Integer | Value of luxury assets | 22700000 |
| `bank_asset_value` | Integer | Value of bank assets | 8000000 |

## 🌐 Deployment

### Render Deployment

1. **Prepare for deployment** (already configured):
   - `Procfile` specifies the start command
   - `requirements.txt` lists all dependencies
   - Cross-platform path handling in `app.py`

2. **Environment Configuration**:
   - Set `PYTHON_VERSION` to `3.11.0` in Render dashboard
   - The app uses `PORT` environment variable automatically

3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `gunicorn app:app`

### Heroku Deployment

1. **Install Heroku CLI**
2. **Deploy commands**:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Local Testing with Gunicorn

```bash
gunicorn app:app
```

## 🔧 Configuration

### Environment Variables

- `PORT`: Port number (default: 5000)
- `PYTHON_VERSION`: Python version for deployment platforms

### CORS Configuration

The API is configured to accept requests from any origin (`CORS(app)`) for development. For production, configure specific origins:

```python
CORS(app, origins=['https://your-frontend-domain.com'])
```

## 🧪 Testing

### Using curl

**Health Check**:
```bash
curl http://localhost:5000/
```

**Prediction**:
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
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
    "bank_asset_value": 8000000
  }'
```

### Using Python requests

```python
import requests
import json

url = "http://localhost:5000/predict"
data = {
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
    "bank_asset_value": 8000000
}

response = requests.post(url, json=data)
print(response.json())
```

## ⚠️ Important Notes

1. **Model Dependencies**: The API requires model files from `../MODEL FILE/` directory
2. **scikit-learn Version**: Must match the version used for training (1.5.1)
3. **Error Handling**: All API endpoints include proper error handling and validation
4. **Security**: For production use, implement authentication and input validation

## 🔍 Troubleshooting

### Common Issues

1. **FileNotFoundError for model files**:
   - Ensure `MODEL FILE` directory exists in parent directory
   - Check that `loan_approval_model.joblib` and `scaler.joblib` are present

2. **Import errors**:
   - Verify all requirements are installed: `pip install -r requirements.txt`
   - Check Python version compatibility

3. **CORS errors**:
   - Frontend requests might be blocked - verify CORS configuration
   - For specific domains, update CORS settings in `app.py`

4. **Port conflicts**:
   - Change the default port in `app.py` if 5000 is occupied
   - Use `PORT` environment variable

### Logs and Debugging

- Enable debug mode locally: Change `debug=False` to `debug=True` in `app.py`
- Check deployment logs on hosting platform
- Use print statements or logging for debugging predictions

## 📝 Development Notes

- The application automatically detects the PORT from environment variables
- Cross-platform file paths ensure compatibility with Windows and Linux
- Model loading happens at startup for better performance
- All routes include proper error handling and JSON responses