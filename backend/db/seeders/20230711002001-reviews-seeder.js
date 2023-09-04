'use strict';
const { Review,  Spot } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
        {
          spotId: 1,
          userId: 1,
          review: "This was an awesome spot!",
          stars: 5
        },
        {
          spotId: 1,
          userId: 2,
          review: "Had a great time at this spot!",
          stars: 4
        },
        {
          spotId: 1,
          userId: 3,
          review: "Nice place with beautiful views!",
          stars: 4
        },
        {
          spotId: 1,
          userId: 4,
          review: "Highly recommended!",
          stars: 5
        },
        {
          spotId: 1,
          userId: 5,
          review: "This was the worst spot I've been to!",
          stars: 1
        },
        {
          spotId: 1,
          userId: 6,
          review: "Not a fan of this place.",
          stars: 2
        },
        {
          spotId: 1,
          userId: 7,
          review: "Average experience, nothing special.",
          stars: 3
        },
        {
          spotId: 1,
          userId: 8,
          review: "Could have been better.",
          stars: 2
        },

        {
          spotId: 2,
          userId: 2,
          review: "What a hidden gem! The spot was even better than expected. Cozy, clean, and surrounded by nature. Can't wait to visit again!",
          stars: 5
        },
        {
          spotId: 2,
          userId: 3,
          review: "Wow! This spot exceeded all expectations. The host was fantastic, and the location was perfect. Will definitely be back soon!",
          stars: 5
        },
        {
          spotId: 2,
          userId: 4,
          review: "An incredible experience from start to finish. The spot was beautifully designed, and the attention to detail was impeccable. 5 stars!",
          stars: 5
        },
        {
          spotId: 2,
          userId: 5,
          review:"If I could give more than 5 stars, I would. This spot is a little slice of paradise. I wish I could stay here forever!" ,
          stars: 4
        },
        {
          spotId: 2,
          userId: 6,
          review: "A dream come true! This spot felt like a luxury retreat. The hosts were warm and welcoming, and the spot had everything we needed.",
          stars: 4
        },
        {
          spotId: 2,
          userId: 7,
          review:"I can't say enough good things about this spot. From the stunning views to the comfortable beds, it was pure perfection.",
          stars: 4
        },
        {
          spotId: 2,
          userId: 8,
          review: "What a wonderful stay! The spot was immaculate, and the host went above and beyond to make us feel at home." ,
          stars: 4
        },
        {
          spotId: 3,
          userId: 1,
          review: "It is over rated spot!",
          stars: 3
        },
        {
          spotId: 3,
          userId: 3,
          review: "Not a bad spot, but not great either. The location was convenient, but the noise from the nearby road was a bit bothersome." ,
          stars: 3
        },
        {
          spotId: 3,
          userId: 5,
          review: "I had a terrible experience at this spot. It was dirty, and the host was unresponsive to our complaints.",
          stars: 2
        },
        {
          spotId: 3,
          userId: 6,
          review:"I would not recommend this spot to anyone. The description was misleading, and the neighborhood felt unsafe.",
          stars: 2
        },
        {
          spotId: 3,
          userId: 7,
          review:"One word: disappointing. The spot was not well-maintained, and the amenities were lacking." ,
          stars: 1
        },
        {
          spotId: 3,
          userId: 8,
          review: "Stay away from this spot! It was infested with bugs, and the bed was uncomfortable." ,
          stars: 1
        },
        {
          spotId: 4,
          userId: 1,
          review: "This spot was amazing! It exceeded all our expectations, and we had a fantastic time during our stay. The amenities were top-notch, and the location was perfect for a beachfront getaway. We would definitely come back again!",
          stars: 5
        },
        {
          spotId: 4,
          userId: 2,
          review: "We had a great time at this spot. It had beautiful views and a cozy atmosphere. However, we felt that the price was a bit steep for what was offered. It would have been perfect if it were more affordable.",
          stars: 4
        },
        {
          spotId: 4,
          userId: 3,
          review: "The spot had a nice design, but it didn't quite live up to the price we paid. Some of the amenities were lacking, and the overall experience was average. We expected more value for our money.",
          stars: 3
        },
        {
          spotId: 4,
          userId: 4,
          review: "We enjoyed our stay, but we can't ignore the fact that this spot was overpriced. While the location was beautiful, the accommodations could have been better for the cost. We might consider other options next time.",
          stars: 3
        },
        {
          spotId: 4,
          userId: 6,
          review: "We had a good time at this spot, but it didn't fully meet our expectations for the price we paid. The photos looked more impressive than the actual experience. It was an okay stay, but not exceptional.",
          stars: 3
        },
        {
          spotId: 4,
          userId: 7,
          review: "We felt that this spot was overpriced for what it offered. While it was clean and comfortable, it lacked the special touches we anticipated for the cost. It was a decent stay, but not outstanding.",
          stars: 2
        },
        {
          spotId: 4,
          userId: 8,
          review: "This spot was not worth the high price we paid. We expected a more luxurious experience, but it fell short. We were disappointed with the overall value and wouldn't choose it again in the future.",
          stars: 2
        }

      ], { validate: true })
    },


  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
