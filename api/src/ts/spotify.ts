import * as spotify from 'node-spotify-api';
import {DiscordMessage} from './types/discord';

export interface spotifyResponse {
    external_urls: {
        spotify: string,
        href: string
    }
}
export interface baseResponse {
    readonly [index:string] : {items: spotifyResponse[]};
}

export class Spotify {
    id: string;
    secret: string;
    msg: DiscordMessage;
    args: string[];
    spotify:any;
    constructor(id: string, secret: string) {
        console.log(id, secret)
        this.id = id
        this.msg = null
        this.secret = secret
        this.spotify = new spotify({
            id: this.id,
            secret: this.secret
        })
    }

    getMessage() {
        return this.msg
    }

    search(type:string = 'track', message: DiscordMessage, args:string[]) {
        this.msg = message;
        this.args = args
        const channel = this.msg.channel
        const query = this.args
        this.spotify.search({
            query: query,
            type: type
        }).then((resp: baseResponse) => {
            const mapped: string = resp[type+'s'].items.
                slice(0, type == 'track' ? 5 : 1)
                .map((i:spotifyResponse) => i.external_urls.spotify)
                .join("\n")
            channel.send(mapped)
        }).catch((err: any)=> console.log(err))
    }
}
