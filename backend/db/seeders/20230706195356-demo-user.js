'use strict';

// /** @type {import('sequelize-cli').Migration} */


const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Anas',
        lastName: 'Alakkad',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: 'John',
        lastName: 'Dorsey',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Alex',
        lastName: 'H',
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Nichole',
        lastName: 'Alakkad',
        email: 'user4@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Mike',
        lastName: 'dillon',
        email: 'john.doe@example.com',
        username: 'JohnDoe',
        hashedPassword: bcrypt.hashSync('password1', 10)
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        username: 'JaneSmith',
        hashedPassword: bcrypt.hashSync('password2', 10)
      },
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@example.com',
        username: 'MichaelJohnson',
        hashedPassword: bcrypt.hashSync('password3', 10)
      },
      {
        firstName: 'Emily',
        lastName: 'Williams',
        email: 'emily.williams@example.com',
        username: 'EmilyWilliams',
        hashedPassword: bcrypt.hashSync('password4', 10)
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
