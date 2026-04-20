from fastapi import FastAPI
import uvicorn
from fourpercent.api.retirement_api import app as retirement_app
from fourpercent.api.health_api import router as health_router
from fourpercent.api.deep_retirement_api import app as deep_retirement_app
from fourpercent.api.two_person_retirement_api import app as two_person_retirement_app

# Create the main FastAPI app
app = FastAPI(
    title="Four Percentor API",
    version="3.0.0"
)

# Mount the retirement app at /fourpercent/api/v1/retirement
app.mount("/fourpercent/api/v1/retirement", retirement_app)

# Mount the deep retirement app at https://fourpercentrule.com/calculator/fourpercent/api/v2/deep_retirement
app.mount("/fourpercent/api/v2/deep_retirement", deep_retirement_app)

# Mount the two-person retirement app at /fourpercent/api/v3/retirement
app.mount("/fourpercent/api/v3/retirement", two_person_retirement_app)

# Include the health API routes
app.include_router(health_router, prefix="/fourpercent/api/v1")

# Debug endpoint to list all registered routes
@app.get("/debug/routes")
async def list_routes():
    """
    Debug endpoint that lists all registered routes
    """
    routes = []
    for route in app.routes:
        if hasattr(route, 'path') and hasattr(route, 'methods'):
            routes.append({
                "path": route.path,
                "methods": list(route.methods) if hasattr(route, 'methods') else [],
                "name": getattr(route, 'name', None)
            })
    return {"routes": routes}

@app.get("/")
async def root():
    return {
        "message": "Four Percentor API is running",
        "version": "3.0.0",
        "endpoints": [
            "/fourpercent/api/v1/retirement - Basic retirement calculator",
            "/fourpercent/api/v2/deep_retirement - Advanced retirement planner (single person)",
            "/fourpercent/api/v3/retirement - Two-person retirement calculator"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
