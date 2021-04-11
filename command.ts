import { Client } from "discord.js"

const prefix ="!"

export default  (client:Client,aliases:String[],callback:Function) =>{
    client.on('message',message=>{
        if (!message.guild) return;
        const {content} = message


        aliases.forEach( (alias:String) =>{
                const command =`${prefix}${alias}`
                if(content.startsWith(`${command}`) || content === command){
                    callback(message)
                }

        })
    })
}