const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");


//*********************handleErrorResponse******************
const errorAuth = function (err, req, res, next) {
  res.status(401);
  res.setHeader('Content-Type','application/json')
  res.json(
      {
          message: "Authentication required"
        }
  );
};

const authCatch=(err,req,res,next)=>{
  res.status(401)
  .setHeader('Content-Type','application/json')
  .json({
      message: "Authentication required"
    })
  }

const errorResponse403 = (err, req, res, next) => {
  res.status(403)
      .setHeader('Content-Type', 'application/json')
      .json({ message: 'Forbidden' })
}

const createErrorHandler = (statusCode, message, data = {}, res) => {
  return res.status(statusCode).json({ message, ...data });
};
//********************************************************

// Delete a Review Image
router.delete('/:imageId', requireAuth, errorAuth, async (req, res) => {
  const imageId = req.params.imageId;

  const findReviewImage = await ReviewImage.findOne({
    where: { id: imageId },
    include: [
      {
        model: Review,
        attributes: ['userId'],
      },
    ]
  })


  if(!findReviewImage) return createErrorHandler(404, "Review Image couldn't be found", {}, res);

  if(findReviewImage && findReviewImage.Review.userId !== req.user.id) next(err)

  const deletedReviewImage = await ReviewImage.destroy({ where: { id: imageId } })

  if(deletedReviewImage) return res.status(200).json({ message: "Successfully deleted" })

}, errorResponse403)

module.exports = router;
