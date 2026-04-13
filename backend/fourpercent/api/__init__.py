from .retirement_api import app as retirement_app
from .health_api import router as health_router

# Include the health router in the main application
retirement_app.include_router(health_router, prefix="/fourpercent/api/v1")
