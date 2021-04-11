import { Message } from "discord.js";

export default [
    {
        command:['ping'],
        callback:((message:Message)=>{
            
            message.channel.send('pong!')
        })
    }
]