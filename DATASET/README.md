# Dataset

This directory contains the raw dataset used for training the loan approval prediction model.

## 📁 Files Structure

```
DATASET/
├── loan_approval_dataset.csv  # Main dataset file
└── README.md                  # This documentation
```

## 📊 Dataset Overview

### `loan_approval_dataset.csv`

A comprehensive dataset containing loan application records with applicant information, financial details, and approval decisions.

## 🔍 Dataset Description

### Dataset Statistics
- **Total Records**: Varies (check actual file for current count)
- **Features**: 12 input features + 1 target variable
- **Data Types**: Mixed (numerical and categorical)
- **Missing Values**: May contain null values requiring preprocessing
- **File Format**: CSV (Comma-Separated Values)

## 📋 Feature Description

### Personal Information Features

| Column | Data Type | Description | Example Values |
|--------|-----------|-------------|----------------|
| `no_of_dependents` | Integer | Number of family dependents | 0, 1, 2, 3, 4+ |
| `education` | Categorical | Education level | "Graduate", "Not Graduate" |
| `self_employed` | Categorical | Employment type | "Yes", "No" |

### Financial Features

| Column | Data Type | Description | Range/Example |
|--------|-----------|-------------|---------------|
| `income_annum` | Integer | Annual income (in currency units) | 200000 - 40000000+ |
| `loan_amount` | Integer | Requested loan amount | 300000 - 40000000+ |
| `loan_term` | Integer | Loan duration in years | 2 - 20 years |
| `cibil_score` | Integer | Credit score | 300 - 850 |

### Asset Features

| Column | Data Type | Description | Range/Example |
|--------|-----------|-------------|---------------|
| `residential_assets_value` | Integer | Value of residential properties | 0 - 30000000+ |
| `commercial_assets_value` | Integer | Value of commercial properties | 0 - 20000000+ |
| `luxury_assets_value` | Integer | Value of luxury items (cars, jewelry, etc.) | 0 - 40000000+ |
| `bank_asset_value` | Integer | Bank account balance and deposits | 0 - 15000000+ |

### Target Variable

| Column | Data Type | Description | Values |
|--------|-----------|-------------|---------|
| `loan_status` | Categorical | Loan approval decision | "Approved", "Rejected" |

## 📈 Data Characteristics

### Feature Distributions

1. **Income Distribution**: 
   - Typically right-skewed with most applicants in lower income brackets
   - Some high-income outliers

2. **Loan Amount**: 
   - Usually correlated with income levels
   - Wide range from small personal loans to large business loans

3. **CIBIL Score**: 
   - Most scores cluster around 600-800 range
   - Higher scores generally correlate with approval

4. **Asset Values**: 
   - High variability across applicants
   - Some applicants have no assets, others have substantial portfolios

### Target Distribution
- **Class Balance**: Check the ratio of "Approved" vs "Rejected" applications
- **Potential Imbalance**: May require balancing techniques during modeling

## 🔧 Data Usage

### Loading the Dataset

```python
import pandas as pd

# Load the dataset
df = pd.read_csv('loan_approval_dataset.csv')

# Basic information
print(f"Dataset shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")
print(f"Data types:\n{df.dtypes}")
```

### Basic Exploration

```python
# Statistical summary
print(df.describe())

# Check for missing values
print(df.isnull().sum())

# Target variable distribution
print(df['loan_status'].value_counts())
```

## 🧹 Data Preprocessing Requirements

### 1. Missing Value Handling
```python
# Check for missing values
missing_values = df.isnull().sum()
print("Missing values per column:")
print(missing_values[missing_values > 0])
```

### 2. Categorical Encoding
```python
# Convert categorical to numerical
df['education'] = df['education'].map({'Graduate': 1, 'Not Graduate': 0})
df['self_employed'] = df['self_employed'].map({'Yes': 1, 'No': 0})
df['loan_status'] = df['loan_status'].map({'Approved': 1, 'Rejected': 0})
```

### 3. Feature Scaling
```python
from sklearn.preprocessing import StandardScaler

# Features that may need scaling
numerical_features = [
    'income_annum', 'loan_amount', 'cibil_score',
    'residential_assets_value', 'commercial_assets_value',
    'luxury_assets_value', 'bank_asset_value'
]

scaler = StandardScaler()
df[numerical_features] = scaler.fit_transform(df[numerical_features])
```

