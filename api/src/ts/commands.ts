import {config} from './types/config'

import {Bot,DiscordMessage, DiscordMember} from './types/discord'
import {Spotify} from './spotify'
import { YouTube } from './youtube';
import { Permissions } from './permissions';
import {CBStorage} from './storage'

declare interface funcType {
	default: (message: DiscordMessage, args: string[]) => Promise<void>;
	single: (message: DiscordMessage) => Promise<void>;
	none: () => Promise<void>
} 
interface Commands extends funcType {
    bot: Bot
    defaultErrorMsg: string;
    gifRoles: string[];
    scottRoles: string[];
    ravenRoles: string[];
    defaultWrongChannelMsg: string;
    musicHelper: any; // TODO
    spotify: Spotify;
    giphyApiKey: string;
    spotifyID: string;
	spotifySecret: string;
	audioStream: any; // TODO
	voiceChannel: any; //TODO
	yt: YouTube;
	gameroles: string[];
	gamerolesMsg: string;
	
	fart: funcType['default']; // TODO: has to be a better way
	yts: funcType['default'];
	cend: funcType['none'];
	cpause: funcType['none'];
	cplay: funcType['none'];
	gtfo: funcType['single'];
}

interface defaultArgs {
	message: DiscordMessage;
	args: string[];
}

class Commands {
	constructor(bot: Bot, musicBot: any) {
        require("isomorphic-fetch")
		console.log(config)
    new CBStorage()
		
        
        this.spotify = new Spotify(config.spotifyID, config.spotifySecret)
		this.bot = bot
		this.defaultErrorMsg = "Sorry, you don't have permissions to use this!"
		this.defaultWrongChannelMsg = "This isn't allowed on this channel"
		this.musicHelper = require("./music.js")
		this.musicHelper = new this.musicHelper(this.bot)
		this.yt = new YouTube(config.googleApiKey, musicBot)
		this.fart = this.yt.fart // Potentially simplify, also help reporting
		this.yts = this.yt.yts
		this.cend = this.yt.cend
		this.cplay = this.yt.cplay
		this.cpause = this.yt.cpause
		this.gameroles = ['RocketLeague', "DnD", 'SSBU', 'R6Siege', 'Overwatch', 'ApexLegends', "Division2"]
		this.gamerolesMsg = `React to this message with the associated reaction to be given that role. [:`+this.gameroles.join(":, :")+":]"
		// this.gtfo = this.yt.gtfo
	}
	gameroleauto(guild: any, channel: any, member: DiscordMember, bot: any) {
		const filter = (reaction, user) => {
			if (!this.gameroles.includes(reaction.emoji.name)) return false
			reaction.users.map(reactionUser => new Permissions().addroleauto(guild, channel, member, reaction.emoji.name, reactionUser))
			return true
		}
		// const timeout = 60
		if (channel) {
			const sent = channel.send(`${member.user} ${this.gamerolesMsg}`)
			sent.then((x: DiscordMessage) => {
				this.gameroles.forEach(item => {
					const emoji = guild.emojis.find(emoji => emoji.name === item)
					x.react(emoji)
				})
				x.awaitReactions(filter/*, {time: timeout * 1000}*/)		
			})
			.catch(console.error)
		}
	}

	gamerole(message: DiscordMessage, args: string[]) {
		const filter = (reaction, user) => {
			if (!this.gameroles.includes(reaction.emoji.name)) return false
			reaction.users.map(reactionUser => new Permissions().addrole(message, reaction.emoji.name, reactionUser))
			return true
		}
		const timeout = 60
		const sent = message.channel.send(`@here ${this.gamerolesMsg}`)
	
		sent.then((x: DiscordMessage) => {
			this.gameroles.forEach(item => {
				const emoji = message.guild.emojis.find(emoji => emoji.name === item)
				x.react(emoji)
			})
			x.awaitReactions(filter/*, {time: timeout * 1000}*/)		
		})
		.catch(console.error)
	}

	deleteMessage(message: DiscordMessage) {
		message.delete().catch(O_o => {})	
	}

