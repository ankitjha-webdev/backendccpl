const db = require("../config/sequalize.config");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { imageSchema, deleteImageSchema } = require("../helpers/validationschems.helpers");
const CustomError = require("../utils/CustomError");
const fs = require("fs");

// Create Image
exports.uploadImage = asyncErrorHandler(async (req, res, next) => {
  const { error, value } = imageSchema.validate({
    ...req.body,
    name: req.file.filename,
    url: req.file.destination,
  });

  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }

  const image = await db.pageImages.create(value);

  res.status(201).json({
    status: 201,
    success: true,
    message: "Image uploaded successfully",
    data: image,
  });
});

// List All Images
exports.listAllImages = asyncErrorHandler(async (req, res, next) => {
  const images = await db.pageImages.findAll({
    where: {
      page_location: decodeURIComponent(req.query.page_location),
    },
    attributes: ["name", "alt_text", "page_location"],
  });

  const imagesWithUrl = images.map((image) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${image.name}`;
    return {
      name: image.name,
      alt_text: image.alt_text,
      page_location: image.page_location,
      url: imageUrl
    };
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: "Images fetched successfully",
    data: imagesWithUrl,
  });

});

// Delete Image
exports.deleteImage = asyncErrorHandler(async (req, res, next) => {
  const { error, value } = deleteImageSchema.validate({
    id: req.params.id,
  });

  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }

  const image = await db.pageImages.findOne({
    where: {
      id: value.id,
    },
  });

  if (!image) {
    return next(new CustomError('Image not found', 404));
  }

  await db.pageImages.destroy({
    where: {
      id: parseInt(value.id),
    },
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: "Image deleted successfully",
  });
});



// List All Images for Admins
exports.listImages = asyncErrorHandler(async (req, res, next) => {
  const images = await db.pageImages.findAll({
    attributes: ["id", "name", "alt_text", "page_location"],
  });

  const imagesWithUrl = images.map((image) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${image.name}`;
    return {
      id: image.id,
      name: image.name,
      alt_text: image.alt_text,
      page_location: image.page_location,
      url: imageUrl
    };
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: "Images fetched successfully",
    data: imagesWithUrl,
  });

});