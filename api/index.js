// Vercel serverless function for AKASHYAM Remix app
import { createRequestHandler } from "@remix-run/vercel";

export default createRequestHandler({
  build: () => import("../build/server/index.js"),
  mode: process.env.NODE_ENV
});
