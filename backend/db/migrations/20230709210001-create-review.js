'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        type: Sequelize.INTEGER,
        // allowNull: false,
        references: { model: 'Spots' },
        onDelete: 'CASCADE',
        hooks: true
      },
      userId: {
        type: Sequelize.INTEGER,
        // allowNull: false,
        references: { model: 'Users' },
        onDelete: 'CASCADE',
        hooks: true
      },
      review: {
        type: Sequelize.STRING,
        // allowNull: false
      },
      stars: {
        type: Sequelize.INTEGER,
        // allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        // allowNull: false,
        type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews"
    await queryInterface.dropTable(options);
  }
};
