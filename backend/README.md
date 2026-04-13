# Four Percentor Backend API

This is the backend API for the Four Percentor retirement planning application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the development server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### POST `/fourpercentor/calculate`
Calculate retirement plan based on user inputs.

**Request Body:**
```json
{
  "is_married": true,
  "current_age": 35,
  "spouse_age": 33,
  "retirement_age": 65,
  "spouse_retirement_age": 63,
  "net_worth": 500000.0,
  "income_assets": {
    "social_security": true,
    "spouse_social_security": true,
    "real_estate_primary": false,
    "real_estate_investment": true
  }
}
```

**Response:**
```json
{
  "message": "Retirement calculation completed successfully",
  "input_data": {
    // Original input data
  },
  "calculated_results": {
    // Calculated results
  }
}
```