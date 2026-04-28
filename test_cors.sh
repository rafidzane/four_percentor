#!/bin/bash

echo "Testing CORS headers..."

# Test if the server is running and responding
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v http://localhost:8000/fourpercent/api/v4/retirement 2>&1 | grep -i access-control

echo ""
echo "Testing actual POST request:"
curl -X POST \
     -H "Content-Type: application/json" \
     -H "Origin: http://localhost:3000" \
     -d '{"timeline":{"current_age":35,"retirement_age":65,"years_in_retirement":30},"portfolio_allocation":{"equity_return_pre_retirement_pct":7.0,"equity_return_post_retirement_pct":5.5}}' \
     http://localhost:8000/fourpercent/api/v4/retirement 2>&1 | head -5