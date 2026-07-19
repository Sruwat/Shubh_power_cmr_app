const { getDefaultConfig } = require("expo/metro-config");
const http = require("http");

const config = getDefaultConfig(__dirname);
const backendHost = process.env.SHUBH_BACKEND_HOST || "127.0.0.1";
const backendPort = Number(process.env.SHUBH_BACKEND_PORT || 8010);

config.server = config.server || {};
const defaultEnhanceMiddleware = config.server.enhanceMiddleware;

config.server.enhanceMiddleware = (middleware, server) => {
  const enhanced = defaultEnhanceMiddleware ? defaultEnhanceMiddleware(middleware, server) : middleware;

  return (req, res, next) => {
    if (!req.url || !req.url.startsWith("/api/")) {
      return enhanced(req, res, next);
    }

    const proxyReq = http.request(
      {
        hostname: backendHost,
        port: backendPort,
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          host: `${backendHost}:${backendPort}`,
        },
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
        proxyRes.pipe(res);
      },
    );

    proxyReq.on("error", (error) => {
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ detail: "Backend proxy failed", error: error.message }));
    });

    req.pipe(proxyReq);
  };
};

module.exports = config;
