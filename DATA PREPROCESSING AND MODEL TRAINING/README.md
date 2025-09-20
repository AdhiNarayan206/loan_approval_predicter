# Data Preprocessing and Model Training

This directory contains Jupyter notebooks for data analysis, preprocessing, and machine learning model training for the loan approval prediction system.

## 📁 Files Structure

```
DATA PREPROCESSING AND MODEL TRAINING/
├── loan_approval_model_logisticregression (1).ipynb  # Main ML pipeline notebook
└── README.md                                        # This documentation
```

## 📓 Notebook Overview

### `loan_approval_model_logisticregression (1).ipynb`

A comprehensive Jupyter notebook that implements the complete machine learning pipeline for loan approval prediction.

## 🔄 Pipeline Workflow

### 1. Data Loading and Exploration
- **Data Import**: Loading the loan approval dataset from CSV
- **Initial Analysis**: Dataset shape, basic statistics, data types
- **Missing Value Analysis**: Identifying and handling null values
- **Data Quality Assessment**: Checking for duplicates and inconsistencies

### 2. Exploratory Data Analysis (EDA)
- **Feature Distribution**: Analyzing the distribution of numerical and categorical features
- **Target Variable Analysis**: Understanding loan approval patterns
- **Correlation Analysis**: Identifying relationships between features
- **Visualization**: Creating plots to understand data patterns

### 3. Data Preprocessing
- **Feature Engineering**: Creating new features or transforming existing ones
- **Categorical Encoding**: Converting categorical variables to numerical format
- **Feature Scaling**: Standardizing numerical features using StandardScaler
- **Data Splitting**: Separating features and target variable

### 4. Model Training
- **Train-Test Split**: Dividing data into training and testing sets
- **Model Selection**: Training multiple algorithms:
  - Logistic Regression
  - Random Forest Classifier
- **Hyperparameter Tuning**: Optimizing model parameters
- **Cross-validation**: Ensuring model robustness

### 5. Model Evaluation
- **Performance Metrics**: Accuracy, Precision, Recall, F1-score
- **Confusion Matrix**: Understanding prediction errors
- **ROC Curve**: Evaluating model's discriminative ability
- **Feature Importance**: Identifying most influential features

### 6. Model Persistence
- **Model Saving**: Exporting trained models using joblib
- **Scaler Saving**: Preserving preprocessing transformations
- **File Organization**: Storing models in the MODEL FILE directory

## 🔧 Requirements

### Python Libraries
```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve,
    accuracy_score
)
import joblib
import warnings
```

### Installation
```bash
pip install pandas numpy matplotlib seaborn scikit-learn joblib jupyter
```

## 📊 Key Features Used

### Input Features
1. **Personal Demographics**:
   - `no_of_dependents`: Number of family dependents
   - `education`: Education level (Graduate/Not Graduate)
   - `self_employed`: Employment type

2. **Financial Information**:
   - `income_annum`: Annual income
   - `loan_amount`: Requested loan amount
   - `loan_term`: Loan duration in years
   - `cibil_score`: Credit score

3. **Asset Portfolio**:
   - `residential_assets_value`: Value of residential properties
   - `commercial_assets_value`: Value of commercial properties
   - `luxury_assets_value`: Value of luxury items
   - `bank_asset_value`: Bank account balance/assets

### Target Variable
- `loan_status`: Approval status (Approved/Rejected)

## 🎯 Model Performance

### Logistic Regression
- **Algorithm**: Linear classifier with sigmoid function
- **Advantages**: Fast, interpretable, probabilistic output
- **Use Case**: Primary model for the API

### Random Forest
- **Algorithm**: Ensemble of decision trees
- **Advantages**: Handles non-linear relationships, feature importance
- **Use Case**: Alternative model for comparison

## 🛠️ Running the Notebook

### Prerequisites
1. **Jupyter Environment**: Install Jupyter Lab or Notebook
   ```bash
   pip install jupyterlab
   # or
   pip install notebook
   ```

