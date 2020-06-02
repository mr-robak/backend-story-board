"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "stories",
      "homepageId",

      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "homepages",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("stories", "homepageId");
  },
};
