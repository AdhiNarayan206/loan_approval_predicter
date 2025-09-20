from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
import os

# Load the saved model and scaler
model = joblib.load(r"loan_approval_predicter\MODEL FILE\loan_approval_model.joblib")
scaler = joblib.load(r"loan_approval_predicter\MODEL FILE\scaler.joblib")

@app.route('/')
def hello():
    return "Congratulations! Your loan approval API is running."

@app.route('/predict', methods=['POST'])
def check_eligibility():
    try:
        data= request.get_json(force=True)
        features = [
            data['no_of_dependents'],
            data['education'],
            data['self_employed'],
            data['income_annum'],
            data['loan_amount'],
            data['loan_term'],
            data['cibil_score'],
            data['residential_assets_value'],
            data['commercial_assets_value'],
            data['luxury_assets_value'],
            data['bank_asset_value']
        ]
        final_features = np.array(features).reshape(1, -1)
        scaled_features = scaler.transform(final_features)
        prediction = model.predict(scaled_features)
        prediction_proba = model.predict_proba(scaled_features)
        output='Approved' if prediction[0]==1 else 'Rejected'
        confidence=prediction_proba[0][prediction[0]]
        return jsonify({'prediction': output, 'confidence': float(confidence)})
    except Exception as e:
        return jsonify({'error': 'Invalid input format', 'message': str(e)}), 400

if __name__ == '__main__':
    
    port = int(os.environ.get('PORT', 5000))  # Use Render's PORT or default to 5000
    app.run(host='0.0.0.0', port=port, debug=False)