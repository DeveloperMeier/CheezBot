import { DiscordMessage, DiscordMember } from "./types/discord";

const fs = require('fs')
const dataFile = './perms.json'
const perms = {
    "rl": "Rocket League",
    "rocketleague": "Rocket League",
    "overwatch": "Overwatch",
    "r6": "R6 Siege",
    "siege": "R6 Siege",
    "ssbu": "SSBU",
    "smash": "SSBU",
    "nms": "No Man's Sky",
    "dnd": "DnD",
    "nauts": "Awesomenauts",
    "awesomenauts": "Awesomenauts"
}

export interface Permissions {
    name: string;
}

export class Permissions {
     constructor(name = dataFile) {
        this.name = name
     }

    addrole(message: DiscordMessage, roleString: string, author: DiscordMember) {
        
            const serverPerm = message.guild.roles.find(role => {
                return role.name === roleString 
            })
            const member = message.guild.members.get(author.id);
            console.log(member.constructor, serverPerm.constructor)
            console.log(`Attempting to attach ${serverPerm} to ${member}`)
            member.addRole(serverPerm).catch(console.log)
    }
    
    addroleauto(guild: any, channel: any, member: DiscordMember, roleString: string, author: DiscordMember) {
        
            const serverPerm = guild.roles.find(role => {
                return role.name === roleString 
            })
            console.log(member.constructor, serverPerm.constructor)
            console.log(`Attempting to attach ${serverPerm} to ${member}`)
            member.addRole(serverPerm).catch(console.log)
    }

    remrole(message: DiscordMessage, args:string[]) {
        const perms = this.getFile()
        const allowedPerm = perms[args.join()]
        if (allowedPerm) {
            const serverPerm = message.guild.roles.find(role => role.name === allowedPerm )
            const member = message.member;
            member.removeRole(serverPerm).catch(error => {
                console.log(error)
                message.channel.send("I failed to remove you. My owner has been notified.")
            })
        } else {
            message.channel.send("That is not a role you're authorized to add.")
        }
    }

    getFile(name = this.name) {
        if (!fs.existsSync(name)) {
            this.writeFile({}, name)
        }
        const file = require(name)
        return file
    }

    writeFile(data, name = this.name) {
        fs.writeFileSync(name, JSON.stringify(data, null, 2))
        return data
    }
    
    writeAndUpdate(data, keyValueMap, name = this.name) {
        var newData = data
        for (let k in keyValueMap) {
            newData[k] = keyValueMap[k]
        }
        this.writeFile(newData, name)
        return newData
    }
    getServerData() {}
    getUserData() {}
    addgame() {}
    remgame() {}
 }