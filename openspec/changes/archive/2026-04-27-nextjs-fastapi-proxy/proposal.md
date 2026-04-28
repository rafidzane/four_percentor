## Why

The current architecture requires direct cross-origin calls from the Next.js frontend to the FastAPI backend, which necessitates CORS configuration and exposes the backend port externally. This creates security concerns and complicates deployment. By implementing an internal proxy via Next.js API route rewrites, we can keep all backend traffic server-side while maintaining a clean API interface for the frontend.

## What Changes

- Implement Next.js API route rewrites to proxy `/api/*` requests to the FastAPI backend internally
- Configure Docker setup to only expose port 3000 externally (Next.js) while keeping FastAPI on port 8000 internally
- Update documentation and deployment scripts to reflect the new architecture

## Capabilities

### New Capabilities
- `api-proxy`: Internal proxy implementation for routing API requests between Next.js and FastAPI
- `docker-networking`: Updated Docker configuration for internal service communication

### Modified Capabilities
- `frontend-api-integration`: Updated frontend API calls to use internal proxy routes
- `backend-deployment`: Revised deployment strategy to support internal networking

## Impact

- Security improvement: Backend port 8000 is no longer exposed publicly
- Simplified deployment: Only one port (3000) needs to be managed externally
- Transparent API usage: Frontend code remains unchanged, calls `/api/endpoint` without hostname
- Internal routing: All `/api/*` traffic from browser is routed through Next.js proxy to FastAPI on localhost:8000