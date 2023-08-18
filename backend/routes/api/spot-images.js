const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");
const { Op } = require('sequelize');

const errorAuth = function (err, req, res, next) {
  res.status(401);
  res.setHeader('Content-Type','application/json')
  res.json(
      {
          message: "Authentication required"
        }
  );
};

//*********************handleErrorResponse******************
const errorResponse403 = (err, req, res, next) => {
  res.status(403)
      .setHeader('Content-Type', 'application/json')
      .json({ message: 'Forbidden' })
}
//********************************************************

// Delete a Spot Image
router.delete('/:imageId', requireAuth, errorAuth,async (req, res) => {
  const imageId = req.params.imageId;
  const { user } = req;

  const findSpotImage = await SpotImage.findOne({
    where: { id: imageId },
    include: [
      {
        model: Spot,
        attributes: ['ownerId'],
      },
    ]
  })


  if(!findSpotImage) return res.status(404).json({ message: "Spot Image couldn't be found" })

  if(findSpotImage && findSpotImage.Spot.ownerId !== req.user.id) next(err)

  const deletedSpotImage = await SpotImage.destroy({ where: { id: imageId } })

  if(deletedSpotImage) return res.status(200).json({ message: "Successfully deleted" })

}, errorResponse403)

module.exports = router;
