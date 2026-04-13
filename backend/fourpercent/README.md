# FourPercentor Backend

This directory contains the backend services for the FourPercentor application.

## API Structure

The main API is located in `fourpercent/api` and provides:

- `/fourpercentor/calculate` endpoint for retirement calculations
- FastAPI-based service with proper data validation
- Docker support for containerization

## Setup Instructions

1. Navigate to the API directory:
```bash
cd fourpercent/api
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python fourpercent/main.py
# or
./run_dev.sh
```

4. The API will be available at `http://localhost:8000`

## API Endpoints

### POST /fourpercentor/calculate

Calculate retirement projections based on user inputs.

The endpoint accepts a comprehensive set of parameters for detailed retirement planning, including:
- Personal information (age, marital status)
- Financial assets and income sources
- Contribution amounts and growth rates
- Investment returns and allocations
- Social security and pension details
- Home equity information

## Docker Support

A Dockerfile is included to containerize the API service. You can build and run it with:

```bash
docker build -t fourpercentor-api .
docker run -p 8000:8000 fourpercentor-api
```