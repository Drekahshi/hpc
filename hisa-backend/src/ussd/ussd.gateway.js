const pogEngine = require("../modules/jani/pog.engine");
const wellnessEngine = require("../modules/hisa/wellness.engine");

/**
 * USSD Menu definitions (Africa's Talking / custom)
 * Format: CON = continue, END = terminate
 */
const MENUS = {
  "": "CON Welcome to HISA People Chain 🌍\n1. JANI - Conservation\n2. CHAT - Culture\n3. UMOJA - Finance\n4. HISA - Wellness\n5. My Account",
  "1": "CON JANI Conservation 🌳\n1. Plant a Tree\n2. Check JANI Balance\n3. Submit Growth Report\n0. Back",
  "2": "CON CHAT Culture 🎭\n1. Register Asset\n2. My Cultural Assets\n0. Back",
  "3": "CON UMOJA Finance 💰\n1. Check Portfolio\n2. Send Money\n3. Stake Tokens\n0. Back",
  "4": "CON HISA Wellness 💚\n1. Wellness Check-In\n2. My SDG Rewards\n3. Claim Rewards\n0. Back",
  "5": "CON My Account 👤\n1. Check All Balances\n2. Transaction History\n0. Back",
};

/**
 * Handle a USSD request
 */
async function handleUSSDRequest(req, res) {
  const { sessionId, phoneNumber, text = "", networkCode } = req.body;
  const input = text.trim();

  // Determine response based on menu path
  let response = MENUS[input] || null;

  // Action routes
  if (input === "1*1") {
    response = "CON Enter GPS coordinates (lat,lng):\nExample: -1.286389,36.817223";
  } else if (input.startsWith("1*1*")) {
    const coords = input.replace("1*1*", "").split(",");
    response = `END Tree planting registered for GPS ${coords[0]},${coords[1]}. You will receive a confirmation.`;
  } else if (input === "4*1") {
    response = "CON Rate your wellness today (1-10):\n1=Very Low .. 10=Excellent";
  } else if (input.startsWith("4*1*")) {
    const score = parseInt(input.replace("4*1*", ""), 10);
    if (score >= 1 && score <= 10) {
      response = `END Wellness score ${score} recorded! Rewards will be minted to your account shortly.`;
    } else {
      response = "END Invalid score. Please enter 1-10.";
    }
  } else if (!response) {
    response = "END Invalid option. Please try again.";
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
}

module.exports = { handleUSSDRequest };
