import { Client, EmojiIdentifierResolvable, Message, User } from "discord.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

import * as ranking from "./ranking.json";
import { MessageEmbed } from "discord.js";
export type CategoryType = {
  id: String;
  title: String;
};
export type UserCustomType = {
  id: String;
  username: String;
  bot: Boolean;
  discriminator: String;
  avatar: String;
};
export type PunsType = {
  id: String;
  category: CategoryType;
  emoji: String;
  createdBy: UserCustomType;
  hint: String;
  answer: String[];
};

const categories: CategoryType[] = [
  {
    id: uuidv4(),
    title: "Raper",
  },
  {
    id: uuidv4(),
    title: "Piosenka hip-hop",
  },
];

const tempArr: PunsType[] = [
  {
    id: uuidv4(),
    category: categories[0],
    emoji: "ðð ",
    createdBy: {
      id: "463024314439041037",
      username: "szobi",
      bot: false,
      discriminator: "7693",
      avatar: "4087791e05d645e0a7ba0d00765e88ec",
    },
    hint: "grupa artystÃ³w",
    answer: ["Chillwagon", "chillwagon"],
  },
  {
    id: uuidv4(),
    category: categories[0],
    emoji: "ð¸",
    createdBy: {
      id: "463024314439041037",
      username: "szobi",
      bot: false,
      discriminator: "7693",
      avatar: "4087791e05d645e0a7ba0d00765e88ec",
    },
    hint: "brak",
    answer: ["Å¼abson", "rzabka", "zabson"],
  },
  {
    id: uuidv4(),
    category: categories[0],
    emoji: "â­âï¸ð¶ââï¸",
    createdBy: {
      id: "463024314439041037",
      username: "szobi",
      bot: false,
      discriminator: "7693",
      avatar: "4087791e05d645e0a7ba0d00765e88ec",
    },
    hint: "wtf?",
    answer: ["otsochodzi", "ocochodzi", "ot sochodzi"],
  },
  {
    id: uuidv4(),
    category: categories[1],
    emoji: "ðââï¸ ð ð§ââï¸",
    createdBy: {
      id: "463024314439041037",
      username: "szobi",
      bot: false,
      discriminator: "7693",
      avatar: "4087791e05d645e0a7ba0d00765e88ec",
    },
    hint: "szpaku",
    answer: ["oddajmy krew wampirom", "oddajmy krew wampirÄ"],
  },
  {
    id: uuidv4(),
    category: categories[1],
    emoji: "ââªï¸",
    createdBy: {
      id: "463024314439041037",
      username: "szobi",
      bot: false,
      discriminator: "7693",
      avatar: "4087791e05d645e0a7ba0d00765e88ec",
    },
    hint: "poznaÅski raper",
    answer: ["moj kosciol", "mÃ³j koÅciÃ³Å", "moj koÅciÃ³Å"],
  },
  {
    id: uuidv4(),
    category: categories[1],
    emoji: "ðµ",
    createdBy: {
      id: "463024314439041037",
      username: "szobi",
      bot: false,
      discriminator: "7693",
      avatar: "4087791e05d645e0a7ba0d00765e88ec",
    },
    hint: "Hops Hops Hops",
    answer: ["maÅpa", "malpa"],
  },
];

export default class PunsManager {
  list: PunsType[];
  currentEmbed: MessageEmbed = new MessageEmbed();
  rankingEmbed: MessageEmbed = new MessageEmbed();
  used: PunsType[] = [];
  rankings: any = (ranking as any).default;
  current: PunsType = tempArr[0];
  session: String;
  error: String = "";
  constructor() {
    this.list = [...tempArr];
    this.session = uuidv4();
    this.random();
  }

  random() {
    if (this.list.length > 0) {
      this.current = this.list[Math.floor(Math.random() * this.list.length)];
    }
    this.error = "Brak haseÅ do gier";
  }
  generateEmbed() {
    this.currentEmbed
      .setTitle(`Emoji dodane przez ${this.getCurrent()?.createdBy.username}`)
      .addFields(
        {
          name: "Kategoria:",
          value: this.current.category.title,
          inline: false,
        },
        {
          name: "HasÅo:",
          value: this.current.emoji,
          inline: false,
        }
      )
      .setColor("#00b3de");
    return this.currentEmbed;
  }
  getCurrent() {
    return this.current;
  }
  getList() {
    return this.list[0];
  }
  addRactions(message: Message, react: EmojiIdentifierResolvable) {
    message.react(react);
  }
  addPoint(user: string) {
    let r;
    console.log(this.rankings);
    const find = this.rankings.find((e: any) => e.id === user);
    if (find) {
      find.points = find.points + 1;
    } else {
      this.rankings.push({
        id: user,
        points: 1,
      });
    }
    fs.writeFile("ranking.json", JSON.stringify(this.rankings), () => {
      console.log("save");
    });

    // if ((r = ranking.find((e) => e.id === user))) {
    //   r.points++;
    // } else {
    //   ranking.push({ id: user, points: 1 });
    // }
  }
  check(answer: String, message: Message) {
    const user = message.author;
    console.log(user);
    const isCorrect = this.current.answer
      .map((e) => e.trim())
      .some((a) => a === answer);
    console.log(isCorrect);
    if (isCorrect) {
      this.addRactions(message, "ð");
      this.addPoint(user.id);
      console.log(ranking);
    } else {
      this.addRactions(message, "â");
    }
    return isCorrect;
  }
  next() {
    this.list = this.list.filter((e) => e.id !== this.current.id);
    this.currentEmbed = new MessageEmbed();
    if (this.list.length > 0) {
      this.random();
      return true;
    } else {
      return false;
    }
  }
}
