import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import groupRoutes from "./routes/GroupRoutes.js";
import setupSocket from "./socket.js";
import friendRequestsRoutes from "./routes/FriendRequestsRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/friend-requests", friendRequestsRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port} at http://localhost:${port}`);
});

setupSocket(server);

// Fail fast with a clear message when DATABASE_URL is not provided.
if (!databaseURL) {
  console.error(
    "FATAL: `DATABASE_URL` is not set.\n" +
      "Create a `server/.env` file (copy from `server/.env.example`) and set `DATABASE_URL` to your MongoDB connection string.\n" +
      "Example (Atlas): mongodb+srv://<USER>:<ENCODED_PASS>@cluster0.xxxxx.mongodb.net/realtime_chat_app?retryWrites=true&w=majority"
  );
  process.exit(1);
}

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
