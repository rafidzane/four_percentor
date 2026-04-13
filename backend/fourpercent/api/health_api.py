from fastapi import APIRouter

# Create a router for health endpoints
router = APIRouter()

# Health check endpoint
@router.get("health")
async def health_check():
    """
    Health check endpoint that returns OK status
    """
    return {"health": "OK"}