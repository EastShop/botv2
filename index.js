const { createClient } = require("bedrock-protocol");

const CONFIG = {
  username: "KNPSEZONA2",            // Ime bota
  host: "knpsezona2.aternos.me",     // IP servera
  port: 44564,                       // PORT servera
  version: "1.21.10",                // Verzija Bedrock servera

  autoReconnect: true,
  reconnectDelay: 5000,

  autoAFK: true,
  afkInterval: 5000,

  autoMessages: true,
  autoMessageDelay: 60000,
  messages: ["KNP SEZONA 2!"]
};

function startBot() {
  console.log("🔌 Povezivanje bota na server...");

  const bot = createClient({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    offline: true,
    version: CONFIG.version
  });

  bot.on("start_game", () => {
    console.log("✅ Bot je uspešno povezan na server!");
  });

  // *** CHAT LOG ***
  bot.on("text", (packet) => {
    console.log(`[CHAT] ${packet.message}`);
  });

  // *** AUTO PORUKE ***
  if (CONFIG.autoMessages) {
    setInterval(() => {
      CONFIG.messages.forEach((msg) => {
        bot.write("text", {
          type: "chat",
          needs_translation: false,
          source_name: CONFIG.username,
          message: msg
        });
      });
    }, CONFIG.autoMessageDelay);
  }

  // *** ANTI-AFK ***
  if (CONFIG.autoAFK) {
    setInterval(() => {
      try {
        bot.write("player_auth_input", {
          pitch: 0,
          yaw: 0,
          input_data: 0,
          input_mode: 0,
          play_mode: 0,
          interaction_model: 0,
          vr_gaze_direction: [0, 0, 0],
          pos: { x: 0, y: 0, z: 0 },
          direction: 0,
          head_yaw: 0
        });

        console.log("⚙️ Anti-AFK tick...");
      } catch (err) {
        console.log("AFK ERROR:", err.message);
      }
    }, CONFIG.afkInterval);
  }

  // *** AUTO RECONNECT ***
  bot.on("close", () => {
    console.log("❌ Bot je diskonektovan.");

    if (CONFIG.autoReconnect) {
      console.log(`🔁 Reconnect za ${CONFIG.reconnectDelay / 1000} sekundi...`);
      setTimeout(startBot, CONFIG.reconnectDelay);
    }
  });

  bot.on("error", (err) => {
    console.log("🔻 ERROR:", err.message);
  });
}

startBot();
