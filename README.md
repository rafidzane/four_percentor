# Four Percentor Application

Four Percentor is a retirement planning application that helps users calculate their retirement projections based on various financial inputs.

## Project Structure

```
four_percentor/
├── backend/
│   ├── fourpercent/
│   │   ├── api/
│   │   │   └── retirement_api.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── run_dev.sh
│   └── test_retirement_api.py
└── frontend/
    └── src/
        └── app/(main)/dashboard/retirement/_components/RetirementCalculator.tsx
```

## Backend Setup

### Prerequisites
- Python 3.8+
- pip

### Installation
```bash
cd backend
pip install -r requirements.txt
```

### Running the Backend
```bash
# Run development server
./run_dev.sh

# Or manually
uvicorn fourpercent.main:app --host 0.0.0.0 --port 8000 --reload
```

### API Endpoints
- `POST /fourpercent/api/v1/fourpercentor/calculate` - Calculate retirement plan

## Frontend Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Running the Frontend
```bash
cd frontend
npm run dev
```

## How It Works

The application consists of:
1. A FastAPI backend that handles retirement calculations
2. A Next.js frontend with a retirement calculator component
3. Communication between frontend and backend via REST API calls

## API Request Format

### Request Body
```json
{
  "current_age": 30,
  "retirement_age": 65,
  "current_savings": 50000,
  "annual_contribution": 10000,
  "annual_return": 7,
  "inflation_rate": 2.5,
  "monthly_withdrawal": 4000
}
```

### Response Format
```json
{
  "final_savings": 123456.78,
  "annual_withdrawal": 48000,
  "withdrawal_with_inflation": 52345.67,
  "years_to_depletion": 25.5
}
```

## Testing

To test the API:
```bash
cd backend
python test_retirement_api.py
```

The frontend will automatically call the backend API when users adjust the retirement calculator inputs.