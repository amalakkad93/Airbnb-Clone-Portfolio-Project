'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {
      // define association here
      Review.belongsTo(models.User, { foreignKey: 'userId' });
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId', onDelete: 'CASCADE', hooks: true });
      Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
    }
  }
  Review.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    review: DataTypes.STRING,
    stars: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },{
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
