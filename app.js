// Load up the discord.js library
const Discord = require("discord.js");

// This is your bot. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `bot.something`, or `bot.something`,
// this is what we're refering to. Your bot.
const bot = new Discord.Client();
const oldCommands = require("./oldCommands.js")

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

bot.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `bot.user` is what the
  // docs refer to as the "ClientUser".
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

bot.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

bot.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});


bot.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  
  // which is set in the configuration file.
  
  if(message.content.indexOf(config.prefix) !== 0) {
	  if (message.contents.some("ai")) {
		  oldCommands.say(message, stringRet.trim().split(/ +/g))
	  }
	  // console.log(message.content, config.prefix);
	  return;
  }
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  switch (command) {
	case "div":
		break;
	case "kick":
		oldCommands.kick(message, args);
		break;
	case "say":
		oldCommands.say(message, args)
		break;
	case "purge":
		oldCommands.purge(message, args)
		break;
	case "ping":
		oldCommands.ping(message, args)
		break;
  }
})
  

bot.login(config.token);