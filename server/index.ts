import express from "express";
import path from "path";
import https from "https";
import fs from "fs";
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(express.static(path.join(__dirname, "static")));

app.get(
  "/.well-known/apple-developer-merchantid-domain-association",
  (_req, res) => {
    const filePath = path.join(
      __dirname,
      "../static/.well-known/apple-developer-merchantid-domain-association",
    );
    const content = fs.readFileSync(filePath, "utf-8");
    res.setHeader("Content-Type", "text/plain");
    res.send(content);
  },
);

const port = process.env.PORT || 8000;

if (process.env.ENABLE_HTTPS !== "true") {
  app.listen(port, () => {
    console.log(`Demo Store Server is listening on port: ${port}`);
  });
} else {
  // SSL Certificate configuration
  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH || "./certs/key.pem"),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH || "./certs/cert.pem"),
  };

  // Create HTTPS server
  const server = https.createServer(sslOptions, app);

  server.listen(port, () => {
    console.log(`Demo Store Server (HTTPS) is listening on port: ${port}`);
  });
}
