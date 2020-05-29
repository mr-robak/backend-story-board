"use strict";
const User = require("../models").user;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user1 = await User.findOne({ where: { email: "test@test.com" } });
    const user2 = await User.findOne({ where: { email: "dummy@dummy.com" } });

    return queryInterface.bulkInsert(
      "homepages",
      [
        {
          title: "Alien Fanpage",
          description: "All things related to Alien franchise",
          backgroundColor: "#40A056",
          color: "#EDEDED",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user1.id,
        },
        {
          title: "Coding journey",
          description: "My journey to become a softwaredeveloper",
          backgroundColor: "#FF3E00",
          color: "#000000",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user2.id,
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("homepages", null, {});
  },
};
