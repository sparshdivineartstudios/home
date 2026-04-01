Backend CORS setup for Express
=============================

Add this to your backend (Express) to allow your frontend origin(s) and avoid CORS errors.

1) Install `cors` if not already:

```bash
npm install cors
```

2) Example robust CORS middleware (use in your backend entry file):

```js
const cors = require('cors');

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:8080,https://home-frontend.onrender.com')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) return next(); // allow non-browser requests (curl, server-to-server)
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  }
  // Optionally block unknown origins
  res.status(403).json({ error: 'CORS origin denied' });
});

// If you prefer the cors package convenience:
// app.use(cors({ origin: allowedOrigins, credentials: true }));

```

Notes
-----
- When using cookies, the frontend must send `credentials: 'include'` and the backend must set `Access-Control-Allow-Credentials: true` and the exact origin (not `*`).
- For Authorization header (Bearer tokens), ensure `Authorization` is in `Access-Control-Allow-Headers`.
- In production prefer listing explicit origins in `ALLOWED_ORIGINS` env var, not `*`.
- If you're behind a reverse-proxy or CDN, consider routing frontend and API under the same origin to remove CORS issues.

Testing
-------
Use the included script `scripts/test_cors.ps1` to verify preflight and GET responses.
