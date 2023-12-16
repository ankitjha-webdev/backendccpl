const Joi = require('joi');

exports.jobSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
    'string.base': 'Title should be a type of \'text\''
  }),
  description: Joi.string().required().messages({
    'any.required': 'Description is required',
    'string.base': 'Description should be a type of \'text\''
  }),
  requirements: Joi.string().required().messages({
    'any.required': 'Requirements are required',
    'string.base': 'Requirements should be a type of \'text\''
  }),
  experience: Joi.string().required().messages({
    'any.required': 'Experience is required',
    'string.base': 'Experience should be a type of \'text\''
  }),
  location: Joi.string().required().messages({
    'any.required': 'Location is required',
    'string.base': 'Location should be a type of \'text\''
  }),
  desiredSkillsAndExperience: Joi.string().required().messages({
    'any.required': 'Desired Skills and Experience are required',
    'string.base': 'Desired Skills and Experience should be a type of \'text\''
  }),
  highlyDesiredSkills: Joi.string().required().messages({
    'any.required': 'Highly Desired Skills are required',
    'string.base': 'Highly Desired Skills should be a type of \'text\''
  }),
  preferredEducationalBackground: Joi.string().required().messages({
    'any.required': 'Preferred Educational Background is required',
    'string.base': 'Preferred Educational Background should be a type of \'text\''
  }),
  keyBenefits: Joi.string().required().messages({
    'any.required': 'Key Benefits are required',
    'string.base': 'Key Benefits should be a type of \'text\''
  })
});

exports.imageSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Image name is required',
    'string.base': 'Image name should be a type of \'text\''
  }),
  url: Joi.string().required().messages({
    'any.required': 'Image URL is required',
    'string.base': 'Image URL should be a type of \'text\''
  }),
  alt_text: Joi.string().required().messages({
    'any.required': 'Alt text is required',
    'string.base': 'Alt text should be a type of \'text\''
  }),
  page_location: Joi.string().required().messages({
    'any.required': 'Page location is required',
    'string.base': 'Page location should be a type of \'text\''
  })
});

exports.deleteImageSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'Image id is required',
    'string.base': 'Image id should be a type of \'text\''
  })
});
