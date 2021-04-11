import Discord, { Message, User } from "discord.js";

import PunsManager from "./puns";
import command from "./command";
import Ranking from "./ranks";
const client = new Discord.Client();

const arr: User[] = [];
client.on("ready", () => {
  console.log("the client is ready");
  command(client, ["ping"], (message: Message) => {
    message.channel.send("pong!");
  });
  command(client, ["join"], (message: Message) => {
    const user = message.author;
    if (arr.includes(user)) {
      message.reply(`Już dołączyłeś zjebie `);
      return;
    }
    arr.push(message.author);
    message.reply(` zostałeś dodany :beers: `);
  });
  command(client, ["check"], (message: Message) => {
    message.channel.send(`all Users: ${arr.join(",")}`);
  });
  command(client, ["winner"], (message: Message) => {
    const winner = arr[Math.floor(Math.random() * arr.length)];
    winner
      ? message.channel.send(`Wygrał for: ${winner}`)
      : message.channel.send(`Nikt nie brał udziału`);
    arr.length = 0;
  });
  command(client, ["roles"], (message: Message) => {
    const winner = arr[Math.floor(Math.random() * arr.length)];
    message.channel.send(`Twoje role: ${Object.keys(message).join(" - ")})`);
    arr.length = 0;
  });
  //   let rankingMenager: PunsRanking = new PunsRanking();
  let session: any = undefined;
  // Kalambury
  command(client, ["kb:run"], (message: Message) => {
    if (session !== undefined) {
      message.channel.send(`Gra aktywna !kb:current`);
      return;
    }
    session = new PunsManager();
    message.channel.send(
      `Gra rozpoczęta aby dodać odpowiedź wpisz !a "odp...". Za chwilę pokażę się hasło`
    );
    setTimeout(() => {
      message.channel.send(session.generateEmbed());
    }, 1000);
    // message.channel.send('Hasło to : ``` ' + session.getCurrent().emoji + ' ```')
  });
  command(client, ["kb:current"], (message: Message) => {
    if (session !== undefined) {
      message.channel.send(`Gra aktywna !kb:start`);
      return;
    }
    message.channel.send(session.generateEmbed());
  });
  command(client, ["kb:rankings"], (message: Message) => {
    const t = new Ranking();
    const userRankings = client.guilds.cache.get("830392770563932160");
    if (userRankings) {
      message.channel.send(t.showRanking(userRankings.members.cache));
    }
  });
  command(client, ["a"], (message: Message) => {
    if (session === undefined) {
      message.channel.send(`Gra nieaktywna wpisz !kb:start`);
      return;
    }
    const answer =
      message.content.startsWith("!a") &&
      message.content.replace("!a", "").trim();
    if (answer) {
      const isCorrect = session.check(answer, message);
      if (isCorrect) {
        message.channel.send(
          `Brawo ${message.author} hasło to: ${session.getCurrent().answer[0]}`
        );
        const isNext = session.next();
        if (isNext) {
          setTimeout(() => {
            message.channel.send(session.generateEmbed());
          }, 2000);
        } else {
          message.channel.send(`Zabrakło mi haseł. sesja została zakończona`);
          session = undefined;
        }
      }
    }
  });
  command(client, ["kb:add"], (message: Message) => {
    console.log(message.channel.type);
  });
});

client.login("ODMwMzk1NTk4NzEyNjAyNjc1.YHGEKg.Wxua8-PZq_WsxJoWy_Hm19QAbpo");
