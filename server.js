require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
// setupWebSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
