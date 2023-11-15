/** @format */

// forai.js
/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("\x1b[32mConnected to the database\x1b[0m");
  })
  .catch((error) => {
    console.error("\x1b[31mFailed to connect to the database\x1b[0m", error);
    process.exit(1);
  });

// Define the Message schema
const MessageSchema = new mongoose.Schema({
  id: String,
  created: Date,
  whatsappMessageId: String,
  conversationId: String,
  ticketId: String,
  text: String,
  type: String,
  data: mongoose.Schema.Types.Mixed,
  timestamp: Date,
  owner: Boolean,
  eventType: String,
  statusString: String,
  avatarUrl: String,
  assignedId: String,
  operatorName: String,
  operatorEmail: String,
  waId: String,
  messageContact: mongoose.Schema.Types.Mixed,
  senderName: String,
  listReply: mongoose.Schema.Types.Mixed,
  replyContextId: mongoose.Schema.Types.Mixed,
});

const Message = mongoose.model("Message", MessageSchema);

// Define the webhook endpoint
app.post("/webhook", async (req, res) => {
  try {
    const webhookData = req.body;

    // Validate request body
    const requiredFields = ["id", "created"]; // Add other required fields as needed
    const isValidWebhook = requiredFields.every((field) =>
      Object.prototype.hasOwnProperty.call(webhookData, field)
    );

    if (!isValidWebhook) {
      return res.status(400).json({ error: "Invalid webhook data" });
    }

    const newMessage = new Message(webhookData);
    await newMessage.save();

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
