interface DiscordMusicHelper {
    bot: any;
    state: {
        lastSaid: string,
        lastChannel: any,
        lastMessage: string[]
    }
}

class DiscordMusicHelper {
    constructor(bot) {
        this.bot = bot
        this.state = {
            lastSaid: null,
            lastChannel: null,
            lastMessage: null
        }
        
    }

    do(message, args) {
        this.state = {
            lastSaid: args,
            lastMessage: message,
            lastChannel: message.channel
        }
    }

    did() {
        console.log(this.state.lastSaid)
    }
}

export = DiscordMusicHelper