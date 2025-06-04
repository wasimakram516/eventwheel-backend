const Joi = require("joi");
const CustomError = require("../../utils/customError");

const registerSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "string.empty": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters.",
  }),
});

const validateRegisterDTO = (data) => {
  const { error, value } = registerSchema.validate(data, { abortEarly: false });

  if (error) {
    const errorDetails = error.details.map((err) => err.message).join(", ");
    throw new CustomError(400, errorDetails);
  }

  value.email = value.email.toLowerCase(); // Normalize email to lowercase
  return value;
};

module.exports = validateRegisterDTO;