	async music(message: DiscordMessage, args: string[]) {
		this.spotify.search('track',message, args)

	}

	async playlist(message: DiscordMessage, args: string[]) {
		this.spotify.search('playlist', message, args)
	}

	async artist(message: DiscordMessage, args: string[]) {
		this.spotify.search('artist', message, args)
	}

	async album(message: DiscordMessage, args: string[]) {
		this.spotify.search('album', message, args)
	}	
	
	async ascii(message: DiscordMessage, args: string[]) {
		if (args.length < 1) {
			message.channel.send("ASCII what?")
		}
		const imageToAscii = require("image-to-ascii")
		imageToAscii(args[0], {
			colored: false
		}, (err: any, converted: any) => {
			if (err) {
				message.channel.send("I failed you...")
				return
			}
			//console.log(converted)
			message.channel.send("```\n"+converted+"```")
			return
		})
	}
	
	async multitwitch(message: DiscordMessage, args: string[]) {
		const _parts = args.join("/")
		this.deleteMessage(message)
		message.channel.send("http://multitwitch.tv/"+_parts)
	}
	
	async aiver(message: DiscordMessage, args: string[]) {
		message.channel.send("Version: 0.1.43, Utilizing tensorflow version: r1.8")
	}
	
	
	async fetchList(url: string, message: DiscordMessage, args: string[], random: boolean = true) {
		return fetch (url)
		.then((resp: any) => resp.json())
		.then((msg:any) => {
			console.log()
			const rnd = (len: number) => Math.floor(Math.random() * len)
			const weightedRnd = (arr: number[]) => {
				const unif = Math.random()
				const beta = Math.pow(Math.sin(unif*(Math.PI/2)), 2)
				const betaLeft = (beta < 0.5) ? (2 * beta) : (2*(1-beta))
				const betaRight = (beta > 0.5) ? (2 * beta)-1 : (2*(1-beta)-1)
				console.log(betaLeft * arr.length, betaRight * arr.length, arr.length)
				//return arr[Math.floor(Math.random() * (arr.length - 1)) + 1]
				return arr[Math.floor(arr.length * betaLeft)] // 0 biased
				// return arr[Math.floor(arr.length * betaRight)] // 1 biased
			}
			const randomHandler = (msg && msg.data && msg.data.images && msg.data.images.original.mp4) ? msg.data.images.original.mp4 : weightedRnd(msg.data)
			if (randomHandler.url) {
				return randomHandler.url
			} else {
				return randomHandler
			}
		})
		.then((foo: DiscordMessage) => {
			this.deleteMessage(message)
			const linkMsg = (args.length > 0) ? "`"+args.join(" ")+"`" : ""
			message.channel.send(linkMsg+" *" + message.author + "* \n"+ foo)
		})
		.catch(err => {
			console.log(err)
			message.channel.send("Nice try, but your attempt to search looks like this https://img.buzzfeed.com/buzzfeed-static/static/2014-11/10/13/enhanced/webdr04/anigif_enhanced-buzz-6539-1415644559-8.gif?downsize=715:*&output-format=auto&output-quality=auto")
		})			
	}
	
	redditCall(message) {
		const topRe = / ?\-\-top ?/
		const hotRe = / ?\-\-hot ?/
		const fetchTop = !!message.content.match(topRe)
		const fetchHot = !!message.content.match(hotRe)
		if (fetchTop) {
			fetch (`https://reddit.com${message.content.replace(topRe, '')}/top.json`)
			.then(toJson => toJson.json())
			.then(toUrl => toUrl.data.children[0].data.url)
			.then(toSend => message.channel.send(toSend))
		} if (fetchHot) {
			fetch (`https://reddit.com${message.content.replace(hotRe, '')}/hot.json`)
			.then(toJson => toJson.json())
			.then(toUrl => {
				const size = toUrl.data.children.length
				return toUrl.data.children[Math.floor(Math.random() * size)]
			})
			.then(toSend => message.channel.send(toSend.data.url))
			
		}else {
			fetch (`https://reddit.com${message.content}/random.json`)
			.then(toJson => toJson.json())
			.then(getFirst => getFirst[0])
			.then(toData => toData.data)
			.then(getChild => getChild.children[0])
			.then(toData => toData.data)
			.then(toSend => message.channel.send(toSend.url))
			.catch(err => console.log(err))
		}
	}
	
