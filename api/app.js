const Music = require('discord.js-musicbot-addon')
const Discord  = require("discord.js");
const bot      = new Discord.Client();
const Commands = require("./src/js/commands.js")
const config = require("./config.json");
// const musicBot = Music.start(bot, {
//   prefix: config.prefix, // Prefix for the commands.
//   global: false,            // Non-server-specific queues.
//   maxQueueSize: 100,        // Maximum queue size of 25.
//   clearInvoker: true,      // If permissions applicable, allow the bot to delete the messages that invoke it.
//   helpCmd: 'chelp',        // Sets the name for the help command.
//   playCmd: 'cplay',        // Sets the name for the 'play' command.
//   volumeCmd: 'adjust',     // Sets the name for the 'volume' command.
//   leaveCmd: 'gtfo',      // Sets the name for the 'leave' command.
// 	disableLoop: true,        // Disable the loop command.
// 	youtubeKey: config.googleApiKey,
// 	enableQueueStat: true
// });
const musicBot = "I'm a dummy"
const commands = new Commands(bot, musicBot)
const _        = require("lodash")
const readline = require('readline');


var lastChan;
const liveInput = true
const chatbotActive = true

bot.on("ready", () => {
  console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`); 
  bot.user.setActivity(`I'm pretty.`);
});

bot.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

bot.on('guildMemberAdd', member => {
	const guild = member.guild;

  const channel = guild.channels.find(channel =>  channel.name === "welcome" && guild.name === "Snipely's Hideout");
	commands.gameroleauto(guild, channel,member, bot)	
});
	
bot.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

if (liveInput) {
	const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});

	rl.on('line', (answer) => {
	  // TODO: Log the answer in a database
	  lastChan.send(answer)
	  console.log(`Sent: ${answer}`);
	});
}

bot.on("error", async message => console.log(message))


bot.on("message", async message => {
  if(message.author.bot) return;
  
  const redditMatch = "/r/"
  const redditLinkMatch = "r/"
  const isRedditCmd = message.content.indexOf(redditMatch) !== -1
  const isRedditLink = message.content.indexOf(redditLinkMatch) !== -1
  
  if(message.content.indexOf(config.prefix) !== 0 && !isRedditCmd ) {
	  const fs = require('fs');
	  fs.appendFile('log.txt', `${message.author},${message.channel},${message.content.replace(/,/g, '~')},${new Date().getTime()}` + "\n", (err) => (err) ? console.log(err): null)
	  return
  }
  
  
  
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if (isRedditCmd) {
	  commands.redditCall(message)
  } else if (isRedditLink) {
	message.channel.send("http://www.reddit.com"+message.content)  
  } else {
	  try {
		  lastChan = message.channel
		  commands.call(command,message,args, bot)
	  }
	  catch(err) {
		  console.log(message, args, err)
	  }
  }
})


  

bot.login(config.token);
