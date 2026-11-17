import http from "http";
import fs from "fs";

// Sample vehicle records
let vehicles = [
  {
    id: 1,
    vehicleName: "Hyundai Creta",
    vehicleNumber: "HR26AB1234",
    type: "SUV",
    price: 1500000
  },
  {
    id: 2,
    vehicleName: "Maruti Swift",
    vehicleNumber: "DL8CAF5030",
    type: "Hatchback",
    price: 750000
  },
  {
    id: 3,
    vehicleName: "Tata Nexon",
    vehicleNumber: "UP14CD5678",
    type: "SUV",
    price: 1000000
  }
];

// Create HTTP server
const server = http.createServer((req, res) => {

  // Welcome route
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to Vehicle Management System</h1>");
  }

  // Get all vehicles
  else if (req.method === "GET" && req.url === "/vehicles") {
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify(vehicles, null, 2));
  }

  // About route
  else if (req.method === "GET" && req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>About Vehicle Management Application</h1><p>This application manages vehicle records using Node.js.</p>");
  }

  // Serve static info.html file
  else if (req.method === "GET" && req.url === "/info") {
    fs.readFile("./public/info.html", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading info.html file");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }

  // Add vehicle using POST
  else if (req.method === "POST" && req.url === "/add-vehicle") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const newVehicle = JSON.parse(body);

        const { id, vehicleName, vehicleNumber, type, price } = newVehicle;

        if (
          id === undefined ||
          !vehicleName ||
          !vehicleNumber ||
          !type ||
          price === undefined
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Missing required fields" }));
          return;
        }

        vehicles.push(newVehicle);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          message: "Vehicle added successfully",
          vehicle: newVehicle
        }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  }

  // Invalid route
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Page Not Found");
  }
});

// Start server
server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});