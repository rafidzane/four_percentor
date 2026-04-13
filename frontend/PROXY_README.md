# API Proxy Setup

This project includes an API proxy implementation to help with development and CORS issues.

## How It Works

The proxy is implemented as a Next.js API route at `/api/proxy`. When you make requests through this proxy, it forwards them to your backend server while maintaining the same interface.

## Usage

### For Development

1. Make sure your backend server is running on `http://localhost:8000/fourpercent/api/v1`
2. The proxy will automatically forward requests to this URL
3. Update your API calls to use the proxy endpoint instead of direct backend URLs

### Example Usage in Components

Instead of calling the backend directly, you can now call:

```typescript
// In your API client or components
const response = await apiClient.post('/api/proxy/fourpercentor/calculate', data);
```

Or if you want to use the proxy directly in your API calls, update your `NEXT_PUBLIC_API_BASE_URL` to point to the proxy:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/proxy
```

## Configuration

The proxy uses these environment variables:
- `BACKEND_PROXY_URL`: The URL of your backend server (default: `http://localhost:8000/fourpercent/api/v1`)

## Testing the Proxy

You can test if the proxy is working by making a request to:
```
http://localhost:3000/api/proxy/health
```

This will forward the request to your backend server's health endpoint.