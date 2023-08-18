'use strict';
const { Spot } = require('../models')

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {

    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "111 Joy Rd",
        city: "Occidental",
        state: "California",
        country: "United States of America",
        lat: 47.7645358,
        lng: -140.4730327,
        name: "Rustic Yet Luxurious Cabin in the Redwoods",
        description: "Experience the enchantment of a rustic yet luxurious cabin nestled amidst the towering Redwoods. This private retreat offers a serene escape from the bustling world, allowing you to connect with nature and unwind. Hosted by Luke, your stay promises tranquility and comfort.",
        price: 1500.00,
      },
      {
        ownerId: 2,
        address: "2020 Wainiha Powerhouse Rd",
        city: "Hanalei",
        state: " Hawaii",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Romantic Garden Cottage,View! Pool! TVNC#1065",
        description:  "Indulge in romance and serenity at this charming garden cottage. With breathtaking views, a private pool, and every comfort at your disposal, this is the perfect getaway for couples seeking a romantic escape. Your host, Jeffrey, ensures a delightful stay.",
        price: 566.00,
      },
      {
        ownerId: 3,
        address: "222 San Rafael Ave",
        city: "Santa Barbara",
        state: "California",
        country: "United States of America",
        lat: 20.7645358,
        lng: -150.4730327,
        name: "Dreamy small cottage in tropical garden setting",
        description: "Step into a dreamy world of tropical wonder, surrounded by lush gardens and serene beauty. This small cottage is the epitome of coziness and charm, providing a peaceful sanctuary to relax and rejuvenate. Hosted by Vesla, your stay will be a delightful tropical retreat.",
        price: 140.00,
      },
      {
        ownerId: 4,
        address: "916 Seaboard Rd",
        city: "Malibu",
        state: "California",
        country: "United States of America",
        lat: 47.7645358,
        lng: -140.4730327,
        name: "Malibu Beachfront 2 bedroom gem",
        description:  "Uncover the gem of Malibu with this beachfront 2-bedroom retreat. Wake up to the sound of crashing waves and bask in the golden sun on pristine sands. This townhouse, hosted by Annalyn, promises an unforgettable beachfront experience with every modern luxury.",
        price: 695.00,
      },

    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }

};
