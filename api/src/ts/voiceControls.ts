import { DiscordMessage } from "./types/discord";
import * as ytStream from 'youtube-audio-stream';

export interface VoiceControls {
    // TODO: Type these
    voiceChannel: Promise<void>
    audioStream: any;
    stream: any;
}

export class VoiceControls {
    constructor() {
        this.stream = ytStream
    }
	async audio(message: DiscordMessage, args: string[]) {
		return this.doVoIPCommand(message, con => {
            this.audioStream = con.playStream(this.stream(args.join()))
            return this.audioStream
        })
    }
    
	async doVoIPCommand(message: DiscordMessage, doOn: (any) => any): Promise<void> {
		if (message.member.voiceChannel) {
            this.voiceChannel = message.member.voiceChannel
            if ( message.member.voiceChannel) {
                message.member.voiceChannel
                .join().then(doOn)
                .catch(err => console.log(err))
            }
            return this.voiceChannel
		} else {
			message.channel.send("You're not in a voice channel.")
		}
	}
}