	call(fnName, message, args, bot) {
		try {
			this[fnName](message,args, bot)
		} catch(err) {
			//NOP -- For wizardry
		}
	}
	
	gatedCall(message, customMsg = this.defaultErrorMsg, roles = this.roleHandler(message)) {
		if(!message.member.roles.some(r=>{
			return roles.includes(r.name) || r.name == "@owner"
		}) ) {
			message.reply(customMsg);
			return false
		} else {
			return true
		}
	}
	
	gatedChannel(message, customMsg = this.defaultWrongChannelMsg) {
		if(message.channel.name == "nsfw") {
			return true
		} else {
			message.reply(customMsg)
			return false
		}
	}
	
	
	roleHandler(message) {
		switch (message.guild.name) {
			case 'Snipely\'s Hideout':
				return ["Admin", "@owner", "Immortal", "Ender", "Moderator", "@admin","Odin", "Thor", "Loki", "Mazer", "@Mazer", "@Dragon Army", "Dragon Army", "The Hegemon", "@The Hegemon"]
			case 'Halls Of Asgard':
				return  ["Admin", "@owner", "Immortal", "Ender", "Moderator", "@admin","Odin", "Thor", "Loki"]
			case 'The Lock-up':
				return ["@everyone", "everyone"]
			case 'Aardwolf MUD':
				return ["@everyone", "everyone"]
			case 'FTFG':
				return ["@everyone", "everyone", "Mods", "@Mods"]
			default:
				return ["@owner", "@everyone", "everyone"]
		}
	}

	
	chelp(message: DiscordMessage, args: string[]) {
		message.channel.send(
					"ping....: Latency Report\n" +
					"say.....: Say something\n" +
					"kick....: Kick @Someone\n" +
					"ban.....: Ban @Someone\n" +
					"purge...: Purge X number of messages\n" +
					"div.....: TO DIV WITH YOU\n" +
					"gif.....: make a gif\n" +
					"fu......: FUUUUUUUUUUUUUUUUUUU\n" +
					"puppy...: random puppy gif\n" +
					"kitten..: random kitten gif\n" +
					"hentai..: hentai gif (from giphy, limited)\n" +
					"bullshit: call bullshit on @Someone\n" +
					"quote...: random quote\n" +
					"boobs...: random boob gif"
		)
	}
	
	
	async ping(message: DiscordMessage, args: string[]) {
		var m: DiscordMessage = await message.channel.send("Ping?");
		m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(this.bot.ping)}ms`);
	}
	
	
	
	async say(message: DiscordMessage, args: string[]) {
		const sayMessage = args.join(" ");
		this.deleteMessage(message)
		message.channel.send(sayMessage);
	}
	
	async fakeraffle(message, args = 20) {
		this.deleteMessage(message)
		var m = await message.channel.send("Like this comment for entry into our raffle!")
		setTimeout(
			() => m.edit("Like this comment if you're into weird porn."),
			args * 1000 )
	}
	
	
	async kick(message: DiscordMessage, args: string[]) {
		if (!this.gatedCall(message)) return
		
		let member = message.mentions.members.first() || message.guild.members.get(args[0]);
		if(!member)
		  return message.reply("Please mention a valid member of this server");
		if(!member.kickable) 
		  return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
		
		
		let reason = args.slice(1).join(' ');
		if(!reason) reason = "No reason provided";
		
		
		await member.kick(reason)
		  .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
		message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

	}

	async ban(message: DiscordMessage, args: string[]) {
		if (!this.gatedCall(message)) return
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

	async purge(message: DiscordMessage, args: string[]) {  
		if (!this.gatedCall(message)) return 
		const deleteCount = parseInt(args[0], 10);
		
		// Ooooh nice, combined conditions. <3
		if(!deleteCount || deleteCount < 2 || deleteCount > 100)
		  return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
		
		const fetched = await message.channel.fetchMessages({limit: deleteCount+1});
		message.channel.bulkDelete(fetched)
		  .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
	}

	async div(message: DiscordMessage, args: string[]) {
		if (!this.gatedCall(message)) return 
		if (!message.mentions.users.first()) {
					message.channel.send("You have to tag someone my dude.")
					return
		}
		
		if (message.mentions.users.first().id == "234384964496392193" || message.mentions.users.first().username == "Cheezy" || message.mentions.users.first().username == "Snipely") {
			message.channel.send("Hahahaha... No.")
			return
		}

		const member = (message.mentions.users.first())
		try {
			const voiceChannel = message.guild.channels.find((c) => {
				//return ["div", "afk"].includes(c.name.toLowerCase())
				return ["div"].includes(c.name.toLowerCase())
			})
			message.guild.member(member).setVoiceChannel(voiceChannel)
		} catch (err) {
			 console.log(err)
		} finally {
			message.channel.send(":right_facing_fist: " + member + ". YOU GONE!")
		}
	}
	
	async fu(message: DiscordMessage, args: string[]) {
		const member = message.mentions.members.first() || message.guild.members.get(args[0]);
		(member) ?
			message.channel.send(`FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU ${member}`) :
			message.channel.send("You didn't tag anyone")
	}
	
	

	async gif(message: DiscordMessage, args: string[]) {
		if (!this.gatedCall(message, this.defaultErrorMsg)) return
		this.fetchList(`https://api.giphy.com/v1/gifs/search?api_key=${config.giphyApiKey}&q=${args.join(" ")}&limit=100&offset=0&rating=PG-13&lang=en`, message, args)
	}
	
	async puppy(message: DiscordMessage, args: string[]) {
		this.gif(message, ["Puppy"])
	}

	async kitten(message: DiscordMessage, args: string[]) {
		this.gif(message, ["Kitten"])
	}
	
	
	async hentai(message: DiscordMessage, args: string[]) {
		if (!this.gatedChannel(message, this.defaultWrongChannelMsg)) return
		this.fetchList(`https://api.giphy.com/v1/gifs/random?api_key=${config.giphyApiKey}&tag=hentai&rating=R`, message, args)
	}
	
	async bullshit(message: DiscordMessage, args: string[]) {
		message.channel.send("I call bullshit")
	}
	
	async quote(message: DiscordMessage, args: string[]) {
		const randomQuote = require('random-quote');
 
		const quote = await randomQuote()
		.catch(err => console.log(err))
		.then(quote => message.channel.send(quote[0].link))
	
	}
	
	async paddle(message: DiscordMessage, args: string[]) {
		message.channel.send("You don't know me like that. At least buy me a drink first.")
	}
	
	async mute(message, args, bot) {
		const member = message.mentions.members.first() || message.guild.members.get(args[0]);
		(member) ?
			bot.muteMember(member, message.guild) :
			message.channel.send("You didn't tag anyone")
		
	}
	
	async wrong(message: DiscordMessage, args: string[]) {
		message.channel.send("https://imgur.com/B5TBhZr")
	}
	
	async boobs(message: DiscordMessage, args: string[]) {
		this.roleHandler(message)
		if (!this.gatedCall(message, "how bout nah")) return
		const img = this.fetchList(`https://api.giphy.com/v1/gifs/search?api_key=${config.giphyApiKey}&q=boobs&limit=250&offset=0&rating=PG-13&lang=en`, message, args)
	}
	
	
	async sticker(message: DiscordMessage, args: string[]) {
		if (!this.gatedCall(message, "how bout nah")) return
		fetch (`https://api.giphy.com/v1/stickers/random?api_key=${config.giphyApiKey}&tag=${args.join(" ")}&rating=PG-13`)
		.then(resp => {
			return resp.json()
		})
		.then(msg => {
			//var rnd = Math.floor(Math.random() * msg.data.length-1);
			//message.channel.send(msg.data[rnd].url)
			console.log(msg)
		})
		.catch(err => console.log(err))			

	
	}
}

module.exports = Commands
