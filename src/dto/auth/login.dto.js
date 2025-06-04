const Joi = require("joi");
const CustomError = require("../../utils/customError");

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "string.empty": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
  rememberMe: Joi.boolean().optional(),
});

const validateLoginDTO = (data) => {
  const { error, value } = loginSchema.validate(data, { abortEarly: false });

  if (error) {
    const errorDetails = error.details.map((err) => err.message).join(", ");
    throw new CustomError(400, errorDetails);
  }

  value.email = value.email.toLowerCase(); // Normalize email to lowercase
  return value;
};

module.exports = validateLoginDTO;
