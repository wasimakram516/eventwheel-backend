const Joi = require("joi");
const CustomError = require("../../utils/customError");

const createEventSchema = Joi.object({
  shortName:Joi.string().trim().required().messages({
    "string.empty": "Short name is required.",
  }),
  name: Joi.string().trim().required().messages({
    "string.empty": "Event name is required.",
  }),
  type: Joi.string().valid("collect_info", "enter_names").required().messages({
    "any.only": "Invalid event type. Allowed: collect_info, enter_names.",
    "string.empty": "Event type is required.",
  }),
});

const validateCreateEventDTO = (data) => {
  const { error, value } = createEventSchema.validate(data, { abortEarly: false });

  if (error) {
    const errorDetails = error.details.map((err) => err.message).join(", ");
    throw new CustomError(400, errorDetails);
  }

  return value;
};

module.exports = validateCreateEventDTO;
