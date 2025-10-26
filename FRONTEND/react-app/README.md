# Loan Approval Predictor - React + Vite App

A modern, responsive React application built with Vite for predicting loan approvals using machine learning.

## Features

- **Modern UI/UX**: Beautiful gradient-based design with smooth animations
- **Two Main Pages**:
  - **Homepage**: Landing page with features, statistics, and how it works section
  - **Loan Predictor**: Interactive form for loan approval predictions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Validation**: Form validation with instant feedback
- **API Integration**: Connects to Flask backend for ML predictions

## Tech Stack

- React 18
- Vite (build tool)
- React Router DOM (routing)
- Font Awesome (icons)
- CSS3 (custom styling)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the react-app directory:
```bash
cd FRONTEND/react-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## Project Structure

```
react-app/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing page component
│   │   ├── HomePage.css          # Homepage styles
│   │   ├── LoanPredictorPage.jsx # Loan predictor component
│   │   └── LoanPredictorPage.css # Predictor page styles
│   ├── App.jsx                   # Main app component with routing
│   ├── App.css                   # App-level styles
│   ├── index.css                 # Global styles
│   └── main.jsx                  # Entry point
├── index.html                    # HTML template
├── package.json                  # Dependencies
└── vite.config.js               # Vite configuration
```

## Pages

### Home Page (`/`)
- Hero section with call-to-action
- Features showcase
- How it works section
- Statistics display
- Links to GitHub repository

### Loan Predictor Page (`/predictor`)
- Comprehensive loan application form with three sections:
  - Personal Information (dependents, education, employment)
  - Financial Information (income, loan amount, loan term, CIBIL score)
  - Asset Information (residential, commercial, luxury, bank assets)
- Real-time form validation
- Loading states
- Result display with confidence score
- Error handling

## API Configuration

The app connects to the Flask backend API. Update the `API_BASE_URL` in `LoanPredictorPage.jsx` if needed:

```javascript
const API_BASE_URL = 'http://localhost:5000';
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Styling

The app uses:
- CSS custom properties (variables) for consistent theming
- Gradient backgrounds for modern look
- Smooth animations and transitions
- Responsive grid layouts
- Glass-morphism effects with backdrop blur

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Loan Approval Predicter system.

## Author

Built with ❤️ using React + Vite

