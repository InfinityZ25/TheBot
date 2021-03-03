require("dotenv").config();

const mineflayer = require("mineflayer");
const mineflayerViewer = require("prismarine-viewer").mineflayer;

const bot = mineflayer.createBot({
  host: process.env.SERVER_HOST || "localhost", // optional
  port: process.env.SERER_PORT || 25565, // optional
  username: process.env.BOT_NAME || "bot-pinche", // email and password are required only for
  password: process.env.BOT_PASS || "12345678", // online-mode=true servers
  version: false, // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
  auth: "mojang", // optional; by default uses mojang, if using a microsoft account, set to 'microsoft'
});

bot.once("spawn", () => {
  mineflayerViewer(bot, { port: process.env.PORT || 8080, firstPerson: true });

  // keep your eyes on the target, so creepy!
  setInterval(watchTarget, 50);

  function watchTarget() {
    if (!target) {
      entity = bot.nearestEntity();
      return;
    }
    bot.lookAt(target.position.offset(0, target.height, 0));
  }
});

let target = null;
bot.on("chat", function (username, message) {
  if (username === bot.username) return;
  if (
    message.startsWith("!") &&
    (username === "AleIV" || username === "jcedeno")
  ) {
    target = bot.players[username].entity;
    let entity;
    //Parse out the ! and split into different arguments.
    var commandArgs = message.substring(1);
    switch (commandArgs.toLowerCase()) {
      case "forward":
        bot.setControlState("forward", true);
        break;
      case "back":
        bot.setControlState("back", true);
        break;
      case "left":
        bot.setControlState("left", true);
        break;
      case "right":
        bot.setControlState("right", true);
        break;
      case "sprint":
        bot.setControlState("sprint", true);
        break;
      case "stop":
        bot.clearControlStates();
        break;
      case "jump":
        bot.setControlState("jump", true);
        bot.setControlState("jump", false);
        break;
      case "jump a lot":
        bot.setControlState("jump", true);
        break;
      case "stop jumping":
        bot.setControlState("jump", false);
        break;
      case "attack":
        entity = bot.nearestEntity();
        if (entity) {
          bot.attack(entity, true);
        } else {
          bot.chat("no nearby entities");
        }
        break;
      case "mount":
        entity = bot.nearestEntity((entity) => {
          return entity.type === "object";
        });
        if (entity) {
          bot.mount(entity);
        } else {
          bot.chat("no nearby objects");
        }
        break;
      case "dismount":
        bot.dismount();
        break;
      case "move vehicle forward":
        bot.moveVehicle(0.0, 1.0);
        break;
      case "move vehicle backward":
        bot.moveVehicle(0.0, -1.0);
        break;
      case "move vehicle left":
        bot.moveVehicle(1.0, 0.0);
        break;
      case "move vehicle right":
        bot.moveVehicle(-1.0, 0.0);
        break;
      case "tp":
        bot.entity.position.y += 10;
        break;
      case "pos":
        bot.chat(bot.entity.position.toString());
        break;
      case "yp":
        bot.chat(`Yaw ${bot.entity.yaw}, pitch: ${bot.entity.pitch}`);
        break;
    }
    return;
  }
});

bot.on("mount", () => {
  bot.chat(`mounted ${bot.vehicle.objectType}`);
});

bot.on("dismount", (vehicle) => {
  bot.chat(`dismounted ${vehicle.objectType}`);
});

// Log errors and kick reasons:
bot.on("kicked", (reason, loggedIn) => console.log(reason, loggedIn));
bot.on("error", (err) => console.log(err));
