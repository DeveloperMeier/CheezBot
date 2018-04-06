const _ = require("lodash")
const defaultRoles = ["Administrator", "@owner", "Immortal", "Ender", "Moderator"]
const gatedCall = (message, roles = defaultRoles) => {
	if(!message.member.roles.some(r=>roles.includes(r.name)) ) {
		message.reply("Sorry, you don't have permissions to use this!");
		return false
	} else {
		return true
	}
}

const ping = async (message) => {
	// Calculates ping between sending a message and editing it, giving a nice round-trip latency.
	// The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
	var m = await message.channel.send("Ping?");
	m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
}
const say = (message, args) => {
	// makes the bot say something and delete the message. As an example, it's open to anyone to use. 
	// To get the "message" itself we join the `args` back into a string with spaces: 
	const sayMessage = args.join(" ");
	// Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
	message.delete().catch(O_o=>{}); 
	// And we get the bot to say the thing: 
	message.channel.send(sayMessage);
}
const kick = async (message, args) => {
	if (!gatedCall(message)) return
	
	// Let's first check if we have a member and if we can kick them!
	// message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
	// We can also support getting the member by ID, which would be args[0]
	let member = message.mentions.members.first() || message.guild.members.get(args[0]);
	if(!member)
	  return message.reply("Please mention a valid member of this server");
	if(!member.kickable) 
	  return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
	
	// slice(1) removes the first part, which here should be the user mention or ID
	// join(' ') takes all the various parts to make it a single string.
	let reason = args.slice(1).join(' ');
	if(!reason) reason = "No reason provided";
	
	// Now, time for a swift kick in the nuts!
	await member.kick(reason)
	  .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
	message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

}

const ban = async (message, args) => {
	if (!gatedCall(message)) return
	let member = message.mentions.members.first();
	if(!member)
	  return message.reply("Please mention a valid member of this server");
	if(!member.bannable) 
	  return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

	let reason = args.slice(1).join(' ');
	if(!reason) reason = "No reason provided";
	
	await member.ban(reason)
	  .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
	message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
}

const purge = async (message, args) => {  
	// This command removes all messages from all users in the channel, up to 100.
	
	// get the delete count, as an actual number.
	const deleteCount = parseInt(args[0], 10);
	
	// Ooooh nice, combined conditions. <3
	if(!deleteCount || deleteCount < 2 || deleteCount > 100)
	  return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
	
	// So we get our messages, and delete them. Simple enough, right?
	const fetched = await message.channel.fetchMessages({count: deleteCount});
	message.channel.bulkDelete(fetched)
	  .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
}

const div = async (message, args) => {
	if (!gatedCall(message)) return 
	if (!message.mentions.users.first()) {
				message.channel.send("You have to tag someone my dude.")
				return
	}

	const member = (message.mentions.users.first())
	try {
		const voiceChannel = message.guild.channels.find((c) => {
			return ["div", "afk"].includes(c.name.toLowerCase())
		})
		message.guild.member(member).setVoiceChannel(voiceChannel)
	} catch (err) {
		 console.log(err)
	} finally {
		message.channel.send(":right_facing_fist: " + member + ". YOU GONE!")
	}
}

const gif = (message, args) => {
		message.channel.send("/giphy " + args.join(" "))
}


const commands = {
	purge,
	ban,
	kick,
	say,
	ping,
	div,
	gif
}

module.exports = commands