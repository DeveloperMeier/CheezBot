
export interface Config {
    giphyApiKey: string;
    spotifyID: string;
    spotifySecret: string;
    googleApiKey: string;
}

export let config: Config

config = require("../../../config.json")