## 📊 Data Quality Considerations

### Potential Issues

1. **Outliers**: 
   - Extremely high income or asset values
   - Unusually low or high CIBIL scores
   - May require outlier detection and treatment

2. **Data Consistency**:
   - Verify logical relationships (e.g., loan amount vs income)
   - Check for impossible values (negative assets, invalid scores)

3. **Missing Data Patterns**:
   - Random vs systematic missing values
   - Impact on model performance

### Data Validation Rules

1. **CIBIL Score**: Should be between 300-850
2. **Loan Term**: Typically 1-30 years
3. **Income vs Loan Amount**: Usually some logical relationship
4. **Asset Values**: Should be non-negative

## 🔍 Exploratory Data Analysis (EDA) Suggestions

### Univariate Analysis
```python
import matplotlib.pyplot as plt
import seaborn as sns

# Distribution of numerical features
numerical_cols = df.select_dtypes(include=[np.number]).columns
df[numerical_cols].hist(bins=20, figsize=(15, 10))
plt.show()
```

### Bivariate Analysis
```python
# Correlation matrix
correlation_matrix = df.corr()
plt.figure(figsize=(12, 8))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm')
plt.show()

# Target vs features
for col in numerical_cols:
    plt.figure(figsize=(8, 6))
    df.boxplot(column=col, by='loan_status')
    plt.show()
```

### Feature Relationships
```python
# Income vs Loan Amount by Approval Status
plt.figure(figsize=(10, 6))
approved = df[df['loan_status'] == 1]
rejected = df[df['loan_status'] == 0]

plt.scatter(approved['income_annum'], approved['loan_amount'], 
           alpha=0.6, label='Approved', color='green')
plt.scatter(rejected['income_annum'], rejected['loan_amount'], 
           alpha=0.6, label='Rejected', color='red')
plt.xlabel('Annual Income')
plt.ylabel('Loan Amount')
plt.legend()
plt.show()
```

## ⚠️ Important Notes

### Data Privacy and Ethics
1. **Anonymization**: Ensure personal identifiers are removed
2. **Bias Considerations**: Check for discriminatory patterns
3. **Fair Lending**: Comply with fair lending regulations
4. **Data Security**: Handle financial data with appropriate security measures

### Model Development Considerations
1. **Train-Test Split**: Maintain temporal order if dataset has time component
2. **Cross-Validation**: Use stratified sampling to maintain class balance
3. **Feature Engineering**: Consider creating derived features (income-to-loan ratio, etc.)
4. **Data Leakage**: Ensure no future information influences historical predictions

## 📝 Data Source and Collection

### Collection Method
- Describe how the data was collected (if known)
- Time period covered
- Geographic scope
- Sampling methodology

### Data Updates
- Frequency of data updates
- Version control for dataset changes
- Data lineage tracking

## 🔄 Usage in Machine Learning Pipeline

### 1. Data Loading
- Load from CSV into pandas DataFrame
- Initial data validation and type checking

### 2. Preprocessing Pipeline
- Handle missing values
- Encode categorical variables
- Scale numerical features
- Feature engineering

### 3. Model Training
- Split into training and testing sets
- Apply preprocessing transformations
- Train multiple algorithms
- Validate model performance

### 4. Model Evaluation
- Test on unseen data
- Analyze feature importance
- Check for bias and fairness

## 🛠️ Tools and Libraries

### Recommended Libraries
```python
import pandas as pd          # Data manipulation
import numpy as np           # Numerical operations
import matplotlib.pyplot as plt  # Basic plotting
import seaborn as sns        # Statistical visualization
from sklearn.preprocessing import StandardScaler  # Feature scaling
from sklearn.model_selection import train_test_split  # Data splitting
```

### File Handling
```python
# Read CSV with specific parameters
df = pd.read_csv('loan_approval_dataset.csv', 
                 encoding='utf-8',  # Handle special characters
                 na_values=['', 'NULL', 'N/A'])  # Define missing value representations
```

This dataset forms the foundation of the loan approval prediction system and should be handled with care to ensure model accuracy and fairness.