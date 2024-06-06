const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3000;
let count = 0;
const countFilePath = path.join(__dirname, "count.json");

// Load count from file if exists, otherwise initialize with 0
try {
  if (fs.existsSync(countFilePath)) {
    const data = fs.readFileSync(countFilePath, "utf8");
    count = JSON.parse(data).count;
  } else {
    fs.writeFileSync(countFilePath, JSON.stringify({ count }));
  }
} catch (err) {
  console.error(err);
}

// Map of routes to their corresponding handlers
const routes = {
  "/": serveFile,
  "/index.html": serveFile,
  "/styles.css": serveFile,
  "/script.js": serveFile,
  "/count": handleCountRequest,
  "/increment": handleIncrementRequest,
  default: handleNotFound,
};

// Function to serve static files
function serveFile(req, res) {
  const { pathname } = url.parse(req.url);
  const filePath = pathname === "/" ? "/index.html" : pathname;

  fs.readFile(path.join(__dirname, "public", filePath), (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    } else {
      const contentType = getContentType(filePath);
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}

// Helper function to determine Content-Type based on file extension
function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "text/javascript";
    default:
      return "application/octet-stream";
  }
}

// Function to handle count request
function handleCountRequest(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ count }));
}

// Function to handle increment request
function handleIncrementRequest(req, res) {
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const { value } = JSON.parse(body);
        if (typeof value !== "number") {
          throw new Error("Invalid request body");
        }
        count += value;
        fs.writeFile(countFilePath, JSON.stringify({ count }), (err) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Failed to update count" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ count }));
          }
        });
      } catch (error) {
        console.error(error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid request body" }));
      }
    });
  } else {
    handleNotFound(req, res);
  }
}

// Function to handle not found request
function handleNotFound(req, res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found");
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);

  // Determine handler based on route
  const routeHandler = routes[pathname] || routes["default"];

  // Invoke the handler function
  routeHandler(req, res);
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