2. **Dataset**: Ensure `loan_approval_dataset.csv` is in the `../DATASET/` directory

### Execution Steps
1. **Start Jupyter**:
   ```bash
   jupyter lab
   # or
   jupyter notebook
   ```

2. **Open the notebook**: Navigate to and open `loan_approval_model_logisticregression (1).ipynb`

3. **Run cells sequentially**: Execute each cell from top to bottom

4. **Monitor outputs**: Check results, plots, and model performance metrics

### Expected Outputs
- **Trained Models**: Saved in `../MODEL FILE/` directory
- **Performance Reports**: Classification metrics and visualizations
- **Feature Analysis**: Importance scores and correlation insights

## 📈 Data Preprocessing Steps

### 1. Data Cleaning
```python
# Example preprocessing steps
df = df.dropna()  # Remove missing values
df = df.drop_duplicates()  # Remove duplicate records
```

### 2. Feature Engineering
```python
# Example feature transformations
# Convert categorical to numerical
df['education'] = df['education'].map({'Graduate': 1, 'Not Graduate': 0})
df['self_employed'] = df['self_employed'].map({'Yes': 1, 'No': 0})
```

### 3. Feature Scaling
```python
# Standardize numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```

## 🔍 Model Evaluation Metrics

### Classification Metrics
- **Accuracy**: Overall correct predictions
- **Precision**: Correct positive predictions / Total positive predictions
- **Recall**: Correct positive predictions / Total actual positives
- **F1-Score**: Harmonic mean of precision and recall

### Visualization Tools
- **Confusion Matrix**: True vs Predicted labels
- **ROC Curve**: True Positive Rate vs False Positive Rate
- **Feature Importance**: Most influential variables

## 💾 Model Serialization

### Saving Models
```python
# Save the trained model
joblib.dump(model, '../MODEL FILE/loan_approval_model.joblib')

# Save the scaler
joblib.dump(scaler, '../MODEL FILE/scaler.joblib')
```

### Loading Models (for reference)
```python
# Load saved model
model = joblib.load('../MODEL FILE/loan_approval_model.joblib')

# Load saved scaler
scaler = joblib.load('../MODEL FILE/scaler.joblib')
```

## ⚠️ Important Notes

1. **Data Path**: Ensure the dataset path is correct relative to the notebook location
2. **Memory Usage**: Large datasets may require memory optimization
3. **Random State**: Set random seeds for reproducible results
4. **Feature Consistency**: Maintain same feature order for model training and prediction
5. **Version Compatibility**: Use scikit-learn version 1.5.1 for compatibility

## 🔧 Troubleshooting

### Common Issues

1. **Import Errors**:
   - Install missing packages: `pip install package_name`
   - Check Python environment and package versions

2. **Data Loading Issues**:
   - Verify dataset file path and name
   - Check file permissions and format

3. **Memory Errors**:
   - Reduce dataset size for testing
   - Use data sampling for large datasets

4. **Model Performance Issues**:
   - Adjust hyperparameters
   - Try feature selection techniques
   - Consider data quality improvements

### Best Practices

1. **Documentation**: Comment code cells for clarity
2. **Validation**: Use cross-validation for robust evaluation
3. **Experimentation**: Try different algorithms and parameters
4. **Reproducibility**: Set random seeds and save notebook versions

## 📝 Development Notes

- The notebook is designed to be run from start to finish
- Each section builds upon the previous one
- Model files are automatically saved to the correct directory
- All visualizations are embedded within the notebook
- Error handling is included for common issues

## 🔄 Future Improvements

- **Feature Selection**: Implement automated feature selection
- **Hyperparameter Optimization**: Add grid search or random search
- **Model Ensemble**: Combine multiple models for better performance
- **Data Augmentation**: Techniques for handling imbalanced datasets
- **Advanced Metrics**: Additional evaluation metrics and validation techniques