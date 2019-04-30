import { DiscordMessage } from "./types/discord";
import { VoiceControls } from "./voiceControls";


export interface YouTube {
    audioStream: any;
	apiKey: string;
	musicBot: any;
}



export class YouTube {
    constructor(apiKey:string, musicBot: any) {
		this.apiKey = apiKey
		this.musicBot = musicBot
	}

    async yts(message: DiscordMessage, args: string[]) {
		fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${args.join('')}&key=${this.apiKey}`)
		.then(toJson => toJson.json())
        .then(toId => toId.items)
        // 0 index is a dud on these, 1 index is your most likely search result
		.then(x => new VoiceControls().audio(message, [`https://www.youtube.com/watch?v=${x[1].id.videoId}`]))
	}



	async cend() {
		try {
			this.audioStream.end()
		} catch (err){
			 console.log(err)
		}
	}

	async cplay() {
		try {
			this.audioStream.resume()
		} catch (err) {
			console.log(err)
		}
	}

	async cpause() {
		try {
			this.audioStream.pause()
		} catch(err) {
			console.log(err)
		}
	}

	// async gtfo(message: DiscordMessage) {
    //     this.audioStream.end()
    //     message.member.voiceChannel.leave()
        
	// }
	
	async fart(message:DiscordMessage, args: string[]): Promise<void> {
		return new VoiceControls().doVoIPCommand(message, con => {
			// const url = 'http://youtube.com/watch?v=34aQNMvGEZQ'
			const url = 'https://www.youtube.com/watch?v=Bt_kR7u6mM4&has_verified=1'
            this.audioStream = con.playStream(new VoiceControls().stream(url))
		})
	}
}