const http = require("http");
const app = require("./index");
const server = http.createServer(app);

console.log("*LOG: Connecting to server...");

// Use port 3001
const port = process.env.PORT || 3001;

server.listen(port);
if (!server) {
  console.log("*LOG: Could not start server on port " + port);
} else {
<<<<<<< HEAD
  console.log("*LOG: Server is running on port " + port + ".");
=======
  console.log("*LOG: Server is running on port " + port);
>>>>>>> bf78398 (config auth-route)
}
