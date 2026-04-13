from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fourpercent.api.retirement_api import app as retirement_app
from fourpercent.api.health_api import router as health_router
from fourpercent.api.deep_retirement_api import app as deep_retirement_app

# Create the main FastAPI app
app = FastAPI(
    title="Four Percentor API",
    version="2.0.0"
)

# Enable CORS for frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the retirement app at /fourpercent/api/v1/retirement
app.mount("/fourpercent/api/v1/retirement", retirement_app)

# Mount the deep retirement app at /fourpercent/api/v2/deep_retirement
app.mount("/fourpercent/api/v2/deep_retirement", deep_retirement_app)

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
        "version": "2.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
