import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store_adapter.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Simple Auth Middleware
app.use("/make-server-ccd2d338/*", async (c, next) => {
  if (c.req.path.endsWith("/health")) {
    await next();
    return;
  }
  
  const authHeader = c.req.header("Authorization");
  // In a real production environment with Supabase Edge Functions, 
  // the JWT is automatically verified by the platform before reaching here
  // if "Verify JWT" is enabled.
  // However, for extra safety or local dev simulation, we check for presence.
  if (!authHeader) {
     return c.json({ error: "Missing Authorization Header" }, 401);
  }
  await next();
});

// Health check endpoint
app.get("/make-server-ccd2d338/health", (c) => {
  return c.json({ status: "ok" });
});

// GET /chats - Retrieve all chats (Supports optional pagination metadata in structure)
app.get("/make-server-ccd2d338/chats", async (c) => {
  try {
    const channelId = c.req.query("channelId") || "main";
    // Pagination params (not fully implemented in KV but interface exists)
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "100"); // Default high limit for sync
    
    // Prefix: "chat:{channelId}:"
    const prefix = `chat:${channelId}:`;
    const chats = await kv.getByPrefix(prefix);
    
    // Manual pagination if needed (since KV getByPrefix returns all)
    // Note: For full sync, we usually want all.
    // We will return a standardized response.
    
    return c.json({
      data: chats,
      meta: {
        page,
        limit,
        total: chats.length,
        hasMore: false // KV scan returns all currently
      }
    });
  } catch (e: any) {
    console.error("Failed to get chats:", e);
    const msg = e.message || String(e);
    // Sanitize upstream HTML errors from Supabase/Cloudflare
    if (msg.includes("<!DOCTYPE html") || msg.includes("Internal server error")) {
       return c.json({ 
         error: "Upstream Database Unavailable", 
         details: "The KV store table may be missing or the database is paused.",
         code: "UPSTREAM_ERROR"
       }, 503);
    }
    return c.json({ error: msg }, 500);
  }
});

// POST /chats - Save/Sync chats
app.post("/make-server-ccd2d338/chats", async (c) => {
  try {
    const body = await c.req.json();
    const chats = body.chats;
    
    if (!Array.isArray(chats)) {
      return c.json({ error: "Invalid input: 'chats' must be an array" }, 400);
    }

    if (chats.length === 0) {
      return c.json({ success: true, count: 0 });
    }

    // Create keys like "chat:{channelId}:{id}"
    const keys = chats.map((chat: any) => {
       const channel = chat.channelId || "main";
       return `chat:${channel}:${chat.id}`;
    });
    
    // Bulk set
    await kv.mset(keys, chats);
    
    return c.json({ success: true, count: chats.length });
  } catch (e: any) {
    console.error("Failed to save chats:", e);
    const msg = e.message || String(e);
    if (msg.includes("<!DOCTYPE html") || msg.includes("Internal server error")) {
       return c.json({ 
         error: "Upstream Database Unavailable", 
         details: "The KV store table may be missing or the database is paused.",
         code: "UPSTREAM_ERROR"
       }, 503);
    }
    return c.json({ error: msg }, 500);
  }
});

Deno.serve(app.fetch);
