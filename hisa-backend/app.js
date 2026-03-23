const express = require("express");
const dotenv  = require("dotenv");
const connectDB = require("./src/config/db");
const { scheduleAutonomousCycles } = require("./src/integrations/hedera-adk/adk.executor");
const { handleUSSDRequest } = require("./src/ussd/ussd.gateway");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // needed for USSD POST bodies

// ── API Routes ──────────────────────────────────────────────────
app.use("/api/v1/auth",  require("./src/auth/auth.routes"));
app.use("/api/v1/ai",    require("./src/ai/ai.routes"));
app.use("/api/v1/jani",  require("./src/modules/jani/jani.routes"));
app.use("/api/v1/chat",  require("./src/modules/chat/chat.routes"));
app.use("/api/v1/hisa",  require("./src/modules/hisa/hisa.routes"));
app.use("/api/v1/amm",   require("./src/amm/amm.routes"));
app.use("/api/v1/gov",   require("./src/governance/governance.routes"));

// ── USSD Gateway (public) ───────────────────────────────────────
app.post("/ussd", handleUSSDRequest);

// ── DOVU Webhooks ───────────────────────────────────────────────
app.post("/webhooks/dovu/purchase", async (req, res) => {
  try {
    const dovuBridge = require("./src/integrations/dovu/dovu.bridge");
    const result = await dovuBridge.onCorporatePurchase(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Health Check ────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ 
    status: "UP", 
    version: "1.0.0",
    modules: ["JANI", "CHAT", "HISA"],
    timestamp: new Date().toISOString()
  });
});

// ── 404 Catch-all ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ── Global Error Handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

// ── Server Startup ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    scheduleAutonomousCycles();
    app.listen(PORT, () => {
      console.log(`\n🌍 HISA Backend running on http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/health`);
      console.log(`   Auth:   http://localhost:${PORT}/api/v1/auth`);
      console.log(`   KAI AI: http://localhost:${PORT}/api/v1/ai`);
      console.log(`   JANI:   http://localhost:${PORT}/api/v1/jani`);
      console.log(`   CHAT:   http://localhost:${PORT}/api/v1/chat`);
      console.log(`   HISA:   http://localhost:${PORT}/api/v1/hisa`);
      console.log(`   AMM:    http://localhost:${PORT}/api/v1/amm`);
      console.log(`   GOV:    http://localhost:${PORT}/api/v1/gov\n`);
    });
  } catch (error) {
    console.error("Startup Error:", error.message);
    process.exit(1);
  }
}

start();
