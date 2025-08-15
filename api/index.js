// Vercel serverless function for AKASHYAM Remix app
const { createRequestHandler } = require("@remix-run/node");

// Import the server build - correct path relative to api directory
const build = require("../build/server/index.js");

// Create the request handler
const handleRequest = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});

module.exports = async (req, res) => {
  try {
    return await handleRequest(req, res);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      message: error.message 
    });
  }
};
