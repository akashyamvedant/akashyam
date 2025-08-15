// Vercel serverless function for AKASHYAM Remix app
import { createRequestHandler } from "@remix-run/node";

// Import the server build
import * as build from "../build/server/api/index.js";

// Create the request handler
const handleRequest = createRequestHandler({
  build,
  mode: process.env.NODE_ENV || "production",
});

export default async function handler(req, res) {
  try {
    return await handleRequest(req, res);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      message: error.message 
    });
  }
}
