/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// MySQL database configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DB || "your_database_name",
};

// Create a connection to the MySQL database
async function connectToMySQL() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connected to the MySQL database");
    return connection;
  } catch (error) {
    console.error("Failed to connect to the MySQL database", error);
    process.exit(1);
  }
}

// Insert data into the database
async function insertData(tableName, data) {
  const connection = await connectToMySQL();
  try {
    const query = `INSERT INTO ?? SET ?`;
    const result = await connection.execute(query, [tableName, data]);
    return result[0];
  } catch (error) {
    console.error("Error in insertData:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Define the webhook endpoint
app.post("/webhook", async (req, res) => {
  try {
    const webhookData = req.body;
    // Validate request body
    // ... Add validation logic as needed ...

    await insertData("Messages", webhookData); // Assuming 'Messages' is your table name

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
