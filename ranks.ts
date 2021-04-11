import { threadId } from "node:worker_threads";
import * as ranking from "./ranking.json";
import { MessageEmbed } from "discord.js";

export default class Ranking {
  rankings: any = (ranking as any).default;
  embed: MessageEmbed = new MessageEmbed();
  tops: any[] = [];
  ids: string[] = this.rankings.map((e: any) => e.id);

  constructor() {}
  showRanking(users: any) {
    users.forEach((element: any) => {
      const id: string = element.user.id;
      if (this.ids.find((e: string) => e === id)) {
        console.log(element.user.username);
        this.tops.push({
          user: element.user,
          points: this.rankings.find((ranking: any) => ranking.id === id)
            .points,
        });
      }
    });
    console.log(this.tops);
    // this.rankingEmbed.setTitle(`Ranking`).addFields().setColor("green");
    // return this.rankingEmbed;
    return this.generateEmbed();
  }
  generateEmbed() {
    const formatTops = this.tops.map((e, idx) => ({
      name: `#${idx + 1}`,
      inline: false,
      value: `${e.user} - 🔥 ${e.points}`,
    }));
    this.embed.setTitle("Ranking").addFields(...formatTops);
    return this.embed;
  }
}
