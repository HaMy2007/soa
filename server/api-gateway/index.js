const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

app.use((req, res, next) => {
    next();
});

// Chuyển hướng API đến từng service
app.use("/menu", createProxyMiddleware({ 
    target: "http://localhost:3000", 
    changeOrigin: true , 
    logLevel: "debug", 
    // pathRewrite: { "^/menu": "" } 
}));
app.use("/order", createProxyMiddleware({ 
    target: "http://localhost:3001", 
    changeOrigin: true , 
    logLevel: "debug",
}));
app.use("/welcome", createProxyMiddleware({ 
    target: "http://localhost:3002", 
    changeOrigin: true , 
    logLevel: "debug"
}));
app.use("/shift", createProxyMiddleware({ 
    target: "http://localhost:3003", 
    changeOrigin: true , 
    logLevel: "debug"
}));

const PORT = 1234;
app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
