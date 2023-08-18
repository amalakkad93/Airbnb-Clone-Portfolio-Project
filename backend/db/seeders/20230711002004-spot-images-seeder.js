'use strict';
const { SpotImage } = require('../models')
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/5d4d91e3-64ba-4480-b842-f3dacae7ed21.jpg?im_w=1200",
        preview: true
      },
      {
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/b7c661f3-1b24-4725-808b-ec3d9031a078.jpg?im_w=720",
        preview: false
      },
      {
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/62b1d46f-3630-49aa-8888-4ffcdf592a03.jpg?im_w=720",
        preview: false
      },
      {
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/a738ad73-642e-47a9-b1c1-9cf7e12fa39c.jpg?im_w=720",
        preview: false
      },
      {
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/cdc4da03-11db-4d4c-8c29-232b6b8d3311.jpg?im_w=720",
        preview: false
      },

      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/2adb693d-2958-4ff5-a559-620654d321cb.jpg?im_w=1200",
        preview: true
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/755bdb07-ae1a-425a-a778-281d7f822793.jpg?im_w=720",
        preview: false
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/00b1f1ac-3073-432d-8023-61ee93dfa7a7.jpg?im_w=720",
        preview: false
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/77494279/0b08fb31_original.jpg?im_w=720",
        preview: false
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/77494514/dc156fed_original.jpg?im_w=720",
        preview: false
      },

      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/757b18a9-79a0-47cf-b009-80ae7b3f0dbf.jpg?im_w=1200",
        preview: true
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/29cf7f96-15b8-4f33-be54-a3bf48d44869.jpg?im_w=720",
        preview: false
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/3242af2b-d573-4285-8aac-4e02145ca892.jpg?im_w=720",
        preview: false
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/3bc7d0a3-5084-4c8d-a11d-57b89db0f010.jpg?im_w=720",
        preview: false
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/be57df47-f9fd-454e-81e6-4c817ad29c2e.jpg?im_w=720",
        preview: false
      },

      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-48042360/original/e73fbbaa-5d57-4708-91b4-b8b4123a3301.jpeg?im_w=1200",
        preview: true
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-48042360/original/e8fb346b-723f-43e5-9ac2-268d1ac6d53d.jpeg?im_w=720",
        preview: false
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/1cac0300-6fac-4021-8b62-f9b072957096.jpg?im_w=720",
        preview: false
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/01a0b96c-1772-4eff-8d1a-79d3626784ae.jpg?im_w=720",
        preview: false
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/709e82d6-4c22-4e9f-b05e-1d35515bf829.jpg?im_w=720",
        preview: false
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
