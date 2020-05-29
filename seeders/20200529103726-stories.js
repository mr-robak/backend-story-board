"use strict";
const Homepage = require("../models").homepage;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const homepage1 = await Homepage.findOne({
      where: { title: "Alien Fanpage" },
    });
    const homepage2 = await Homepage.findOne({
      where: { title: "Coding journey" },
    });

    return queryInterface.bulkInsert("stories", [
      {
        name: "Queen",
        content:
          "The Queen is a large form of the species Xenomorph XX121 that serves as the mother and leader of a Xenomorph Hive. Queens are one of the largest, strongest, and most intelligent Xenomorph castes, and their appearance differs from that of smaller variants, with a pair of extra arms growing from their chest and a large head crest extending rearwards from their skull.",
        homepageId: homepage1.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Drone",
        content:
          "The Drone,  also commonly referred to as the Warrior,[1][4][5] Soldier[1][6] or Worker[7] and designated a  Stage   Xenomorph by Weyland-Yutani scientists,[1] is the most common adult form of the species Xenomorph XX121. Between 7–8 feet in height and 14–16 feet long (including their tail), Drones are by far the most widespread caste of Xenomorph, acting as the species' principal offensive unit in combat situations. Among the roles carried out by Drones are the construction of Hives, the elimination of threats and the capture of potential hosts for reproduction.",
        homepageId: homepage1.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "USCSS Nostromo",
        content:
          "The USCSS Nostromo, registration number 1809246(09),[3] was a modified Lockmart CM-88B Bison M-Class starfreighter owned by the Weyland-Yutani Corporation and captained by Arthur Dallas, registered out of Panama.[2] The Nostromo operated as a tug, connecting to and pulling loads like a tractor truck rather than carrying those loads on board like a traditional freighter.",
        homepageId: homepage1.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Decission",
        content:
          "I enjoyed solving technical problems, but I knew I wanted to get into the business/startup world at some point. I always kept the thought of an MBA in the back of my mind, but every time I looked at the price tag of the top schools, my interest waned. On May 27th, 2017 I found myself googling about MBAs again, and somehow I stumbled upon software engineering. It seemed like a perfect fit. Software engineers are in increasing demand, salaries are great, and it’s the perfect industry from which to get into the startup world without needing a ton of initial capital. All you need is a computer, and your opportunities are limitless (kind of).",
        homepageId: homepage2.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("stories", null, {});
  },
};
