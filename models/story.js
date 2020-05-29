"use strict";
module.exports = (sequelize, DataTypes) => {
  const story = sequelize.define(
    "story",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
    },
    {}
  );
  story.associate = function (models) {
    // associations can be defined here
    story.belongsTo(models.homepage);
  };
  return story;
};
