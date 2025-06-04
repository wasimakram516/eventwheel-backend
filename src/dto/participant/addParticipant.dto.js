const Joi = require("joi");
const CustomError = require("../../utils/customError");

const addParticipantSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Participant name is required.",
  }),
  phone: Joi.string().trim().required().messages({
    "string.empty": "Phone number is required.",
  }),
  company: Joi.string().trim().required().messages({
    "string.empty": "Company name is required.",
  }),
  eventId: Joi.string().trim().required().messages({
    "string.empty": "Event ID is required.",
  }),
});

const validateAddParticipantDTO = (data) => {
  const { error, value } = addParticipantSchema.validate(data, { abortEarly: false });

  if (error) {
    const errorDetails = error.details.map((err) => err.message).join(", ");
    throw new CustomError(400, errorDetails);
  }

  return value;
};

module.exports = validateAddParticipantDTO;
