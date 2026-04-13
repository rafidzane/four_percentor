# Four Percentor Project Documentation

## Overview
Four Percentor is a retirement planning application that helps users calculate their retirement projections based on various financial inputs. The application consists of a FastAPI backend and a Next.js frontend.

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

## Backend API
The backend provides a REST API for retirement calculations with the following endpoint:
- `POST /fourpercent/api/v1/fourpercentor/calculate` - Calculate retirement plan

### Request Body Format
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

## Frontend
The frontend provides an interactive retirement calculator with:
- Sliders for adjusting financial inputs
- Real-time calculation updates
- Error handling with fallback calculations
- Responsive UI using Tailwind CSS

## Setup Instructions

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
./run_dev.sh
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Development Workflow
1. Make changes to either frontend or backend
2. Test API endpoints directly using curl or Postman
3. Verify frontend updates correctly with new backend data
4. Run tests to ensure functionality remains intact

## Testing
```bash
cd backend
python test_retirement_api.py
```

## Architecture
- **Backend**: FastAPI (Python) with uvicorn server
- **Frontend**: Next.js (React) with TypeScript and Tailwind CSS
- **Communication**: REST API calls between frontend and backend
  

# Project Context

When asked to generate a proposal or spec, read all relevant source files 
and produce a structured markdown document covering:
- Current architecture
- Proposed changes
- Implementation plan
- File-by-file breakdown