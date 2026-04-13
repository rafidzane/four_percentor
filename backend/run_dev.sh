#!/bin/bash

# Run the FastAPI development server
echo "Starting Four Percentor API server..."
uvicorn fourpercent.main:app --host 0.0.0.0 --port 8000 --reload