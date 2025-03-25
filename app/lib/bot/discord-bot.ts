import { Client, GatewayIntentBits } from "discord.js";

// Singleton pattern to ensure only one instance
let botInstance: Client | null = null;

export const getBotInstance = async () => {
  if (!botInstance) {
    botInstance = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
      ],
    });

    await botInstance.login(process.env.DISCORD_BOT_TOKEN);

    await new Promise<void>((resolve) => {
      botInstance!.once("ready", () => {
        console.log("🤖 Bot is ready!");
        resolve();
      });
    });
  };
  
  return botInstance;
};
