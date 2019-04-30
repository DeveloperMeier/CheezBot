export interface Bot {
    ping: number
    muteMember: () => void
}

export interface DiscordMember {
    id: string;
    username: string;
    tag: string;
    voiceChannel: any;
    first: () => DiscordMember;
    kickable: boolean;
    user: any;
    kick: (string) => {
        catch: (any) => void
    };
    bannable: boolean;
    ban: (string) => {
        catch: (any) => void
    }
    addRole: any;
    removeRole: any;
}

export interface DiscordMessage {
    guildMember: any;
    then: Promise<DiscordMessage>;
    awaitReactions: any;
    react: any;
    author: DiscordMember;
    member: DiscordMember;
    createdTimestamp: number;
    reply: (string) => DiscordMessage;
    guild: {
        roles: any;
        emojis: any;
        members: {
            get: (string) => DiscordMember;
        }
        member: (Member) => {
            setVoiceChannel: (any) => {
                catch: (string) => void
            }
        }
        channels: {
            first: () => DiscordMessage
            find: (any) => DiscordMessage
        }
    };
    mentions: {
        members: {
            first: () => DiscordMember;
        }
        users: {
            first: () => DiscordMember
        }
    };
    channel: {
        send: (string) => Promise<DiscordMessage>;
        fetchMessages: (number) => DiscordMessage[];
        bulkDelete: (number) => {
            catch: (string) => void
        }
    };
    delete: () => {
        catch: (string) => void;
    };
    send: () => DiscordMessage;
    edit: (string) => DiscordMessage;

}