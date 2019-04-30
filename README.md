# Cheez Bot

## Custom Discord bot, docker implementation.

### Requirements
1. docker
2. docker-compose
3. a Discord developer token and timeout keys
4. Giphy API Key
5. Spotify Secret and ID
6. Google API Key


### Run it
1. Create a `config.json` in the root directory with requied api keys.
```
{
    "token": "NotARealDiscordToken",
    "tokenTimeout": NotARealDiscordTimeout",
    "giphyApiKey": "NotARealGiphyApiKey",
    "prefix": "!",
    "spotifyID": "NotARealSpotifyID",
    "spotifySecret": "NotArealSpotifySecret",
    "googleApiKey": "NotARealGoogleApiKey"
}
```
2. `docker-compose up --build`
