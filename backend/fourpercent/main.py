from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fourpercent.api.health_api import router as health_router
from fourpercent.api.retirement_api import router as retirement_v4_router

# Create the main FastAPI app
app = FastAPI(
    title="Four Percentor API",
    version="4.0.0"
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the v1/v2/v3 routes from other modules (mounted)
# Include the health API routes
app.include_router(health_router, prefix="/fourpercent/api/v1")

# Mount the new retirement_v4 endpoint at /fourpercent/api/v4/retirement
app.include_router(retirement_v4_router, prefix="/fourpercent/api/v4")

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
        "version": "4.0.0",
        "endpoints": [
            "/fourpercent/api/v1 - Health check",
            "/fourpercent/api/v4/retirement - Comprehensive retirement calculator (v4)"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
