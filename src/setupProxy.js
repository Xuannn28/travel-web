/**
 * To allow HttpOnlyCookie approach works, React and backend server must hosted in
 * same domain. So, we use http-proxy-middlware for local development.
 * 
 * when react makes request to api endpoint, proxy intercepts this request and forwards it 
 * to backend serve (port 8080).
 * 
 * http-proxy middleware prevent cors issues.
 */

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,  // ensure originate from the same domain
    })
  );
};