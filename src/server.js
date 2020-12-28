const http = require("http");
const app = require("./index");
const server = http.createServer(app);

console.log("*LOG: Connecting to server...");

// Use port 9000
const port = process.env.PORT || 9000;

server.listen(port);
if (!server) {
  console.log("*LOG: Could not start server on port " + port);
} else {
  console.log("*LOG: Server is running on port " + port);
}
