const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, ReviewImage,  sequelize } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");

const errorAuth = function (err, req, res, next) {
  res.status(401);
  res.setHeader('Content-Type','application/json')
  res.json(
      {
          message: "Authentication required"
        }
  );
};

const displayvaldErr = (err, req, res, next) => {

  res.status(400)
  res.setHeader('Content-Type', 'application/json')
  res.json({
      message: "Bad Request",
      errors: err.errors
  })
}

const validateReview = [
  check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
  check('stars')
      .isIn([1, 2, 3, 4, 5])
      .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
];

const errorResponse403 = (err, req, res, next) => {
  res.status(403)
      .setHeader('Content-Type', 'application/json')
      .json({ message: 'Forbidden' })
}

const createErrorHandler = (statusCode, message, data = {}, res) => {
  return res.status(statusCode).json({ message, ...data });
};


// ======== Get all Reviews of the Current User ========
router.get("/current", requireAuth, errorAuth,async (req, res) => {
  const reviewList = await Review.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: SpotImage,
            attributes: ["id", "url", "preview"],
          },
        ],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
    where: { userId: req.user.id },
  });

  const reviews = reviewList.map((review) => {
    const reviewJSON = review.toJSON();

    const previewImage = reviewJSON.Spot.SpotImages.find( (spotImage) => spotImage.preview );
    reviewJSON.Spot.previewImage = previewImage ? previewImage.url : null;

    delete reviewJSON.Spot.SpotImages;

    return reviewJSON;
  });
  res.json({ Reviews: reviews });

});

// ======== Add an Image to a Review based on the Review's id ========
router.post("/:reviewId/images", requireAuth,errorAuth, async (req, res) => {
  const { url, preview } = req.body;
  const image = req.body.url;
  const reviewId = req.params.reviewId;

  const review = await Review.findByPk(reviewId, {
    include: [{ model: ReviewImage }]
  });

  if (!review) return createErrorHandler(404, "Review couldn't be found", {}, res);
  if (review.userId !== req.user.id) return createErrorHandler(403, "Forbidden", {}, res);
  if (review.ReviewImages.length > 10) return createErrorHandler(403, "Maximum number of images for this resource was reached", {}, res);
  const reviewImage = await ReviewImage.create({ reviewId: review.id, url: image });
  res.json({id: reviewImage.id, url: reviewImage.url});
});

// ======== Edit a Review ========
router.put("/:reviewId", requireAuth, errorAuth, validateReview, displayvaldErr, async (req, res) => {

  const reviewId = req.params.reviewId;

  const { review, stars } = req.body;
  const reviews = await Review.findOne({ where: { id: reviewId } });

  if(!reviews) return createErrorHandler(404, "Review couldn't be found", {}, res);
  else if (reviews && reviews.userId != req.user.id) next(err);

  const updatedReview = await reviews.update({ review, stars });
  return res.json(updatedReview);

}, errorResponse403);

//======== Delete a Review ========
router.delete('/:reviewId', requireAuth, errorAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const { user } = req;

  const reviewOwner = await Review.findByPk(reviewId)

  const deletedReview = await Review.destroy({ where: { id: reviewId, userId: req.user.id } })

  if(!reviewOwner) return createErrorHandler(404, "Review couldn't be found", {}, res);
  else if(deletedReview) return res.status(200).json({ message: "Successfully deleted" })
  else if(reviewOwner && reviewOwner.reviewId !== req.user.id) next(err)
}, errorResponse403)

module.exports = router;
