## Forewarning
  This bot is highly specified for my use-cases and those of the servers I hang out in. This code probably will NOT work for you without customization of the source code. You're entirely welcome to do so, but this is NOT expected to be used out-of-the-box.
  
  It's based originally on the [tutorial for Discord.js](https://gist.github.com/eslachance/3349734a98d30011bb202f47342601d3) but no longer resembles most of the code located therein.
  
  Contains support for giphy, discord, and reddit.


```sh
npm install
node app.js
```

## Example `./config.json` 

```json
{
	"token": "YourDiscordBotToken", 
	"tokenTimeout": "someTokenTimeOutFromDiscord",
	"giphyApiKey": "thisIsNotARealGiphyKey",
	"prefix": "!", // prefix to watch for commands
	"spotifyID": "thisIsNotARealSpotifyIdEither",
	"spotifySecret": "norIsThisASpotifySecret"
}

```

