## Context

The current architecture requires direct cross-origin calls from the Next.js frontend to the FastAPI backend, which necessitates CORS configuration and exposes the backend port externally. This creates security concerns and complicates deployment.

## Goals / Non-Goals

**Goals:**
- Implement an internal proxy via Next.js API route rewrites to route `/api/*` requests to the FastAPI backend
- Keep all backend traffic server-side without exposing the FastAPI port externally 
- Maintain transparent API usage for frontend code
- Simplify deployment by only exposing one port (3000) externally

**Non-Goals:**
- Changing the existing API endpoints or their behavior
- Modifying the core retirement calculation logic
- Adding new features beyond the proxy implementation

## Decisions

1. **Next.js API Route Rewrites**: Use Next.js's built-in `rewrites()` configuration to route all `/api/*` requests to `http://localhost:8000/api/*`
2. **Docker Network Setup**: Configure Docker to expose only port 3000 (Next.js) while keeping FastAPI on port 8000 internally
3. **Frontend Integration**: Maintain current frontend API calls unchanged - they will automatically be proxied through Next.js
4. **Internal Communication**: All API calls from browser will go through Next.js proxy, which forwards to FastAPI on localhost:8000

## Risks / Trade-offs

- [Performance overhead] → Mitigation: The proxy is minimal and should not significantly impact performance
- [Debugging complexity] → Mitigation: Use logging in both Next.js and FastAPI for troubleshooting
- [Configuration management] → Mitigation: Keep configuration in standard Next.js config files with clear comments