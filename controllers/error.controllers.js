const msg = require("../config/responsecatalog.config.json");
const CustomError = require("../utils/CustomError");

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    success: false,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const sequelizeUniqueConstraintErrorHandler = (error) => {
  const value = error.errors[0].value;
  const msg = `Oops! This data ${value} already exists in our records. Please check your input and try again.`;
  return new CustomError(msg, 400);
};

const sequelizeValidationErrorHandler = (error) => {
  const value = error.errors[0].value;
  const message = error.errors[0].message;
  const msg = `The data you provided does not meet the required criteria. Please review your input and ensure it meets the necessary validation rules.`;
  return new CustomError(message, 400);
};

const sequelizeDatabaseErrorHandler = (error) => {
  const errorCode = error.parent.code;
  let msg;
  if (errorCode === "ER_DATA_TOO_LONG") {
    msg = `Your Input is too long!!`;
  }
  return new CustomError(msg, 400);
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      success: false,
      message: msg.common_failed,
    });
  }
};

module.exports = (error, req, res, next) => {
  // error.staticCode = error.staticCode || 500;
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "SequelizeUniqueConstraintError")
      error = sequelizeUniqueConstraintErrorHandler(error);
    if (error.name === "SequelizeValidationError")
      error = sequelizeValidationErrorHandler(error);
    if (error.name === "SequelizeDatabaseError")
      error = sequelizeDatabaseErrorHandler(error);
      
    prodErrors(res, error);
  }
};
