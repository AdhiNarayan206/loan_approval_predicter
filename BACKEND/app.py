from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Load the saved model and scaler
model = joblib.load(r"loan_approval_predicter\MODEL FILE\loan_approval_model.joblib")
scaler = joblib.load(r"loan_approval_predicter\MODEL FILE\scaler.joblib")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array(data['features']).reshape(1, -1)
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)